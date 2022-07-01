import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  sellingPrice: number;
}
