import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { subCatgory, subCatgoryDocument } from '../model';
interface catgoryOptaions {
    SubCatgoryName?: string;
    AddedBy?: Types.ObjectId;
    Catgory?: Types.ObjectId;
    img?: { public_id: string; secure_url: string };
  }
@Injectable()
export class subcatgoryRepositoryService extends DataBaseRepository<subCatgoryDocument> {
    constructor(@InjectModel(subCatgory.name) private readonly _subcatgoryModel: Model<subCatgoryDocument>,
    ) {
        super(_subcatgoryModel);
     }
     createSubcategorie({ SubCatgoryName, AddedBy , Catgory , img }: catgoryOptaions): Promise<subCatgoryDocument> {
        return this._subcatgoryModel.create({
        SubCatgoryName,
          AddedBy,
          Catgory,
          ...(img && { img })
        });
      }
}
