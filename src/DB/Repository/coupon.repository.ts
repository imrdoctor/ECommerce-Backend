import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { coupon, couponDocument } from '../model';
interface couponOptaions  {
    Code?: string ; 
    Amount?: Number
    FromDate?: Date;
    ToDate?: Date;
    CreatedBy: Types.ObjectId;
  }
@Injectable()
export class couponRepositoryService extends DataBaseRepository<couponDocument> {
    constructor(@InjectModel(coupon.name) private readonly _couponModel: Model<couponDocument>,
    ) {
        super(_couponModel);
     }
     createCoupon({Code,Amount,FromDate,ToDate,CreatedBy}: couponOptaions): Promise<couponDocument> {return this._couponModel.create({Code,Amount,FromDate,ToDate,CreatedBy})}
}
