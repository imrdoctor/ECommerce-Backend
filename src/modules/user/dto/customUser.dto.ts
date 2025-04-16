import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength, Validate } from "class-validator";
import { IsMatchDecorator } from "src/common/decorator/is-match.decorator";
import { UserGender, UserRoles } from "src/common/types/types";

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
    // @IsDate()
    age: Date;
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
export class ConfirmEmail{
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    @MinLength(6)
    otp: string;
}
export class AdminUpdateUserDto{
    @IsEnum(UserRoles)
    role : string;
}