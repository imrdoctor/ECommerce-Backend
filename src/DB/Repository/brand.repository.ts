import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { brand, brandDocument } from '../model';
@Injectable()
export class brandRepositoryService extends DataBaseRepository<brandDocument> {
    constructor(@InjectModel(brand.name) private readonly _brandModel: Model<brandDocument>,
    ) {
        super(_brandModel);
     }
}
