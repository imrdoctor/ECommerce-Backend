import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaymentMethods } from "src/common/types/types";

export class createorderDto {
    @IsString()
    @IsNotEmpty()
    Phone:string;
    @IsString()
    @IsNotEmpty()
    Address:string;
    @IsEnum(PaymentMethods)
    PaymentMethod:PaymentMethods;
    @IsString()
    @IsOptional()
    Coupon:string;
}