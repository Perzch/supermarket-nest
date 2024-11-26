import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/sales/entities/sale.entity';
import { CommonService } from './common.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsService } from 'src/products/products.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale,Category,Product]),
    ],
    controllers: [
        CommonController
    ],
    providers: [
        CommonService,
        CategoriesService,
        ProductsService
    ]
})
export class CommonModule {}