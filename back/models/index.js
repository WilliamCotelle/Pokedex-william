const sequelize = require('../config/database');

const Pokemon = require('./pokemon');
const Type = require('./type');
const Team = require('./team');
const PokemonType = require('./pokemon_type');
const TeamPokemon = require('./team_pokemon');

// Définir les relations
Pokemon.belongsToMany(Type, { through: PokemonType, foreignKey: 'pokemon_id' });
Type.belongsToMany(Pokemon, { through: PokemonType, foreignKey: 'type_id' });

Pokemon.belongsToMany(Team, { through: TeamPokemon, foreignKey: 'pokemon_id' });
Team.belongsToMany(Pokemon, { through: TeamPokemon, foreignKey: 'team_id' });

module.exports = {
  sequelize,
  Pokemon,
  Type,
  Team,
  PokemonType,
  TeamPokemon,
};
