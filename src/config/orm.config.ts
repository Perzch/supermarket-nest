import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const config:TypeOrmModuleOptions = {
    type: 'oracle',
    host: 'localhost',
    port: 1521,
    username: 'supermarket',
    password: '123456',
    sid: 'XE',
    // entities: [User,Category,Product],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
}

export default config;