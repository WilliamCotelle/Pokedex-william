const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PokemonType = sequelize.define('PokemonType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pokemon_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Pokemons',
      key: 'id',
    },
  },
  type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Types',
      key: 'id',
    },
  },
});

module.exports = PokemonType;
