import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(
    @Query('sort') sort: 'asc' | 'desc',
    @Query('sortColumn') sortColumn: string
  ) {
    return await this.categoriesService.findAll(sort,sortColumn);
  }

  @Get('names')
  async findAllName() {
    const categories = await this.categoriesService.findAll()
    return categories;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(+id);
  }

  @Put()
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
