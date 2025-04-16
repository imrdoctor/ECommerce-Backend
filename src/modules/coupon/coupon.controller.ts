import { Body, Controller, Delete, Param, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CrateCouponDto, updateCouponDto } from './dto/coupon.dto';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { Auth } from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { MongoIdDto } from '../GlobalDto/global.dto';
import { Response } from 'express';

@Controller('api/v1/coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}
    @Post('/create')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createCoupon(
        @Body() body: CrateCouponDto,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,

    ) {
        return this.couponService.createCoupon(body,res,user);
    }
    @Patch('/update/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async updateCoupon(
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto,
        @Body() body: updateCouponDto
    ) {
        return this.couponService.updateCoupon(res,user,params,body);
    }
    @Delete('/delete/:id')
    @Auth(UserRoles.ADMIN)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async deleteCoupon(
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
        @Param() params: MongoIdDto,
    ) {
        return this.couponService.deleteCoupon(res,user,params);
    }
}
