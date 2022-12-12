import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProductsMeasurementUnits } from '../helpers/types';
import { ProductsMeasurementUnitsEnum } from '../helpers/constants';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsPositive()
  price: number;
  @ApiProperty({ enum: ProductsMeasurementUnitsEnum })
  @IsIn(ProductsMeasurementUnitsEnum)
  measurement: ProductsMeasurementUnits;
  @IsPositive()
  @IsInt()
  stockAmount: number;
  @IsUrl()
  @IsOptional()
  productBigImage?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  type: string;
}
