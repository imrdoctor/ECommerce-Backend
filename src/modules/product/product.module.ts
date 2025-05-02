import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productModel } from '../../DB/model/product.model';
import { ProductRepositoryService } from '../../DB/Repository/product.repository';
import { brandModel, subCatgoryModel, UserModel } from 'src/DB/model';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcategorie.repository';
import { brandRepositoryService } from 'src/DB/Repository';

@Module({
    imports: [productModel,UserModel,subCatgoryModel,brandModel],
    controllers: [ProductController],
    providers: [ProductService, ProductRepositoryService,subcatgoryRepositoryService,brandRepositoryService]
})
export class ProductModule {}
