import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { OrderStatus, PaymentMethods, PaymentStatus } from "src/common/types/types";
import { Cart, Order } from "src/DB/model";
import { ProductType } from "./product.types";

@ObjectType()
export class OrderItemType {
    @Field(() => ID)
    productId: Types.ObjectId;
    
    @Field(() => ProductType, { nullable: true })
    product?: ProductType;
    
    @Field(() => Number)
    quantity: number;
    
    @Field(() => Number)
    finalPrice: number;
}


@ObjectType()
class DiscountType {
  @Field(() => Number, { nullable: true })
  amount_discount: number;
  
  @Field(() => Number, { nullable: true })
  amount_shipping: number;
  
  @Field(() => Number, { nullable: true })
  amount_tax: number;
  
  @Field(() => String, { nullable: true })
  code: string;
}

@ObjectType()
class PaymentInfoType {
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String, { nullable: true })
  payment_intent: string;
  
  @Field(() => Date, { nullable: true })
  paidAt: Date;
}

@ObjectType()
class OrderChangesType {
  @Field(() => Date, { nullable: true })
  refundAt: Date;
}

@ObjectType()
export class OrderType implements Partial<Order> {
    @Field(() => ID, { nullable: false })
    _id: string;
    
    @Field(() => ID, { nullable: false })
    User: Types.ObjectId;
    
    @Field(() => String, { nullable: false })
    Phone: String;
    
    @Field(() => String, { nullable: false })
    Address: string;
    
    @Field(() => String, { nullable: false })
    PaymentMethod: PaymentMethods;
    
    @Field(() => String, { nullable: false })
    PaymentStatus: PaymentStatus;
    
    @Field(() => Number, { nullable: false })
    TotalPrice: number;
    
    @Field(() => String, { nullable: false })
    Status: OrderStatus;
    
    @Field(() => Date, { nullable: false })
    ArriveAt: Date;
    
    @Field(() => ID, { nullable: true }) // Made nullable if coupon is optional
    Coupon: Types.ObjectId;
    
    @Field(() => [OrderItemType], { nullable: false })
    Items: OrderItemType[];
    
    @Field(() => DiscountType, { nullable: true })
    discounts: DiscountType;
    
    @Field(() => PaymentInfoType, { nullable: true })
    PaymentInfo: PaymentInfoType;
    
    @Field(() => OrderChangesType, { nullable: true })
    orderChanges: OrderChangesType;
}