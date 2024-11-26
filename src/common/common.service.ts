import { Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "src/sales/entities/sale.entity";
import { Repository } from "typeorm";
import { Row, Workbook } from 'exceljs'

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>
    ) {}

    async findAllSale() {
        const data = await this.saleRepository.find({
            relations: ['saleProducts', 'saleProducts.product', 'saleProducts.product.category'],
            order: {
                id: 'ASC'
            }
        })
        return data;
    }
}