import { Module } from '@nestjs/common';
import { CartModel, couponModel, OrderModel, UserModel } from 'src/DB/model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { cartRepositoryService, orderRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { PaymentService } from 'src/common/paymant/payment';
import { couponRepositoryService } from 'src/DB/Repository/coupon.repository';

@Module({
    imports: [OrderModel,CartModel,couponModel,UserModel],
    controllers: [OrderController],
    providers: [OrderService,orderRepositoryService,cartRepositoryService,PaymentService,couponRepositoryService,UserRepositoryService],
    exports: [OrderService,orderRepositoryService,cartRepositoryService,PaymentService,couponRepositoryService,UserRepositoryService],
})
export class OrderModule {

}
