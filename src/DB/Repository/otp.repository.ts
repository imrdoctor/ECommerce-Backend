import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { otp, otpDocument } from '../model/index';
interface otpOptaions {
  otp?: string ; 
  userId?: Types.ObjectId;
  otpType?: string;
  expireAt?: Date;
}
@Injectable()
export class otpRepositoryService extends DataBaseRepository<otpDocument> {
  constructor(
    @InjectModel(otp.name) private readonly _otpModel: Model<otpDocument>,
  ) {
    super(_otpModel);
  }
  createOtp({otp,expireAt,otpType,userId,}: otpOptaions): Promise<otpDocument> {return this._otpModel.create({
      otp,
      expireAt : expireAt || new Date(Date.now() + 5 * 60 * 1000),
      userId,
      otpType,
    });
  }
}
