module.exports = {
  development: {
    username: 'jcdata',
    password: 'Libertad.636', 
    database: 'jcdata_proyecto2_digital',
    host: 'mysql-jcdata.alwaysdata.net', 
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
