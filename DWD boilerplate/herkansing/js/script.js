/**
 * Personagezoeker - Rick and Morty API
 * Functionaliteiten: zoeken, favorieten (localStorage), details modal, foutafhandeling
 * Structuur: Declaraties → Functies → Event Handlers → Events
 */

// ============================================================
// 1. DECLARATIES
// ============================================================

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const resultsContainer = document.getElementById('resultsContainer');
const messageArea = document.getElementById('messageArea');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.querySelector('.close-modal');

let currentCharacters = [];
let favoriteCharacters = [];

// ============================================================
// 2. FUNCTIES
// ============================================================

/**
 * Toon een melding (info of fout)
 */
function showMessage(msg, type = 'info') {
    messageArea.textContent = msg;
    messageArea.className = `message ${type}`;
    messageArea.style.display = 'block';
    setTimeout(() => {
        messageArea.style.display = 'none';
        messageArea.className = 'message';
    }, 3500);
}

/**
 * Laad favorieten uit localStorage
 */
function loadFavorites() {
    const stored = localStorage.getItem('favoriteCharacters');
    favoriteCharacters = stored ? JSON.parse(stored) : [];
}

/**
 * Bewaar favorieten naar localStorage
 */
function saveFavorites() {
    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteCharacters));
}

/**
 * Check of een personage favoriet is
 */
function isFavorite(id) {
    return favoriteCharacters.some(char => char.id === id);
}

/**
 * Voeg toe of verwijder uit favorieten
 */
function toggleFavorite(character, heartIcon) {
    const id = character.id;
    if (isFavorite(id)) {
        favoriteCharacters = favoriteCharacters.filter(c => c.id !== id);
        if (heartIcon) heartIcon.classList.remove('favorited');
        showMessage(`${character.name} verwijderd uit favorieten`, 'info');
    } else {
        const favoriteData = {
            id: character.id,
            name: character.name,
            image: character.image,
            status: character.status,
            species: character.species
        };
        favoriteCharacters.push(favoriteData);
        if (heartIcon) heartIcon.classList.add('favorited');
        showMessage(`${character.name} toegevoegd aan favorieten`, 'info');
    }
    saveFavorites();
}

/**
 * Genereert HTML voor een personagekaart
 */
function createCharacterCard(character) {
    const isFav = isFavorite(character.id);
    const heartClass = isFav ? 'favorited' : '';
    const statusClass = `status-${character.status.toLowerCase()}`;
    
    return `
        <div class="character-card" data-id="${character.id}">
            <img src="${character.image}" alt="${character.name}" loading="lazy">
            <div class="card-content">
                <h3>${character.name}</h3>
                <div class="character-details">
                    <p><span class="status-badge ${statusClass}">${character.status}</span></p>
                    <p><strong>Soort:</strong> ${character.species}</p>
                </div>
                <div class="favorite-icon ${heartClass}" data-id="${character.id}">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
        </div>
    `;
}

/**
 * Toon personages in het grid
 */
function renderCharacters(characters) {
    if (!characters || characters.length === 0) {
        resultsContainer.innerHTML = '';
        showMessage('Geen personages gevonden. Probeer een andere naam.', 'info');
        return;
    }
    resultsContainer.innerHTML = characters.map(char => createCharacterCard(char)).join('');
}

/**
 * Haal personages op van API (async/await)
 */
