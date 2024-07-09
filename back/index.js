const express = require('express');
const { sequelize, Pokemon } = require('./models');
const seedDatabase = require('./seedDatabase');
const indexRoutes = require('./router/index'); 

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Vérifiez s'il y a déjà des données dans la base de données
    const pokemonCount = await Pokemon.count();

    if (pokemonCount === 0) {
      await seedDatabase();
    } else {
      console.log('Database already seeded!');
    }

    const app = express();
    
    app.use(express.static('front'));

    app.use('/', indexRoutes);

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(3000, () => {
      console.log('Server ready: http://localhost:3000');
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();



