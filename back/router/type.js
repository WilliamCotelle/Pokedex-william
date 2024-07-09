const express = require('express');
const router = express.Router();
const { Type, Pokemon } = require('../models');

// Obtenir tous les Types
router.get('/', async (req, res) => {
  try {
    const types = await Type.findAll();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des Types' });
  }
});

// Obtenir les Pokémons par Type
router.get('/:id/pokemons', async (req, res) => {
  try {
    const type = await Type.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }
    const pokemons = await type.getPokemons();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des Pokémons par Type' });
  }
});

module.exports = router;


