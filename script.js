// === Import Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, deleteField } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// 🔥 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYYfL_0sDNJFOQF5C-IM8GBoCBJhDGCJ8",
  authDomain: "pokedex-1bef8.firebaseapp.com",
  projectId: "pokedex-1bef8",
  storageBucket: "pokedex-1bef8.firebasestorage.app",
  messagingSenderId: "241969962061",
  appId: "1:241969962061:web:4353435e151974372e1004"
};

// === Initialisation Firebase ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pokedexRef = doc(db, "pokedex", "shared");

// === Couleurs par type ===
const typeColors = {
  grass: "#78C850", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068",
  flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038",
  ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0",
  fairy: "#EE99AC", normal: "#A8A878"
};

// === Pokémon par numéro du nouveau jeu ===
const pokemonByNumber = [
  "Chikorita", "Bayleef", "Meganium", "Tepig", "Pignite", "Emboar",
  "Totodile", "Croconaw", "Feraligatr", "Fletchling", "Fletchinder", "Talonflame",
  "Bunnelby", "Diggersby", "Scatterbug", "Spewpa", "Vivillon", "Weedle", "Kakuna",
  "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Mareep", "Flaaffy", "Ampharos",
  "Patrat", "Watchog", "Budew", "Roselia", "Roserade", "Magikarp", "Gyarados",
  "Binacle", "Barbaracle", "Staryu", "Starmie", "Flabebe", "Floette", "Florges",
  "Skiddo", "Gogoat", "Espurr", "Meowstic", "Litleo", "Pyroar", "Pancham", "Pangoro",
  "Trubbish", "Garbodor", "Dedenne", "Pichu", "Pikachu", "Raichu", "Cleffa", "Clefairy",
  "Clefable", "Spinarak", "Ariados", "Ekans", "Arbok", "Abra", "Kadabra", "Alakazam",
  "Gastly", "Haunter", "Gengar", "Venipede", "Whirlipede", "Scolipede", "Honedge",
  "Doublade", "Aegislash-shield", // <-- Correction pour Aegislash
  "Bellsprout", "Weepinbell", "Victreebel", "Pansage",
  "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Meditite", "Medicham",
  "Electrike", "Manectric", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Houndour",
  "Houndoom", "Swablu", "Altaria", "Audino", "Spritzee", "Aromatisse", "Swirlix",
  "Slurpuff", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon",
  "Glaceon", "Sylveon", "Buneary", "Lopunny", "Shuppet", "Banette", "Vanillite",
  "Vanillish", "Vanilluxe", "Numel", "Camerupt", "Hippopotas", "Hippowdon", "Drilbur",
  "Excadrill", "Sandile", "Krokorok", "Krookodile", "Machop", "Machoke", "Machamp",
  "Gible", "Gabite", "Garchomp", "Carbink", "Sableye", "Mawile", "Absol", "Riolu",
  "Lucario", "Slowpoke", "Slowbro", "Slowking", "Carvanha", "Sharpedo", "Tynamo",
  "Eelektrik", "Eelektross", "Dratini", "Dragonair", "Dragonite", "Bulbasaur", "Ivysaur",
  "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise",
  "Stunfisk", "Furfrou", "Inkay", "Malamar", "Skrelp", "Dragalge", "Clauncher", "Clawitzer",
  "Goomy", "Sliggoo", "Goodra", "Delibird", "Snorunt", "Glalie", "Froslass", "Snover",
  "Abomasnow", "Bergmite", "Avalugg", "Scyther", "Scizor", "Pinsir", "Heracross", "Emolga",
  "Hawlucha", "Phantump", "Trevenant", "Scraggy", "Scrafty", "Noibat", "Noivern", "Klefki",
  "Litwick", "Lampent", "Chandelure", "Aerodactyl", "Tyrunt", "Tyrantrum", "Amaura",
  "Aurorus", "Onix", "Steelix", "Aron", "Lairon", "Aggron", "Helioptile", "Heliolisk",
  "Pumpkaboo", "Gourgeist", "Larvitar", "Pupitar", "Tyranitar", "Froakie", "Frogadier",
  "Greninja", "Falinks", "Chespin", "Quilladin", "Chesnaught", "Skarmory", "Fennekin",
  "Braixen", "Delphox", "Bagon", "Shelgon", "Salamence", "Kangaskhan", "Drampa", "Beldum",
  "Metang", "Metagross"
];

