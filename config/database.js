const { Sequelize } = require("sequelize");
const dbConfig = require('./db.config');

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql'
    }
);

// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch((err) => {
//     console.error('Unable to connect to the database: ', error);
// });

module.exports = sequelize;