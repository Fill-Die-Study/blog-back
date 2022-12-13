import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOption: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.{ts,js}'],
  logging: true,
  synchronize: process.env.NODE_ENV === 'dev',
  migrations: ['dist/database/**/*.ts'],
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
