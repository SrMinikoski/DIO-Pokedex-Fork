document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    // Modificamos o event listener para pageshow
    window.addEventListener('pageshow', function(event) {
        // Se a página está sendo carregada do cache (como ao voltar com o botão do navegador)
        if (event.persisted) {
            // Não fazemos nada aqui, o estado já está salvo
        }
    });

    if (pokemonId) {
        loadPokemonDetail(pokemonId);
    }
});

function loadPokemonDetail(pokemonId) {
    pokeApi.getPokemonById(pokemonId)
        .then((pokemon) => {

            return pokeApi.getPokemonSpecies(pokemon.species)
                .then((speciesName) => {
                    pokemon.species = speciesName;
                    return pokemon;
                });
        })
        .then((pokemon) => {
            displayPokemonDetail(pokemon);
        })
        .catch((error) => console.log(error));
}

function displayPokemonDetail(pokemon) {

    document.querySelector('h1').textContent = pokemon.nome;


    const pokemonLi = document.querySelector('.pokemon');
    pokemonLi.className = `pokemon ${pokemon.tipoMain}`;



    const spriteImg = document.getElementById('sprite');
    spriteImg.src = pokemon.imagem;
    spriteImg.alt = pokemon.nome;


    const typesContainer = document.querySelector('.types');
    typesContainer.innerHTML = '';
    pokemon.tipos.forEach(type => {
        const typeSpan = document.createElement('span');
        typeSpan.className = `type ${type}`;
        typeSpan.textContent = type;
        typesContainer.appendChild(typeSpan);
    });

    const speciesCell = document.querySelector('.vertical-table tr:nth-child(1) td');
    const heightCell = document.querySelector('.vertical-table tr:nth-child(2) td');
    const weightCell = document.querySelector('.vertical-table tr:nth-child(3) td');
    const abilitiesCell = document.querySelector('.vertical-table tr:nth-child(4) td');

    speciesCell.textContent = pokemon.species;
    heightCell.textContent = `${pokemon.height} m`;
    weightCell.textContent = `${pokemon.weight} kg`;
    abilitiesCell.textContent = pokemon.abilities.join(', ');


    const statsTable = document.querySelectorAll('.vertical-table')[1];
    statsTable.innerHTML = `
        <tr>
            <th>Vida:</th>
            <td>${pokemon.stats[0].value}</td>
        </tr>
        <tr>
            <th>Ataque:</th>
            <td>${pokemon.stats[1].value}</td>
        </tr>
        <tr>
            <th>Defesa:</th>
            <td>${pokemon.stats[2].value}</td>
        </tr>
        <tr>
            <th>Atq Esp:</th>
            <td>${pokemon.stats[3].value}</td>
        </tr>
        <tr>
            <th>Def Esp:</th>
            <td>${pokemon.stats[4].value}</td>
        </tr>
        <tr>
            <th>Velocidade:</th>
            <td>${pokemon.stats[5].value}</td>
        </tr>
        <tr>
            <th>Total:</th>
            <td>${pokemon.stats.reduce((total, stat) => total + stat.value, 0)}</td>
        </tr>
    `;
    const movesSection = document.querySelector('article h2:last-of-type');
    if (movesSection) {
        const movesList = document.createElement('ul');

        pokemon.moves.slice(0, 10).forEach(move => {
            const moveItem = document.createElement('li');
            moveItem.textContent = move;
            movesList.appendChild(moveItem);
        });
        movesSection.parentNode.insertBefore(movesList, movesSection.nextSibling);
    }
}