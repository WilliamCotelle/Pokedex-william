// Fonction pour afficher les suggestions
const showSuggestions = (suggestions) => {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.classList.add('dropdown-item');
        item.textContent = suggestion.name;
        item.onclick = () => {
            document.getElementById('pokemonSearch').value = suggestion.name;
            suggestionsBox.style.display = 'none';
            openPokemonDetailModal(suggestion.id); // Ouvrir la modal avec les détails du Pokémon sélectionné
        };
        suggestionsBox.appendChild(item);
    });

    if (suggestions.length > 0) {
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
    }
};

// Fonction pour rechercher les Pokémon par nom
const searchPokemons = async (query) => {
    const response = await fetch('http://localhost:3000/api/pokemons');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pokemons = await response.json();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    return filteredPokemons;
};

document.getElementById('pokemonSearch').addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length > 0) {
        const suggestions = await searchPokemons(query);
        showSuggestions(suggestions);
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});

// Fermer les suggestions si on clique en dehors
document.addEventListener('click', (event) => {
    const suggestionsBox = document.getElementById('suggestions');
    if (!suggestionsBox.contains(event.target) && event.target.id !== 'pokemonSearch') {
        suggestionsBox.style.display = 'none';
    }
});
