import { DataSource } from 'typeorm';

const host = process.env.DATABASE_HOST || 'localhost';
const port = parseInt(process.env.DATABASE_PORT || '3306', 10);
const username = process.env.DATABASE_USER || 'test';
const password = process.env.DATABASE_PASSWORD || 'password';
const database = process.env.DATABASE_NAME || 'test';

export default new DataSource({
  type: 'mysql',
  host,
  port,
  database,
  username,
  password,
  entities: ['dist/**/entities/**/*.entity.js'],
  migrations: ['dist/**/migrations/**/*.js'],
  logging: true,
});
