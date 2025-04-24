import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';
import { catgory, catgoryDocument } from '../model';
interface catgoryOptaions {
  name?: string;
  AddedBy?: Types.ObjectId;
  image?: { public_id: string; secure_url: string };
}
@Injectable()
export class catgoryRepositoryService extends DataBaseRepository<catgoryDocument> {
  constructor(
    @InjectModel(catgory.name)
    private readonly _catgoryModel: Model<catgoryDocument>,
  ) {
    super(_catgoryModel);
  }
  createcategorie({ name, AddedBy , image }: catgoryOptaions): Promise<catgoryDocument> {
    return this._catgoryModel.create({
      name,
      AddedBy,
      ...(image && { image })
    });
  }
}
