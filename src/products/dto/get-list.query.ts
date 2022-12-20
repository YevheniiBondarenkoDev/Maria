import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SortProductFieldsEnum } from '../helpers/constants';
import { SortProductFields } from '../helpers/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetListQuery {
  @IsInt()
  @IsPositive()
  @IsOptional()
  page = 1;
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantityPerPage = 10;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];
  @ApiPropertyOptional({ enum: SortProductFieldsEnum })
  @IsOptional()
  @IsIn(SortProductFieldsEnum)
  sortBy?: SortProductFields;
  @IsOptional()
  @IsBoolean()
  isOnlyAvailable?: boolean;
  @IsPositive()
  @IsOptional()
  minPrice?: number;
  @IsPositive()
  @IsOptional()
  maxPrice?: number;
  @IsString()
  @IsOptional()
  search: string;
}
