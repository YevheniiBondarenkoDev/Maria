import { IsInt, IsMongoId, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsMongoId()
  _id: string;
  @IsInt()
  @IsPositive()
  quantity: number;
}
