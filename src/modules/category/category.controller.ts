import {
  Body,
  Controller,
  Delete,
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
import { CategoryService } from './category.service';
import { Auth } from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { crateCatgoryDto, updateCatgoryImgDto, updateCatgoryNameDto } from './dto/customCategory.dto';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAllowedExtensions } from 'src/common/constants/constants';
import { Request, Response } from 'express';
import { multerCloudConfig } from 'src/common/multer/multerCloud';
import { Types } from 'mongoose';
import { MongoIdDto } from '../GlobalDto/global.dto';
@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly _CategoryService: CategoryService) {}
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
  //       uploadPath: 'category',
  //       allowedExtension: ImageAllowedExtensions
  //     }))
  //   )
  // ////////////////// Create Category ////////////////////
  crateCtgory(
    @UploadedFile() img: Express.Multer.File,
    @Req() req : Request,
    @Res() res: Response,
    @Body() body: crateCatgoryDto,
    @UserDecorator()
    user: UserDocument,
  ) {
    return this._CategoryService.createCategory(req,res,body,user,img);
  }
  // ////////////////// Update Create Category Img ////////////////////
  @Patch('update/img/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('img',multerCloudConfig({
    allowedExtension: ImageAllowedExtensions
  }),
    ),
  )
  updateCtgoryImg(
    @UploadedFile() img: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto,  // Changed from id:Types.ObjectId to params: MongoIdDto
    @Body() body: updateCatgoryImgDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this._CategoryService.updateCategoryImg(req, res, body, user, img, params);
  }
  // Also update other methods similarly
  @Patch('update/name/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateCtgoryName(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto,  
    @Body() body: updateCatgoryNameDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this._CategoryService.updateCategoryName(req, res, body, user, params);
  }

  @Delete('delete/:id')
  @Auth(UserRoles.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  deleteCtgory(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: MongoIdDto, 
    @UserDecorator() user: UserDocument,
  ) {
    return this._CategoryService.deleteCategory(req, res, user, params); 
  }
}
