import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "./common.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Workbook } from "exceljs";
import { Product } from "src/products/entities/product.entity";
import { CategoriesService } from "src/categories/categories.service";
import { ProductsService } from "src/products/products.service";

@Controller()
export class CommonController {
    constructor(
        private readonly commonService:CommonService,
        private readonly categoriesService:CategoriesService,
        private readonly productsService:ProductsService
    ) {}
    @Get('sales/print')
    async printSale(@Res() res) {
        const data = await this.commonService.findAllSale()
        const workbook = new Workbook()
        const worksheet = workbook.addWorksheet('销售记录')
        // 冻结第一行
        worksheet.views = [
            { state: 'frozen', ySplit: 1 }
        ]
        // 设置列头
        worksheet.columns = [
            { header: '销售单号', key: 'id', width: 9 },
            { header: '销售日期', key: 'createDate', width: 11 },
            { header: '商品名称', key: 'name', width: 19 },
            { header: '商品分类', key: 'category', width: 19 },
            { header: '商品进价', key: 'price', width: 9 },
            { header: '商品售价', key: 'nowPrice', width: 9 },
            { header: '商品销量', key: 'count', width: 9 },
            { header: '净利润', key: 'total', width: 10 }
        ]
        let beforeAddRowCount = 2
        data.forEach((item, index) => {
            worksheet.addRows(item.saleProducts.map(s => ({
                id: item.id,
                createDate: item.createDate,
                name: s.product.name,
                category: s.product.category.name,
                price: s.product.price,
                nowPrice: s.product.nowPrice,
                count: s.saleCount,
                total: s.saleCount * (s.product.nowPrice - s.product.price)
            })))
            if (beforeAddRowCount > worksheet.rowCount) {
                return
            }
            worksheet.mergeCells(`A${beforeAddRowCount}:A${worksheet.rowCount}`)
            worksheet.mergeCells(`B${beforeAddRowCount}:B${worksheet.rowCount}`)
            beforeAddRowCount = worksheet.rowCount + 1
        })
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition','attachment; filename=sale.xlsx')
        res.send(await workbook.xlsx.writeBuffer())
    }
    @Get('products/download/template')
    async downloadProductTemplate(@Res() res) {
        return await res.download('src/common/template/product_template.xlsx')
    }

    @Post('products/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProduct(@UploadedFile() file: Express.Multer.File) {
        const workBook: Workbook = new Workbook();
        await workBook.xlsx.load(file.buffer);
        const sheet = workBook.worksheets[0];
        const error = []
        await new Promise((res,rej) => {
            sheet.eachRow(async (row, rowNumber) => {
                if (rowNumber === 1) {
                    return
                }
                const [, categoryName, name, yieldDate, manufacturers, price, createDate, stock, nowPrice] = Array.isArray(row.values) ? row.values : []

                const product: Product = new Product()
                let category = await this.categoriesService.findByName(categoryName as string)
                if (!category) {
                    category = await this.categoriesService.create({ name: categoryName as string, recommend: '' })
                }
                Object.assign(product, {
                    category,
                    name,
                    yieldDate: new Date(yieldDate as string),
                    manufacturers,
                    price,
                    createDate: new Date(createDate as string),
                    stock,
                    nowPrice
                })
                try {
                    await this.productsService.create(product)
                } catch (e) {
                    error.push({ rowNumber, error: e.message})
                } finally {
                    if(rowNumber === sheet.rowCount - 1) 
                        res(true)
                }
            })
        })
        return {
            successCount: sheet.rowCount - 2 - error.length,
            errorCount: error.length,
            error
        }
    }
}