import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { product } from "src/DB/model";

@ObjectType()
class SubImageType {
    @Field(() => String)
    public_id: string;

    @Field(() => String)
    secure_url: string;
}

@ObjectType()
export class ProductType implements Partial<product> {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field(() => String)
    ProductName: string;

    @Field(() => String)
    Slug: string;

    @Field(() => String)
    Descreption: string;

    @Field(() => Boolean)
    IsDeleted: boolean;

    @Field(() => ID)
    AddedBy: Types.ObjectId;

    @Field(() => ID)
    Subcacategorie: Types.ObjectId;

    @Field(() => String, { description: "Main image URL" })
    Img: string;

    @Field(() => [SubImageType])
    SubImgs: {
        public_id: string;
        secure_url: string;
    }[];

    @Field(() => Number)
    Price: number;

    @Field(() => Number)
    Discount: number;

    @Field(() => Number)
    SubPrice: number;

    @Field(() => Number)
    Stock: number;

    @Field(() => Number)
    Quantity: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}