import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { ProductModule } from './modules/product/product.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { GlobalModule } from './global.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'config/.env'
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    GlobalModule,
    UserModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    CouponModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
