import mysql2 from 'mysql2';

export const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node_complete',
  password: '123456'
}).promise();