// === DOM ===
const pokedexDiv = document.getElementById("pokedex");
const addBtn = document.getElementById("add-btn");
const pokemonNameInput = document.getElementById("pokemon-name");
const trainerNameInput = document.getElementById("trainer-name");
const captureTimeInput = document.getElementById("capture-time");

const kirbNameEl = document.getElementById("kirb-name");
const plosionNameEl = document.getElementById("plosion-name");
const natzorNameEl = document.getElementById("natzor-name");
const curlyNameEl = document.getElementById("curly-name");

const kirbCount = document.getElementById("kirb-count");
const plosionCount = document.getElementById("plosion-count");
const natzorCount = document.getElementById("natzor-count");
const curlyCount = document.getElementById("curly-count");

const shinySound = new Audio("sounds/shiny.mp3");

let filteredTrainer = null;
let lastData = {}; // Stocke les dernières données du Pokédex pour le rendu et la suppression

// === Rendu Pokédex ===
function renderPokedex(data) {
  pokedexDiv.innerHTML = "";

  // --- Ordre du nouveau Pokédex ---
  // Utilise directement pokemonByNumber comme ordre pour éviter la duplication
  const newDexOrder = pokemonByNumber.map(name => name.toLowerCase());

  // --- Conversion de data en tableau [clé, valeur] ---
  const entries = Object.entries(data).filter(([name, info]) => name !== "init" && info.img);

  // --- Tri dans l'ordre du nouveau Pokédex ---
  entries.sort(([nameA], [nameB]) => {
    // Normalise les noms pour la comparaison (ex: "bulbizarre (♂)" -> "bulbizarre")
    const cleanNameA = nameA.split(" ")[0].replace(/[^\w]/g, "").toLowerCase();
    const cleanNameB = nameB.split(" ")[0].replace(/[^\w]/g, "").toLowerCase();

    const indexA = newDexOrder.indexOf(cleanNameA);
    const indexB = newDexOrder.indexOf(cleanNameB);

    // Les Pokémon non trouvés dans newDexOrder sont mis à la fin
    return (indexA === -1 ? 9999 : indexA) - (indexB === -1 ? 9999 : indexB);
  });

  // --- Affichage ---
  entries.forEach(([name, info]) => {
    // Filtrage par dresseur actif
    if (filteredTrainer && !info.caughtBy?.[filteredTrainer]) {
      return;
    }

    const color = typeColors[(info.type || "").split(",")[0]] || "#888";
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.style.background = `linear-gradient(180deg, ${color}cc, #111)`;
    card.style.border = `2px solid ${color}`;

    const trainers = Object.keys(info.caughtBy || {}).join(", ") || "?";

    card.innerHTML = `
      <div class="shine"></div>
      <img src="${info.img}" alt="${name}">
      <h3>${name}</h3>
      <p>Type : ${info.type || "?"}</p>
      <p>Capturé par : ${trainers}</p>
      ${info.firstCaptureTime ? `<p class="capture-time">⏰ ${info.firstCaptureTime}</p>` : ""}
      <button class="delete-btn" data-pokemon-name="${name}">X</button>
    `;
    pokedexDiv.appendChild(card);
  });

  // Attacher les écouteurs d'événements aux boutons de suppression APRES le rendu
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation(); // Empêche le clic de la carte de se déclencher
      const pokemonName = event.target.dataset.pokemonName;
      await showDeleteTrainerPopup(pokemonName);
    });
  });
}

// === Compteurs ===
function updateTrainerStats(data) {
  const kirbCaught = new Set();
  const plosionCaught = new Set();
  const natzorCaught = new Set();
  const curlyCaught = new Set();

  Object.values(data).forEach(pokemon => {
    if (pokemon.caughtBy) {
      if (pokemon.caughtBy.Kirb) kirbCaught.add(pokemon.id);
      if (pokemon.caughtBy.Plosion) plosionCaught.add(pokemon.id);
      if (pokemon.caughtBy.Natzor) natzorCaught.add(pokemon.id);
      if (pokemon.caughtBy.Curly) curlyCaught.add(pokemon.id);
    }
  });

  if (kirbCount) kirbCount.textContent = kirbCaught.size;
  if (plosionCount) plosionCount.textContent = plosionCaught.size;
  if (natzorCount) natzorCount.textContent = natzorCaught.size;
  if (curlyCount) curlyCount.textContent = curlyCaught.size;
}

