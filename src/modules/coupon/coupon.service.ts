import { ConflictException, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/DB/model';
import { couponRepositoryService } from 'src/DB/Repository/coupon.repository';
import { CrateCouponDto } from './dto/coupon.dto';
import { Response } from 'express';
import { MongoIdDto } from '../GlobalDto/global.dto';

@Injectable()
export class CouponService {
    constructor(
        private readonly _couponRepositoryService: couponRepositoryService
    ) {}
    async createCoupon( body: CrateCouponDto,res: Response,user: UserDocument) {
        const  {Code,Amount,FromDate,ToDate} = body
        const couponExist = await this._couponRepositoryService.findOne({Code})        
        if(couponExist) throw new ConflictException('Coupon Code Already Exist')
        const coupon = await this._couponRepositoryService.createCoupon({Code,Amount,FromDate,ToDate,CreatedBy:user._id}) 
        return res.status(201).json({
            message:'coupon created successfully',
            coupon 
        })
    }   
    async deleteCoupon(res : Response, user : UserDocument,params : MongoIdDto){
        const coupon = await this._couponRepositoryService.findById(params.id)        
        if(!coupon) throw new ConflictException('Coupon Not Found')
        if(coupon.CreatedBy.toString() !== user._id.toString()) throw new ConflictException('You Are Not Allowed To Delete This Coupon')
        await this._couponRepositoryService.findByIdAndDelete(params.id)
        return res.status(200).json({
            message:'coupon deleted successfully',
        })
    }
    async updateCoupon(res: Response,user: UserDocument,params: MongoIdDto , body){
        const coupon = await this._couponRepositoryService.findById(params.id)
        if(!coupon) throw new ConflictException('Coupon Not Found')
        const couponNewCodeExsist = await this._couponRepositoryService.findOne({Code:body.Code})
    if(coupon.Code !== body.Code && couponNewCodeExsist) throw new ConflictException('Coupon Code Already Exist')
        if(coupon.CreatedBy.toString()!== user._id.toString()) throw new ConflictException('You Are Not Allowed To Update This Coupon')        
        const updatedCoupon = await this._couponRepositoryService.findByIdAndUpdate(params.id,body)
        return res.status(200).json({
            message:'coupon updated successfully',
            updatedCoupon
        })
    }
}
