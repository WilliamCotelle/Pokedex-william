const express = require('express');
const router = express.Router();

const pokemonRoutes = require('./pokemon');
const typeRoutes = require('./type');
const teamRoutes = require('./team');

router.use('/api/pokemons', pokemonRoutes);
router.use('/api/types', typeRoutes);
router.use('/api/teams', teamRoutes);

module.exports = router;

