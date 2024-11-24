import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from 'src/products/entities/product.entity';
import { SaleProduct } from './entities/saleProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale,Product,SaleProduct])
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
