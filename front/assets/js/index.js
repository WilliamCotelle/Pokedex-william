// Fonction pour récupérer les pokémons depuis l'API
const getPokemons = async () => {
    try {
        // Faire une requête fetch à l'endpoint de l'API pour les pokémons
        const reponse = await fetch('http://localhost:3000/api/pokemons');
        // Vérifier si la réponse est correcte (status 200)
        if (!reponse.ok) {
            throw new Error(`HTTP error! status: ${reponse.status}`);
        }
        // Extraire les données JSON de la réponse
        const data = await reponse.json();
        // Retourner les données JSON
        return data;
    } catch (error) {
        console.log('Error fetching pokemons:', error);
    }
}


function createPokemonCardElem(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `./assets/img/${pokemonData.id}.webp`; // Assurez-vous que les images sont nommées par ID

    const pokemonName = document.createElement('h3');
    pokemonName.textContent = pokemonData.name;

    const pokemonStats = document.createElement('p');
    pokemonStats.textContent = `HP: ${pokemonData.hp} | ATK: ${pokemonData.atk}`;

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonStats);
    pokemonCard.dataset.id = pokemon.id;
    return pokemonCard;
}


// Récupérer les pokémons et les afficher
const fetchAndDisplayPokemons = async () => {
    try {
        // Appeler la fonction pour récupérer les pokémons
        const pokemons = await getPokemons();
        const pokemonList = document.getElementById('pokemon-list');
        pokemonList.innerHTML = '';
        for (const pokemon of pokemons) {
            pokemonList.appendChild(createPokemonCardElem(pokemonData));
        }
    } catch (error) {
        console.log('Error displaying pokemons:', error);
    }
}

// Ajouter des écouteurs d'événements pour les boutons et les modals
// Fonction pour ouvrir la modal des détails du pokémon
const openPokemonDetailModal = (pokemonId) => {
    // Récupérer les détails du pokémon en utilisant son ID
    // Remplir le contenu de la modal avec les détails du pokémon
    // Afficher la modal
}

// Fonction pour ouvrir la modal pour ajouter une nouvelle équipe
const openAddTeamModal = () => {
    // Afficher la modal pour ajouter une équipe
}
// Attendre que le document soit prêt
document.addEventListener("DOMContentLoaded", () => {


    // Appeler la fonction pour récupérer et afficher les pokémons au chargement de la page
    fetchAndDisplayPokemons();



    // Écouteur d'événements pour les cartes de pokémon
    document.getElementById('pokemon-list').addEventListener('click', (event) => {
        // Vérifier si l'élément cliqué est une carte de pokémon
        if (event.target.classList.contains('pokemon')) {
            // Si oui, récupérer l'ID du pokémon
            const pokemonId = event.target.dataset.id;
            // Appeler la fonction pour ouvrir la modal des détails du pokémon avec cet ID
            openPokemonDetailModal(pokemonId);
        }
    });

});