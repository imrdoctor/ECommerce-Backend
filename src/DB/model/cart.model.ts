import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { product, User } from './index';
import { Encrypt } from 'src/common/security/crypto.helper';
export type CartDocument = HydratedDocument<Cart> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  User: Types.ObjectId;
  @Prop({type:[{
    productId: {type:Types.ObjectId,ref:product.name},
    quantity:{type : Number , required:true},
    finalPrice:{type:Number,required:true}
  }]})
  Products: {productId:Types.ObjectId,quantity:number,finalPrice:number}[]
  @Prop({ type: Number, default: 0 })
  subTotal:number
  @Prop({type:String})
  uniqueCartCode : string
}
export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.pre('save',function(next){
  this.subTotal = this.Products.reduce((acc,prod)=>acc+(prod.finalPrice * prod.quantity),0)  
  if (this.isModified('uniqueCartCode')) {    
    this.uniqueCartCode = Encrypt(this.uniqueCartCode, process.env.CRYPTO_SECRET);
  }
  next();
})
export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
