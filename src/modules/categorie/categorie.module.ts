import { Module } from "@nestjs/common";
import { categorieController } from './categorie.controller';
import { catgoryRepositoryService } from "src/DB/Repository";
import { catgoryModel } from "src/DB/model";
import { CloudinaryServece } from "src/common/cloudinary/cloudinary.servece";
import { categorieService } from "./categorie.service";
@Module({
  imports: [catgoryModel],
  controllers: [categorieController],
  providers: [categorieService,catgoryRepositoryService , categorieModule, CloudinaryServece]
})
export class categorieModule {}