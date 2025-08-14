// main.js
function htmlTipos(pokemonTypes) {
    return pokemonTypes.map((typeName) => `<li class="type ${typeName}">${typeName}</li>`)
}

function htmlPokemon(pokemon) {
    return `
        <li class="pokemon ${pokemon.tipoMain}" onclick="redirectToDetail(${pokemon.numero})">
            <span class="number">#${pokemon.numero.toString().padStart(3, '0')}</span>
            <span class="name">${pokemon.nome}</span>
            <div class="detail">
                <ol class="types">
                    ${htmlTipos(pokemon.tipos).join('')}                        
                </ol>
                <img src="${pokemon.imagem}" alt="${pokemon.nome}">
            </div>
        </li>`
}

function redirectToDetail(pokemonId) {
    // Salva o estado atual antes de redirecionar
    saveState();
    window.location.href = `detail.html?id=${pokemonId}`;
}

let offset = 0;
let limit = 5;
let pokemonCount = 0;
let loadedPokemons = [];

const htmlPokemonList = document.getElementById("pokemonList");

function saveState() {
    localStorage.setItem('pokedexState', JSON.stringify({
        offset: offset,
        count: pokemonCount,
        loadedPokemons: loadedPokemons.map(p => p.numero) // Salva apenas os IDs para economizar espaço
    }));
}

function loadState() {
    const savedState = localStorage.getItem('pokedexState');
    if (savedState) {
        const state = JSON.parse(savedState);
        offset = state.offset || 0;
        pokemonCount = state.count || 0;
        updateCounter();
        return state.loadedPokemons || [];
    }
    return [];
}

function updateCounter() {
    const counterElement = document.querySelector('.contagem span');
    if (counterElement) {
        counterElement.textContent = `Contagem: ${pokemonCount.toString().padStart(2, '0')}`;
    }
}

async function loadInitialPokemons() {
    const savedPokemons = loadState();
    
    if (savedPokemons.length > 0) {
        // Carrega os Pokémon salvos primeiro
        const pokemonDetails = await Promise.all(
            savedPokemons.map(id => pokeApi.getPokemonById(id))
        );
        
        const newHtml = pokemonDetails.map(htmlPokemon).join('');
        htmlPokemonList.innerHTML = newHtml;
        loadedPokemons = pokemonDetails;
        pokemonCount = loadedPokemons.length;
        updateCounter();
    } else {
        // Se não houver estado salvo, carrega os primeiros Pokémon
        await loadPokemon(offset, limit);
    }
}

function loadPokemon(offset, limit, resetList = false) {
    return pokeApi.getPokemon(offset, limit)
        .then((pokemonList = []) => {
            if (resetList) {
                loadedPokemons = [...pokemonList];
                htmlPokemonList.innerHTML = pokemonList.map(htmlPokemon).join('');
            } else {
                loadedPokemons = [...loadedPokemons, ...pokemonList];
                htmlPokemonList.innerHTML += pokemonList.map(htmlPokemon).join('');
            }
            
            pokemonCount = loadedPokemons.length;
            updateCounter();
            saveState();
        })
        .catch((error) => console.log(error));
}

function loadMore() {
    offset += limit;
    loadPokemon(offset, limit);
}
function reset() {
    localStorage.removeItem('pokedexState');
    offset = 0;
    pokemonCount = 0;
    loadedPokemons = [];
    updateCounter();
    loadPokemon(offset, limit, true); // O true indica que é um reset
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadInitialPokemons();
});