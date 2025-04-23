import { Body, Controller, Get, Param, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserRoles } from 'src/common/types/types';
import { Auth } from 'src/common/decorator/auth';
import { createorderDto } from './dto/order.dto';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { Response } from 'express';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Controller('api/v1/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @Post('create')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Auth(...Object.values(UserRoles))
    async createOrder(
        @Body() body: createorderDto ,     
        @Res() res: Response,
        @UserDecorator() user: UserDocument, ) {
        return this.orderService.createOrder(body,user,res)
    };
    @Get('get/all')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Auth(...Object.values(UserRoles))
    async getAllOrders(
        @Res() res: Response,
        @UserDecorator() user: UserDocument, ) {
        return this.orderService.getAllUserOrders(user,res)
    };
    @Post("webhook")
    async webhook(@Body() body: any,){
        return this.orderService.webhookService(body)
    }
    @Post('cancel/:id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Auth(...Object.values(UserRoles))
    async refundOrder(@Param() params : MongoIdDto , @Res() res: Response, @UserDecorator() user: UserDocument ){
        return this.orderService.cancelOrder(params,res,user)
    }
    @Post('payment/cancel')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Auth(...Object.values(UserRoles))
    async paymentCancel(
        @Res() res: Response, @UserDecorator() user: UserDocument 
    ){
        return this.orderService.paymentCancel(res,user)
    }
}
