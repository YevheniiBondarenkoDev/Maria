import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Auth } from '../auth/guards/auth.guard';
import { AddProductDto } from './dto/add-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { IdParam } from '../dto/id.param';
import { GetListQuery } from './dto/get-list.query';
import { FilterQuery } from 'mongoose';
import { Product } from './product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Auth('admin')
  @Post()
  addProduct(@Body() addProductDto: AddProductDto) {
    return this.productsService.addProduct(addProductDto);
  }
  @Auth('admin')
  @Patch(':id')
  async editProduct(
    @Param() { id }: IdParam,
    @Body() editProductDto: EditProductDto,
  ) {
    const product = await this.productsService.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Item not found');
    }
    if (editProductDto.name && product.name !== editProductDto.name) {
      const isDuplicate = await this.productsService.findOne({
        name: editProductDto.name,
      });
      if (isDuplicate) {
        throw new BadRequestException(
          `Product \"${editProductDto.name}\" already exists`,
        );
      }
    }
    return this.productsService.updateById(id, editProductDto, { new: true });
  }
  @Auth('admin')
  @Delete(':id')
  async deleteProduct(@Param() { id }: IdParam) {
    const product = await this.productsService.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Item not found');
    }
    return this.productsService.deleteById(id);
  }
  @Post('list')
  async getList(@Body() getListQuery: GetListQuery) {
    const {
      page,
      quantityPerPage,
      types,
      sortBy,
      isOnlyAvailable,
      maxPrice,
      minPrice,
      search,
    } = getListQuery;
    const filterQuery: FilterQuery<Product> = {
      $and: [
        {
          ...(types ? { type: { $in: types } } : null),
          ...(isOnlyAvailable ? { stockAmount: { $gt: 0 } } : null),
          ...(maxPrice || minPrice
            ? {
                price: {
                  ...(minPrice ? { $gte: minPrice } : null),
                  ...(maxPrice ? { $lte: maxPrice } : null),
                },
              }
            : null),
        },
      ],
    };
    if (search) {
      filterQuery.$and.push(
        ...search
          .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, (value) => `\\${value}`)
          .split(' ')
          .map((regex) => ({ name: { $regex: regex, $options: 'i' } })),
      );
    }
    const skip = (page - 1) * quantityPerPage;
    const findQuery = this.productsService
      .findMany(filterQuery)
      .skip(skip)
      .limit(quantityPerPage);
    if (sortBy) {
      findQuery.sort({ [sortBy]: 1 });
    }
    return findQuery.exec();
  }
  @Get('types')
  getExistTypes() {
    return this.productsService.getExistTypes();
  }
  @Get(':id')
  getById(@Param() { id }: IdParam) {
    return this.productsService.findOne({ _id: id });
  }
}
