import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Between, FindManyOptions, FindOperator, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/saleProduct.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>
  ) {}
  async create(createSaleDtos: CreateSaleDto[]) {
    const sale = new Sale()
    sale.createDate = new Date()
    sale.saleProducts = []
    for await (const item of createSaleDtos) {
      const saleProduct = new SaleProduct()
      saleProduct.product = await this.productRepository.findOneBy({id: item.id})
      saleProduct.saleCount = item.count
      sale.saleProducts.push(saleProduct)
    }
    const result = await this.saleRepository.save(sale)
    return result;
  }

  async findAll(query: QuerySaleDto, page: number, limit: number) {
    let createDate: FindOperator<Date>;
    if(query.startCreateDate && query.endCreateDate) {
      createDate = Between(new Date(query.startCreateDate), new Date(query.endCreateDate))
    } else if(query.startCreateDate) {
      createDate = MoreThanOrEqual(new Date(query.startCreateDate))
    } else if(query.endCreateDate) {
      createDate = LessThanOrEqual(new Date(query.endCreateDate))
    }
    const where = {
      createDate,
      saleProducts: {
        product: {
          category: query.category
        }
      }
    }
    const searchOptions:FindManyOptions<Sale> = {
        skip: page * limit,
        take: limit,
        order: {
          [query.sortColumn as string || 'id']: query.sort
        },
        relations: ['saleProducts', 'saleProducts.product','saleProducts.product.category'],
        where
    }
    const data = await this.saleRepository.find(searchOptions)
    const total = await this.saleRepository.count({ where })
    return { data,total }
  }
}