async function searchCharacters(query) {
    if (!query.trim()) {
        showMessage('Voer een naam in.', 'error');
        return;
    }
    
    resultsContainer.innerHTML = '<div style="text-align:center;padding:2rem;">Bezig met laden...</div>';
    
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query)}`);
        if (!response.ok) {
            if (response.status === 404) {
                currentCharacters = [];
                renderCharacters([]);
                return;
            }
            throw new Error('Netwerkfout');
        }
        const data = await response.json();
        currentCharacters = data.results;
        renderCharacters(currentCharacters);
    } catch (error) {
        console.error(error);
        showMessage('Fout bij ophalen data. Controleer je internetverbinding.', 'error');
        resultsContainer.innerHTML = '';
    }
}

/**
 * Toon details van een personage (modal)
 */
async function showDetails(id) {
    // Zoek in currentCharacters
    let character = currentCharacters.find(c => c.id === id);
    
    if (!character) {
        // Probeer op te halen via API
        try {
            const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            if (!res.ok) throw new Error('Fout');
            character = await res.json();
        } catch {
            showMessage('Details niet gevonden', 'error');
            return;
        }
    }
    
    displayModalContent(character);
}

/**
 * Bouwt HTML voor modal met alle details
 */
function displayModalContent(character) {
    const statusClass = `status-${character.status.toLowerCase()}`;
    
    // Afleveringen (max 10 tonen)
    let episodesHtml = '<h3>Afleveringen:</h3><ul class="episode-list">';
    const episodeUrls = character.episode.slice(0, 10);
    episodeUrls.forEach(url => {
        const episodeId = url.split('/').pop();
        episodesHtml += `<li>Aflevering ${episodeId}</li>`;
    });
    if (character.episode.length > 10) {
        episodesHtml += `<li>... en nog ${character.episode.length - 10} meer</li>`;
    }
    episodesHtml += '</ul>';
    
    modalBody.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${character.status}</span></p>
        <p><strong>Soort:</strong> ${character.species}</p>
        <p><strong>Herkomst:</strong> ${character.origin.name}</p>
        <p><strong>Laatst gekende locatie:</strong> ${character.location.name}</p>
        ${episodesHtml}
    `;
    modal.style.display = 'block';
}

/**
 * Toon enkel de favoriete personages
 */
function showFavorites() {
    if (favoriteCharacters.length === 0) {
        showMessage('Je hebt nog geen favoriete personages.', 'info');
        resultsContainer.innerHTML = '';
        currentCharacters = [];
        return;
    }
    
    // Maak kunstmatige character objecten voor weergave
    const fakeCharacters = favoriteCharacters.map(fav => ({
        id: fav.id,
        name: fav.name,
        image: fav.image,
        status: fav.status || 'unknown',
        species: fav.species || 'Onbekend'
    }));
    currentCharacters = fakeCharacters;
    renderCharacters(currentCharacters);
    showMessage(`${favoriteCharacters.length} favoriete personage(s)`, 'info');
}

// ============================================================
// 3. EVENT HANDLERS
// ============================================================

/**
 * Click handler voor resultaten (hartje + details)
 */
function handleResultsClick(e) {
    // Hartje klik
    const heart = e.target.closest('.favorite-icon');
    if (heart) {
        e.stopPropagation();
        const card = heart.closest('.character-card');
        const characterId = parseInt(card.dataset.id);
        let character = currentCharacters.find(c => c.id === characterId);
        
        if (character) {
            toggleFavorite(character, heart);
        } else {
            // Haal op via API
            fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
                .then(res => res.json())
                .then(data => {
                    toggleFavorite(data, heart);
                    if (!currentCharacters.find(c => c.id === characterId)) {
                        currentCharacters.push(data);
                    }
                })
                .catch(() => showMessage('Fout bij toevoegen favoriet', 'error'));
        }
        return;
    }
    
    // Klik op kaart (details)
    const card = e.target.closest('.character-card');
    if (card) {
        const characterId = parseInt(card.dataset.id);
        showDetails(characterId);
    }
}

/**
 * Zoek handler
 */
async function handleSearch() {
    await searchCharacters(searchInput.value);
}

/**
 * Favorieten knop handler
 */
function handleFavorites() {
    showFavorites();
}

// ============================================================
// 4. EVENTS
// ============================================================

// Sluit modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Zoek
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Favorieten
favoritesBtn.addEventListener('click', handleFavorites);

// Resultaten (delegatie)
resultsContainer.addEventListener('click', handleResultsClick);

// ============================================================
// 5. INIT
// ============================================================

loadFavorites();
searchCharacters('rick');
