import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, DefaultValuePipe, ParseIntPipe, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createProductDto: Product) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryProductDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productsService.findAll(query,page,limit);
  }

  @Get('ids')
  async findAllIds() {
    return await this.productsService.findAllColumn('id')
  }

  @Get('names')
  async findAllNames() {
    return await this.productsService.findAllColumn('name')
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return await this.productsService.findByName(name)
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Put()
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }
 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
