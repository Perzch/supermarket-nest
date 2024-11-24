import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Put } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body('ids') createSaleDtos: CreateSaleDto[]) {
    return this.salesService.create(createSaleDtos);
  }

  @Get()
  async findAll(
    @Query() query: QuerySaleDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit:number
  ) {
    return await this.salesService.findAll(query,page,limit);
  }

}
