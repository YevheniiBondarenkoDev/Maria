import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductsMeasurementUnits } from './helpers/types';
import { ProductsMeasurementUnitsEnum } from './helpers/constants';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true, enum: ProductsMeasurementUnitsEnum })
  measurement: ProductsMeasurementUnits;
  @Prop({ required: true, default: 0 })
  stockAmount: number;
  @Prop()
  productBigImage?: string;
  @Prop()
  description?: string;
  @Prop()
  type: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