// === Barre de progression ===
// === Barre de progression ===
function updateProgressBar(data) {
  const totalShiny = pokemonByNumber.length; // Utilise la taille de ton tableau de référence (227)
  const uniqueCaughtIds = new Set(); // On va stocker les IDs des Pokémon uniques capturés

  Object.values(data).forEach(pokemon => {
    // Un Pokémon est considéré comme capturé s'il a au moins un dresseur
    if (pokemon.caughtBy && Object.keys(pokemon.caughtBy).length > 0) {
      if (pokemon.id) { // Assure-toi que l'ID existe
        uniqueCaughtIds.add(pokemon.id);
      } else {
        // Fallback si un ancien Pokémon n'a pas d'ID, essaie de le déduire du nom (moins fiable)
        const pokemonNameKey = Object.keys(data).find(key => data[key] === pokemon);
        if (pokemonNameKey) {
            const cleanName = pokemonNameKey.split(" ")[0].replace(/[^\w]/g, "").toLowerCase();
            const indexInByNumber = pokemonByNumber.findIndex(n => n.toLowerCase() === cleanName);
            if (indexInByNumber !== -1) {
                // Si on le trouve par son nom dans la liste de référence, on peut utiliser son index + 1 comme "ID" temporaire
                uniqueCaughtIds.add(indexInByNumber + 1);
            }
        }
      }
    }
  });

  const current = uniqueCaughtIds.size; // Nombre d'IDs uniques capturés
  const percent = Math.min((current / totalShiny) * 100, 100).toFixed(1);

  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("progress-label");

  if (fill && label) {
    fill.style.width = `${percent}%`;
    label.textContent = `Progression : ${current} / ${totalShiny} (${percent}%)`;
  }
}

// === Firestore listener ===
onSnapshot(pokedexRef, snapshot => {
  const data = snapshot.exists() ? snapshot.data() : {};
  lastData = data; // Met à jour lastData avec les dernières données
  updateTrainerStats(data);
  updateProgressBar(data);
  renderPokedex(data);
  applyActiveTrainerClass();
}, (error) => {
  console.error("Erreur de lecture Firestore:", error);
  // Gérer l'erreur, par exemple afficher un message à l'utilisateur
});

