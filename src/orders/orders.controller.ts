import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from '../auth/guards/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { User as ExtractUser } from '../auth/extract-user-req';
import { VerifiedToken } from '../auth/helpers/types';
import { User } from '../users/user.schema';
import { LeanDocument } from 'mongoose';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Auth('user')
  @Post()
  createOrder(
    @Body() { items }: CreateOrderDto,
    @ExtractUser() { userId }: VerifiedToken,
  ) {
    items.reduce((acc, { _id }) => {
      if (acc[_id]) {
        throw new BadRequestException(`Duplicate items ${_id}`);
      }
      acc[_id] = true;
      return acc;
    }, {});
    return this.ordersService.createOrder(items, userId);
  }
  @Auth('admin')
  @Get()
  async getAll() {
    const orders = await this.ordersService
      .findMany()
      .populate<{ userId: LeanDocument<User> }>({
        path: 'userId',
        model: 'User',
      });
    return orders.map(this.ordersService.mapOrder);
  }
  @Auth('user')
  @Get()
  async getMyOrders(@ExtractUser() { userId }: VerifiedToken) {
    const orders = await this.ordersService.findMany({ userId });
    return orders.map(this.ordersService.mapOrder);
  }
}
