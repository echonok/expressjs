import { Db, MongoClient } from 'mongodb';
import { Sequelize } from 'sequelize';

type Callback = (error: Error | null, response: Object | null) => void;

let _db: Db;

export const MongoConnect = (callback: Callback) => {
  MongoClient.connect(
    'mongodb+srv://dev:7J6xZRgDf1ufJkdE@dev.m2tjfcf.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected');
      _db = client.db();
      callback(null, client);
    })
    .catch((err) => {
      console.error(err);
    });
}

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('no database found!')
}

export const sequelize = new Sequelize(
  'node_complete',
  'root',
  '123456',
  { dialect: 'mysql', host: 'localhost' }
);
