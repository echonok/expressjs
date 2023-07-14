import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'node_complete',
  'root',
  '123456',
  { dialect: 'mysql', host: 'localhost' }
);
