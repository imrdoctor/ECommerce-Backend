import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';
import { Encrypt } from 'src/common/security/crypto.helper';
export type emailOtpDocument = HydratedDocument<emailOtp> & { _id: string };
// THIS SCHEMA FOR register email otp
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class emailOtp {
  @Prop({ type: String, required: true })
  code: string;
  @Prop({type: Date,required: true,default: new Date(Date.now() + 5 * 60 * 1000),})
  expireAt: Date;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  email: Types.ObjectId;
}
export const emailOtpSchema = SchemaFactory.createForClass(emailOtp);
emailOtpSchema.pre('save', function (next) {
  if (this.isModified('code')) {
    this.code = Encrypt(this.code, process.env.CRYPTO_SECRET);  }
  next();
});
export const emailOtpModel = MongooseModule.forFeature([
  { name: emailOtp.name, schema: emailOtpSchema },
]);