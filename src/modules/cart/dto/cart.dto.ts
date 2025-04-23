import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class addToCartDto {
    @IsNotEmpty()
    @IsMongoId()
    productId: Types.ObjectId;
    @Type(()=>Number)
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}