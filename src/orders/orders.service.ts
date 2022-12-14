import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import {
  DocumentDefinition,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { ProductsService } from '../products/products.service';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderItem } from './item.schema';
import { Product } from '../products/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly productsService: ProductsService,
  ) {}
  async createOrder(items: OrderItemDto[], userId: string) {
    const updateProductQueries: [string, UpdateQuery<Product>][] = [];
    const productsList: DocumentDefinition<OrderItem>[] = await Promise.all(
      items.map(async ({ _id, quantity }) => {
        const product = await this.productsService.findOne({ _id });
        if (!product) {
          throw new BadRequestException(`Product: ${_id} not found`);
        }
        if (product.stockAmount < quantity) {
          new BadRequestException(
            `We have only ${product.stockAmount}, but you want ${quantity}`,
          );
        }
        updateProductQueries.push([
          _id,
          { $set: { stockAmount: product.stockAmount - quantity } },
        ]);
        return {
          name: product.name,
          price: product.price,
          measurement: product.measurement,
          productBigImage: product.measurement,
          description: product.description,
          type: product.type,
          quantity,
          productId: _id,
        };
      }),
    );
    await Promise.all(
      updateProductQueries.map(([productId, updateQueries]) =>
        this.productsService.updateById(productId, updateQueries),
      ),
    );
    return await this.orderModel.create({ items: productsList, userId });
  }
  findMany(
    filter?: FilterQuery<Order>,
    projection?: ProjectionType<Order>,
    options?: QueryOptions<Order>,
  ) {
    return this.orderModel.find(filter, projection, options);
  }
  mapOrder<T extends Pick<Order, 'items'>>(
    order: T,
  ): T & { totalPrice: number } {
    const totalPrice = order.items.reduce((sum, { price }) => {
      sum += price;
      return sum;
    }, 0);
    return { ...order, totalPrice };
  }
  getById(orderId) {
    return this.orderModel.findById(orderId);
  }
}
