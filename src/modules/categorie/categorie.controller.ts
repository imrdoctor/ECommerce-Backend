import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAllowedExtensions } from 'src/common/constants/constants';
import { Request, Response } from 'express';
import { multerCloudConfig } from 'src/common/multer/multerCloud';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { crateCatgoryDto, updateCatgoryImgDto, updateCatgoryNameDto } from './dto/customCategory.dto';
import { categorieService } from './categorie.service';
@Controller('api/v1/categorie')
export class categorieController {
  constructor(private readonly _categorieService: categorieService) {}
  @Post('create')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('img',multerCloudConfig({
    allowedExtension: ImageAllowedExtensions
  }),
    ),
  )
  // @UseInterceptors(
  //     FileFieldsInterceptor([
  //         {name: 'img',maxCount: 1,},
  //     ] , multerConfig({
  //       uploadPath: 'categorie',
  //       allowedExtension: ImageAllowedExtensions
  //     }))
  //   )
  // ////////////////// Create categorie ////////////////////
  crateCategorie(
    @UploadedFile() img: Express.Multer.File,
    @Req() req : Request,
    @Res() res: Response,
    @Body() body: crateCatgoryDto,
    @UserDecorator()
    user: UserDocument,
  ) {
    return this._categorieService.createcategorie(req,res,body,user,img);
  }
  // ////////////////// Update Create categorie Img ////////////////////
  @Patch('update/img/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('img',multerCloudConfig({
    allowedExtension: ImageAllowedExtensions
  }),
    ),
  )
  updateCategorieImg(
    @UploadedFile() img: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto,  // Changed from id:Types.ObjectId to params: MongoIdDto
    @Body() body: updateCatgoryImgDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this._categorieService.updatecategorieImg(req, res, body, user, img, params);
  }
  // Also update other methods similarly
  @Patch('update/name/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateCategorieName(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto,  
    @Body() body: updateCatgoryNameDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this._categorieService.updatecategorieName(req, res, body, user, params);
  }

  @Delete('delete/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  deleteCategorie(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto, 
    @UserDecorator() user: UserDocument,
  ) {
    return this._categorieService.deletecategorie(req, res, user, params); 
  }
  @Get('get/all')
  @Auth(...Object.values(UserRoles))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getAllCategorie(
    @Res() res: Response,
  ) {
    return this._categorieService.getAllCategories( res); 
  }
}
