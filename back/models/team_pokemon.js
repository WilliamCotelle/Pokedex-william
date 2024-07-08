const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeamPokemon = sequelize.define('TeamPokemon', {
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
  team_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Teams',
      key: 'id',
    },
  },
});

module.exports = TeamPokemon;
