const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Pokemon = sequelize.define('pokemon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    atk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    def: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    atk_spe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    def_spe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Pokemon;
