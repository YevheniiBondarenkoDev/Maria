import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from '../auth/guards/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { User as ExtractUser } from '../auth/extract-user-req';
import { VerifiedToken } from '../auth/helpers/types';
import { User } from '../users/user.schema';
import { LeanDocument } from 'mongoose';
import { IdParam } from '../dto/id.param';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Auth()
  @Post()
  async createOrder(
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
    const order = await this.ordersService.createOrder(items, userId);
    return this.ordersService.mapOrder(order.toJSON());
  }
  @Auth('admin')
  @Get()
  async getAll() {
    const orders = await this.ordersService
      .findMany()
      .populate<{ userId: LeanDocument<User> }>({
        path: 'userId',
        model: 'User',
        select: { email: true },
      })
      .lean();
    return orders.map(this.ordersService.mapOrder);
  }
  @Auth('admin')
  @Get(':id')
  async getOrderInfo(@Param() { id }: IdParam) {
    const order = await this.ordersService
      .getById(id)
      .populate<{ userId: LeanDocument<User> }>({
        path: 'userId',
        model: 'User',
        select: { email: true },
      })
      .lean();
    return this.ordersService.mapOrder(order);
  }
}
