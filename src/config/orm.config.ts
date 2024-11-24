import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

const config:TypeOrmModuleOptions = {
    type: 'oracle',
    host: 'localhost',
    port: 1521,
    username: 'system',
    password: 'oracle',
    sid: 'XE',
    // entities: [User,Category,Product],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
}

export default config;