// === Ajouter Pokémon ===
async function addShinyPokemon() {
  const input = pokemonNameInput.value.trim().toLowerCase();
  const trainerName = trainerNameInput.value.trim();
  const captureTime = captureTimeInput.value || new Date().toLocaleString("fr-FR", {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }); // Format français

  if (!input) return alert("Veuillez entrer un nom, ID ou numéro.");
  if (!trainerName) return alert("Veuillez sélectionner un dresseur.");

  let pokemonNameToFetch = ""; // Nom utilisé pour la requête à PokeAPI

  // Si c'est un numéro du nouveau jeu
  if (/^\d+$/.test(input)) {
    const num = parseInt(input, 10);
    if (num >= 1 && num <= pokemonByNumber.length) {
      pokemonNameToFetch = pokemonByNumber[num - 1].toLowerCase();
    } else {
      alert(`Numéro de Pokémon invalide ! (entre 1 et ${pokemonByNumber.length})`);
      return;
    }
  } else {
    pokemonNameToFetch = input;
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameToFetch}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Pokémon "${pokemonNameToFetch}" introuvable sur PokeAPI ! Vérifiez l'orthographe ou le nom de forme.`);
      }
      throw new Error(`Erreur lors de la récupération du Pokémon: ${res.statusText}`);
    }
    const data = await res.json();

    const name = data.name; // Nom de base du Pokémon selon l'API
    const types = data.types.map(t => t.type.name).join(", ");

    const forms = [];
    if (data.sprites.front_shiny) forms.push({ label: `${name} (♂)`, img: data.sprites.front_shiny });
    if (data.sprites.front_shiny_female) forms.push({ label: `${name} (♀)`, img: data.sprites.front_shiny_female });

    let selectedForm = forms.length > 1 ? await chooseForm(forms) : (forms[0] || { label: name, img: data.sprites.front_shiny || data.sprites.front_default });
    if (!selectedForm) return; // Si l'utilisateur annule la sélection de forme

    const shinyImg = selectedForm.img;
    const formLabel = selectedForm.label; // Ex: "bulbizarre (♂)"

    const snapshot = await getDoc(pokedexRef);
    const currentData = snapshot.exists() ? snapshot.data() : {};

    if (currentData[formLabel]) {
      // Le Pokémon (sous cette forme) existe déjà dans le Pokédex
      if (currentData[formLabel].caughtBy?.[trainerName]) {
        alert(`${trainerName} a déjà attrapé ${formLabel} !`);
        return;
      }
      // Ajoute le dresseur au Pokémon existant
      currentData[formLabel].caughtBy[trainerName] = { time: captureTime };
    } else {
      // Nouveau Pokémon (sous cette forme) à ajouter
      currentData[formLabel] = {
        id: data.id, // L'ID numérique de l'API
        name: data.name, // Le nom de base (ex: "bulbasaur")
        img: shinyImg,
        type: types,
        firstCaptureTime: captureTime, // Première capture enregistrée pour cette forme
        caughtBy: {
          [trainerName]: { time: captureTime } // Le dresseur actuel
        }
      };
    }

    await setDoc(pokedexRef, currentData);
    shinySound.play().catch(e => console.log("Erreur de lecture audio:", e));
    alert(`${formLabel} a été ajouté pour ${trainerName} !`);

    pokemonNameInput.value = "";
    trainerNameInput.value = "";
    captureTimeInput.value = "";
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// === Popup mâle/femelle ===
function chooseForm(forms) {
  return new Promise(resolve => {
    // Utilise les éléments existants dans le HTML si tu en as (form-selector, form-selector-content, etc.)
    // Sinon, crée-les dynamiquement comme avant.
    // Pour cet exemple, je suppose que tu as la structure HTML définie pour #form-selector.
    const formSelector = document.getElementById("form-selector");
    const formOptionsDiv = document.getElementById("form-options");
    const formSelectorTitle = document.querySelector("#form-selector-content h3");
    const cancelFormButton = document.getElementById("cancel-form");

    if (!formSelector || !formOptionsDiv || !formSelectorTitle || !cancelFormButton) {
      console.error("Éléments HTML pour le sélecteur de forme introuvables. Création dynamique.");
      // Fallback à la création dynamique si les éléments HTML ne sont pas là
      // C'est le même code que j'ai donné précédemment pour chooseForm si tu n'as pas le HTML.
      // Je laisse cette partie de côté pour ne pas alourdir, si tu as le HTML, c'est mieux.
      // Pour l'instant, si les éléments ne sont pas là, on choisit la première forme
      resolve(forms[0]);
      return;
    }

    formOptionsDiv.innerHTML = ""; // Vide les options précédentes
    formSelectorTitle.textContent = `Choisir une forme pour votre Pokémon :`; // Met à jour le titre

    forms.forEach(form => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "form-option";
      optionDiv.innerHTML = `
        <img src="${form.img}" alt="${form.label}">
        <p class="form-name">${form.label}</p>
      `;
      optionDiv.addEventListener("click", () => {
        formSelector.classList.add("hidden"); // Cache l'overlay
        resolve(form);
      });
      formOptionsDiv.appendChild(optionDiv);
    });

    cancelFormButton.onclick = () => {
      formSelector.classList.add("hidden"); // Cache l'overlay
      resolve(null);
    };

    formSelector.classList.remove("hidden"); // Affiche l'overlay

    // Pour l'animation de popIn, on peut relancer l'animation
    const formSelectorContent = document.getElementById("form-selector-content");
    if (formSelectorContent) {
        formSelectorContent.style.animation = 'none'; // Reset animation
        void formSelectorContent.offsetWidth; // Trigger reflow
        formSelectorContent.style.animation = ''; // Re-apply animation
    }
  });
}


// === GESTION DE LA SUPPRESSION ===

