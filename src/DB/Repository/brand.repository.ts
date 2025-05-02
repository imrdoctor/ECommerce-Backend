import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { brand, brandDocument } from '../model';
interface BrandFields {
  BrandName: string;
  CreatedBy: Types.ObjectId;
  Catgory: Types.ObjectId;
  Image: {
    public_id: string;
    secure_url: string;
  };
}
@Injectable()
export class brandRepositoryService extends DataBaseRepository<brandDocument> {
  constructor(
    @InjectModel(brand.name) private readonly _brandModel: Model<brandDocument>,
  ) {
    super(_brandModel);
  }
  async createBrand({
    BrandName,
    CreatedBy,
    Catgory,
    Image,
  }: BrandFields): Promise<brandDocument> {
    return await this._brandModel.create({
      BrandName,
      CreatedBy,
      Catgory,
      ...(Image && { Image }),
    });
  }
  async updateBrand(
    id: string,
    { BrandName, CreatedBy, Catgory, Image }: BrandFields,
  ): Promise<brandDocument | {}> {
    const updatedBrand = await this._brandModel.findByIdAndUpdate(id,{ BrandName, CreatedBy, Catgory, ...(Image && { Image }) },{ new: true },).populate([
      { path: 'Catgory' },
      { path: 'Employees', select: 'Fname Lname' }
    ]);
    return updatedBrand || {};
  }

  async addEmployee(
    { id, EmployeeId }: { 
      id: Types.ObjectId; 
      EmployeeId: Types.ObjectId
     }
  ): Promise<brandDocument | {}> {
    const updatedBrand = await this._brandModel.findByIdAndUpdate(
      id,
      { $push: { Employees: EmployeeId } },
      { new: true }
    ).populate([
      { path: 'Catgory' },
      { path: 'Employees', select: 'Fname Lname' },
    ]);
  
    return updatedBrand || {};
  }
  async removeEmployee(
    { id, EmployeeId }: { 
      id: Types.ObjectId; 
      EmployeeId: Types.ObjectId
     }
  ): Promise<brandDocument | {}> {
    const updatedBrand = await this._brandModel.findByIdAndUpdate(
      id,
      { $pull: { Employees: EmployeeId } },
      { new: true }
    ).populate([
      { path: 'Catgory' },
      { path: 'Employees', select: 'Fname Lname' },
    ]);
  
    return updatedBrand || {};
  }
}
