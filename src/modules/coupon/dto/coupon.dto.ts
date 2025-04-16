import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Max, Min, Validate } from "class-validator";
import { IsAfterFromDateConstraint, IsFutureDateConstraint } from "src/common/decorator/is-before.decorator";

export class CrateCouponDto{
    @IsString()    
    @IsNotEmpty()
    @Length(2,10)
    Code:string;
    @Type(()=>Number)
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Max(100)
    Amount:number;
    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    @Validate(IsFutureDateConstraint)
    FromDate:Date;
    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    @Validate(IsAfterFromDateConstraint)
    ToDate:Date;
}
export class updateCouponDto{
    @IsString()    
    @IsNotEmpty()
    @Length(2,10)
    Code:string;
    @Type(()=>Number)
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Max(100)
    Amount:number;
    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    @Validate(IsFutureDateConstraint)
    FromDate:Date;
    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    @Validate(IsAfterFromDateConstraint)
    ToDate:Date;
}