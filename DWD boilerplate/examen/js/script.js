/* =============================================================
   Recipe Finder – script.js
   Structuur (verplicht door cursus):
     1. DECLARATIES   – constanten, DOM-referenties, globale state
     2. FUNCTIES      – alle logica en rendering
     3. EVENT HANDLERS – functies gekoppeld aan events
     4. EVENTS KOPPELEN – addEventListener-calls
   ============================================================= */
 
/* ======================== 1. DECLARATIES ======================== */
 
// Base-URL van TheMealDB API (gratis v1, geen API-key nodig)
const API_ZOEK_URL  = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const API_DETAIL_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
 
// Maximaal aantal te tonen recepten per zoekactie
const MAX_RESULTATEN = 20;
 
// localStorage-sleutel voor favorieten
const OPSLAG_SLEUTEL = "recipeFinder_favorieten";
 
// DOM-referenties
const zoekInput          = document.querySelector("#zoekInput");
const zoekKnop           = document.querySelector("#zoekKnop");
const resultatenContainer = document.querySelector("#resultatenContainer");
const statusBericht      = document.querySelector("#statusBericht");
const modalOverlay       = document.querySelector("#modalOverlay");
const modalSluit         = document.querySelector("#modalSluit");
const modalInhoud        = document.querySelector("#modalInhoud");
 
// Globale state: object met favoriete recepten
// Structuur: { [idMaaltijd]: { id, naam, thumbnail } }
let favorieten = {};
 
 
/* ======================== 2. FUNCTIES ======================== */
 
/**
 * Laadt favorieten uit localStorage bij het opstarten van de app.
 * Vult de globale `favorieten`-variabele.
 */
function laadFavorieten() {
  const opgeslagen = localStorage.getItem(OPSLAG_SLEUTEL);
  if (opgeslagen) {
    favorieten = JSON.parse(opgeslagen);
  }
}
 
/**
 * Slaat de huidige `favorieten`-variabele op in localStorage.
 */
function slaFavorietenOp() {
  localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(favorieten));
}
 
/**
 * Voegt een recept toe aan favorieten of verwijdert het.
 * Past het hartje-icoon direct aan in alle kaarten die hetzelfde recept tonen.
 *
 * @param {string} id        - Uniek ID van de maaltijd (idMeal)
 * @param {string} naam      - Naam van de maaltijd (strMeal)
 * @param {string} thumbnail - URL van de thumbnail (strMealThumb)
 */
function toggleFavoriet(id, naam, thumbnail) {
  if (favorieten[id]) {
    // Recept staat al in favorieten → verwijderen
    delete favorieten[id];
  } else {
    // Recept staat nog niet in favorieten → toevoegen
    favorieten[id] = { id: id, naam: naam, thumbnail: thumbnail };
  }
 
  // Sla de bijgewerkte staat op in localStorage
  slaFavorietenOp();
 
  // Werk alle hartje-knoppen bij die dit recept-ID hebben
  // (kan meerdere keren voorkomen als resultaten opnieuw gerenderd zijn)
  const alleHartjes = document.querySelectorAll(".favoriet-knop[data-id='" + id + "']");
  alleHartjes.forEach(function(knop) {
    pasHartjeAan(knop, favorieten[id] !== undefined);
  });
}
 
/**
 * Wijzigt het uiterlijk van een hartje-knop op basis van favoriet-status.
 *
 * @param {HTMLElement} knop      - De hartje-knop (<button>)
 * @param {boolean}     isActief  - true = favoriet (rood), false = niet favoriet (grijs)
 */
function pasHartjeAan(knop, isActief) {
  if (isActief) {
    knop.textContent = "♥";           // gevuld hart
    knop.classList.add("actief");
    knop.setAttribute("aria-label", "Verwijder uit favorieten");
  } else {
    knop.textContent = "♡";           // leeg hart
    knop.classList.remove("actief");
    knop.setAttribute("aria-label", "Voeg toe aan favorieten");
  }
}
 
/**
 * Toont een status- of foutbericht boven de resultaten.
 * Verbergt het bericht automatisch als de tekst leeg is.
 *
 * @param {string}  bericht - De tekst om weer te geven
 * @param {boolean} isFout  - true = rode fout-stijl, false = gele waarschuwing
 */
function toonStatusBericht(bericht, isFout) {
  if (!bericht) {
    statusBericht.classList.add("verborgen");
    return;
  }
 
  statusBericht.textContent = bericht;
  statusBericht.classList.remove("verborgen");
 
  if (isFout) {
    statusBericht.classList.add("fout");
  } else {
    statusBericht.classList.remove("fout");
  }
}
 
