import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { User } from './user.model';
export type catgoryDocument = HydratedDocument<catgory> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class catgory {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  })
  name: string;
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
  AddedBy: Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
  @Prop({ type: Object })
  image: Object;
}
export const catgorySchema = SchemaFactory.createForClass(catgory);

export const catgoryModel = MongooseModule.forFeature([
  { name: catgory.name, schema: catgorySchema },
]);
