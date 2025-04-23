import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { Cart, CartDocument } from '../model';
interface catgoryOptaions {
    User: Types.ObjectId;
    Products: {productId: Types.ObjectId, quantity: number, finalPrice: number}[];
}
@Injectable()
export class cartRepositoryService extends DataBaseRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) private readonly _cartModel: Model<CartDocument>,
    ) {
        super(_cartModel);
     }
     async addToCart({User, Products}: catgoryOptaions): Promise<CartDocument> {
         return this._cartModel.create({User, Products});
     }
     async getUserCart(User: Types.ObjectId): Promise<CartDocument | null> {
         return this._cartModel.findOne({User}).populate('Products.productId');
     }
}
