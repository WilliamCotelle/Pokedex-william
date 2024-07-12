// Fonction pour récupérer les pokémons depuis l'API
const getPokemons = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/pokemons');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pokemons = data.map(pokemon => {
            if (pokemon.Types) {
                pokemon.color = pokemon.Types[0].color.toLowerCase();
            }
            return pokemon;
        })
        return pokemons;
    } catch (error) {
        console.log('Error fetching pokemons:', error);
    }
}

let typeMap = {};
// Fonction pour sélectionner les types depuis l'API
const getTypes = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/types');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const types = await response.json();
        for (const type of types) {
            typeMap[type.name.toLowerCase()] = type.color;
        }
    } catch (error) {
        console.log('Error fetching types:', error);
    }
};

// Fonction pour créer un élément de carte de pokémon
function createPokemonCardElem(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card', 'column', 'is-one-quarter');
    
    if (pokemonData.color) {
        pokemonCard.style.background = pokemonData.color;
    }

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
            if (pokemon.type) {
                pokemon.color = typeMap[pokemon.type];
            }
            pokemonList.appendChild(createPokemonCardElem(pokemon));
        }

        populatePokemonSelects(pokemons);
    } catch (error) {
        console.log('Error displaying pokemons:', error);
    }
};

// Récupérer les détails du Pokémon et inclure les couleurs de type
const fetchPokemonDetails = async (pokemonId) => {
    const response = await fetch(`http://localhost:3000/api/pokemons/${pokemonId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pokemon = await response.json();

    // Add type color to pokemon
    if (pokemon.Types) {
        pokemon.color = pokemon.Types[0].color.toLowerCase();
    }

    return pokemon;
};

// Met à jour le contenu de la modal
const updateModalContent = (pokemon) => {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalBody = document.querySelector('#pokemonModal .modal-card-body');

    modalTitle.textContent = pokemon.name;

    // vider le contenu
    modalBody.innerHTML = '';

    // Ajouter le contenu structuré
    const pokemonDetailHeader = document.createElement('div');
    pokemonDetailHeader.classList.add('pokemon-detail-header');

    const pokemonImg = document.createElement('img');
    pokemonImg.src = `./assets/img/${pokemon.id}.webp`;
    pokemonImg.alt = pokemon.name;
    pokemonImg.classList.add('modal-pokemon-img');

    const pokemonBasicInfo = document.createElement('div');
    pokemonBasicInfo.classList.add('pokemon-basic-info');

    const pokemonName = document.createElement('h2');
    pokemonName.textContent = pokemon.name;

    if (pokemon.color) {
        document.querySelector('#pokemonModal .modal-card').style.background = pokemon.color;
    }

    pokemonBasicInfo.append(pokemonName);
    pokemonDetailHeader.append(pokemonImg, pokemonBasicInfo);

    const pokemonStats = document.createElement('div');
    pokemonStats.classList.add('pokemon-stats');

    const statsTitle = document.createElement('h3');
    statsTitle.textContent = 'Stats';

    const createStatElement = (label, value) => {
        const stat = document.createElement('div');
        stat.classList.add('stat');

        const statLabel = document.createElement('span');
        statLabel.textContent = label;

        const statBar = document.createElement('div');
        statBar.classList.add('stat-bar');

        const statValue = document.createElement('div');
        statValue.classList.add('stat-value');
        statValue.style.width = `${value}%`;

        const statText = document.createElement('span');
        statText.textContent = value;

        statBar.appendChild(statValue);
        stat.append(statLabel, statBar, statText);
        return stat;
    };

    const hpStat = createStatElement('HP', pokemon.hp);
    const atkStat = createStatElement('Attack', pokemon.atk);
    const defStat = createStatElement('Defense', pokemon.def);
    const atkSpeStat = createStatElement('SP. ATK', pokemon.atk_spe);
    const defSpeStat = createStatElement('SP. DEF', pokemon.def_spe);
    const speedStat = createStatElement('Speed', pokemon.speed);

    pokemonStats.append(statsTitle, hpStat, atkStat, defStat, atkSpeStat, defSpeStat, speedStat);

    modalBody.append(pokemonDetailHeader, pokemonStats);
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
const openAddTeamModal = async () => {
    await populateTeamPokemonSelects();
    showModal('teamModal');
};

// Fonction pour fermer la modal des équipes
const closeTeamModal = () => {
    closeModal('teamModal');
};

// Fonction pour afficher les détails de l'équipe dans une modal
const openTeamDetailModal = async (teamId) => {
    try {
        const team = await fetchTeamDetails(teamId);
        const modalTitle = document.getElementById('teamDetailModalLabel');
        const modalDescription = document.getElementById('teamDetailDescription');
        const pokemonList = document.getElementById('teamDetailPokemonList');

        modalTitle.textContent = team.name;
        modalDescription.textContent = team.description;
        pokemonList.innerHTML = ''; // Clear previous list

        // const pokemonsTitle = document.createElement('h3');
        // pokemonsTitle.textContent = 'Pokémons de la team';
        // pokemonList.appendChild(pokemonsTitle);

        for (const pokemon of team.Pokemons) {
            const pokemonImg = document.createElement('img');
            pokemonImg.src = `./assets/img/${pokemon.id}.webp`;
            pokemonImg.alt = pokemon.name;
            pokemonImg.classList.add('pokemon-team-img');
            pokemonList.appendChild(pokemonImg);
        }

        showModal('teamDetailModal');
    } catch (error) {
        console.log('Error fetching team details:', error);
    }
};

// Fonction pour sélectionner les détails d'une équipe
const fetchTeamDetails = async (teamId) => {
    const response = await fetch(`http://localhost:3000/api/teams/${teamId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

// Fonction pour ajouter une nouvelle équipe
const addTeam = async (teamName, teamDescription, pokemons) => {
    try {
        const response = await fetch('http://localhost:3000/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName, description: teamDescription, pokemons })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTeam = await response.json();
        const teamList = document.getElementById('team-list');

        const teamCard = document.createElement('div');
        teamCard.classList.add('team-card');
        teamCard.dataset.id = newTeam.id;

        const teamNameElement = document.createElement('h5');
        teamNameElement.classList.add('team-name');
        teamNameElement.textContent = newTeam.name;

        teamCard.appendChild(teamNameElement);
        teamCard.addEventListener('click', () => openTeamDetailModal(newTeam.id));
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

    const pokemonSelects = document.getElementById('pokemonSelects').querySelectorAll('select');
    const selectedPokemons = Array.from(pokemonSelects).map(select => select.value).filter(pokemonId => pokemonId !== '');

    await addTeam(teamName, teamDescription, selectedPokemons);
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
        teamName.classList.add('team-name');
        teamName.textContent = team.name;

        const pokemonList = document.createElement('div');
        pokemonList.classList.add('team-pokemon-list');

        teamCard.appendChild(teamName);
        teamCard.appendChild(pokemonList);
        teamCard.addEventListener('click', () => openTeamDetailModal(team.id));
        teamList.appendChild(teamCard);
    }
};

// Fonction pour récupérer et afficher les équipes
const fetchAndDisplayTeams = async () => {
    try {
        const teams = await getTeams();
        displayTeams(teams);
    } catch (error) {
        console.log('Error displaying teams:', error);
    }
}

// =============comparer poké=============
let selectedPokemon1 = null;
let selectedPokemon2 = null;

// Fonction pour afficher les Pokémon pour la sélection dans la comparaison
const populatePokemonSelects = (pokemons) => {
    const pokemon1Selection = document.getElementById('pokemon1-selection');
    const pokemon2Selection = document.getElementById('pokemon2-selection');

    pokemon1Selection.innerHTML = '';
    pokemon2Selection.innerHTML = '';

    for (const pokemon of pokemons) {
        const img1 = document.createElement('img');
        img1.src = `./assets/img/${pokemon.id}.webp`;
        img1.alt = pokemon.name;
        img1.classList.add('selectable-pokemon');
        img1.dataset.id = pokemon.id;
        img1.title = pokemon.name; // Pour afficher le nom au survol
        img1.onclick = () => selectPokemon(1, pokemon.id);

        const img2 = document.createElement('img');
        img2.src = `./assets/img/${pokemon.id}.webp`;
        img2.alt = pokemon.name;
        img2.classList.add('selectable-pokemon');
        img2.dataset.id = pokemon.id;
        img2.title = pokemon.name; // Pour afficher le nom au survol
        img2.onclick = () => selectPokemon(2, pokemon.id);

        pokemon1Selection.appendChild(img1);
        pokemon2Selection.appendChild(img2);
    }
};

const selectPokemon = (slot, pokemonId) => {
    if (slot === 1) {
        selectedPokemon1 = pokemonId;
    } else if (slot === 2) {
        selectedPokemon2 = pokemonId;
    }
    if (selectedPokemon1 && selectedPokemon2) {
        comparePokemons();
    }
};

const comparePokemons = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
        alert('Veuillez sélectionner deux Pokémon à comparer.');
        return;
    }

    const pokemon1 = await fetchPokemonDetails(selectedPokemon1);
    const pokemon2 = await fetchPokemonDetails(selectedPokemon2);

    displayComparison(pokemon1, pokemon2);
};

// Fonction pour afficher les résultats de la comparaison
const displayComparison = (pokemon1, pokemon2) => {
    const comparisonResult = document.getElementById('comparisonResult');
    comparisonResult.innerHTML = '';

    const pokemon1Column = document.createElement('div');
    pokemon1Column.classList.add('column');
    const pokemon2Column = document.createElement('div');
    pokemon2Column.classList.add('column');

    // Afficher les images des Pokémon au-dessus des statistiques
    const img1 = document.createElement('img');
    img1.src = `./assets/img/${pokemon1.id}.webp`;
    img1.alt = pokemon1.name;
    img1.classList.add('modal-pokemon-img');

    const img2 = document.createElement('img');
    img2.src = `./assets/img/${pokemon2.id}.webp`;
    img2.alt = pokemon2.name;
    img2.classList.add('modal-pokemon-img');

    pokemon1Column.appendChild(img1);
    pokemon2Column.appendChild(img2);

    const createStatElement = (label, value) => {
        const stat = document.createElement('div');
        stat.classList.add('stat');

        const statLabel = document.createElement('span');
        statLabel.textContent = label;

        const statBar = document.createElement('div');
        statBar.classList.add('stat-bar');

        const statValue = document.createElement('div');
        statValue.classList.add('stat-value');
        statValue.style.width = `${value}%`;

        const statText = document.createElement('span');
        statText.textContent = value;

        statBar.appendChild(statValue);
        stat.append(statLabel, statBar, statText);
        return stat;
    };

    const createPokemonStats = (pokemon) => {
        const statsContainer = document.createElement('div');
        statsContainer.classList.add('pokemon-stats');

        const hpStat = createStatElement('HP', pokemon.hp);
        const atkStat = createStatElement('Attack', pokemon.atk);
        const defStat = createStatElement('Defense', pokemon.def);
        const atkSpeStat = createStatElement('SP. ATK', pokemon.atk_spe);
        const defSpeStat = createStatElement('SP. DEF', pokemon.def_spe);
        const speedStat = createStatElement('Speed', pokemon.speed);

        statsContainer.append(hpStat, atkStat, defStat, atkSpeStat, defSpeStat, speedStat);
        return statsContainer;
    };

    pokemon1Column.appendChild(createPokemonStats(pokemon1));
    pokemon2Column.appendChild(createPokemonStats(pokemon2));

    comparisonResult.appendChild(pokemon1Column);
    comparisonResult.appendChild(pokemon2Column);

    // Affiche la modal de comparaison des résultats
    showModal('comparisonResultModal');
};

// Fonction pour fermer la modal et réinitialiser les choix de Pokémon
const closeComparisonResultModal = () => {
    selectedPokemon1 = null;
    selectedPokemon2 = null;
    closeModal('comparisonResultModal');
};

const populateTeamPokemonSelects = async () => {
    const pokemonSelectsContainer = document.getElementById('pokemonSelects');
    pokemonSelectsContainer.innerHTML = '';

    const pokemons = await getPokemons();

    for (let i = 0; i < 5; i++) {
        const select = document.createElement('select');
        select.classList.add('input', 'mb-2');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionnez un Pokémon';
        select.appendChild(defaultOption);

        pokemons.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.id;
            option.textContent = pokemon.name;
            select.appendChild(option);
        });

        pokemonSelectsContainer.appendChild(select);
    }
};

// Attendre que le document soit prêt
document.addEventListener("DOMContentLoaded", async () => {
    await getTypes();
    const pokemons = await getPokemons();
    await fetchAndDisplayPokemons();
    await fetchAndDisplayTeams();

    populatePokemonSelects(pokemons);

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

    // Ouvrir la modal de comparaison
    document.getElementById('compare-pokemons').addEventListener('click', () => {
        showModal('compareModal');
    });

    // Comparer les Pokémon
    document.getElementById('compareBtn').addEventListener('click', comparePokemons);

    // Fermer la modal de comparaison des résultats
    document.querySelectorAll('.modal .delete').forEach(button => {
        button.addEventListener('click', closeComparisonResultModal);
    });
    document.querySelectorAll('.modal-background').forEach(background => {
        background.addEventListener('click', closeComparisonResultModal);
    });

    // Ouvrir la modal d'ajout d'équipe
    document.getElementById('addTeamBtn').addEventListener('click', openAddTeamModal);
});
