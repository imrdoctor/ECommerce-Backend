import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from 'src/DB/model';
import { cartRepositoryService } from 'src/DB/Repository/cart.repository';
import { addToCartDto } from './dto/cart.dto';
import { ProductRepositoryService } from 'src/DB/Repository/product.repository';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Injectable()
export class CartService {
    constructor(
        private readonly _cartRepositoryService: cartRepositoryService,
        private readonly _ProductRepositoryService: ProductRepositoryService,
    ){}
    // Add to cart
    async addToCart(body: addToCartDto, res: Response, user: UserDocument) {
        const { productId, quantity } = body;
        const product = await this._ProductRepositoryService.findById(productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        let cart = await this._cartRepositoryService.findOne({ User: user._id });
        if (!cart) {
            cart = await this._cartRepositoryService.create({
                User: user._id,
                Products: [{
                    productId: product._id,
                    quantity: quantity,
                    finalPrice: product.SubPrice * quantity,
                }]
            });
            return res.status(201).json({
                message: 'Product added to cart successfully',
                cart
            });}
        let productExist = cart.Products.find((p) => p.productId.toString() === productId.toString());
        if (productExist) {
            productExist.quantity += quantity;
            productExist.finalPrice = product.SubPrice * productExist.quantity;
            await cart.save();
            return res.status(201).json({
                message: 'Product quantity increased in cart',
                cart
            });
        }
        cart.Products.push({
            productId: product._id,
            quantity: quantity,
            finalPrice: product.SubPrice * quantity,
        });
        await cart.save();
        return res.status(201).json({
            message: 'Product added to cart successfully',
            cart
        });
    }
    
    async removeFromCart(params: MongoIdDto, res: Response, user: UserDocument) {
        const cart = await this._cartRepositoryService.findOne({ User: user._id ,"Products.productId":params.id});
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        const productIndex = cart.Products.findIndex((p) => p.productId.toString() === params.id.toString());
        if (productIndex === -1) {
            throw new NotFoundException('Product not found in cart');
        }
        cart.Products.splice(productIndex, 1);
        await cart.save();
        return res.status(200).json({
            message: 'Product removed from cart successfully',
            cart
        });
    }
    

    async updateProductCart(body: addToCartDto, res: Response, user: UserDocument) {
        const { productId, quantity } = body;
        const cart = await this._cartRepositoryService.findOne({ User: user._id });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        const product = cart.Products.find((p) => p.productId.toString() === productId.toString());
        if (!product) {
            throw new NotFoundException('Product not found in cart');
        }
        if (quantity <= 0) {
            cart.Products = cart.Products.filter((p) => p.productId.toString() !== productId.toString());
        } else {
            const prod = await this._ProductRepositoryService.findById(productId);
            if (!prod) {
                throw new NotFoundException('Product not found');
            }
            product.quantity = quantity;
            product.finalPrice = prod.SubPrice * quantity;
        }
        await cart.save();
        return res.status(200).json({
            message: 'Product quantity updated in cart',
            cart
        });
    }
}
