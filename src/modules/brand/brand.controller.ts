import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { UserRoles } from 'src/common/types/types';
import { Auth } from 'src/common/decorator/auth';
import { UserDecorator } from 'src/common/decorator/user';
import { UserDocument } from 'src/DB/model';
import { Response } from 'express';
import { createBrandDto, employeeDto, updateBrandDto } from './dto/brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudConfig } from 'src/common/multer/multerCloud';
import { ImageAllowedExtensions } from 'src/common/constants/constants';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AddemployeeBrandResponseDto, BrandDto, CrateBrandResponseBrandDto, DeletedBrandResponseDto, GetAllBrandsResponseDto, RemoveemployeeBrandResponseDto, UpdateBrandResponseDto } from './dto/swagger.response.dto';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { string } from 'zod';

@Controller('api/v1/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  ///////////////////////////////////////////////////// GET ALL BRANDS /////////////////////////////////////////////////////
  @Get('all')
  @ApiOperation({ summary: 'Get All Brands' })
  @ApiResponse({
    status: 201,
    description: 'Brands retrieved successfully',
    type: GetAllBrandsResponseDto,
  })
  async getAllBrands(@Res() res: Response) {
    return await this.brandService.getAllBrands(res);
  }
  ///////////////////////////////////////////////////// CREATE BRAND /////////////////////////////////////////////////////
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create New Brand' })
  @ApiBody({ type: createBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: CrateBrandResponseBrandDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Auth(...Object.values(UserRoles))
  @UseInterceptors(FileInterceptor('img',multerCloudConfig({allowedExtension: ImageAllowedExtensions,}),),)
  async createBrand(
    @UploadedFile() img: Express.Multer.File,
    @Body() body: createBrandDto,
    @Res() res: Response,
    @UserDecorator() user: UserDocument,
  ) {
    return await this.brandService.createBrand(body, res, user , img);
  }
  ///////////////////////////////////////////////////// UPDATE BRAND /////////////////////////////////////////////////////
  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update Brand' })
  @ApiBody({ type: updateBrandDto })
  @ApiParam({name: 'id',description: 'The ID of the brand to be updated',type: String})
  @ApiResponse({status: 200,description: 'Brand updated successfully',type: UpdateBrandResponseDto})
  @Auth(...Object.values(UserRoles))
  @UseInterceptors(FileInterceptor('img',multerCloudConfig({allowedExtension: ImageAllowedExtensions,}),),)
  async updateBrand(
    @UploadedFile() img: Express.Multer.File,
    @Body() body: updateBrandDto,
    @Res() res: Response,
    @Param() params: MongoIdDto, 
    @UserDecorator() user: UserDocument, 
  ){
    return await this.brandService.updateBrand(body, res, user, img,params);
  }
  ///////////////////////////////////////////////////// ADD Employee /////////////////////////////////////////////////////
  @Post('/:id/employee/add')
  @ApiOperation({ summary: 'Add Employee' })
  @ApiParam({name: 'id',description: 'The ID of the brand to be add employee',type: String})
  @ApiResponse({status: 200,description: 'Employee added successfully',type:AddemployeeBrandResponseDto})
  @Auth(...Object.values(UserRoles))
  async addEmployee(
    @Res() res: Response,
    @UserDecorator() user: UserDocument,
    @Body() body: employeeDto,
    @Param() params: MongoIdDto,
  ){
    return await this.brandService.addEmployee(res, user, body,params);
  }
  ///////////////////////////////////////////////////// Remove Employee /////////////////////////////////////////////////////
  @Delete('/:id/employee/remove')
  @ApiOperation({ summary: 'Remove Employee' })
  @ApiParam({name: 'id',description: 'The ID of the brand to be remove employee',type: String})
  @ApiResponse({status: 200,description: 'Employee Removed successfully',type: RemoveemployeeBrandResponseDto})
  @Auth(...Object.values(UserRoles))
  async removeEmployee(
    @Res() res: Response,
    @UserDecorator() user: UserDocument,
    @Body() body: employeeDto,
    @Param() params: MongoIdDto,
  ){
    return await this.brandService.removeEmployee(res, user, body,params);
  }
  ///////////////////////////////////////////////////// DELETE BRAND /////////////////////////////////////////////////////
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Brand' })
  @ApiParam({name: 'id',description: 'The ID of the brand to be deleted',type: String})
  @ApiResponse({status: 200,description: 'Brand deleted successfully',type:DeletedBrandResponseDto})
  @Auth(...Object.values(UserRoles))
  async deleteBrand(
    @Res() res: Response,
    @Param() params: MongoIdDto,
    @UserDecorator() user: UserDocument, 
  ){
    return await this.brandService.deleteBrand(res, params, user);
  }
}
