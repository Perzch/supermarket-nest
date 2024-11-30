import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, FindManyOptions, FindOperator, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto';

/**
 * 产品服务类，提供对产品的增删改查操作。
 */
@Injectable()
export class ProductsService {
  /**
   * 构造函数，注入产品仓库。
   * @param productRepository 产品仓库实例
   */
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  /**
   * 创建新产品。
   * @param createProductDto 创建产品的数据传输对象
   * @returns 创建的产品
   */
  async create(createProductDto: CreateProductDto) {
    const createdProduct = this.productRepository.create(createProductDto)
    return await this.productRepository.save(createdProduct);
  }

  /**
   * 查找所有产品，支持分页和查询条件。
   * @param query 查询条件的数据传输对象
   * @param page 页码
   * @param limit 每页数量
   * @returns 包含产品数据和总数的对象
   */
  async findAll(query:QueryProductDto,page:number,limit:number) {
    let yieldDate: FindOperator<Date>;
    if(query.startYieldDate && query.endYieldDate) {
      yieldDate = Between(new Date(query.startYieldDate), new Date(query.endYieldDate))
    } else if(query.startYieldDate) {
      yieldDate = MoreThanOrEqual(new Date(query.startYieldDate))
    } else if(query.endYieldDate) {
      yieldDate = LessThanOrEqual(new Date(query.endYieldDate))
    }
    const where = {
      name: Like(`%${query.name || ''}%`),
      yieldDate,
      category: query.category
    }
    const searchOptions:FindManyOptions<Product> = {
      where,
      relations: ['category'],
      skip: page * limit,
      take: limit,
      order: {
        [query.sortColumn || 'id']: query.sort || 'ASC'
      }
    }
    
    const data = await this.productRepository.find(searchOptions)
    const total = await this.productRepository.count({ where })
    return {data,total};
  }

  /**
   * 查找所有产品的指定列。
   * @param column 产品的列名
   * @returns 指定列的值数组
   */
  async findAllColumn(column:keyof Product) {
    const result = await this.productRepository.find({
      where: {
        stock: MoreThan(0)
      },
      select: [column]
    })
    return result.map(item => item[column])
  }

  /**
   * 根据产品名称查找产品。
   * @param name 产品名称
   * @returns 查找到的产品数组
   */
  async findByName(name: string) {
    return await this.productRepository.find({
      where: {
        name
      }
    })
  }

  /**
   * 根据产品ID查找产品。
   * @param id 产品ID
   * @returns 查找到的产品
   */
  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: {
        id
      }
    });
  }

  /**
   * 更新产品信息。
   * @param updateProductDto 更新产品的数据传输对象
   * @returns 更新后的产品
   */
  async update(updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      ...updateProductDto
    })
    return await this.productRepository.save(product);
  }

  /**
   * 根据产品ID删除产品。
   * @param id 产品ID
   * @returns 删除结果
   */
  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