/**
 * Maakt één receptkaart-element op basis van een maaltijd-object van de API.
 *
 * @param {Object} maaltijd - Maaltijdobject uit TheMealDB (idMeal, strMeal, ...)
 * @returns {HTMLElement} - Het <article>-element van de kaart
 */
function maakKaartElement(maaltijd) {
  const id        = maaltijd.idMeal;
  const naam      = maaltijd.strMeal;
  const thumbnail = maaltijd.strMealThumb;
  const categorie = maaltijd.strCategory || "Onbekend";
  const regio     = maaltijd.strArea    || "Onbekend";
 
  // Bepaal of dit recept al in favorieten staat
  const isActief = favorieten[id] !== undefined;
 
  // Maak het kaart-element
  const artikel = document.createElement("article");
  artikel.classList.add("recept-kaart");
  artikel.setAttribute("data-id", id);
 
  // Thumbnail
  const afbeelding = document.createElement("img");
  afbeelding.src        = thumbnail;
  afbeelding.alt        = naam;
  afbeelding.classList.add("kaart-thumbnail");
  afbeelding.loading    = "lazy";
 
  // Tekstdeel
  const body = document.createElement("div");
  body.classList.add("kaart-body");
 
  const naamEl = document.createElement("h2");
  naamEl.classList.add("kaart-naam");
  naamEl.textContent = naam;
 
  const metaEl = document.createElement("p");
  metaEl.classList.add("kaart-meta");
  metaEl.textContent = categorie + " · " + regio;
 
  body.appendChild(naamEl);
  body.appendChild(metaEl);
 
  // Acties-rij: hartje + details-knop
  const acties = document.createElement("div");
  acties.classList.add("kaart-acties");
 
  // Hartje-knop
  const hartjeKnop = document.createElement("button");
  hartjeKnop.classList.add("favoriet-knop");
  hartjeKnop.setAttribute("data-id", id);
  hartjeKnop.setAttribute("data-naam", naam);
  hartjeKnop.setAttribute("data-thumb", thumbnail);
  // Stel het juiste uiterlijk in op basis van huidige favoriet-status
  pasHartjeAan(hartjeKnop, isActief);
 
  // Details-knop
  const detailsKnop = document.createElement("button");
  detailsKnop.classList.add("details-knop");
  detailsKnop.textContent = "Details";
  detailsKnop.setAttribute("data-id", id);
  detailsKnop.setAttribute("aria-label", "Details van " + naam);
 
  acties.appendChild(hartjeKnop);
  acties.appendChild(detailsKnop);
 
  // Stel de volledige kaart samen
  artikel.appendChild(afbeelding);
  artikel.appendChild(body);
  artikel.appendChild(acties);
 
  return artikel;
}
 
/**
 * Rendert maximaal MAX_RESULTATEN receptkaarten in de resultatencontainer.
 * Verwijdert eerst alle bestaande kaarten.
 *
 * @param {Array} maaltijden - Array van maaltijdobjecten van de API
 */
function toonReceptKaarten(maaltijden) {
  // Verwijder vorige resultaten
  resultatenContainer.innerHTML = "";
 
  // Beperk tot MAX_RESULTATEN
  const zichtbaar = maaltijden.slice(0, MAX_RESULTATEN);
 
  zichtbaar.forEach(function(maaltijd) {
    const kaart = maakKaartElement(maaltijd);
    resultatenContainer.appendChild(kaart);
  });
}
 
/**
 * Bouwt een <ul> met ingrediënten + maten op basis van de API-velden.
 * TheMealDB gebruikt genummerde velden: strIngredient1..20 en strMeasure1..20.
 * Lege of null-waarden worden overgeslagen.
 *
 * @param {Object} maaltijd - Volledig maaltijdobject van de detail-API
 * @returns {HTMLUListElement} - Lijst met ingrediënten
 */
function bouwIngredienten(maaltijd) {
  const lijst = document.createElement("ul");
  lijst.classList.add("ingredienten-lijst");
 
  for (let i = 1; i <= 20; i++) {
    const ingredient = maaltijd["strIngredient" + i];
    const maat       = maaltijd["strMeasure"    + i];
 
    // Sla over als het ingredient leeg of null is
    if (!ingredient || ingredient.trim() === "") {
      continue;
    }
 
    const item = document.createElement("li");
 
    const maatSpan = document.createElement("span");
    maatSpan.classList.add("ingredient-maat");
    maatSpan.textContent = maat ? maat.trim() : "–";
 
    const naamSpan = document.createElement("span");
    naamSpan.textContent = ingredient.trim();
 
    item.appendChild(maatSpan);
    item.appendChild(naamSpan);
    lijst.appendChild(item);
  }
 
  return lijst;
}
 
