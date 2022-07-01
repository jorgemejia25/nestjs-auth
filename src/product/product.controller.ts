import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import { ProductDto } from './dtos/product.dto';
import { ProductService } from './product.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product')
@UseGuards(JwtGuard, RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.productService.findAll();
  }

  @Get('/:id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('/')
  create(@Body() product: ProductDto) {
    return this.productService.create(product);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() product: any) {
    return this.productService.update(id, product);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
