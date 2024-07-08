const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Pokemon = require('./pokemon');
const Type = require('./type');
const Team = require('./team');
const TeamPokemon = require('./team_pokemon');
const PokemonType = require('./pokemon_type');

//associations
Pokemon.belongsToMany(Team, { through: TeamPokemon });
Team.belongsToMany(Pokemon, { through: TeamPokemon });

Pokemon.belongsToMany(Type, { through: PokemonType });
Type.belongsToMany(Pokemon, { through: PokemonType });

module.exports = {
    Pokemon,
    Type,
    Team,
    TeamPokemon,
    PokemonType,
    sequelize,
};