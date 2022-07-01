import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepo.find();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepo.findOne({
      where: { id },
    });
  }

  async create(product: ProductDto): Promise<Product[]> {
    const newProduct = this.productRepo.create(product as any);

    return await this.productRepo.save(newProduct);
  }

  async update(id: string, product: Product): Promise<Product> {
    const updatedProduct = await this.productRepo.findOne({
      where: { id },
    });

    if (!updatedProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(updatedProduct, product);

    return await this.productRepo.save(updatedProduct);
  }

  async delete(id: string): Promise<Product> {
    const deletedProduct = await this.productRepo.findOne({
      where: { id },
    });

    if (!deletedProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return await this.productRepo.remove(deletedProduct);
  }
}
