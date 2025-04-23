import { Module } from '@nestjs/common';
import { CartModel, productModel } from 'src/DB/model';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { cartRepositoryService } from 'src/DB/Repository/cart.repository';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';

@Module({
    imports: [CartModel,productModel],
    controllers: [CartController],
    providers: [CartService,cartRepositoryService,ProductRepositoryService],
})
export class CartModule {}
