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

module.exports = router;
