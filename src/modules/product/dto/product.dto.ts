import { Types } from "mongoose";
import { User } from "src/DB/model";
import { IsString, IsNumber, Min, Max, Length, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Transform, Type } from "class-transformer";
import { IsArrayOfMongoIds } from "src/common/decorator/isArryOfMongoIds.decorator";
import { sanitizeFields } from "src/common/decorator/sanitize-fields.decorator";
import { sanitizeSort } from "src/common/decorator/sanitize-sort.decorator";
export const allowedFields = ['ProductName', 'Price', 'Stock', 'Slug', 'Discount', 'SubPrice'];

export class createProductDto {
  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  ProductName: string;

  @IsString()
  @Length(5, 100)
  @IsNotEmpty()
  Descreption: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  Price: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  Discount: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  Stock: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  Quantity: number;
  @IsMongoId({
    message: 'Invalid ID format. Please provide a valid Subcacategorie id'
})
@IsNotEmpty({
    message: 'Subcacategorie ID is required'
})
  Subcacategorie: Types.ObjectId;
}
export class updateProductInfo{
  @IsString()
  @Length(2, 20)
  ProductName: string;

  @IsString()
  @Length(5, 100)
  Descreption: string;

  
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  Price: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  Discount: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  Stock: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  Quantity: number;
}
export class UpdateProductSubImgs {
  @IsArray()
  @IsOptional()
  @IsArrayOfMongoIds({ message: 'All provided IDs must be valid Id.' })
  deleteImg: string[];
}
export class QueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitizeFields(value, allowedFields))
  select?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitizeSort(value, allowedFields))
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;
}