let pokemon = []
let pokemons = [];
let printPokemon = [];
let startIndex = 0;
let endIndex = 10;


async function init() {
    for (let i = 1; i <= 100; i++) {
        pokemon.push(i);
    }
    showLoadAnimation();
    await loadPokemon(startIndex, endIndex);
    hideLoadAnimation();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadPokemon(start, end) {
    for (let i = start; i <= end && i < pokemon.length; i++) {
        let cardID = pokemon[i];
        let url = `https://pokeapi.co/api/v2/pokemon/${cardID}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();

        pokemons.push(currentPokemon);
        printPokemon.push(currentPokemon);

        let pokemonName = capitalize(currentPokemon['name']);
        let pokemonImage = currentPokemon['sprites']['other']['official-artwork']['front_default'];
        let pokemonSpecies = capitalize(currentPokemon['species']['name']);
        let pokemonHeight = currentPokemon['height'];
        let pokemonWeight = currentPokemon['weight'];

        renderCards(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);
    }
}

function renderCards(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    let pokemonTypes = pokemons.find(function(pokemon) {
        return pokemon.id === cardID;
        }).types;
        let mainType = pokemonTypes[0].type.name;
        document.getElementById('content').innerHTML += templateRenderCards(i, mainType, cardID, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);

    renderTypes(cardID, pokemonTypes, 'properties-overview');
}

function renderTypes(cardID, pokemonTypes, elementIdPrefix) {
    pokemonTypes.forEach(function(type) {
        let pokemonType = capitalize(type.type.name);
        document.getElementById(`${elementIdPrefix}-${cardID}`).innerHTML += /*html*/`
        <img class="types" src="./icons/${pokemonType}.svg" class="type-icon" title="${pokemonType}">`;
    });
}

async function loadMore() {
    startIndex = endIndex + 1;
    endIndex += 20;
    if (startIndex < pokemon.length) {
        showLoadAnimation();
        await loadPokemon(startIndex, endIndex);
        hideLoadAnimation();
    } else {
        document.getElementById('button-container').style.display = "none";
    }

}

function filterPokemon() {
    let searchTerm = getSearchTerm();

    if (searchTerm.length >= 1) {
        let filteredPokemon = getFilteredPokemon(searchTerm);
        displayFilteredPokemon(filteredPokemon);
    } else {
        resetPokemonDisplay();
    }
    toggleLoadMoreButton(searchTerm);
}

function getSearchTerm() {
    return document.getElementById('searching').value.toLowerCase();
}

function getFilteredPokemon(searchTerm) {
    return printPokemon.filter(function(pokemon) {
        return pokemon.name.toLowerCase().includes(searchTerm);
    }).slice(0, 10);
}

function displayFilteredPokemon(filteredPokemon) {
    let content = document.getElementById('content');
    content.innerHTML = '';
    if (filteredPokemon.length === 0) {
        content.innerHTML = '<p>No result</p>';
        return;
    }
    filteredPokemon.forEach((pokemon, i) => {
        renderCards(
            pokemon.id,
            i,
            capitalize(pokemon.name),
            pokemon.sprites.other['official-artwork'].front_default,
            capitalize(pokemon.species.name),
            pokemon.height,
            pokemon.weight
        );
    });
}

function resetPokemonDisplay() {
    document.getElementById('content').innerHTML = '';
    printPokemon.slice(0, Math.min(printPokemon.length, startIndex + 20)).forEach((pokemon, i) => {
        renderCards(
            pokemon.id,
            i,
            capitalize(pokemon.name),
            pokemon.sprites.other['official-artwork'].front_default,
            capitalize(pokemon.species.name),
            pokemon.height,
            pokemon.weight
        );
    });
}

function toggleLoadMoreButton(searchTerm) {
    if (searchTerm.trim() === '') {
        document.getElementById('button-container').style.display = "flex";
    } else {
        document.getElementById('button-container').style.display = "none";
    }
}

function showLoadAnimation() {
    document.getElementById('button-container').style.display = "none";
    document.getElementById('load').style.display = 'flex';
}

function hideLoadAnimation() {
    document.getElementById('load').style.display = 'none';
    document.getElementById('button-container').style.display = "flex";
}

function openBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    document.getElementById('big-card-container').innerHTML = '';
    document.getElementById('big-card-container').innerHTML += returnHTMLBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);

    let pokemonTypes = pokemons.find(function(pokemon) {
        return pokemon.id === cardID;
    }).types;
    renderTypes(cardID, pokemonTypes, 'properties-overview-bc');
   
    renderAbilities(cardID, i);
    openTabSkills();
    showChart(cardID);
    document.body.classList.add('no-scroll');
}

function renderAbilities(cardID, i) {
    for (let k = 0; k < pokemons[i]['abilities'].length; k++) {
        let pokemonAbility = pokemons[i]['abilities'][k]['ability']['name'];
        document.getElementById(`abilities${cardID}`).innerHTML += /*html*/`
    <div class="ability">${pokemonAbility}</div>`
    }
}

function closeBigCard() {
    document.getElementById('big-card-container').innerHTML = '';
    document.body.classList.remove('no-scroll');
}

function openTabSkills() {
    let tab1 = document.getElementById('menu-skills');
    let tab2 = document.getElementById('menu-stats');
    document.getElementById('skills').style.display = "block";
    document.getElementById('base-stats').style.display = "none";
    tab1.style.color = "#000";
    tab1.style.fontWeight = "bold";
    tab2.style.color = "#838383";
    tab2.style.fontWeight = "400";
}

function openTabStats() {
    let tab1 = document.getElementById('menu-skills');
    let tab2 = document.getElementById('menu-stats');
    document.getElementById('base-stats').style.display = "block";
    document.getElementById('skills').style.display = "none";
    tab2.style.color = "#000";
    tab2.style.fontWeight = "bold";
    tab1.style.color = "#838383";
    tab1.style.fontWeight = "400";
}

function previousCard(cardID) {
    let currentIndex = pokemons.findIndex(function(pokemon) {
        return pokemon.id === cardID;
    });
    let newIndex = currentIndex - 1;

    if (newIndex >= 0) {
        let prevPokemon = pokemons[newIndex];
        let prevCardID = pokemon[newIndex];

        openBigCard(
            prevCardID,
            newIndex,
            capitalize(prevPokemon.name),
            prevPokemon.sprites.other['official-artwork'].front_default,
            capitalize(prevPokemon.species.name),
            prevPokemon.height,
            prevPokemon.weight
        );
    } else {
        closeBigCard(cardID);
    }
}

function nextCard(cardID) {
    let currentIndex = pokemons.findIndex(function(pokemon) {
        return pokemon.id === cardID;
    });
    let newIndex = currentIndex + 1;

    if (newIndex < pokemons.length) {
        let nextPokemon = pokemons[newIndex];
        let nextCardID = pokemon[newIndex];

        openBigCard(
            nextCardID,
            newIndex,
            capitalize(nextPokemon.name),
            nextPokemon.sprites.other['official-artwork'].front_default,
            capitalize(nextPokemon.species.name),
            nextPokemon.height,
            nextPokemon.weight
        );
    } else {
        closeBigCard(cardID);
    }
}
