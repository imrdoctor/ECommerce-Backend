import { Module } from '@nestjs/common';
import { catgoryModel, subCatgoryModel, UserModel } from 'src/DB/model';
import { catgoryRepositoryService } from 'src/DB/Repository';
import { CloudinaryServece } from 'src/common/cloudinary/cloudinary.servece';
import { subcatgoryRepositoryService } from 'src/DB/Repository/subcategorie.repository';
import { SubcategorieController } from './subcategory.controller';
import { SubcategorieService } from './subcategory.service';

@Module({
  imports: [subCatgoryModel,catgoryModel], 
  controllers: [SubcategorieController],
  providers: [SubcategorieService,CloudinaryServece,subcatgoryRepositoryService,catgoryRepositoryService]
})
export class SubcategorieModule {}
