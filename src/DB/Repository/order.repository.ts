import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { Order, OrderDocument } from '../model';
@Injectable()
export class orderRepositoryService extends DataBaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) private readonly _orderModel: Model<OrderDocument>,
    ) {
        super(_orderModel);
     }
}
