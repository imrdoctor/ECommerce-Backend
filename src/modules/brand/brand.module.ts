import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { brandModel, catgoryModel, subCatgoryModel } from 'src/DB/model';
import { brandRepositoryService, catgoryRepositoryService } from 'src/DB/Repository';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcategorie.repository';

@Module({
  controllers:[BrandController],
  imports:[brandModel,catgoryModel,subCatgoryModel],
  providers: [BrandService,brandRepositoryService,BrandService,catgoryRepositoryService,subcatgoryRepositoryService]
})
export class BrandModule {}
