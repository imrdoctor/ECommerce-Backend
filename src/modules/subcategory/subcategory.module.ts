import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { catgoryModel, subCatgoryModel, UserModel } from 'src/DB/model';
import { catgoryRepositoryService } from 'src/DB/Repository';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcatgory.repository';

@Module({
  imports: [subCatgoryModel,catgoryModel], 
  controllers: [SubcategoryController],
  providers: [SubcategoryService,CloudinaryServece,subcatgoryRepositoryService,catgoryRepositoryService]
})
export class SubcategoryModule {}
