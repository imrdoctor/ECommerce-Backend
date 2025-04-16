import { Body, Controller, Delete, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Auth } from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { createSubCatgoryDto } from './dto/subCategory.dto';
import { Request, Response } from 'express';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { multerCloudConfig } from 'src/common/multer/multerCloud';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAllowedExtensions } from 'src/common/constants/constants';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Controller('/api/v1/subcategory')
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}
    @Post('create/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(FileInterceptor('img', multerCloudConfig({
        allowedExtension: ImageAllowedExtensions
    })))
    crateSubCtgory(
        @UploadedFile() img: Express.Multer.File,
        @Body() body: createSubCatgoryDto,
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto,  
    ) {
        return this.subcategoryService.crateSubCategory(req, res, body, user, img , params);
    }
    @Patch('update/name/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    updateSubCategoryName(
        @Body() body: createSubCatgoryDto,
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto,  
    ){
        return this.subcategoryService.updateSubCategoryName(req, res, body, user, params);
    }
    @Patch('update/img/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    @UseInterceptors(FileInterceptor('img', multerCloudConfig({
        allowedExtension: ImageAllowedExtensions
    })))
    updateSubCategoryImg(
        @UploadedFile() img: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto, 
    ){
        return this.subcategoryService.updateSubCategoryImg(req, res, user, img, params);
    }
    @Delete('delete/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    deleteSubCategory(
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto, 
    ){
        return this.subcategoryService.deleteSubCategory(req, res, user, params);
    }
}

