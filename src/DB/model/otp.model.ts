import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';
import { OtpTypes } from 'src/common/types/types';
export type otpDocument = HydratedDocument<otp> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class otp {
  @Prop({ type: String, required: true })
  otp: string;
  @Prop({ type: String, required: true, enum: OtpTypes })
  otpType: string;
  @Prop({type: Date,required: true,default: new Date(Date.now() + 5 * 60 * 1000),})
  expireAt: Date;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}
export const otpSchema = SchemaFactory.createForClass(otp);

export const otpModel = MongooseModule.forFeature([
  { name: otp.name, schema: otpSchema },
]);
