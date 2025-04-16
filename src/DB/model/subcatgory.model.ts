import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { User } from './user.model';
import { catgory } from './catgory.model';
export type subCatgoryDocument = HydratedDocument<subCatgory> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class subCatgory {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  SubCatgoryName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    default: function () {
      return slugify.default(this.SubCatgoryName, { lower: true, trim: true });
    },
  })
  Slug: string;
  @Prop({ type: Types.ObjectId, ref: catgory.name, required: true })
  Catgory: Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  IsDeleted: boolean;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  AddedBy: Types.ObjectId;
  @Prop({ type: Object })
  img: Object;
}
export const subCatgorySchema = SchemaFactory.createForClass(subCatgory);

export const subCatgoryModel = MongooseModule.forFeature([
  { name: subCatgory.name, schema: subCatgorySchema },
]);
