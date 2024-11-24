import { Category } from "src/categories/entities/category.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { SaleProduct } from "src/sales/entities/saleProduct.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @Column()
    yieldDate:Date
    @Column()
    manufacturers:string
    @Column()
    price:number
    @Column()
    createDate:Date
    @Column()
    stock:number
    @Column()
    nowPrice: number
    @ManyToOne(() => Category, category => category.products, {
        onDelete: 'CASCADE',
        nullable: false
    })
    category:Category

    @OneToMany(() => SaleProduct, saleProduct => saleProduct.product, { cascade: true })
    saleProducts: SaleProduct[];
}
