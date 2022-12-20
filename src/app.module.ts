import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'shop-test',
      autoIndex: true,
    }),
    UsersModule,
    AuthModule,
    CryptoModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
