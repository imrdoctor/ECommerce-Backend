import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Types } from "mongoose";

export class MongoIdDto {
    @IsMongoId({
        message: 'Invalid ID format. Please provide a valid id'
    })
    @IsNotEmpty({
        message: 'ID is required'
    })
    id: Types.ObjectId;
}
export class QueryFilterDto {
    @IsOptional()
    @IsString()
    select:string;    
    @IsOptional()
    @IsString()
    sort:string;
    @Type(()=> Number)
    @IsPositive()
    @IsOptional()
    @IsNumber()
    page:number;
    @Type(()=> Number)
    @IsPositive()
    @IsOptional()
    @IsNumber()
    limit:number;
}