import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { catgory, subCatgory, User } from './index';
export type couponDocument = HydratedDocument<coupon> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class coupon {
  @Prop({ type: String, required: true, minlength: 1, maxlength:10 , unique:true })
  Code: string;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  CreatedBy: Types.ObjectId;
  @Prop({ type: Number , min:1,max:100,required:true })
  Amount:number;
  @Prop({ type: Date , required: true  })
  ToDate : Date;  
  @Prop({ type: Date , required: true  })
  FromDate : Date;
  @Prop({type:[Types.ObjectId],ref:User.name})
  UsedBy: Types.ObjectId[];
  @Prop({ type: Boolean, default: false })
  IsWork: boolean;
}
export const couponSchema = SchemaFactory.createForClass(coupon);

export const couponModel = MongooseModule.forFeature([
  { name: coupon.name, schema: couponSchema },
]);
