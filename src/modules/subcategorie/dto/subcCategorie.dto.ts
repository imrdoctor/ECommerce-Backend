import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class createSubCatgoryDto {
    @IsString()
    @MaxLength(20)
    @MinLength(2)
    SubCatgoryName: string;
}