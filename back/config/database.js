const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,  // Désactive les logs de Sequelize
});

module.exports = sequelize;


