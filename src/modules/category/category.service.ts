import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { catgoryRepositoryService } from 'src/DB/Repository';
import { crateCatgoryDto, updateCatgoryImgDto, updateCatgoryNameDto } from './dto/customCategory.dto';
import { UserDocument } from 'src/DB/model';
import { Request, Response } from 'express';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import { Types } from 'mongoose';
import { MongoIdDto } from '../GlobalDto/global.dto';
@Injectable()
export class CategoryService {
  constructor(
    private readonly _catgoryRepositoryService: catgoryRepositoryService,
    private readonly _CloudinaryServece: CloudinaryServece,
  ) {}
  //////////////////// Create Category ////////////////////
  async createCategory(
    req: Request,
    res: Response,
    body: crateCatgoryDto,
    user: UserDocument,
    img: Express.Multer.File,
  ) {
    const existingCatgory = await this._catgoryRepositoryService.findOne({
      name: body.name,
    });
    if (existingCatgory) {
      throw new NotFoundException('Category already exists');
    }
    let imageData = { public_id: '', secure_url: '' };
    if (img) {
      const uploadedImage = await this._CloudinaryServece.uploadFile(img, {
        folder: 'ecommerce/category/logo',
        public_id: `${body.name}`,
      });
      imageData = {
        public_id: uploadedImage.public_id,
        secure_url: uploadedImage.secure_url,
      };
    }

    const catgory = await this._catgoryRepositoryService.createCategory({
      name: body.name,
      AddedBy: user._id,
      ...(img && { image: imageData }),
    });

    return res.status(201).json({
      message: 'Category created successfully',
      catgory,
    })
  }
  //////////////////// Update Category ////////////////////
  async updateCategoryImg(
    req: Request,
    res: Response,
    body: updateCatgoryImgDto,
    user: UserDocument,
    img: Express.Multer.File,
    id: MongoIdDto,
  ) {
    if (!img) {
      throw new BadRequestException('New Image is required');
    }
    const catgory = await this._catgoryRepositoryService.findById(new Types.ObjectId(id.id));
    if (!catgory) {
      throw new NotFoundException('Category not found');
    }
    if (catgory.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to update this category',
      );
    }
    if (catgory.image && 'public_id' in catgory.image) {
      const public_id = catgory.image.public_id as string;
      await this._CloudinaryServece.deleteFile(public_id);
    }
    const uploadedImage = await this._CloudinaryServece.uploadFile(img, {
      folder: 'ecommerce/category/logo',
      public_id: `${catgory.name}`,
    });
    let imageData = {
      public_id: uploadedImage.public_id,
      secure_url: uploadedImage.secure_url,
    };
    const updatedCatgoryImg =
      await this._catgoryRepositoryService.findByIdAndUpdate(id, {
        image: imageData,
      });
    return res.status(200).json({
      message: 'Category updated successfully',
      updatedCatgoryImg: uploadedImage.secure_url,
    });
  }
  async updateCategoryName(
    req: Request,
    res: Response,
    body: updateCatgoryNameDto,
    user: UserDocument,
    id: MongoIdDto,
  ) {
    const catgory = await this._catgoryRepositoryService.findById(new Types.ObjectId(id.id));
    if (!catgory) {
      throw new NotFoundException('Category not found');
    }
    const {name} = body
    if(name === catgory.name) {
      throw new BadRequestException('Category Name is same');
    }
    const existingCatgory = await this._catgoryRepositoryService.findOne({
      name,
    });
    if (existingCatgory) {
      throw new NotFoundException('Category Name already exists');
    }

    if (catgory.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to update this category',
      );
    }
    const updatedCatgoryName =
      await this._catgoryRepositoryService.findByIdAndUpdate(id, {
        name: body.name,
      });
      return res.status(200).json({
        message: 'Category updated successfully',
        updatedCatgoryName,
      });
  }
  async deleteCategory(
    req: Request,
    res: Response, 
    user: UserDocument,
    id: MongoIdDto,
  ) {  
    const category = await this._catgoryRepositoryService.findById(new Types.ObjectId(id.id));
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to delete this category',
      );
    }

    if (category.image && 'public_id' in category.image) {
      const public_id = category.image.public_id as string;
      await this._CloudinaryServece.deleteFile(public_id);
    }
    await this._catgoryRepositoryService.findByIdAndDelete(new Types.ObjectId(id.id));
    // delete all products and all subcatgory related with this catgory
    return res.status(200).json({
      message: 'Category deleted successfully'
    });
  }
}
