import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class crateCatgoryDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    name : string;
    @IsOptional()
    img: string;
}
export class updateCatgoryImgDto{
    img: string;
}
export class updateCatgoryNameDto{
    @IsString()
    @IsOptional()
    @MaxLength(20)
    @MinLength(2)
    name : string;
}