// Fonction pour supprimer un dresseur d'un Pokémon ou le Pokémon entier
async function removeTrainerOrPokemon(pokemonName, trainerToRemove) {
  const snapshot = await getDoc(pokedexRef);
  let currentData = snapshot.exists() ? snapshot.data() : {};

  if (!currentData[pokemonName]) {
    alert("Pokémon introuvable dans la base de données.");
    return;
  }

  // Si un dresseur est spécifié, on le supprime de la liste caughtBy
  if (trainerToRemove && currentData[pokemonName].caughtBy?.[trainerToRemove]) {
    // Utilise deleteField de Firebase pour une suppression propre d'un champ
    // Cependant, pour des sous-objets, il faut récupérer l'objet, le modifier, puis le re-sauvegarder
    const updatedCaughtBy = { ...currentData[pokemonName].caughtBy }; // Copie l'objet
    delete updatedCaughtBy[trainerToRemove]; // Supprime le dresseur

    // Si après suppression, il n'y a plus aucun dresseur pour ce Pokémon, supprime toute la carte
    if (Object.keys(updatedCaughtBy).length === 0) {
      delete currentData[pokemonName]; // Supprime le Pokémon entier
      alert(`${pokemonName} a été supprimé du Pokédex.`);
    } else {
      // Met à jour l'objet caughtBy pour ce Pokémon
      currentData[pokemonName].caughtBy = updatedCaughtBy;
      alert(`${trainerToRemove} a été retiré de ${pokemonName}.`);
    }
  } else {
    // Cas d'erreur ou si le dresseur n'était pas trouvé pour une raison quelconque
    alert(`Le dresseur ${trainerToRemove} n'a pas capturé ${pokemonName} ou le Pokémon a déjà été retiré.`);
    return;
  }

  await setDoc(pokedexRef, currentData); // Sauvegarde les modifications dans Firebase
}


// Fonction pour afficher la popup de sélection du dresseur à supprimer
function showDeleteTrainerPopup(pokemonName) {
  return new Promise(resolve => {
    // lastData contient déjà toutes les informations du Pokédex
    const pokemonInfo = lastData[pokemonName];

    if (!pokemonInfo || !pokemonInfo.caughtBy || Object.keys(pokemonInfo.caughtBy).length === 0) {
      alert("Ce Pokémon n'a aucun dresseur enregistré.");
      resolve(null);
      return;
    }

    const caughtByTrainers = Object.keys(pokemonInfo.caughtBy);

    const overlay = document.createElement("div");
    overlay.className = "delete-trainer-overlay";

    const popup = document.createElement("div");
    popup.className = "delete-trainer-popup";
    popup.innerHTML = `<h4>Qui a relâché ${pokemonName} ?</h4>`;

    caughtByTrainers.forEach(trainer => {
      const trainerButton = document.createElement("button");
      trainerButton.className = "trainer-button";
      trainerButton.textContent = `Retirer ${trainer}`;
      trainerButton.addEventListener("click", async () => {
        document.body.removeChild(overlay);
        await removeTrainerOrPokemon(pokemonName, trainer);
        resolve(trainer);
      });
      popup.appendChild(trainerButton);
    });

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "Annuler";
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(null);
    });
    popup.appendChild(cancelButton);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}

// === Ajout bouton "Ajouter Pokémon" ===
if (addBtn) addBtn.addEventListener("click", addShinyPokemon);

// === Filtrage par dresseur ===
function applyActiveTrainerClass() {
  [kirbNameEl, plosionNameEl, natzorNameEl, curlyNameEl].forEach(el => el && el.classList.remove("active-trainer"));
  if (!filteredTrainer) return;

  const map = { Kirb: kirbNameEl, Plosion: plosionNameEl, Natzor: natzorNameEl, Curly: curlyNameEl };
  map[filteredTrainer] && map[filteredTrainer].classList.add("active-trainer");
}

[kirbNameEl, plosionNameEl, natzorNameEl, curlyNameEl].forEach(el => {
  if (!el) return;
  el.style.cursor = "pointer";
  el.addEventListener("click", () => {
    const trainer = el.id === "kirb-name" ? "Kirb" :
                    el.id === "plosion-name" ? "Plosion" :
                    el.id === "natzor-name" ? "Natzor" :
                    "Curly";
    filteredTrainer = filteredTrainer === trainer ? null : trainer;
    renderPokedex(lastData);
    applyActiveTrainerClass();
  });
});

// === Effet holographique ===
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".pokemon-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);
  });
});