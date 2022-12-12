import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OrderItem, OrderItemSchema } from './item.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: [OrderItemSchema] })
  items: OrderItem[];
  @Prop()
  userId: Types.ObjectId;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
