import { Category } from "src/categories/entities/category.entity"
import { Sale } from "../entities/sale.entity"

export class QuerySaleDto {
    startCreateDate: Date
    endCreateDate: Date
    sort: 'asc' | 'desc'
    sortColumn: Omit<keyof Sale, 'product'>
    category: Category
}