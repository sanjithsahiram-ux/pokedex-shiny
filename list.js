// === Liste des 227 Pokémon (ordre du jeu) ===
const pokemonNames = [
  "Chikorita","Bayleef","Meganium","Tepig","Pignite","Emboar","Totodile","Croconaw","Feraligatr","Fletchling","Fletchinder","Talonflame","Bunnelby","Diggersby","Scatterbug","Spewpa","Vivillon","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Mareep","Flaaffy","Ampharos","Patrat","Watchog","Budew","Roselia","Roserade","Magikarp","Gyarados","Binacle","Barbaracle","Staryu","Starmie","Flabebe","Floette","Florges","Skiddo","Gogoat","Espurr","Meowstic","Litleo","Pyroar","Pancham","Pangoro","Trubbish","Garbodor","Dedenne","Pichu","Pikachu","Raichu","Cleffa","Clefairy","Clefable","Spinarak","Ariados","Ekans","Arbok","Abra","Kadabra","Alakazam","Gastly","Haunter","Gengar","Venipede","Whirlipede","Scolipede","Honedge","Doublade","Aegislash","Bellsprout","Weepinbell","Victreebel","Pansage","Simisage","Pansear","Simisear","Panpour","Simipour","Meditite","Medicham","Electrike","Manectric","Ralts","Kirlia","Gardevoir","Gallade","Houndour","Houndoom","Swablu","Altaria","Audino","Spritzee","Aromatisse","Swirlix","Slurpuff","Eevee","Vaporeon","Jolteon","Flareon","Espeon","Umbreon","Leafeon","Glaceon","Sylveon","Buneary","Lopunny","Shuppet","Banette","Vanillite","Vanillish","Vanilluxe","Numel","Camerupt","Hippopotas","Hippowdon","Drilbur","Excadrill","Sandile","Krokorok","Krookodile","Machop","Machoke","Machamp","Gible","Gabite","Garchomp","Carbink","Sableye","Mawile","Absol","Riolu","Lucario","Slowpoke","Slowbro","Slowking","Carvanha","Sharpedo","Tynamo","Eelektrik","Eelektross","Dratini","Dragonair","Dragonite","Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Stunfisk","Furfrou","Inkay","Malamar","Skrelp","Dragalge","Clauncher","Clawitzer","Goomy","Sliggoo","Goodra","Delibird","Snorunt","Glalie","Froslass","Snover","Abomasnow","Bergmite","Avalugg","Scyther","Scizor","Pinsir","Heracross","Emolga","Hawlucha","Phantump","Trevenant","Scraggy","Scrafty","Noibat","Noivern","Klefki","Litwick","Lampent","Chandelure","Aerodactyl","Tyrunt","Tyrantrum","Amaura","Aurorus","Onix","Steelix","Aron","Lairon","Aggron","Helioptile","Heliolisk","Pumpkaboo","Gourgeist","Larvitar","Pupitar","Tyranitar","Froakie","Frogadier","Greninja","Falinks","Chespin","Quilladin","Chesnaught","Skarmory","Fennekin","Braixen","Delphox","Bagon","Shelgon","Salamence","Kangaskhan","Drampa","Beldum","Metang","Metagross"
];

const grid = document.getElementById("pokemonGrid");
const search = document.getElementById("search");

let pokemons = [];

// Récupérer le sprite shiny via PokéAPI
async function fetchPokemonData(name, num) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    return {
      num,
      name,
      img: data.sprites.front_shiny || data.sprites.front_default
    };
  } catch (err) {
    console.error("Erreur pour", name, err);
    return {
      num,
      name,
      img: "https://via.placeholder.com/96?text=?"
    };
  }
}

// Affichage dans la grille
function displayPokemons(list) {
  grid.innerHTML = list.map(p => `
    <div class="pokemon-card">
      <div class="pokemon-number">#${p.num}</div>
      <img src="${p.img}" alt="${p.name}">
      <div>${p.name}</div>
    </div>
  `).join("");
}

// Recherche par numéro
search.addEventListener("input", e => {
  const value = e.target.value.trim();
  if (value === "") displayPokemons(pokemons);
  else {
    const filtered = pokemons.filter(p => p.num === Number(value));
    displayPokemons(filtered);
  }
});

// Chargement de tous les Pokémon en parallèle
async function loadAll() {
  const promises = pokemonNames.map((name, i) => fetchPokemonData(name, i + 1));
  pokemons = await Promise.all(promises);
  displayPokemons(pokemons); // Affiche tout d'un coup
}

loadAll();
