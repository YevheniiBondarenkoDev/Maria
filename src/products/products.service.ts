import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DocumentDefinition,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  findOne(
    filter: FilterQuery<Product>,
    projection?: ProjectionType<Product>,
    options?: QueryOptions<Product>,
  ) {
    return this.productModel.findOne(filter, projection, options);
  }
  async addProduct(data: DocumentDefinition<Product>) {
    const isDuplicate = await this.findOne({ name: data.name });
    if (isDuplicate) {
      throw new BadRequestException(`Product \"${data.name}\" already exists`);
    }
    return await this.productModel.create(data);
  }
  findMany(
    filter: FilterQuery<Product>,
    projection?: ProjectionType<Product>,
    options?: QueryOptions<Product>,
  ) {
    return this.productModel.find(filter, projection, options);
  }
  updateById(
    productId: string | Types.ObjectId,
    updateQuery: UpdateQuery<Product>,
    options?: QueryOptions<Product>,
  ) {
    return this.productModel.findByIdAndUpdate(productId, updateQuery, options);
  }
  deleteById(productId: string | Types.ObjectId) {
    return this.productModel.findByIdAndDelete(productId);
  }
  getExistTypes() {
    return this.productModel.distinct<string>('type').exec();
  }
}