/**
 * Opent de modal en vult deze met de volledige details van een recept.
 * Haalt de detailgegevens op via de API op basis van het recept-ID.
 *
 * @param {string} id - Het idMeal van het te tonen recept
 */
async function toonDetails(id) {
  // Reset en toon de modal met een laad-indicator
  modalInhoud.innerHTML = "<p class='laden-tekst'>Recept laden…</p>";
  modalOverlay.classList.remove("verborgen");
  document.body.style.overflow = "hidden";  // Voorkom scrollen achter de modal
 
  try {
    // Haal de volledige receptgegevens op
    const antwoord = await fetch(API_DETAIL_URL + id);
 
    if (!antwoord.ok) {
      throw new Error("HTTP-fout: " + antwoord.status);
    }
 
    const data = await antwoord.json();
 
    // null-check: API geeft { meals: null } terug als ID niet bestaat
    if (!data.meals) {
      modalInhoud.innerHTML = "<p>Recept niet gevonden.</p>";
      return;
    }
 
    const maaltijd = data.meals[0];
 
    // Bouw de modalinhoud op
    modalInhoud.innerHTML = "";
 
    // Grote afbeelding
    const afbeelding = document.createElement("img");
    afbeelding.src     = maaltijd.strMealThumb;
    afbeelding.alt     = maaltijd.strMeal;
    afbeelding.classList.add("modal-afbeelding");
 
    // Naam
    const naam = document.createElement("h2");
    naam.id          = "modalTitel";
    naam.classList.add("modal-naam");
    naam.textContent = maaltijd.strMeal;
 
    // Badges: categorie + regio
    const badges = document.createElement("div");
    badges.classList.add("modal-badges");
 
    const badgeCategorie = document.createElement("span");
    badgeCategorie.classList.add("badge");
    badgeCategorie.textContent = "🍴 " + (maaltijd.strCategory || "Onbekend");
 
    const badgeRegio = document.createElement("span");
    badgeRegio.classList.add("badge");
    badgeRegio.textContent = "🌍 " + (maaltijd.strArea || "Onbekend");
 
    badges.appendChild(badgeCategorie);
    badges.appendChild(badgeRegio);
 
    // Sectie: Ingrediënten
    const ingredientenTitel = document.createElement("p");
    ingredientenTitel.classList.add("modal-sectie-titel");
    ingredientenTitel.textContent = "Ingrediënten";
 
    const ingredientenLijst = bouwIngredienten(maaltijd);
 
    // Sectie: Instructies
    const instructiesTitel = document.createElement("p");
    instructiesTitel.classList.add("modal-sectie-titel");
    instructiesTitel.textContent = "Bereiding";
 
    const instructiesTekst = document.createElement("div");
    instructiesTekst.classList.add("instructies-tekst");
    instructiesTekst.textContent = maaltijd.strInstructions || "Geen instructies beschikbaar.";
 
    // Voeg alles toe aan de modal
    modalInhoud.appendChild(afbeelding);
    modalInhoud.appendChild(naam);
    modalInhoud.appendChild(badges);
    modalInhoud.appendChild(ingredientenTitel);
    modalInhoud.appendChild(ingredientenLijst);
    modalInhoud.appendChild(instructiesTitel);
    modalInhoud.appendChild(instructiesTekst);
 
  } catch (fout) {
    // Toon een foutmelding in de modal bij netwerk- of parseerfouten
    console.error("Detail-ophaalfout:", fout);
    modalInhoud.innerHTML = "<p>Fout bij ophalen van recept­details.</p>";
  }
}
 
/**
 * Sluit de modal en herstelt de scrollbaarheid van de pagina.
 */
function sluitModal() {
  modalOverlay.classList.add("verborgen");
  modalInhoud.innerHTML = "";
  document.body.style.overflow = "";
}
 
/**
 * Voert een zoekactie uit naar TheMealDB op basis van de invoerwaarde.
 * Valideert de invoer, haalt resultaten op en rendert de kaarten.
 * Vangt fouten op en toont de juiste melding.
 */
