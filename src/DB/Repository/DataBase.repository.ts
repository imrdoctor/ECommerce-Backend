import { FilterQuery, Model, PopulateOptions, QueryOptions, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
interface FindOptions <TDocument>{
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    limit?: number;
    select?: string;
    page?: number;
    sort?: string;
}
export abstract class DataBaseRepository<TDocument> {
    constructor(private readonly model:Model<TDocument>){}
    async create(data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data);
    }
    async findOne(
        query: FilterQuery<TDocument>,
        populate?: PopulateOptions[]
    ): Promise<TDocument | null> {
return (await this.model.findOne(query).populate(populate || []) as TDocument
    )}
    async find({filter = {},populate = [],page = 1,sort = '', select = ' ',limit,} : FindOptions<TDocument>): Promise<TDocument[] | []> {
        const query = this.model.find(filter);
        if (populate) query.populate(populate);
        if (select) query.select(select.replaceAll(","," "));
        if (sort) query.sort(sort.replaceAll(","," "));
        if (limit) query.limit(limit);
        if (page && limit) query.skip((page - 1) * limit);
        return await query.exec();
    }
    async findById(id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(id);
    }
    async findAll(): Promise<TDocument[]> {
        return this.model.find();
    }
    async findOneAndUpdate(
        query: FilterQuery<TDocument>,
        data: UpdateQuery<TDocument>,
        options: QueryOptions = { new: true },
      ): Promise<TDocument | null> {
        return this.model.findOneAndUpdate(query, data, options);
      }
    async updateOne(
        query: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>
      ): Promise<UpdateWriteOpResult> {
        return this.model.updateOne(query, update);
      }
    async findByIdAndUpdate(
        id: FilterQuery<TDocument>,
        data: Partial<TDocument>,
    ): Promise<TDocument | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteOne(
        query: FilterQuery<TDocument>,
    ): Promise<TDocument | null> {
        return this.model.findOneAndDelete(query);
    }
    async deleteMany(query:FilterQuery<TDocument>): Promise<void> {
        await this.model.deleteMany(query);
    }
    async findByIdAndDelete(id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findByIdAndDelete(id);
    }
}