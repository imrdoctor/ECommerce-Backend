import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { catgory, subCatgory, User } from './index';
export type brandDocument = HydratedDocument<brand> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class brand {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  BrandName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    default: function () {
      return slugify.default(this.name, { lower: true, trim: true });
    },
  })
  Slug: string;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  CreatedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: catgory.name, required: true })
  Catgory: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: subCatgory.name, required: true })
  SubCatgory: Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  IsDeleted: boolean;
  @Prop({ type: Object })
  Image: Object;
}
export const brandSchema = SchemaFactory.createForClass(brand);

export const brandModel = MongooseModule.forFeature([
  { name: brand.name, schema: brandSchema },
]);
