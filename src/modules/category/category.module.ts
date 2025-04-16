import { Module } from "@nestjs/common";
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { catgoryRepositoryService } from "src/DB/Repository";
import { catgoryModel, UserModel } from "src/DB/model";
import { CloudinaryServece } from "src/common/cloudinary/cloudinary.servece";
@Module({
  imports: [UserModel,catgoryModel],
  controllers: [CategoryController],
  providers: [CategoryService,catgoryRepositoryService , CategoryModule, CloudinaryServece]
})
export class CategoryModule {}