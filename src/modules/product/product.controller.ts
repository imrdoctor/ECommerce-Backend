import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto, UpdateProductSubImgs, updateProductInfo, QueryDto } from './dto/product.dto';
import { Request, Response } from 'express';
import { Auth } from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerCloudConfig } from 'src/common/multer/multerCloud';
import { ImageAllowedExtensions } from 'src/common/constants/constants';
import { UserDecorator } from 'src/common/decorator/user';
import { UserDocument } from 'src/DB/model';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { CustomQuery } from 'src/common/decorator/Query.Decorator';

@Controller('/api/v1/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    @Post("/create")
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true , transform: true, transformOptions: { enableImplicitConversion: true } }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'img', maxCount: 1 },
        { name: 'SubImgs', maxCount: 5 },
    ], multerCloudConfig({
        allowedExtension: ImageAllowedExtensions
    })))
    createProduct(
        @UploadedFiles() imgs: {img?:Express.Multer.File,SubImgs?:Express.Multer.File[]},
        @Body() body: createProductDto,
        @Res() res: Response,
        @Req() req : Request,
        @UserDecorator() user: UserDocument,
    ) {
        return this.productService.createProduct(body,res,req,user,imgs);
    }
    @Patch('update/info/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true , transform: true }))
    @UseInterceptors(FileInterceptor('img', multerCloudConfig({
        allowedExtension: ImageAllowedExtensions
    })))
    updateProductInfo(
        @UploadedFile() img: Express.Multer.File,
        @Body() body: updateProductInfo,
        @Res() res: Response,
        @Req() req : Request,
        @Param() params: MongoIdDto, 
        @UserDecorator() user: UserDocument,
    ){
        return this.productService.updateProductInfo(img,body,res,req,params,user);
    }
    @Delete('delete/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    deleteProduct(
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto, 
    ){
        return this.productService.deleteProduct(params,res,req,user);
    }
    @Patch('update/subimgs/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'SubImgs', maxCount: 5 },
    ], multerCloudConfig({
        allowedExtension: ImageAllowedExtensions
    })))
    updateSubImgs(
        @UploadedFiles() imgs: {SubImgs?:Express.Multer.File[]} = {SubImgs: []},
        @Req() req: Request,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto,
        @Body() body : UpdateProductSubImgs
    ){
        return this.productService.updateSubImgs(imgs.SubImgs || [], res, req, user, params ,body);
    }
    @Get('get/all')
    getAllProducts(
        @Req() req: Request,
        @Res() res: Response,
        @CustomQuery() query: QueryDto
    ){
        return this.productService.getAllProducts(req,res,query);
    }
}