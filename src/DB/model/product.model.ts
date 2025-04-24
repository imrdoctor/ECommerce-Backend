import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as slugify from 'slugify';
import { User } from './user.model';
import { catgory } from './catgory.model';
import { subCatgory } from './subcatgory.model';
export type productDocument = HydratedDocument<product> & { _id: string };
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class product {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 20 })
  ProductName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    default: function () {
      return slugify.default(this.ProductName, { lower: true, trim: true });
    },
  })
  Slug: string;
  @Prop({ type: String, required: true, minlength: 5, maxlength: 100 })
  Descreption: string;
  @Prop({ type: Boolean, default: false })
  IsDeleted: boolean;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  AddedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: subCatgory.name, required: true })
  Subcacategorie: Types.ObjectId;
  @Prop({ type: Object , required: true })
  Img: Object;
  @Prop({
    type: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    _id: true,
    default: [],
  })
  SubImgs: {
    _id?: string;
    public_id: string;
    secure_url: string;
  }[];
  @Prop({ type: Number, required: true })
  Price: number;
  @Prop({ type: Number, required: true , min: 1, max: 100 })
  Discount: number;
  @Prop({ type: Number, required: true })
  SubPrice : number;
  @Prop({ type: Number, required: true , min: 1  })
  Stock: number;
  @Prop({ type: Number, required: true , min: 1  })
  Quantity: number;
}
export const productSchema = SchemaFactory.createForClass(product);

export const productModel = MongooseModule.forFeature([
  { name: product.name, schema: productSchema },
]);
