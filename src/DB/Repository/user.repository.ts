import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.model';
import { FilterQuery, Model } from 'mongoose';
import { DataBaseRepository } from './DataBase.repository';

@Injectable()
export class UserRepositoryService extends DataBaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    ) {
        super(_userModel);
     }

}
