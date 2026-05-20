/*
Bron: DeepSeek AI (chat.deepseek.com)
Eerdere versie: alleen zoekfunctie en dashboard, geen vaste knoppen
*/

const API_KEY = "6y5Z4PDQmgkxiO6HxlmrdzWxANgxrUI9HHTg6Zpj";
const API_BASE_URL = "https://freesound.org/apiv2";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResultsDiv = document.getElementById("searchResults");
const dashboardDiv = document.getElementById("dashboard");
const dashboardCountSpan = document.getElementById("dashboardCount");

let dashboardSounds = [];
let currentAudio = null;
let currentPlayingId = null;
let currentVolume = 0.7;

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function showError(message) {
    searchResultsDiv.innerHTML = `<div class="placeholder">❌ ${message}</div>`;
}

function playSound(url, soundId, button, volumeSlider = null) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        removeActiveClassFromAllButtons();
    }
    currentAudio = new Audio(url);
    currentAudio.volume = currentVolume;
    currentPlayingId = soundId;
    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            currentVolume = parseFloat(e.target.value);
            if (currentAudio && currentPlayingId === soundId) {
                currentAudio.volume = currentVolume;
            }
        });
    }
    currentAudio.play().catch(error => console.error("Fout bij afspelen:", error));
    button.classList.add("active");
    const iconSpan = button.querySelector(".sound-icon");
    if (iconSpan) iconSpan.textContent = "⏸";
    currentAudio.addEventListener("ended", () => {
        button.classList.remove("active");
        if (iconSpan) iconSpan.textContent = "🎵";
        currentAudio = null;
        currentPlayingId = null;
    });
}

function stopCurrentSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    removeActiveClassFromAllButtons();
    currentPlayingId = null;
}

function removeActiveClassFromAllButtons() {
    document.querySelectorAll(".sound-btn.active").forEach(btn => {
        btn.classList.remove("active");
        const iconSpan = btn.querySelector(".sound-icon");
        if (iconSpan) iconSpan.textContent = "🎵";
    });
}

async function searchSounds(query) {
    if (!query.trim()) {
        showError("Voer een zoekterm in!");
        return;
    }
    searchResultsDiv.innerHTML = '<div class="loading">🔍 Bezig met zoeken...</div>';
    try {
        const url = `${API_BASE_URL}/search/?q=${encodeURIComponent(query)}&token=${API_KEY}&format=json&page_size=12&fields=id,name,duration,previews`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            searchResultsDiv.innerHTML = '<div class="placeholder">😕 Geen geluiden gevonden.</div>';
        }
    } catch (error) {
        showError("Fout bij verbinding met Freesound.");
    }
}

function displaySearchResults(results) {
    searchResultsDiv.innerHTML = "";
    results.forEach(sound => {
        const previewUrl = sound.previews?.["preview-hq-mp3"] || sound.previews?.["preview-lq-mp3"];
        const container = document.createElement("div");
        const button = document.createElement("button");
        button.className = "sound-btn";
        button.setAttribute("data-id", sound.id);
        button.setAttribute("data-preview-url", previewUrl || "");
        button.innerHTML = `<span class="sound-icon">🎵</span><span class="sound-name">${escapeHtml(sound.name.substring(0, 30))}</span><span class="sound-duration">⏱️ ${formatDuration(sound.duration)}</span>`;
        const addBtn = document.createElement("button");
        addBtn.className = "action-btn add";
        addBtn.textContent = "⭐ Toevoegen";
        container.appendChild(button);
        container.appendChild(addBtn);
        searchResultsDiv.appendChild(container);
        if (!previewUrl) {
            button.disabled = true;
            addBtn.disabled = true;
        }
        button.addEventListener("click", () => {
            if (!previewUrl) return;
            if (currentPlayingId === sound.id && currentAudio && !currentAudio.paused) {
                stopCurrentSound();
            } else {
                if (currentAudio) stopCurrentSound();
                playSound(previewUrl, sound.id, button);
            }
        });
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!previewUrl) return;
            if (dashboardSounds.length >= 20) { alert("Max 20!"); return; }
            if (dashboardSounds.some(s => s.id === sound.id)) { alert("Al in dashboard!"); return; }
            dashboardSounds.push({ id: sound.id, name: sound.name, duration: sound.duration, previewUrl: previewUrl });
            saveDashboard(); renderDashboard();
        });
    });
}

function renderDashboard() {
    if (dashboardSounds.length === 0) {
        dashboardDiv.innerHTML = '<div class="placeholder">⭐ Voeg geluiden toe via zoekresultaten</div>';
        dashboardCountSpan.textContent = "(0)";
        return;
    }
    dashboardDiv.innerHTML = "";
    dashboardCountSpan.textContent = `(${dashboardSounds.length})`;
    dashboardSounds.forEach(sound => {
        const container = document.createElement("div");
        const button = document.createElement("button");
        button.className = "sound-btn";
        button.setAttribute("data-id", sound.id);
        button.innerHTML = `<span class="sound-icon">🎵</span><span class="sound-name">${escapeHtml(sound.name.substring(0, 30))}</span>`;
        const volumeContainer = document.createElement("div");
        volumeContainer.className = "volume-control";
        volumeContainer.innerHTML = `<span>🔊</span><input type="range" min="0" max="1" step="0.01" value="${currentVolume}" class="volume-slider">`;
        const removeBtn = document.createElement("button");
        removeBtn.className = "action-btn remove";
        removeBtn.textContent = "🗑️ Verwijderen";
        container.appendChild(button);
        container.appendChild(volumeContainer);
        container.appendChild(removeBtn);
        dashboardDiv.appendChild(container);
        button.addEventListener("click", () => {
            if (currentPlayingId === sound.id && currentAudio && !currentAudio.paused) {
                stopCurrentSound();
            } else {
                if (currentAudio) stopCurrentSound();
                playSound(sound.previewUrl, sound.id, button, volumeContainer.querySelector(".volume-slider"));
            }
        });
        removeBtn.addEventListener("click", () => {
            if (currentPlayingId === sound.id) stopCurrentSound();
            dashboardSounds = dashboardSounds.filter(s => s.id !== sound.id);
            saveDashboard(); renderDashboard();
        });
        volumeContainer.querySelector(".volume-slider").addEventListener("input", (e) => {
            currentVolume = parseFloat(e.target.value);
            if (currentPlayingId === sound.id && currentAudio) currentAudio.volume = currentVolume;
        });
    });
}

function saveDashboard() { localStorage.setItem("soundboard_dashboard", JSON.stringify(dashboardSounds)); }
function loadDashboard() { const saved = localStorage.getItem("soundboard_dashboard"); if (saved) { dashboardSounds = JSON.parse(saved); renderDashboard(); } }

searchBtn.addEventListener("click", () => searchSounds(searchInput.value));
searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") searchSounds(searchInput.value); });

loadDashboard();
console.log("Soundboard geladen (geen vaste knoppen)");
