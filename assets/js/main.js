const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonSearch = document.getElementById('pokemonSearch');

let allPokemons = []; // Para armazenar todos os Pokémon carregados
const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function renderPokemonList(pokemons) {
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML = newHtml;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons = [...allPokemons, ...pokemons]; // Armazena todos os Pokémon
        renderPokemonList(allPokemons); // Renderiza todos os Pokémon
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

// Filtrar Pokémon por nome
pokemonSearch.addEventListener('input', (event) => {
    const searchValue = event.target.value.toLowerCase();

    const filteredPokemons = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchValue)
    );

    renderPokemonList(filteredPokemons);
});

const pokemonTypeFilter = document.getElementById('pokemonTypeFilter');

// Filtrar Pokémon por tipo
pokemonTypeFilter.addEventListener('change', (event) => {
    const selectedType = event.target.value;

    if (selectedType === "") {
        renderPokemonList(allPokemons); // Exibe todos os Pokémon
    } else {
        const filteredPokemons = allPokemons.filter(pokemon =>
            pokemon.types.includes(selectedType)
        );
        renderPokemonList(filteredPokemons);
    }
});