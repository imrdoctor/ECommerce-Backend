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
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { CoreModule } from './Core/core.module';
import { GraphQlConfigModule } from './graphQl/graphql.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'config/.env'
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    GraphQlConfigModule,
    CoreModule,
    GlobalModule,
    UserModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
