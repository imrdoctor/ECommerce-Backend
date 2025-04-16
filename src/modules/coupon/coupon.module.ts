import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { couponModel } from 'src/DB/model';
import { couponRepositoryService } from 'src/DB/Repository/coupon.repository';

@Module({
  imports: [couponModel],
  controllers: [CouponController],
  providers: [CouponService,couponRepositoryService],
})
export class CouponModule {}
