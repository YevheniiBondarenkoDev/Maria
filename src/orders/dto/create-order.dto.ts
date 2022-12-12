import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  @ValidateNested({ each: true })
  items: OrderItemDto[];
}
