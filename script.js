// === Import Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

// === DOM ===
const pokedexDiv = document.getElementById("pokedex");
const addBtn = document.getElementById("add-btn");
const pokemonNameInput = document.getElementById("pokemon-name");
const trainerNameInput = document.getElementById("trainer-name");
const captureTimeInput = document.getElementById("capture-time");

const kirbNameEl = document.getElementById("kirb-name");
const plosionNameEl = document.getElementById("plosion-name");
const natzorNameEl = document.getElementById("natzor-name");
const kirbCount = document.getElementById("kirb-count");
const plosionCount = document.getElementById("plosion-count");
const natzorCount = document.getElementById("natzor-count");

// Audio shiny
const shinySound = new Audio("sounds/shiny.mp3");

// === State ===
let filteredTrainer = null;
let lastData = {};

// === Affichage Pokédex ===
function renderPokedex(data) {
  pokedexDiv.innerHTML = "";

  Object.entries(data)
    .sort(([a, A], [b, B]) => (A.id || 0) - (B.id || 0))
    .forEach(([name, info]) => {
      if (name === "init" || !info.img) return;
      if (filteredTrainer && !info.caughtBy?.[filteredTrainer]) return;

      const color = typeColors[(info.type || "").split(",")[0]] || "#888";
      const card = document.createElement("div");
      card.className = "pokemon-card new";
      card.style.background = `linear-gradient(180deg, ${color}cc, #111)`;
      card.style.border = `2px solid ${color}`;

      if (Object.keys(info.caughtBy || {}).length > 0) {
        card.classList.add("shiny-flash");
        setTimeout(() => card.classList.remove("shiny-flash"), 600);
        card.classList.add("shiny-ray");
        setTimeout(() => card.classList.remove("shiny-ray"), 800);
      }

      const trainers = Object.keys(info.caughtBy || {}).join(", ") || "?";

      card.innerHTML = `
        <div class="shine"></div>
        <img src="${info.img}" alt="${name}">
        <h3>${name}</h3>
        <p>Type : ${info.type || "?"}</p>
        <p>Capturé par : ${trainers}</p>
        ${info.firstCaptureTime ? `<p class="capture-time">⏰ ${info.firstCaptureTime}</p>` : ""}
      `;

      pokedexDiv.appendChild(card);
      setTimeout(() => card.classList.remove("new"), 600);
    });
}

// === Mise à jour des compteurs ===
function updateTrainerStats(data) {
  const kirbCaught = new Set();
  const plosionCaught = new Set();
  const natzorCaught = new Set();

  Object.values(data).forEach(pokemon => {
    if (pokemon.caughtBy) {
      if (pokemon.caughtBy.Kirb) kirbCaught.add(pokemon.id);
      if (pokemon.caughtBy.Plosion) plosionCaught.add(pokemon.id);
      if (pokemon.caughtBy.Natzor) natzorCaught.add(pokemon.id);
    }
  });

  kirbCount.textContent = kirbCaught.size;
  plosionCount.textContent = plosionCaught.size;
  natzorCount.textContent = natzorCaught.size;
}

function updateProgressBar(data) {
  const totalShiny = 230; // objectif total
  const uniqueCaught = new Set();

  Object.values(data).forEach(pokemon => {
    if (pokemon.caughtBy && Object.keys(pokemon.caughtBy).length > 0) {
      uniqueCaught.add(pokemon.id);
    }
  });

  const current = uniqueCaught.size;
  const percent = Math.min((current / totalShiny) * 100, 100).toFixed(1);

  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("progress-label");

  if (fill && label) {
    fill.style.width = `${percent}%`;
    label.textContent = `Progression : ${current} / ${totalShiny} (${percent}%)`;
  }
}


// === Listener Firestore ===
onSnapshot(pokedexRef, snapshot => {
  const data = snapshot.exists() ? snapshot.data() : {};
  lastData = data;
  updateTrainerStats(data);
  updateProgressBar(data); // ⬅️ AJOUT ICI
  renderPokedex(data);
  applyActiveTrainerClass();
});

