const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Pokemon extends Model {}

Pokemon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  atk: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  def: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  atk_spe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  def_spe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,  // Initialiser à 0
  },
}, {
  sequelize,
  modelName: 'Pokemon',
});

module.exports = Pokemon;
