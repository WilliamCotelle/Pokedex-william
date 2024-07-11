const express = require('express');
const router = express.Router();
const { Team, Pokemon, TeamPokemon } = require('../models');

// Obtenir toutes les Équipes
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({ include: Pokemon });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des équipes' });
  }
});

// Obtenir une Équipe par ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, { include: Pokemon });
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ error: 'Équipe non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipe' });
  }
});

// Créer une nouvelle équipe
router.post('/', async (req, res) => {
  const { name, description, pokemons } = req.body;
  try {
    const newTeam = await Team.create({ name, description });
    if (pokemons && pokemons.length > 0) {
      const pokemonInstances = await Pokemon.findAll({ where: { id: pokemons } });
      await newTeam.addPokemons(pokemonInstances);
    }
    const createdTeam = await Team.findByPk(newTeam.id, { include: Pokemon });
    res.status(201).json(createdTeam);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'équipe' });
  }
});

module.exports = router;
