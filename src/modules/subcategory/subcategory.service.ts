import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Request, Response  } from 'express';
import { UserDocument } from 'src/DB/model';
import { createSubCatgoryDto } from './dto/subCategory.dto';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcatgory.repository';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { Types } from 'mongoose';
import { catgoryRepositoryService } from 'src/DB/Repository';

@Injectable()
export class SubcategoryService {
    constructor(
        private readonly _subcatgoryRepositoryService: subcatgoryRepositoryService,
        private readonly _catgoryRepositoryService: catgoryRepositoryService,
        private readonly _CloudinaryServece: CloudinaryServece,
    ) {}
    async crateSubCategory(req:Request, res : Response, body : createSubCatgoryDto, user : UserDocument, img : Express.Multer.File , params : MongoIdDto){
        const {SubCatgoryName} = body;
        const {id} = params;
        const existingCatgory = await this._catgoryRepositoryService.findById(id)
        if(!existingCatgory){
            throw new ConflictException('Category not found'); 
        }
        const existingSubCatgory = await this._subcatgoryRepositoryService.findOne({SubCatgoryName});
        if(existingSubCatgory){
            throw new ConflictException('SubCategory already exists');
        }
        let imageData = { public_id: '', secure_url: '' };
        if (img) {
            const { public_id, secure_url } = await this._CloudinaryServece.uploadFile(img,{
                folder: 'ecommerce/subCategory/logo',
                public_id: `${SubCatgoryName}`,
              });
            imageData = { public_id, secure_url };
        }
        const catgory = await this._subcatgoryRepositoryService.createSubCategory({SubCatgoryName, ...(img && { img: imageData }), AddedBy : user._id, Catgory : new Types.ObjectId(id)});       
        return res.status(201).json({
            status: 'success',
            message: 'subCategory created successfully',
            data: catgory,
       });
    }
    async updateSubCategoryName(req:Request, res : Response, body : createSubCatgoryDto, user : UserDocument, params : MongoIdDto){
        const {SubCatgoryName} = body;
        const {id} = params;
        const existingSubCatgory = await this._subcatgoryRepositoryService.findById(id);
        if(!existingSubCatgory){
            throw new ConflictException('SubCategory not found');
        }
        if(existingSubCatgory.AddedBy.toString()!== user._id.toString()){
            new ForbiddenException('You are not authorized to update this SubCategory') 
        }
        const catgory = await this._subcatgoryRepositoryService.findByIdAndUpdate(id,{SubCatgoryName});
        return res.status(200).json({
            status:'success',
            message:'SubCategory updated successfully',
            data: catgory,
       });
    }
    async updateSubCategoryImg(req:Request, res : Response, user : UserDocument, img : Express.Multer.File, params : MongoIdDto){
        if(!img){
            throw new ConflictException('New Image is required');
        }
        const {id} = params;
        const existingSubCatgory = await this._subcatgoryRepositoryService.findById(id);
        if(!existingSubCatgory){
            throw new ConflictException('SubCategory not found');
        }
        if(existingSubCatgory.AddedBy.toString()!== user._id.toString()){
            new ForbiddenException('You are not authorized to update this SubCategory')
        }
        if (existingSubCatgory.img && 'public_id' in existingSubCatgory.img) {
            const public_id = existingSubCatgory.img.public_id as string;
            await this._CloudinaryServece.deleteFile(public_id);
        }
        const { public_id, secure_url } = await this._CloudinaryServece.uploadFile(img,{
            folder: 'ecommerce/category/logo',
            public_id: `${existingSubCatgory.SubCatgoryName}`,
          });
        const catgory = await this._subcatgoryRepositoryService.findByIdAndUpdate(id,{img : { public_id, secure_url }});
        return res.status(200).json({
            status:'success',
            message:'SubCategory img updated successfully',
            catgory, 
        })
    }
    async deleteSubCategory(req:Request, res : Response, user:UserDocument, params : MongoIdDto ){
        const {id} = params;
        const existingSubCatgory = await this._subcatgoryRepositoryService.findById(id);
        if(!existingSubCatgory){
            throw new ConflictException('SubCategory not found');
        }
        if(existingSubCatgory.AddedBy.toString() !== user._id.toString()){
            new ForbiddenException('You are not authorized to delete this SubCategory')
        }
        if (existingSubCatgory.img && 'public_id' in existingSubCatgory.img) {
            const public_id = existingSubCatgory.img.public_id as string;
           const ttt =  await this._CloudinaryServece.deleteFile(public_id);           
        }
        await this._subcatgoryRepositoryService.findByIdAndDelete(id);
        return res.status(200).json({
            status:'success',
            message:'SubCategory deleted successfully',
       });
    }
}
