import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { GlobalModule } from './global.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { CoreModule } from './Core/core.module';
import { GraphQlConfigModule } from './graphQl/graphql.config';
import { categorieModule } from './modules/categorie/categorie.module';
import { SubcategorieModule } from './modules/subcategorie/subcategory.module';
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
    categorieModule,
    SubcategorieModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
