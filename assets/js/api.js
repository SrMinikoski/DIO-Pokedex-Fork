const pokeApi = {}

function convertApiPokeToModelPoke(detalhesPokemon) {
    const pokemon = new Pokemon()
    pokemon.nome = detalhesPokemon.name
    pokemon.numero = detalhesPokemon.id

    const tipos = detalhesPokemon.types.map((typeSlot) => typeSlot.type.name)
    const [tipo] = tipos

    pokemon.tipos = tipos
    pokemon.tipoMain = tipo

    pokemon.imagem = detalhesPokemon.sprites.other.dream_world.front_default
    pokemon.species = detalhesPokemon.species.url 
    pokemon.height = detalhesPokemon.height / 10
    pokemon.weight = detalhesPokemon.weight / 10
    pokemon.abilities = detalhesPokemon.abilities.map(ability => ability.ability.name)
    pokemon.stats = detalhesPokemon.stats.map(stat => {
        return {
            name: stat.stat.name,
            value: stat.base_stat
        }
    })
    pokemon.moves = detalhesPokemon.moves.map(move => move.move.name)

    return pokemon
}

pokeApi.getPokemonSpecies = (speciesUrl) => {
    return fetch(speciesUrl)
        .then((response) => response.json())
        .then((speciesData) => {
            const genusEntry = speciesData.genera.find(genus => genus.language.name === 'en');
            return genusEntry ? genusEntry.genus : speciesData.name;
        });
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertApiPokeToModelPoke)
}

pokeApi.getPokemon = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonbody) => jsonbody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detalhesRequests) => Promise.all(detalhesRequests))
        .then((detalhesPokemon) => detalhesPokemon)
}

pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    return fetch(url)
        .then((response) => response.json())
        .then(convertApiPokeToModelPoke)
}