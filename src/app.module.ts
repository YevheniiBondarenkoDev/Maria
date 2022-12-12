import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoModule } from './crypto/crypto.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

/** Importing configs */
import appConfig from './configs/app.config';
import mongodbConfig from './configs/mongodb.config';
import jwtConfig from './configs/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('mongodb'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CryptoModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
