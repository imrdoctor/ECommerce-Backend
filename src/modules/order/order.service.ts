import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createorderDto } from './dto/order.dto';
import { UserDocument } from 'src/DB/model';
import { Response } from 'express';
import {
  cartRepositoryService,
  orderRepositoryService,
  UserRepositoryService,
} from 'src/DB/Repository';
import {
  CartPopulated,
  OrderStatus,
  PaymentMethods,
  PaymentStatus,
} from 'src/common/types/types';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { PaymentService } from 'src/common/paymant/payment';
import { couponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { Decrypt } from 'src/common/security/crypto.helper';
import { differenceInDays } from 'date-fns';
import { Types } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OrderService {
  constructor(
    private readonly _orderRepositoryService: orderRepositoryService,
    private readonly _cartRepositoryService: cartRepositoryService,
    private readonly _paymentService: PaymentService,
    private readonly _couponRepositoryService: couponRepositoryService,
    private readonly _userRepositoryService: UserRepositoryService,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache
  ) {}
  async getAllUserOrders(user: UserDocument, res: Response) {

    let orders = await this._cacheManager.get(`orders-${user._id}`);
    if(!orders) {
      orders = await this._orderRepositoryService.find({
      filter: {
        User: user._id,
      },
      populate:[ {path: 'Items.productId'}]
    });
    await this._cacheManager.set(`orders-${user._id}`, orders, 60); 
    }
    if(!orders) throw new NotFoundException('Not Have Orders')
    return res.status(200).json({
      message: 'Orders',
      orders,
    });
  }
  async paymentCancel(res: Response, user: UserDocument ){
    if(!user.cartLocked){
      throw new ConflictException('Not Have Payments')
    }
    const cart = await this._cartRepositoryService.findOneAndUpdate(
      { User: user._id },
      { $unset: { uniqueCartCode: "" } } ,
      { new: true }
    );
    console.log(cart);
    if(!cart) throw new ConflictException('Somthing wrong')
    user.cartLocked = false
    await user.save()
    return res.status(200).json({
      msg : 'Payment Canceled'
    })
  }
  async getAllOrdersGraphQl() {
    let orders = await this._cacheManager.get<any[]>(`orders`);
    if (!orders) {
      orders = await this._orderRepositoryService.find({
        populate: [{
          path: 'Items.productId',
          select: '_id'
        }]
      });
      const plainOrders = orders.map(order => order.toObject());
      await this._cacheManager.set(`orders`, plainOrders, 60);
      orders = plainOrders;
    }
    if (!orders || !Array.isArray(orders)) {
      throw new NotFoundException('No Orders Found');
    }
    return orders.map(order => ({
      ...order,
      Items: order.Items?.map(item => ({
        ...item,
        productId: item.productId?._id || item.productId
      })) || []
    }));
  }
  async createOrder(body: createorderDto, user: UserDocument, res: Response) {
    if (user.cartLocked)
      throw new ForbiddenException('End Your Old Payments first');
    const { Phone, Address, PaymentMethod } = body;
    const cart = await this._cartRepositoryService.getUserCart(user._id);
    if (!cart || !cart.Products || cart.Products.length === 0)
      throw new NotFoundException('Cart is empty');
    let Coupon;
    if (body.Coupon) {
      Coupon = await this._couponRepositoryService.findOneAndUpdate(
        {
          Code: body.Coupon,
          IsWork: true,
          UsedBy: { $ne: user._id },
          FromDate: { $lte: new Date() },
          ToDate: { $gte: new Date() },
        },
        {
          $push: { UsedBy: user._id }, // نضيف المستخدم للكوبون
        },
        { new: true }, // عشان يرجعلك النسخة الجديدة بعد التحديث
      );
      Coupon;
      if (!Coupon) {
        throw new BadRequestException('Coupon is invalid or already used.');
      }
    }
    let session;
    if (PaymentMethod === PaymentMethods.cash) {
      const order = await this._orderRepositoryService.create({
        User: user._id,
        TotalPrice: cart.subTotal,
        Phone,
        Address,
        PaymentMethod,
        Items: cart?.Products,
        PaymentStatus: PaymentStatus.Unpaid,
        Status: OrderStatus.Pending,
        Coupon: Coupon?._id,
        discounts: {
          code: body.Coupon,
          amount_discount: 0,
          amount_shipping: 0,
          amount_tax: 0,
        },
        PaymentInfo: {
          name : PaymentMethods.cash,
          payment_intent : PaymentMethods.cash,
          paidAt: new Date()
        },
      });
      await this._cartRepositoryService.deleteOne({ User: user._id });
    } else if (PaymentMethod === PaymentMethods.card) {
      // lock cart
      const uniqueCartCode = [...Array(10)].map(() => Math.random().toString(36)[2]).join('');
      console.log(uniqueCartCode);
      cart.uniqueCartCode = uniqueCartCode
      await cart.save()
      await this._userRepositoryService.findByIdAndUpdate(user._id, {
        cartLocked: true,
      });
      // -------------------------------------------------- STRIPE PAYMENT --------------------------------------------------
      const items = cart.Products.map((item) => {
        const product = item.productId as any;
        return {
          productId: product._id,
          quantity: item.quantity,
          finalPrice: item.finalPrice,
          productName: product.ProductName,
          img: product.Img?.[0]?.secure_url || '',
          Price: product.SubPrice,
          Quantity: product.Quantity,
        };
      });
      let coupon;
      if (Coupon) {
        coupon = await this._paymentService.createCoupon({
          name: Coupon?.Code,
          percent_off: Coupon?.Amount,
        });
      }

      session = await this._paymentService.crateChekoutSession({
        customer_email: user.email,
        metadata: {
          UserId: user._id.toString(),
          CartId: cart._id.toString(),
          CouponId: Coupon?._id.toString(),
          Phone: Phone.toString(),
          Address: Address.toString(),
          Coupon: body.Coupon ? body.Coupon : null,
          uniqueCartCode : uniqueCartCode.toString()
        },
        line_items: items.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productName,
              images: [item.img.secure_url],
            },
            unit_amount: Math.round(item.finalPrice * 100),
          },
          quantity: item.quantity,
        })),
        discounts: [{ coupon: coupon?.id }],
      });
    }
    return res
      .status(201)
      .json({
        message: 'Order created successfully',
        checkout: PaymentMethod === PaymentMethods.card ? session.url : 'Cash',
      });
  }
  async webhookService(body: any) {
    const paymentStatus = body?.data?.object?.payment_status;
    if (paymentStatus === 'paid') {
      const { amount_total, payment_intent } = body?.data?.object;
      const { name } = body?.data?.object.customer_details;
      const { CartId, UserId, Phone, Address, Coupon , uniqueCartCode } = body?.data?.object?.metadata;
      const { amount_discount, amount_shipping, amount_tax } = body?.data?.object?.total_details;
      const cart = await this._cartRepositoryService.findById(CartId);
      const decryptedUniqueCartCode = await Decrypt(cart?.uniqueCartCode ?? '', process.env.CRYPTO_SECRET);
      console.log("Decrypted Cart Code:", decryptedUniqueCartCode);
      console.log("Original Cart Code:", uniqueCartCode);
      console.log(
        cart?.uniqueCartCode?.trim().toLowerCase() !== decryptedUniqueCartCode?.trim().toLowerCase()
      );      
      if (uniqueCartCode?.trim().toLowerCase() !== decryptedUniqueCartCode?.trim().toLowerCase()) {
        console.log("Refund payment triggered");
        await this._paymentService.refund({
          paymentIntentId: payment_intent,
          amount: amount_total,
          reason: 'requested_by_customer',
        });
  
        return { received: true };
      }
      const userObjectId = new Types.ObjectId(String(UserId));

      await this._orderRepositoryService.create({
        User: userObjectId,
        TotalPrice: amount_total,
        Phone,
        Address,
        Items: cart?.Products,
        PaymentMethod: PaymentMethods.card,
        PaymentStatus: PaymentStatus.Paid,
        Status: OrderStatus.Pending,
        discounts: {
          code: Coupon,
          amount_discount,
          amount_shipping,
          amount_tax,
        },
        PaymentInfo: {
          name,
          payment_intent,
          paidAt: new Date()
        },
      });
      await this._cartRepositoryService.deleteOne({ _id: CartId });
      await this._userRepositoryService.findByIdAndUpdate(UserId, {
        cartLocked: false,
      });
    }
    console.log("sucsess payment");
    
    return { received: true };
  }
  async cancelOrder(params: MongoIdDto,res : Response,user:UserDocument) {
    const order = await this._orderRepositoryService.findById(params.id);
    if (!order) throw new NotFoundException('Order Not Found');
    if (order.User.toString() !== user._id.toString()) {
      throw new UnauthorizedException('You are not authorized for this order');
    }
    if (order.Status == OrderStatus.Cancled){
      throw new BadRequestException('This Order Arldy Canceld')
    }
    const paidAt = new Date(order.PaymentInfo?.paidAt);
    const today = new Date();
    const daysSincePayment = differenceInDays(today, paidAt);
    if (daysSincePayment > 14) {
      throw new BadRequestException('Refund period has expired (more than 14 days)');
    }
    if(order.PaymentMethod == PaymentMethods.cash){
      if(order.PaymentStatus !== PaymentStatus.Paid){
        await this._orderRepositoryService.deleteOne({
          _id:params.id
        })
        return res.status(200).json({
          msg:"order cancled"
        })
      }else{
        await this._orderRepositoryService.findByIdAndUpdate(params.id,{
          PaymentStatus : PaymentStatus.Refunded,
          Status : OrderStatus.Cancled,
          orderChanges : {
            refundAt : new Date()
          }
        })
        return res.status(200).json({
          msg: "The order has been canceled. You can get your refund when you return the item to the delivery agent."
        })
      }
    }else if (order.PaymentMethod == PaymentMethods.card){
      if(order.Status == OrderStatus.Confirmed){
        await this._orderRepositoryService.findByIdAndUpdate(params.id,{
          PaymentStatus : PaymentStatus.Refunded,
          Status : OrderStatus.Cancled,
          orderChanges : {
            refundAt : new Date()
          }
        })
      }else if(order.Status == OrderStatus.Pending){
        await this._paymentService.refund({
          paymentIntentId: order.PaymentInfo.payment_intent,
          amount: order.TotalPrice,
          reason: 'requested_by_customer',
        });
        return res.status(200).json({
          msg : "your order is canceld"
        })
      }
    }
    return res.status(400).json({ msg: "Unable to cancel order" });
  }
}