import { Body, Controller, Delete, Param, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { addToCartDto } from './dto/cart.dto';
import { Response } from 'express';
import { UserDocument } from 'src/DB/model';
import { UserDecorator } from 'src/common/decorator/user';
import { Auth, CartAuth} from 'src/common/decorator/auth';
import { UserRoles } from 'src/common/types/types';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Controller('api/v1/cart')
export class CartController {
    constructor(private readonly _cartService: CartService){
    }
    @Post('add')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @CartAuth()
    @Auth(...Object.values(UserRoles))
    async addToCart(
        @Body() body: addToCartDto,
        @Res() res: Response,
        @UserDecorator() user: UserDocument,
    ){
        return this._cartService.addToCart(body,res,user,);
    }
    @Delete('remove/:id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @CartAuth()
    @Auth(...Object.values(UserRoles))
    async removeFromCart(
        @Param() params: MongoIdDto,
        @Res() res: Response,
        @UserDecorator() user: UserDocument, 
    ){
        return this._cartService.removeFromCart(params,res,user,);
    }
    @Patch('update')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @CartAuth()
    @Auth(...Object.values(UserRoles))
    async updateProductInCart(
       @Body() body: addToCartDto,
       @Res() res: Response,
       @UserDecorator() user: UserDocument,
    ){
        return this._cartService.updateProductCart(body,res,user);
    }
}