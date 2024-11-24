import { IsNotEmpty } from "class-validator"
import { Category } from "src/categories/entities/category.entity"

export class QueryProductDto {
    name: string
    startYieldDate: Date
    endYieldDate: Date
    sort: string
    sortColumn: string
    category: Category
}