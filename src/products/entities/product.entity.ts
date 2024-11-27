import { IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { SaleProduct } from "src/sales/entities/saleProduct.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    @IsNotEmpty({message: '产品名称不能为空'})
    name:string
    @Column()
    @IsNotEmpty({message: '生产日期不能为空'})
    @IsDateString({},{message: '生产日期必须是日期格式'})
    yieldDate:Date
    @Column()
    @IsNotEmpty({message: '生产厂家不能为空'})
    manufacturers:string
    @Column()
    @IsNotEmpty({message: '产品价格不能为空'})
    @IsNumber({allowNaN:false}, {message: '价格必须是数字'})
    price:number
    @Column()
    @IsNotEmpty({message: '进货日期不能为空'})
    @IsDateString({},{message: '进货日期必须是日期格式'})
    createDate:Date
    @Column()
    @IsNotEmpty({message: '库存不能为空'})
    @IsNumber({allowNaN:false}, {message: '库存必须是数字'})
    stock:number
    @Column()
    @IsNotEmpty({message: '售价不能为空'})
    @IsNumber({allowNaN:false}, {message: '售价必须是数字'})
    nowPrice: number
    @ManyToOne(() => Category, category => category.products, {
        onDelete: 'CASCADE',
        nullable: false
    })
    category:Category

    @OneToMany(() => SaleProduct, saleProduct => saleProduct.product, { cascade: true })
    saleProducts: SaleProduct[];
}
