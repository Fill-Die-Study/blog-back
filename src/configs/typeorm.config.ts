import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 9191,
  username: 'root',
  password: 'test',
  database: 'blog',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
};
