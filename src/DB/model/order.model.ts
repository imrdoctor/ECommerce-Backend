import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Cart, coupon, product, User } from './index';
import {
  OrderStatus,
  PaymentMethods,
  PaymentStatus,
} from 'src/common/types/types';
export type OrderDocument = HydratedDocument<Order> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  User: Types.ObjectId;
  @Prop({ type: String, required: true })
  Phone: String;
  @Prop({ type: String, required: true })
  Address: string;
  @Prop({ type: String, required: true, enum: Object.values(PaymentMethods) })
  PaymentMethod: PaymentMethods;
  @Prop({ type: String, required: true, enum: Object.values(PaymentStatus) })
  PaymentStatus: PaymentStatus;
  @Prop({ type: Number, required: true })
  TotalPrice: number;
  @Prop({ type: String, required: true, enum: Object.values(OrderStatus) })
  Status: OrderStatus;
  @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
  ArriveAt: Date;
  @Prop({ type: Types.ObjectId, ref: coupon.name })
  Coupon: Types.ObjectId;
  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: product.name },
        quantity: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
  })
  Items: { productId: Types.ObjectId; quantity: number; finalPrice: number }[];
  @Prop({ type: Object })
  discounts: {
      amount_discount: number;
      amount_shipping: number;
      amount_tax: number;
      code: string;
    
  };
  @Prop({ type: Object })
  PaymentInfo:{
    name : string,
    payment_intent : string
    paidAt : Date
  }
  @Prop({
    type: [
      {
        refundAt: Date
      },
    ],
  })
  orderChanges:{
    refundAt : Date,

  }
}
export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);
