import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productModel } from '../../DB/model/product.model';
import { ProductRepositoryService } from '../../DB/Repository/product.repository';
import { subCatgoryModel, UserModel } from 'src/DB/model';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcatgory.repository';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';

@Module({
    imports: [productModel,UserModel,subCatgoryModel],
    controllers: [ProductController],
    providers: [ProductService, ProductRepositoryService,subcatgoryRepositoryService,CloudinaryServece]
})
export class ProductModule {}
