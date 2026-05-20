# Project: MyInstants Style Soundboard met Freesound API

## 🎯 Projectdoel
Een soundboard applicatie waarbij de gebruiker:
- 15 vaste knoppen heeft met vooraf gekozen geluiden (koe, explosie, kat, drill, MJ Hee Hee, fart, Discord, Snapchat, hond, Windows error, applaus, donder, correct, incorrect, gun)
- De vaste knoppen kunnen worden toegevoegd aan een persoonlijk dashboard
- Geluiden kan zoeken via de Freesound API
- Zoekresultaten kan toevoegen aan het dashboard
- Het dashboard bewaard blijft na refreshen (localStorage)
- Geluiden kan afspelen met een MyInstants look (3D knoppen met ingedrukt effect)
- Een tweede klik of klik op een andere knop stopt het huidige geluid
- Een volume slider heeft voor elke knop in het dashboard (eigen uitbreiding)

## 🛠️ Technologieën (VERPLICHT)
- **Vanilla HTML5** - semantische markup, geen frameworks
- **Vanilla CSS3** - Grid layout, MyInstants button styling (box-shadow 3D effect), responsive design
- **Vanilla JavaScript (ES6+)** - geen jQuery, geen React
- **Fetch API** met async/await syntax (verplicht!)
- **LocalStorage** voor het bewaren van het dashboard
- **Freesound API** (https://freesound.org/apiv2/) voor zoekfunctionaliteit
- **MyInstants MP3 links** voor de 15 vaste knoppen

## 📁 Bestandsstructuur
project:
- index.html # HTML structuur (zoekbalk, vaste knoppen, zoekresultaten, dashboard)
- styles.css # MyInstans stijl (3D buttons, grid, responsive)
- script.js # Alle JavaScript (API key, MP3 links, afspeellogica, dashboard)
- AGENTS.md # Dit bestand (agent instructies)
- documentatie.docx # AI gebruik verslag


## 📝 Code conventies (verplicht!)

### Algemeen
- Gebruik **`const`** en **`let`** , nooit `var`
- Gebruik **`querySelector`** / **`querySelectorAll`** , nooit `getElementById`
- Geen inline styles in HTML
- Geen onclick attributes in HTML (koppel events in JS)

### Code organisatie in script.js (in deze volgorde!)
```javascript
// 1. DECLARATIES (const, let variabelen)
//    - API_KEY, API_BASE_URL
//    - FIXED_SOUNDS (15 vaste geluiden met naam, icoon, MP3 link)
//    - DOM elementen (searchInput, searchBtn, etc.)
//    - dashboardSounds array
//    - currentAudio, currentPlayingId, currentVolume

// 2. HULPFUNCTIES (helper functies)
//    - formatDuration() - zet seconden om naar mm:ss
//    - escapeHtml() - voorkomt XSS aanvallen
//    - showError() - toont foutmeldingen
//    - showTemporaryMessage() - tijdelijke bevestiging bij toevoegen

// 3. HOOFDFUNCTIES
//    - playSound() - speelt geluid af, stopt vorige
//    - stopCurrentSound() - stopt huidig geluid
//    - removeActiveClassFromAllButtons() - reset alle knoppen
//    - addToDashboard() - voegt geluid toe aan dashboard (met max 20 check)
//    - loadFixedSounds() - maakt de 15 vaste knoppen met ⭐ toevoegknop
//    - searchSounds() - zoekt op Freesound API (async/await, fetch)
//    - displaySearchResults() - toont zoekresultaten met ⭐ toevoegknop
//    - renderDashboard() - toont dashboard met volume slider en verwijderknop
//    - saveDashboard() / loadDashboard() - localStorage

// 4. EVENT HANDLERS (koppelen van events)
//    - searchBtn.addEventListener("click", ...)
//    - searchInput.addEventListener("keypress", ...)

// 5. INITIALISATIE (start de app)
//    - document.addEventListener("DOMContentLoaded", () => {
//        loadFixedSounds();
//        loadDashboard();
//      });
