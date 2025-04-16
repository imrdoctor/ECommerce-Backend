import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { product, productDocument } from '../model';

interface ProductOptions {
  ProductName: string;
  Descreption: string;
  Price: number;
  Discount: number;
  SubPrice: number;
  Stock: number;
  Quantity: number;
  Img: { public_id: string; secure_url: string };
  AddedBy: Types.ObjectId;
  SubImgs?: Array<{ public_id: string; secure_url: string }>;
  SubcaCategory: Types.ObjectId;
}

@Injectable()
export class ProductRepositoryService extends DataBaseRepository<productDocument> {
  constructor(
    @InjectModel(product.name)
    private readonly _productModel: Model<productDocument>,
  ) {
    super(_productModel);
  }

  async createProduct({
    ProductName,
    Descreption,
    Price,
    Discount,
    SubPrice,
    Stock,
    Quantity,
    Img,
    AddedBy,
    SubImgs,
    SubcaCategory,
  }: ProductOptions): Promise<productDocument> {
    return this._productModel.create({
      ProductName,
      Descreption,
      Price,
      Discount,
      SubPrice,
      Stock,
      Quantity,
      ...(Img && { Img }),
      AddedBy,
      ...(SubImgs && { SubImgs }),
      SubcaCategory
    });
  }
}