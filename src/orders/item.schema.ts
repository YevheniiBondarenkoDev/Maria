import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductsMeasurementUnitsEnum } from '../products/helpers/constants';
import { ProductsMeasurementUnits } from '../products/helpers/types';
import { Types, SchemaTypes } from 'mongoose';
import { Product } from '../products/product.schema';

@Schema()
export class OrderItem {
  @Prop({ ref: Product.name, type: SchemaTypes.ObjectId })
  productId: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true, enum: ProductsMeasurementUnitsEnum })
  measurement: ProductsMeasurementUnits;
  @Prop()
  productBigImage?: string;
  @Prop()
  description?: string;
  @Prop()
  type?: string;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