async function zoekRecepten() {
  const zoekterm = zoekInput.value.trim();
 
  // Validatie: lege zoekopdracht
  if (!zoekterm) {
    toonStatusBericht("Voer een trefwoord in.", false);
    resultatenContainer.innerHTML = "";
    return;
  }
 
  // Verberg eventueel vorig statusbericht
  toonStatusBericht("", false);
 
  try {
    // Stuur het verzoek naar de API
    const antwoord = await fetch(API_ZOEK_URL + encodeURIComponent(zoekterm));
 
    if (!antwoord.ok) {
      throw new Error("HTTP-fout: " + antwoord.status);
    }
 
    const data = await antwoord.json();
 
    // null-check: geen resultaten gevonden
    if (!data.meals) {
      toonStatusBericht("Geen recepten gevonden voor \"" + zoekterm + "\".", false);
      resultatenContainer.innerHTML = "";
      return;
    }
 
    // Render de kaarten (max MAX_RESULTATEN)
    toonReceptKaarten(data.meals);
 
    // Optioneel: vermeld het totaal als er meer zijn dan MAX_RESULTATEN
    if (data.meals.length > MAX_RESULTATEN) {
      toonStatusBericht(
        "Er zijn " + data.meals.length + " resultaten gevonden. De eerste " + MAX_RESULTATEN + " worden getoond.",
        false
      );
    }
 
  } catch (fout) {
    // API-fout of netwerkprobleem
    console.error("Zoekfout:", fout);
    toonStatusBericht("Fout bij ophalen data. Controleer je internetverbinding.", true);
    resultatenContainer.innerHTML = "";
  }
}
 
 
/* ======================== 3. EVENT HANDLERS ======================== */
 
/**
 * Handler voor de zoekknop: start de zoekactie.
 */
function handleZoekKnop() {
  zoekRecepten();
}
 
/**
 * Handler voor Enter-toets in het zoekveld: start de zoekactie.
 *
 * @param {KeyboardEvent} event
 */
function handleZoekEnter(event) {
  if (event.key === "Enter") {
    zoekRecepten();
  }
}
 
/**
 * Handler voor klikken op de resultatencontainer (event delegation).
 * Detecteert klikken op hartje-knoppen en details-knoppen.
 *
 * @param {MouseEvent} event
 */
function handleResultatenKlik(event) {
  // Zoek de dichtstbijzijnde knop met de juiste klasse
  const hartjeKnop  = event.target.closest(".favoriet-knop");
  const detailsKnop = event.target.closest(".details-knop");
 
  if (hartjeKnop) {
    // Hartje geklikt: toggle favoriet-status
    const id        = hartjeKnop.getAttribute("data-id");
    const naam      = hartjeKnop.getAttribute("data-naam");
    const thumbnail = hartjeKnop.getAttribute("data-thumb");
    toggleFavoriet(id, naam, thumbnail);
  }
 
  if (detailsKnop) {
    // Details-knop geklikt: toon de modal
    const id = detailsKnop.getAttribute("data-id");
    toonDetails(id);
  }
}
 
/**
 * Handler voor de sluitknop van de modal.
 */
function handleModalSluit() {
  sluitModal();
}
 
/**
 * Handler voor klikken op de modal-overlay zelf (buiten de kaart).
 * Sluit de modal als de gebruiker op de donkere achtergrond klikt.
 *
 * @param {MouseEvent} event
 */
function handleOverlayKlik(event) {
  // Controleer of exact op de overlay geklikt werd (niet op de modal-kaart)
  if (event.target === modalOverlay) {
    sluitModal();
  }
}
 
/**
 * Handler voor de Escape-toets: sluit de modal als die open is.
 *
 * @param {KeyboardEvent} event
 */
function handleEscapeToets(event) {
  if (event.key === "Escape" && !modalOverlay.classList.contains("verborgen")) {
    sluitModal();
  }
}
 
 
/* ======================== 4. EVENTS KOPPELEN ======================== */
 
// Klik op de zoekknop
zoekKnop.addEventListener("click", handleZoekKnop);
 
// Enter-toets in het zoekveld
zoekInput.addEventListener("keydown", handleZoekEnter);
 
// Klikken op kaarten (delegation: één listener voor hartje + details)
resultatenContainer.addEventListener("click", handleResultatenKlik);
 
// Sluitknop van de modal
modalSluit.addEventListener("click", handleModalSluit);
 
// Klik buiten de modal-kaart (op de overlay)
modalOverlay.addEventListener("click", handleOverlayKlik);
 
// Escape-toets sluit de modal
document.addEventListener("keydown", handleEscapeToets);
 
// Laad favorieten uit localStorage bij het opstarten
laadFavorieten();
