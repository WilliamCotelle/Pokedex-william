const express = require('express');
const router = express.Router();
const { Pokemon, Type } = require('../models');

// Obtenir le classement
router.get('/ranking', async (req, res) => {
  try {
      const ranking = await Pokemon.findAll({
          order: [['votes', 'DESC']],
          limit: 10, // Limite à 10 Pokémon par exemple
      });
      res.json(ranking);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

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

// Route pour enregistrer les votes
router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) {
      return res.status(404).send('Pokemon not found');
    }

    pokemon.votes += 1;
    await pokemon.save();

    res.status(200).send('Vote recorded');
  } catch (error) {
    res.status(500).send('Error recording vote');
  }
});



module.exports = router;
