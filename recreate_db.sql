-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS pokedex;

-- Créer la base de données
CREATE DATABASE pokedex;

-- Attribuer les privilèges à l'utilisateur pokedex_admin
GRANT ALL PRIVILEGES ON DATABASE pokedex TO pokedex_admin;
