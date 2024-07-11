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
const openAddTeamModal = () => {
    showModal('teamModal');
};

// Fonction pour fermer la modal des équipes
const closeTeamModal = () => {
    closeModal('teamModal');
};

// Fonction pour afficher les détails de l'équipe dans une modal
const openTeamDetailModal = (teamId) => {
    fetchTeamDetails(teamId).then(team => {
        const modalTitle = document.getElementById('teamDetailModalLabel');
        const modalDescription = document.getElementById('teamDetailDescription');

        modalTitle.textContent = team.name;
        modalDescription.textContent = team.description;

        showModal('teamDetailModal');
    }).catch(error => {
        console.log('Error fetching team details:', error);
    });
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
// Fonction pour afficher les pokemons dans la liste
const populatePokemonSelects = (pokemons) => {
    const pokemon1Select = document.getElementById('pokemon1');
    const pokemon2Select = document.getElementById('pokemon2');

    for (const pokemon of pokemons) {
        const option1 = document.createElement('option');
        option1.value = pokemon.id;
        option1.textContent = pokemon.name;
        pokemon1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = pokemon.id;
        option2.textContent = pokemon.name;
        pokemon2Select.appendChild(option2);
    }
};

// Fonction pour afficher les résultats de la comparaison 
const displayComparison = (pokemon1, pokemon2) => {
    const comparisonResult = document.getElementById('comparisonResult');
    comparisonResult.innerHTML = ''; 

    const pokemon1Column = document.createElement('div');
    pokemon1Column.classList.add('column');
    const pokemon2Column = document.createElement('div');
    pokemon2Column.classList.add('column');

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
};

const comparePokemons = async () => {
    const pokemon1Id = document.getElementById('pokemon1').value;
    const pokemon2Id = document.getElementById('pokemon2').value;

    if (!pokemon1Id || !pokemon2Id) {
        alert('Veuillez sélectionner deux Pokémon à comparer.');
        return;
    }

    const pokemon1 = await fetchPokemonDetails(pokemon1Id);
    const pokemon2 = await fetchPokemonDetails(pokemon2Id);

    displayComparison(pokemon1, pokemon2);
};

// Attendre que le document soit prêt
document.addEventListener("DOMContentLoaded", async () => {
    await getTypes();
    await fetchAndDisplayPokemons();
    await fetchAndDisplayTeams();

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
});
