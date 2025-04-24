import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, ValidateNested } from "class-validator";
import { IsMatchDecorator } from "src/common/decorator/is-match.decorator";
import { UserGender, UserRoles } from "src/common/types/types";
export class ConfirmEmail{
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    @MinLength(6)
    otp: string;
}
export class CustomUserRegister {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    Fname: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    Lname: string;
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
    @IsMatchDecorator("password")    
    confirmPassword: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    @MinLength(6)
    emailVerfyCode: string;    
    @IsDate()
    @Type(() => Date)
    birthDate: Date;
    @IsEnum(UserGender)
    gender: string;
    @IsString()
    @MaxLength(25)
    @MinLength(2)
    @IsNotEmpty()
    adress: string;
    @IsString()
    @MaxLength(15)
    @MinLength(10)
    @IsNotEmpty()
    phone: string;
}
export class CustomUserLogin {
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
}
export class sendConfirmregisterEmail{
    @IsEmail()
    email: string;
}
export class AdminUpdateUserDto{
    @IsEnum(UserRoles)
    role : string;
}