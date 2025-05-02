import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryService } from '../../DB/Repository/product.repository';
import { createProductDto, UpdateProductSubImgs, updateProductInfo, QueryDto } from './dto/product.dto';
import { Request, Response } from 'express';
import { productDocument, UserDocument } from 'src/DB/model';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcategorie.repository';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { FilterQuery } from 'mongoose';
import { brandRepositoryService } from 'src/DB/Repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly _ProductRepositoryService: ProductRepositoryService,
    private readonly _subcatgoryRepositoryService: subcatgoryRepositoryService,
    private readonly _brandRepositoryService: brandRepositoryService,
    private readonly _CloudinaryServece: CloudinaryServece,
  ) {}
  async createProduct(
    body: createProductDto,
    res: Response,
    user: UserDocument,
    imgs: { img?: Express.Multer.File; SubImgs?: Express.Multer.File[] },
  ) {
    const {ProductName,Descreption,Price,Discount,Stock,Quantity,Subcacategorie,Brand} = body;
    if (!await this._subcatgoryRepositoryService.findById(Subcacategorie)) {
      throw new ConflictException('Subcategorie not found');
    }
    const exsistBrand = await this._brandRepositoryService.findById(Brand)
    if (!exsistBrand) {
      throw new ConflictException('Brand not found');
    }
    // check if the user from brand staff 
    if(exsistBrand.CreatedBy.toString()!== user._id.toString() || !exsistBrand.Employees.map(id => id.toString()).includes(user._id.toString()) ){
      throw new ConflictException('You are not authorized to add product to this brand');
    }
    let imageData = { public_id: '', secure_url: '' };
    if (imgs.img) {
        
      const { public_id, secure_url } =
        await this._CloudinaryServece.uploadFile(imgs.img[0], {
          folder: 'ecommerce/product/logo',
          public_id: `${Date.now()}${ProductName}`,
        });
      imageData = { public_id: public_id, secure_url: secure_url };
    }
    let SubimagesData: { public_id: string; secure_url: string }[] = [];
    if (imgs.SubImgs) {
      for (const img of imgs.SubImgs) {        
        const { public_id, secure_url } =
          await this._CloudinaryServece.uploadFile(img, {
            folder: 'ecommerce/product/subImgs',
            public_id: `${Date.now()}${ProductName}`,
          });
        SubimagesData.push({ public_id, secure_url });
      }
    }
    const SubPrice = Price - (Price*((Discount | 0) /100));
     const product = await this._ProductRepositoryService.createProduct({
      ProductName,
      Descreption,
      Price,
      Discount,
      SubPrice,
      Stock,
      Quantity,
      Img: imageData,
      AddedBy: user._id,
      Subcacategorie,
      SubImgs: SubimagesData,
      Brand
    });
    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      product,
    });
  }
  async updateProductInfo(
    img: Express.Multer.File,
    body: updateProductInfo,
    res: Response,
    req: Request,
    id: MongoIdDto,
    user: UserDocument,
  ){
    const { ProductName, Descreption , Price, Discount, Stock} = body;
    const isImageUpdate = !!img;

    const isTextUpdate = ProductName || Descreption;
    if (!isImageUpdate && !isTextUpdate) {
      return res.status(400).json({ status: 'error', message: 'Nothing to update' });
    }
  
    const exsitngProduct = await this._ProductRepositoryService.findById(id.id);
    if (!exsitngProduct) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  
    const updateData: any = {};
  
    if (img) {
      const oldImage = exsitngProduct.Img as { public_id: string };
      if (oldImage?.public_id) {
        await this._CloudinaryServece.deleteFile(oldImage.public_id);
      }
  
      const { public_id, secure_url } = await this._CloudinaryServece.uploadFile(img, {
        folder: 'ecommerce/product/logo',
        public_id: `${ProductName || exsitngProduct.ProductName}`,
      });
  
      updateData.Img = { public_id, secure_url };
    }
  
    if (ProductName) updateData.ProductName = ProductName;
    if (Descreption) updateData.Descreption = Descreption;
    if (Price) updateData.Price = Price;
    if (Discount) updateData.Discount = Discount;
    if (Stock) updateData.Stock = Stock;
    if(Price && Discount){
      updateData.SubPrice = Price - (Price*((Discount | 0) /100));
    } else if(Price){
      updateData.SubPrice = Price - (Price*((exsitngProduct.Discount | 0) /100));; 
    } else if(Discount){
      updateData.SubPrice = exsitngProduct.Price - (exsitngProduct.Price*((Discount | 0) /100));
    }
    const product = await this._ProductRepositoryService.findByIdAndUpdate(id.id, updateData);
  
    return res.status(200).json({
      message: 'Product updated',
      product: product,
    });
  }
  async deleteProduct(
    id: MongoIdDto,
    res: Response,
    req: Request,
    user : UserDocument,
  ){
    const product = await this._ProductRepositoryService.findById(id.id);
    if (!product) {
    throw new ConflictException('Product not found');
    }
    if(product.AddedBy.toString() !== user._id.toString()){
      throw new ConflictException('You are not authorized to delete this product'); 
    }
    // delete iall images of product
    if((product.Img as { public_id: string }).public_id){
      await this._CloudinaryServece.deleteFile((product.Img as { public_id: string }).public_id);
    }
    // delete Sub imgs
    if(product.SubImgs.length > 0){
      for (const img of product.SubImgs) {  
        await this._CloudinaryServece.deleteFile(img.public_id);
    }
    }
    await this._ProductRepositoryService.findByIdAndDelete(id.id);
    return res.status(200).json({ message: 'Product deleted' });
  }
  async updateSubImgs( 
    imgs: Express.Multer.File[],
    res: Response,
    req: Request,
    user: UserDocument,
    params: MongoIdDto,
    body: UpdateProductSubImgs
  ) {
    const ExsistProduct = await this._ProductRepositoryService.findById(params.id);
  
    if (!ExsistProduct) {
      throw new ConflictException('Product not found');
    }
  
    if (ExsistProduct.AddedBy.toString() !== user._id.toString()) {
      throw new ConflictException('You are not authorized to update this product');
    }    
    const { deleteImg } = body;
  
    if ((!deleteImg || deleteImg.length === 0) && imgs.length === 0) {
      throw new BadRequestException('No images provided to update or delete.');
    }
  
    let updatedSubImgs = [...ExsistProduct.SubImgs];
  
    if (deleteImg && deleteImg.length > 0) {
      for (const imgId of deleteImg) {
        const targetImg = ExsistProduct.SubImgs.find(img => img._id?.toString() === imgId);
        if (!targetImg) {
          throw new NotFoundException(`Image with id ${imgId} not found in product.`);
        }

        await this._CloudinaryServece.deleteFile(targetImg.public_id);
        updatedSubImgs = updatedSubImgs.filter(img => img._id?.toString() !== imgId);
      }
    }
    if (imgs.length > 0) {
      for (const img of imgs) {
        const { public_id, secure_url } = await this._CloudinaryServece.uploadFile(img, {
          folder: 'ecommerce/product/subImgs',
          public_id: `${ExsistProduct.ProductName}-${Date.now()}`, 
        });

        updatedSubImgs.push({ public_id, secure_url });
      }
    }
  
    ExsistProduct.SubImgs = updatedSubImgs;
    await ExsistProduct.save();
  
    return res.status(200).json({
      status: 'success',
      message: 'Product sub images updated successfully',
      updatedSubImgs,
    });
  }
  async getAllProducts(req: Request, res: Response, query: QueryDto) {
    const { name, select, sort, page = 1, limit = 10 } = query;
  
    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
  
    let filterObject: FilterQuery<productDocument> = {};
  
    if (name) {
      filterObject = {
        $or: [
          { ProductName: { $regex: name, $options: 'i' } },
          { Slug: { $regex: name, $options: 'i' } }
        ]
      };
    }
  
    const products = await this._ProductRepositoryService.find({
      filter: filterObject,
      populate: [{ path: 'Subcacategorie' }],
      select,
      sort,
      page: numericPage,
      limit: numericLimit
    });
  
    const response = {
      status: 'success',
      results: products.length,
      currentPage: numericPage,
      products,
      message: products.length > 0 ? 'Products retrieved successfully' : 'No products found'
    };
  
    return res.status(200).json(response);
  }
}
