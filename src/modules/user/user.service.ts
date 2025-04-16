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
import { ConfirmEmail, CustomUserLogin, CustomUserRegister } from './dto/customUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly UserRepositoryService: UserRepositoryService,
    private readonly TokenService: TokenService,
    private readonly otpRepositoryService: otpRepositoryService,
  ) {}

  // Register
  async Register(req: Request, res: Response , body : CustomUserRegister): Promise<{}> {
    const { Fname, Lname, email, password, age, role, adress, phone, gender } =
      req.body;
    const UserExsits = await this.UserRepositoryService.findOne({ email });
    if (UserExsits) {
      throw new ConflictException('User already exists');
    }
    const user = await this.UserRepositoryService.create({
      Fname,
      Lname,
      email,
      password,
      age,
      role,
      adress,
      phone,
      gender,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const data = { otp, email, id: user['_id'] };
    eventEmitter.emit('sendActiveEmailOTP', data);
    const cryptedOtp = Encrypt(otp, process.env.CRYPTO_SECRET).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.otpRepositoryService.createOtp({
      otp: cryptedOtp,
      expireAt,
      otpType: OtpTypes.confirmEmail,
      userId: user['_id'],
    });
    return res.status(201).json({
      message: 'User created successfully',
      userName: user.UserName,
      email: user.email,
    });
  }
  // Login
  async Login(req: Request, res: Response ,  body :CustomUserLogin): Promise<{}> {
    const { email, password } = req.body;
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
  async confirmEmail(req: Request, res: Response , body : ConfirmEmail): Promise<{}> {
    const user = req['user'];    
    if (user.confirmed === true) {
      throw new BadRequestException('Account is already confirmed');
    }
  
    const foundOtps = await this.otpRepositoryService.find({
      filter: {
        userId: user['_id'],
        otpType: OtpTypes.confirmEmail,
      }
    });
  
    if (!foundOtps || foundOtps.length === 0) {
      throw new NotFoundException('No OTP found for this user');
    }
  
    let matchedOtp: { expireAt: Date; otp: string } | null = null;
  
    for (const otpEntry of foundOtps) {
      const decryptedOtp = Decrypt(otpEntry.otp, process.env.CRYPTO_SECRET).toString();
      if (decryptedOtp === body.otp) {
        matchedOtp = otpEntry;
        break;
      }
    }
  
    if (!matchedOtp) {
      throw new BadRequestException('Invalid OTP');
    }
  
    if (new Date(matchedOtp.expireAt) < new Date()) {
      throw new BadRequestException('OTP has expired');
    }
  
    // Confirm the user
    const data = {
      confirmed: true,
    };
    const updatedUser = await this.UserRepositoryService.findByIdAndUpdate(user['_id'], data);
  
    // Delete all confirmEmail OTPs for this user
    await this.otpRepositoryService.deleteMany({
      userId: user['_id'],
      otpType: OtpTypes.confirmEmail,
    });
  
    return res.status(200).json({
      message: 'Account confirmed successfully',
      user: {
        userName: updatedUser?.UserName,
        email: updatedUser?.email,
        confirmed: updatedUser?.confirmed,
      },
    });
  }
  // Get Profile
  async profile(req: Request, res: Response): Promise<{}> {
    const user = req['user'];
    return res.status(200).json({
      message: 'User profile',
      User: {
        id: user.id,
        userName: user.UserName,
        email: user.email,
        age: user.age,
        role: user.role,
        confirmed: user.confirmed,
        createdAt: user.createdAt,
      },
    });
  }
}
