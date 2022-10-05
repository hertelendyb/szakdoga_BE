module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'szakdoga',
  entities: ['**/entities/*.js'],
  synchronize: true,
};
