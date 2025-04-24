import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { emailOtp, emailOtpDocument } from '../model/index';
interface otpOptaions {
  code?: string ; 
  expireAt?: Date;
  email?: string;
}
@Injectable()
export class emailOtpRepositoryService extends DataBaseRepository<emailOtpDocument> {
  constructor(
    @InjectModel(emailOtp.name) private readonly _emailOtpModel: Model<emailOtpDocument>,
  ) {
    super(_emailOtpModel);
  }
  createemailOtp({code,expireAt,email,}: otpOptaions): Promise<emailOtpDocument> {return this._emailOtpModel.create({
      code,
      expireAt ,
      email,
    });
  }
}