// === Ajouter Pokémon (mâle/femelle) ===
async function addShinyPokemon() {
  const inputName = pokemonNameInput.value.trim().toLowerCase();
  const trainerName = trainerNameInput.value.trim();
  const captureTime = captureTimeInput.value || new Date().toLocaleString();

  if (!inputName) return alert("Veuillez entrer un nom ou ID du Pokémon.");
  if (!trainerName) return alert("Veuillez sélectionner un dresseur.");

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputName}`);
    if (!res.ok) throw new Error("Pokémon introuvable !");
    const data = await res.json();

    const name = data.name;
    const types = data.types.map(t => t.type.name).join(", ");

    const forms = [];
    if (data.sprites.front_shiny) forms.push({ label: `${name} (♂)`, img: data.sprites.front_shiny });
    if (data.sprites.front_shiny_female) forms.push({ label: `${name} (♀)`, img: data.sprites.front_shiny_female });

    let selectedForm = forms.length > 1 ? await chooseForm(forms) : forms[0];
    if (!selectedForm) return;

    const shinyImg = selectedForm.img;
    const formLabel = selectedForm.label;

    const snapshot = await getDoc(pokedexRef);
    const currentData = snapshot.exists() ? snapshot.data() : {};

    if (currentData[formLabel]) {
      if (currentData[formLabel].caughtBy?.[trainerName]) {
        alert(`${trainerName} a déjà attrapé ${formLabel} !`);
        return;
      }
      currentData[formLabel].caughtBy[trainerName] = { time: captureTime };
    } else {
      currentData[formLabel] = {
        id: data.id,
        img: shinyImg,
        type: types,
        firstCaptureTime: captureTime,
        caughtBy: { [trainerName]: { time: captureTime } }
      };
    }

    await setDoc(pokedexRef, currentData);
    shinySound.play().catch(e => console.log(e));

    pokemonNameInput.value = "";
    trainerNameInput.value = "";
    captureTimeInput.value = "";

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// === Popup choix mâle/femelle ===
function chooseForm(forms) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.style = `
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;
    `;

    const container = document.createElement("div");
    container.style = `
      background:#1c1c1c; padding:1.5em; border-radius:16px; display:flex; gap:1.5em;
      box-shadow:0 0 15px rgba(255,255,255,0.2);
    `;

    forms.forEach(form => {
      const card = document.createElement("div");
      card.style = "cursor:pointer; text-align:center; color:white; transition: transform 0.2s";
      card.innerHTML = `<img src="${form.img}" style="width:96px;height:96px;"><p>${form.label}</p>`;
      card.addEventListener("mouseenter", () => card.style.transform="scale(1.1)");
      card.addEventListener("mouseleave", () => card.style.transform="scale(1)");
      card.addEventListener("click", () => { document.body.removeChild(overlay); resolve(form); });
      container.appendChild(card);
    });

    const cancel = document.createElement("button");
    cancel.textContent = "Annuler";
    cancel.style = `
      position:absolute; bottom:2em; background:#444; color:white;
      padding:0.5em 1.2em; border-radius:8px; border:none; cursor:pointer;
    `;
    cancel.onclick = () => { document.body.removeChild(overlay); resolve(null); };

    overlay.appendChild(container);
    overlay.appendChild(cancel);
    document.body.appendChild(overlay);
  });
}

// === Bouton ajouter ===
if (addBtn) addBtn.addEventListener("click", addShinyPokemon);

// === Classe active sur nom filtré ===
function applyActiveTrainerClass() {
  [kirbNameEl, plosionNameEl, natzorNameEl].forEach(el => el?.classList.remove("active-trainer"));
  if (!filteredTrainer) return;
  const map = { Kirb: kirbNameEl, Plosion: plosionNameEl, Natzor: natzorNameEl };
  map[filteredTrainer]?.classList.add("active-trainer");
}

// === Filtrage par dresseur ===
[kirbNameEl, plosionNameEl, natzorNameEl].forEach(el => {
  if (!el) return;
  el.style.cursor = "pointer";
  el.addEventListener("click", () => {
    const trainer = el.id === "kirb-name" ? "Kirb" : el.id === "plosion-name" ? "Plosion" : "Natzor";
    filteredTrainer = filteredTrainer === trainer ? null : trainer;
    renderPokedex(lastData);
    applyActiveTrainerClass();
  });
});

// === Effet holographique ===
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".pokemon-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left)/rect.width)*100;
    const y = ((e.clientY - rect.top)/rect.height)*100;
    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);
  });
});
