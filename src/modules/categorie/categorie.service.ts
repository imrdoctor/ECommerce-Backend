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
export class categorieService {
  constructor(
    private readonly _catgoryRepositoryService: catgoryRepositoryService,
    private readonly _CloudinaryServece: CloudinaryServece,
  ) {}
  //////////////////// Create categorie ////////////////////
  async createcategorie(
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
      throw new NotFoundException('categorie already exists');
    }
    let imageData = { public_id: '', secure_url: '' };
    if (img) {
      const uploadedImage = await this._CloudinaryServece.uploadFile(img, {
        folder: 'ecommerce/categorie/logo',
        public_id: `${body.name}`,
      });
      imageData = {
        public_id: uploadedImage.public_id,
        secure_url: uploadedImage.secure_url,
      };
    }

    const catgory = await this._catgoryRepositoryService.createcategorie({
      name: body.name,
      AddedBy: user._id,
      ...(img && { image: imageData }),
    });

    return res.status(201).json({
      message: 'categorie created successfully',
      catgory,
    })
  }
  //////////////////// Update categorie ////////////////////
  async updatecategorieImg(
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
      throw new NotFoundException('categorie not found');
    }
    if (catgory.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to update this categorie',
      );
    }
    if (catgory.image && 'public_id' in catgory.image) {
      const public_id = catgory.image.public_id as string;
      await this._CloudinaryServece.deleteFile(public_id);
    }
    const uploadedImage = await this._CloudinaryServece.uploadFile(img, {
      folder: 'ecommerce/categorie/logo',
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
      message: 'categorie updated successfully',
      updatedCatgoryImg: uploadedImage.secure_url,
    });
  }
  async updatecategorieName(
    req: Request,
    res: Response,
    body: updateCatgoryNameDto,
    user: UserDocument,
    id: MongoIdDto,
  ) {
    const catgory = await this._catgoryRepositoryService.findById(new Types.ObjectId(id.id));
    if (!catgory) {
      throw new NotFoundException('categorie not found');
    }
    const {name} = body
    if(name === catgory.name) {
      throw new BadRequestException('categorie Name is same');
    }
    const existingCatgory = await this._catgoryRepositoryService.findOne({
      name,
    });
    if (existingCatgory) {
      throw new NotFoundException('categorie Name already exists');
    }

    if (catgory.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to update this categorie',
      );
    }
    const updatedCatgoryName =
      await this._catgoryRepositoryService.findByIdAndUpdate(id, {
        name: body.name,
      });
      return res.status(200).json({
        message: 'categorie updated successfully',
        updatedCatgoryName,
      });
  }
  async deletecategorie(
    req: Request,
    res: Response, 
    user: UserDocument,
    id: MongoIdDto,
  ) {  
    const categorie = await this._catgoryRepositoryService.findById(new Types.ObjectId(id.id));
    if (!categorie) {
      throw new NotFoundException('categorie not found');
    }

    if (categorie.AddedBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'You are not authorized to delete this categorie',
      );
    }

    if (categorie.image && 'public_id' in categorie.image) {
      const public_id = categorie.image.public_id as string;
      await this._CloudinaryServece.deleteFile(public_id);
    }
    await this._catgoryRepositoryService.findByIdAndDelete(new Types.ObjectId(id.id));
    // delete all products and all subcatgory related with this catgory
    return res.status(200).json({
      message: 'categorie deleted successfully'
    });
  }
  async getAllCategories(res: Response){
    const categories = await this._catgoryRepositoryService.findAll();
    if(!categories) {
      throw new NotFoundException('No Categories Added');
    }
    return res.status(200).json({
      message: 'Categories fetched successfully',
      categories, 
    })
  }
}
