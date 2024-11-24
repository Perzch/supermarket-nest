import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaleProduct } from "./saleProduct.entity";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    createDate: Date
    @OneToMany(() => SaleProduct, saleProduct => saleProduct.sale, { cascade: true })
    saleProducts: SaleProduct[];
}
