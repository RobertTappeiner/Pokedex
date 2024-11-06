function templateRenderCards(i, mainType, cardID, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    return /*html*/`
    <div class="card-small ${mainType}" id="card_small_${cardID}" onclick="openBigCard(${cardID}, ${i}, '${pokemonName}', '${pokemonImage}', '${pokemonSpecies}', '${pokemonHeight}', '${pokemonWeight}')">
        <h1>${pokemonName}</h1>
        <div class="image"><img src="${pokemonImage}" alt=""></div>
        <h3>TYPE:</h3>
        <div class="properties-overview" id="properties-overview-${cardID}"></div>
    </div>
    `
}

function returnHTMLBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    let pokemonTypes = pokemons.find(function(pokemon) {
        return pokemon.id === cardID;
    }).types;
    let mainType = pokemonTypes[0].type.name;

    return /*html*/`
    <div class="dialog-bg" id="dialog_${cardID}">
    
    <div class="arrow">
        <img id="arrow-left" class="left" src="./img/pokemon_arrow_left.svg" onclick="previousCard(${cardID})">
    </div>

    <div class="card-big ${mainType}">
        <h1>${pokemonName}</h1>
        <div class="close">        
        <img id="close-icon" src="./img/pokemon_x.svg" onclick="closeBigCard('${cardID}')">
        </div>
        <div class="image"><img src="${pokemonImage}" alt=""></div>
        <h3>TYPE:</h3>
        <div class="properties-overview" id="properties-overview-bc-${cardID}"></div>
            <div class="details">
                <div class="card-menu">
                    <div class="menu-item" id="menu-skills" onclick="openTabSkills()">Skills</div>
                    <div class="menu-item" id="menu-stats" onclick="openTabStats()">Stats</div>
                </div>
                <div class="property-details" id="skills">
                    <div><b>Species: </b>${pokemonSpecies}</div>
                    <div><b>Height: </b>${((pokemonHeight) / 10).toFixed(1)}m</div>
                    <div><b>Weight: </b>${((pokemonWeight) / 10).toFixed(1)}kg</div>
                <div class="abilities" id="abilities${cardID}"><div><b>Abilities: </b></div></div>
                </div>
                <div class="property-details" id="base-stats"><div>
            <canvas id="base-stats-charts"></canvas>
            </div>
        </div>
        </div>
    </div>

    <div class="arrow">
        <img id="arrow-right" class="right" src="./img/pokemon_arrow_right.svg" onclick="nextCard(${cardID})">
    </div>
    
    </div>`;
}

async function showChart(cardID) {
    let ctx = document.getElementById('base-stats-charts');

    let currentPokemon;
    let found = false;
    for (let i = 0; i < pokemons.length && !found; i++) {
        if (pokemons[i].id === cardID) {
            currentPokemon = pokemons[i];
            found = true;
        }
    }

    let baseStats = [];
    let labels = [];
    for (let i = 0; i < currentPokemon.stats.length; i++) {
        baseStats.push(currentPokemon.stats[i].base_stat);
        labels.push(capitalize(currentPokemon.stats[i].stat.name));
    }

    if (ctx.chart) {
        ctx.chart.destroy();
    }

    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: baseStats,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        autoSkip: false,
                    }
                }
            }
        }
    });
}