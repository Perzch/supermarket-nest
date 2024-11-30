import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const config:TypeOrmModuleOptions = {
    type: 'oracle',
    host: 'localhost',
    port: 1521,
    username: 'C##SUPERMARKET',
    password: '123456',
    sid: 'ORCL',
    // entities: [User,Category,Product],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
}
 
export default config;