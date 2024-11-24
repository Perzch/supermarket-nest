import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { Sale } from "src/sales/entities/sale.entity";

@Entity()
export class SaleProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, sale => sale.saleProducts, { onDelete: 'CASCADE' })
    sale: Sale;

    @ManyToOne(() => Product, product => product.saleProducts, { onDelete: 'CASCADE' })
    product: Product;

    @Column()
    saleCount: number;
}
