const express = require('express');
const router = express.Router();
const { Pokemon } = require('../models');
const { Type } = require('../models');

// Obtenir tous les Pokémons
router.get('/', async (req, res) => {
  const pokemons = await Pokemon.findAll({ include: [Type] });
  res.json(pokemons);
});

// Obtenir un Pokémon par ID
router.get('/:id', async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id, { include: [Type] });
  res.json(pokemon);
});

module.exports = router;

