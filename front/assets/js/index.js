// Fonction pour récupérer les pokémons depuis l'API
const getPokemons = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/pokemons');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching pokemons:', error);
    }
}

// Fonction pour créer un élément de carte de pokémon
function createPokemonCardElem(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card', 'column', 'is-one-quarter');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `./assets/img/${pokemonData.id}.webp`;

    const pokemonName = document.createElement('h3');
    pokemonName.classList.add('title', 'is-4');
    pokemonName.textContent = pokemonData.name;


    const pokemonNumberPokedex = document.createElement('span');
    pokemonNumberPokedex.classList.add('pokemon-number');
    pokemonNumberPokedex.textContent = `N°${pokemonData.id}`;

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonNumberPokedex);
    pokemonCard.dataset.id = pokemonData.id;
    return pokemonCard;
}

// Récupérer les pokémons et les afficher
const fetchAndDisplayPokemons = async () => {
    try {
        const pokemons = await getPokemons();
        const pokemonList = document.getElementById('pokemon-list');
        pokemonList.innerHTML = '';
        for (const pokemon of pokemons) {
            pokemonList.appendChild(createPokemonCardElem(pokemon));
        }
    } catch (error) {
        console.log('Error displaying pokemons:', error);
    }
}

// Récupérer les détails du Pokémon
const fetchPokemonDetails = async (pokemonId) => {
    const response = await fetch(`http://localhost:3000/api/pokemons/${pokemonId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

// Met à jour le contenu de la modal
const updateModalContent = (pokemon) => {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalBody = document.querySelector('#pokemonModal .modal-card-body');

    modalTitle.textContent = pokemon.name;

    // vider le contenu
    modalBody.innerHTML = '';

    // ajouter le contenu
    const pokemonImg = document.createElement('img');
    pokemonImg.src = `./assets/img/${pokemon.id}.webp`;
    pokemonImg.alt = pokemon.name;
    pokemonImg.classList.add('modal-pokemon-img');
    
    const hp = document.createElement('p');
    hp.textContent = `HP: ${pokemon.hp}`;

    const atk = document.createElement('p');
    atk.textContent = `ATK: ${pokemon.atk}`;

    const def = document.createElement('p');
    def.textContent = `DEF: ${pokemon.def}`;

    const atkSpe = document.createElement('p');
    atkSpe.textContent = `SP. ATK: ${pokemon.atk_spe}`;

    const defSpe = document.createElement('p');
    defSpe.textContent = `SP. DEF: ${pokemon.def_spe}`;

    const speed = document.createElement('p');
    speed.textContent = `Speed: ${pokemon.speed}`;

    modalBody.append(pokemonImg, hp, atk, def, atkSpe, defSpe, speed);
};

// Affiche la modal
const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.add('is-active');
};

// Cache la modal
const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.remove('is-active');
};

// Fonction principale pour ouvrir la modal des détails du pokémon
const openPokemonDetailModal = async (pokemonId) => {
    try {
        const pokemon = await fetchPokemonDetails(pokemonId);
        updateModalContent(pokemon);
        showModal('pokemonModal');
    } catch (error) {
        console.log('Error fetching pokemon details:', error);
    }
};

// Fonction pour ouvrir la modal pour ajouter une nouvelle équipe
const openAddTeamModal = () => {
    showModal('teamModal');
};

// Fonction pour fermer la modal des équipes
const closeTeamModal = () => {
    closeModal('teamModal', 'teamDetailModal');
};

// Fonction pour afficher les détails de l'équipe dans une modal
const openTeamDetailModal = (teamName, teamDescription) => {
    const modalTitle = document.getElementById('teamDetailModalLabel');
    const modalDescription = document.getElementById('teamDetailDescription');

    modalTitle.textContent = teamName;
    modalDescription.textContent = teamDescription;

    showModal('teamDetailModal');
};

// Fonction pour ajouter une nouvelle équipe
// Fonction pour ajouter une nouvelle équipe
const addTeam = async (teamName, teamDescription) => {
    try {
        const response = await fetch('http://localhost:3000/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName, description: teamDescription })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTeam = await response.json();
        const teamList = document.getElementById('team-list');

        const teamCard = document.createElement('div');
        teamCard.classList.add('team-card');

        const teamNameElement = document.createElement('h5');
        teamNameElement.classList.add('team-name');
        teamNameElement.textContent = newTeam.name;

        teamCard.appendChild(teamNameElement);
        teamCard.addEventListener('click', () => openTeamDetailModal(newTeam.name, newTeam.description));
        teamList.appendChild(teamCard);

        return newTeam;
    } catch (error) {
        console.log('Error adding team:', error);
    }
};

// Fonction pour gérer la soumission du formulaire de création d'équipe
const handleTeamFormSubmit = async (event) => {
    event.preventDefault();
    const teamName = document.getElementById('teamName').value;
    const teamDescription = document.getElementById('teamDescription').value;
    await addTeam(teamName, teamDescription);
    closeTeamModal();
    document.getElementById('teamForm').reset();
};
//écouteur d'événement pour le formulaire de création d'équipe
document.getElementById('teamForm').addEventListener('submit', handleTeamFormSubmit);

// Fonction pour récupérer les équipes depuis l'API
const getTeams = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/teams');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching teams:', error);
    }
}

// Fonction pour afficher les équipes dans la liste
const displayTeams = (teams) => {
    const teamList = document.getElementById('team-list');
    teamList.innerHTML = '';
    for (const team of teams) {
        const teamCard = document.createElement('div');
        teamCard.classList.add('team-card');
        teamCard.dataset.id = team.id;

        const teamName = document.createElement('h5');
        teamName.textContent = team.name;

        const pokemonList = document.createElement('div');
        pokemonList.classList.add('team-pokemon-list');

        teamCard.appendChild(teamName);
        teamCard.appendChild(pokemonList);
        teamList.appendChild(teamCard);
    }
}

// Fonction pour récupérer et afficher les équipes
const fetchAndDisplayTeams = async () => {
    try {
        const teams = await getTeams();
        displayTeams(teams);
    } catch (error) {
        console.log('Error displaying teams:', error);
    }
}



// Attendre que le document soit prêt
document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayPokemons();
    fetchAndDisplayTeams();

    // Écouteur d'événements pour les cartes de pokémon
    document.addEventListener('click', (event) => {
        const pokemonCard = event.target.closest('.pokemon-card');
        if (pokemonCard) {
            const pokemonId = pokemonCard.dataset.id;
            openPokemonDetailModal(pokemonId);
        }
    });

    // Écouteurs pour fermer les modals
    document.querySelectorAll('.modal .delete').forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.modal').id);
        });
    });

    document.querySelectorAll('.modal-background').forEach(background => {
        background.addEventListener('click', () => {
            closeModal(background.closest('.modal').id);
        });
    });
});




