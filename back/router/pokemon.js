const express = require('express');
const router = express.Router();
const { Pokemon } = require('../models');

// Obtenir tous les Pokémons
router.get('/', async (req, res) => {
  const pokemons = await Pokemon.findAll();
  res.json(pokemons);
});

// Obtenir un Pokémon par ID
router.get('/:id', async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id);
  res.json(pokemon);
});

module.exports = router;

