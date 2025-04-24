import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { query, Request, Response } from 'express';

import { eventEmitter } from 'src/common/email/sendemail.events';
import { Decrypt, Encrypt } from 'src/common/security/crypto.helper';
import { CompareHash } from 'src/common/security/Hash.helper';
import { TokenService } from 'src/common/security/Jwt';
import { OtpTypes } from 'src/common/types/types';
import {
  UserRepositoryService,
  otpRepositoryService,
} from 'src/DB/Repository/index';
import { ConfirmEmail, CustomUserLogin, CustomUserRegister, sendConfirmregisterEmail } from './dto/customUser.dto';
import { emailOtpRepositoryService } from 'src/DB/Repository/emailOtp.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly UserRepositoryService: UserRepositoryService,
    private readonly TokenService: TokenService,
    private readonly otpRepositoryService: otpRepositoryService,
    private readonly _emailOtpRepositoryService: emailOtpRepositoryService,
  ) {}

  // Register
  async sendConfirmregister(body: sendConfirmregisterEmail, res: Response,): Promise<{}> {
    const {email} = body;
    const UserExsits = await this.UserRepositoryService.findOne({ email });
    if (UserExsits) {
      throw new ConflictException('"Email Already Used'); 
    }
    const foundOtp = await this._emailOtpRepositoryService.findOne(
      {
        email,
      },
    );
    if (foundOtp) {
      const cooldownEnd = new Date(foundOtp['createdAt']).getTime() + 5 * 60 * 1000;
      const now = Date.now();
      if (cooldownEnd > now) {
        const remainingMs = cooldownEnd - now;
        const remainingSeconds = Math.floor((remainingMs / 1000) % 60);
        const remainingMinutes = Math.floor((remainingMs / 1000 / 60) % 60);
        const timeString =
          (remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : '') +
          (remainingMinutes > 0 && remainingSeconds > 0 ? ' and ' : '') +
          (remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}` : '');
      
        throw new BadRequestException(`Cooldown: You can send another email after ${timeString}.`);
      }else if(cooldownEnd < now){
        await this._emailOtpRepositoryService.findByIdAndDelete(foundOtp._id)
      }
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const data = { code, email };
    eventEmitter.emit('sendActiveEmailOTP', data);
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    await this._emailOtpRepositoryService.createemailOtp({
      code ,
      expireAt,
      email,
    });
    return res.status(200).json({
      message: 'Email Send Successfully',
    });
  }
  async Register(res: Response , body : CustomUserRegister): Promise<{}> {
    const { Fname, Lname, email, password, birthDate, adress, phone, gender , emailVerfyCode } = body;
    const UserExsits = await this.UserRepositoryService.findOne({ email });
    if (UserExsits) {
      throw new ConflictException('User already exists');
    }
    const foundOtp = await this._emailOtpRepositoryService.findOne(
      {
        email,
      },
    )
    if (!foundOtp) {
      throw new BadRequestException('Invalid email'); 
    }
    if (foundOtp) {
      if (foundOtp.expireAt < new Date()) {
        throw new BadRequestException('Email verification code has expired');
      }
      const code = Decrypt(foundOtp.code,process.env.CRYPTO_SECRET).toString()
      if (code !== emailVerfyCode) {
        throw new BadRequestException('Invalid email verification code');
      }
      await this._emailOtpRepositoryService.findByIdAndDelete(foundOtp._id)
    }
    const user = await this.UserRepositoryService.create({
      Fname,
      Lname,
      email,
      password,
      birthDate: birthDate,
      adress,
      phone,
      gender,
    });
    return res.status(201).json({
      message: 'User created successfully',
      userName: user.UserName,
      email: user.email,
    });
  }
  // Login
  async Login(res: Response ,  body :CustomUserLogin): Promise<{}> {
    const { email, password } = body;
    const user = await this.UserRepositoryService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await CompareHash(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!user.RefreshJWTscret || !user.AccessJWTscret) {
      user.RefreshJWTscret = Math.floor(
        100000 + Math.random() * 900000000,
      ).toString();
      user.AccessJWTscret = Math.floor(
        100000 + Math.random() * 900000000,
      ).toString();
    }
    let RefreshJWTscret: string = user.RefreshJWTscret;
    let AccessJWTscret: string = user.AccessJWTscret;
    const token = this.TokenService.generateToken(
      { id: user['_id'], tokenType: 'access', AccessJWTscret },
      {
        secret: process.env.JWT_SECRET_USER,
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
    );
    const refreshToken = this.TokenService.generateToken(
      { id: user['_id'], tokenType: 'refresh', RefreshJWTscret },
      {
        secret: process.env.JWT_REFRESH_USER,
        expiresIn: process.env.JWT_EXPIRE_IN_REFRESH,
      },
    );
    const data = {
      AccessJWTscret,
      RefreshJWTscret,
    };
    await this.UserRepositoryService.findByIdAndUpdate(user['_id'], data);
    // const token = await this
    return res.status(200).json({
      message: 'User logged in successfully',
      userName: user.UserName,
      email: user.email,
      token,
      refreshToken,
    });
  }
  // Confirm Email
  // async confirmEmail(req: Request, res: Response , body : ConfirmEmail): Promise<{}> {
  //   const user = req['user'];    
  //   if (user.confirmed === true) {
  //     throw new BadRequestException('Account is already confirmed');
  //   }
  
  //   const foundOtps = await this.otpRepositoryService.find({
  //     filter: {
  //       userId: user['_id'],
  //       otpType: OtpTypes.confirmEmail,
  //     }
  //   });
  
  //   if (!foundOtps || foundOtps.length === 0) {
  //     throw new NotFoundException('No OTP found for this user');
  //   }
  
  //   let matchedOtp: { expireAt: Date; otp: string } | null = null;
  
  //   for (const otpEntry of foundOtps) {
  //     const decryptedOtp = Decrypt(otpEntry.otp, process.env.CRYPTO_SECRET).toString();
  //     if (decryptedOtp === body.otp) {
  //       matchedOtp = otpEntry;
  //       break;
  //     }
  //   }
  
  //   if (!matchedOtp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }
  
  //   if (new Date(matchedOtp.expireAt) < new Date()) {
  //     throw new BadRequestException('OTP has expired');
  //   }
  
  //   // Confirm the user
  //   const data = {
  //     confirmed: true,
  //   };
  //   const updatedUser = await this.UserRepositoryService.findByIdAndUpdate(user['_id'], data);
  
  //   // Delete all confirmEmail OTPs for this user
  //   await this.otpRepositoryService.deleteMany({
  //     userId: user['_id'],
  //     otpType: OtpTypes.confirmEmail,
  //   });
  
  //   return res.status(200).json({
  //     message: 'Account confirmed successfully',
  //     user: {
  //       userName: updatedUser?.UserName,
  //       email: updatedUser?.email,
  //       confirmed: updatedUser?.confirmed,
  //     },
  //   });
  // }
  // Get Profile
  async profile(req: Request, res: Response): Promise<{}> {
    const user = req['user'];
    const decryptedPhone = Decrypt(user.phone,process.env.CRYPTO_SECRET).toString()
    return res.status(200).json({
      message: 'User profile',
      User: {
        id: user.id,
        userName: user.UserName,
        email: user.email,
        age: user.age,
        role: user.role,
        phone : decryptedPhone,
        confirmed: user.confirmed,
        createdAt: user.createdAt,
      },
    });
  }
}
