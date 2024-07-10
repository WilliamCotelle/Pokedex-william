const express = require('express');
const router = express.Router();
const { Team, Pokemon } = require('../models');

// Obtenir toutes les Équipes
router.get('/', async (req, res) => {
  const teams = await Team.findAll();
  res.json(teams);
});

// Obtenir une Équipe par ID
router.get('/:id', async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  res.json(team);
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newTeam = await Team.create({ name, description });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'équipe' });
  }
});

module.exports = router;
