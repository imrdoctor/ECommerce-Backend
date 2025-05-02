import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from 'src/DB/model';
import {
  brandRepositoryService,
  catgoryRepositoryService,
  UserRepositoryService,
} from 'src/DB/Repository';
import { createBrandDto, employeeDto } from './dto/brand.dto';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import * as fs from 'fs/promises';
import { Types } from 'mongoose';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly _brandRepositoryService: brandRepositoryService,
    private readonly _catgoryRepositoryService: catgoryRepositoryService,
    private readonly _UserRepositoryService: UserRepositoryService,
    private readonly _CloudinaryServece: CloudinaryServece,
  ) {}
  async createBrand(
    body: createBrandDto,
    res: Response,
    user: UserDocument,
    img: Express.Multer.File,
  ) {
    if (!img) {throw new ConflictException('Please Upload Brand Logo');}
    if (await this._brandRepositoryService.findOne({ BrandName:body.BrandName })){throw new ConflictException('Brand Name already exists');}
    if (!await this._catgoryRepositoryService.findById(body.Catgory )){throw new NotFoundException('Category not found');}
    const {public_id,secure_url} = await this._CloudinaryServece.uploadFile(img, {folder: 'ecommerce/brands/logo',public_id: `Logo_${body.BrandName}`, });
    const brand = await this._brandRepositoryService.createBrand({BrandName : body.BrandName,Catgory : body.Catgory,CreatedBy: user._id,Image: { secure_url, public_id },});
    return res.status(201).json({ message: 'Brand created successfully', 
      brand
     });
  }
  async getAllBrands(res: Response) {
    const brands = await this._brandRepositoryService.find({populate: [{path: 'Catgory',},{path: 'Employees',select: 'Fname Lname'}]});
    
    if(!brands.length) throw new NotFoundException('No brands found')
    return res.status(201).json({ message: 'Brands retrieved successfully', brands });
  }
  async updateBrand(
    body: createBrandDto,
    res: Response,
    user: UserDocument,
    img: Express.Multer.File,
    params: MongoIdDto,
  ){
    
    if (!await this._brandRepositoryService.findById(params.id)){throw new NotFoundException('Brand not found');}
    if(body.BrandName){
      if (await this._brandRepositoryService.findOne({ BrandName:body.BrandName })){throw new ConflictException('Brand Name already exists');}
    }
    if(body.Catgory){
      if (!await this._catgoryRepositoryService.findById(body.Catgory )){throw new NotFoundException('Category not found');}
    }
    let imgData = { public_id: '', secure_url: '' }
    const brand = await this._brandRepositoryService.findById(params.id);
    if (img) {
      const deleteresult = await this._CloudinaryServece.deleteFile(brand?.Image['public_id']);
      imgData = await this._CloudinaryServece.uploadFile(img, {folder: 'ecommerce/brands/logo',public_id: `Logo_${body.BrandName?? brand?.Image['public_id']}`, });
    }
    const updateData = {
      ...body,
      ...(img && {Image: {public_id: imgData.public_id,secure_url: imgData.secure_url,}})
    };
    const updatedBrand = await this._brandRepositoryService.findByIdAndUpdate(params.id, updateData);
    return res.status(201).json({ message: 'Brand updated successfully' , 
      updatedBrand
    });
  }
  async deleteBrand(res: Response, params: MongoIdDto , user: UserDocument, ) {
    const brand = await this._brandRepositoryService.findById(params.id)
    if (!brand){throw new NotFoundException('Brand not found');}
    if (brand.CreatedBy.toString() !== user._id.toString()){throw new ConflictException('You are not authorized to delete this brand');}
    await this._CloudinaryServece.deleteFile(brand?.Image['public_id']);
    const DeletedBrand = await this._brandRepositoryService.findByIdAndDelete(params.id);
    return res.status(201).json({ message: 'Brand deleted successfully', DeletedBrand });
  }
  async addEmployee(res: Response,user: UserDocument,body: employeeDto,params:MongoIdDto){
    if(user._id.toString() == body.EmployeeId.toString()){
      throw new ConflictException("You can't added Your Self")
    }
    const brand = await this._brandRepositoryService.findById(params.id);
    if (!brand){throw new NotFoundException('Brand not found');}
    if (brand.CreatedBy.toString()!== user._id.toString()){throw new ConflictException('You are not authorized to add employee to this brand');}
    const employee = await this._UserRepositoryService.findById(body.EmployeeId);
    if (!employee){throw new ConflictException('Employee Not Found');}
    // employee already exists in the brand
    if (brand.Employees.map(id => id.toString()).includes(body.EmployeeId.toString())) {
      throw new ConflictException('Employee already exists in the brand');
    }
    const Addedemployee = await this._brandRepositoryService.addEmployee({id : params.id, EmployeeId: body.EmployeeId});
    return res.status(201).json({ message: 'Employee added successfully', Addedemployee });
  }
  async removeEmployee(res: Response,user: UserDocument,body: employeeDto,params:MongoIdDto){
    if(user._id.toString() == body.EmployeeId.toString()){
      throw new ConflictException("You can't Remove Your Self")
    }
    const brand = await this._brandRepositoryService.findById(params.id);
    if (!brand){throw new NotFoundException('Brand not found');}
    if (brand.CreatedBy.toString()!== user._id.toString()){throw new ConflictException('You are not authorized to add employee to this brand');}
    const employee = await this._UserRepositoryService.findById(body.EmployeeId);
    if (!employee){throw new ConflictException('Employee Not Found');}
    // employee already exists in the brand
    if (!brand.Employees.map(id => id.toString()).includes(body.EmployeeId.toString())) {
      throw new ConflictException('Employee not exists in this brand');
    }
    const Removeemployee = await this._brandRepositoryService.removeEmployee({id : params.id, EmployeeId: body.EmployeeId});
    return res.status(200).json({
      message: 'Employee Removed successfully', Removeemployee
    })
  }
}
