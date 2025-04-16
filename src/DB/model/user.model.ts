import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Encrypt } from 'src/common/security/crypto.helper';
import { Hash } from 'src/common/security/Hash.helper';
import { LoginProvider, UserGender, UserRoles } from 'src/common/types/types';

export type UserDocument = HydratedDocument<User> & { _id: string };

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  Fname: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  Lname: string;

  @Virtual({
    get: function (this: User) {
      return `${this.Fname} ${this.Lname}`;
    },
  })
  UserName: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 8, maxlength: 80 })
  password: string;

  @Prop({ type: Number, required: true, min: 18, max: 100 })
  age: number;

  @Prop({ type: Boolean, default: false })
  confirmed: boolean;

  @Prop({ type: String, enum: UserRoles, default: UserRoles.USER })
  role: string;

  @Prop({ type: String })
  AccessJWTscret: string;

  @Prop({ type: String })
  RefreshJWTscret: string;

  @Prop({ type: String, enum: UserGender, required: true })
  gender: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 25 })
  adress: string;

  @Prop({ type: String, required: true, minlength: 10, maxlength: 15 })
  phone: string;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
  @Prop({ type: String, enum: LoginProvider, default: LoginProvider.email })
  provicer: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = Hash(this.password);
  }
  if (this.isModified('phone')) {
    this.phone = Encrypt(this.phone, process.env.CRYPTO_SECRET);  }
  next();
});

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
