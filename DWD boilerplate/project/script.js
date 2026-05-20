/*
=========================================
BRONVERMELDING
Bestand: script.js
Bron: DeepSeek AI (chat.deepseek.com) (omdat Claude.AI hier niet werkte en bleef maar API Error: "400 This organization has been disabled." weergeven)
Datum: mei 2026
Aanpassingen: 
  - Eigen API key toegevoegd
  - Fallback voor waveform afbeeldingen
  - Max 20 geluiden in dashboard limiet
  - CORS friendly audio
  - Disabled knoppen als preview ontbreekt
UITBREIDING: vaste knoppen kunnen ook toegevoegd worden aan dashboard
=========================================
*/


// ========================================
// JOUW API KEY
// ========================================
const API_KEY = "6y5Z4PDQmgkxiO6HxlmrdzWxANgxrUI9HHTg6Zpj";
const API_BASE_URL = "https://freesound.org/apiv2";

// ========================================
// JOUW 15 VASTE GELUIDEN (MP3 links van MyInstants)
// ========================================
const FIXED_SOUNDS = [
    { name: "🐮 Koe", icon: "🐮", url: "https://www.myinstants.com/media/sounds/cow-moo.mp3" },
    { name: "💥 Explosie", icon: "💥", url: "https://www.myinstants.com/media/sounds/explosion-meme-33169.mp3" },
    { name: "🐱 Kat", icon: "🐱", url: "https://www.myinstants.com/media/sounds/meow-1-25594.mp3" },
    { name: "🔧 Drill", icon: "🔧", url: "https://www.myinstants.com/media/sounds/drill-sound-3467.mp3" },
    { name: "🕺 MJ Hee Hee", icon: "🕺", url: "https://www.myinstants.com/media/sounds/hee-hee-19922.mp3" },
    { name: "💨 Fart", icon: "💨", url: "https://www.myinstants.com/media/sounds/fart.mp3" },
    { name: "💬 Discord", icon: "💬", url: "https://www.myinstants.com/media/sounds/discord-notification-38119.mp3" },
    { name: "👻 Snapchat", icon: "👻", url: "https://www.myinstants.com/media/sounds/snapchat-message-4240.mp3" },
    { name: "🐶 Hond", icon: "🐶", url: "https://www.myinstants.com/media/sounds/doggy-bark-35421.mp3" },
    { name: "⚠️ Windows Error", icon: "⚠️", url: "https://www.myinstants.com/media/sounds/error-soundss-25534.mp3" },
    { name: "👏 Applaus", icon: "👏", url: "https://www.myinstants.com/media/sounds/app.mp3" },
    { name: "⛈️ Donder", icon: "⛈️", url: "https://www.myinstants.com/media/sounds/thunder-65237.mp3" },
    { name: "✅ Correct", icon: "✅", url: "https://www.myinstants.com/media/sounds/correct-answer-gameshow.mp3" },
    { name: "❌ Incorrect", icon: "❌", url: "https://www.myinstants.com/media/sounds/jeopardy-incorrect-answer-16523.mp3" },
    { name: "🔫 Gun", icon: "🔫", url: "https://www.myinstants.com/media/sounds/gunshotttt-3805.mp3" }
];

// ========================================
// DECLARATIES
// ========================================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResultsDiv = document.getElementById("searchResults");
const dashboardDiv = document.getElementById("dashboard");
const fixedSoundboardDiv = document.getElementById("fixedSoundboard");
const dashboardCountSpan = document.getElementById("dashboardCount");

let dashboardSounds = [];
let currentAudio = null;
let currentPlayingId = null;
let currentVolume = 0.7;

// ========================================
// HULPFUNCTIES
// ========================================
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

function showTemporaryMessage(button, message, color) {
    const originalText = button.innerHTML;
    button.innerHTML = message;
    button.style.backgroundColor = color;
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = "";
    }, 800);
}

// ========================================
// AUDIO AFSPELEN
// ========================================
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

    currentAudio.play().catch(error => {
        console.error("Fout bij afspelen:", error);
    });

    button.classList.add("active");
    const iconSpan = button.querySelector(".sound-icon");
    const originalIcon = button.getAttribute("data-icon");
    if (iconSpan && originalIcon) iconSpan.textContent = "⏸";

    currentAudio.addEventListener("ended", () => {
        button.classList.remove("active");
        if (iconSpan && originalIcon) iconSpan.textContent = originalIcon;
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
        const originalIcon = btn.getAttribute("data-icon");
        if (iconSpan && originalIcon) iconSpan.textContent = originalIcon;
    });
}

// ========================================
// FUNCTIE OM GELUID TOE TE VOEGEN AAN DASHBOARD
// ========================================
function addToDashboard(sound) {
    if (dashboardSounds.length >= 20) {
        alert("⚠️ Maximaal 20 knoppen in je dashboard!");
        return false;
    }
    if (dashboardSounds.some(s => s.id === sound.id)) {
        alert("Dit geluid zit al in je dashboard!");
        return false;
    }

    dashboardSounds.push(sound);
    saveDashboard();
    renderDashboard();
    return true;
}

// ========================================
// VASTE KNOPPEN LADEN (met toevoegknop!)
// ========================================
function loadFixedSounds() {
    if (!fixedSoundboardDiv) return;
    fixedSoundboardDiv.innerHTML = "";
    
    FIXED_SOUNDS.forEach(sound => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        
        // De afspeelknop
        const button = document.createElement("button");
        button.className = "sound-btn";
        button.setAttribute("data-id", sound.name);
        button.setAttribute("data-url", sound.url);
        button.setAttribute("data-icon", sound.icon);
        button.innerHTML = `<span class="sound-icon">${sound.icon}</span><span class="sound-name">${sound.name}</span>`;
        
        // Toevoegknop aan dashboard
        const addBtn = document.createElement("button");
        addBtn.className = "action-btn add";
        addBtn.setAttribute("data-id", sound.name);
        addBtn.setAttribute("data-name", sound.name);
        addBtn.setAttribute("data-url", sound.url);
        addBtn.setAttribute("data-icon", sound.icon);
        addBtn.innerHTML = "⭐ Toevoegen aan dashboard";
        
        button.addEventListener("click", () => {
            if (!sound.url) {
                alert("❌ Geen MP3 link voor: " + sound.name);
                return;
            }
            if (currentPlayingId === sound.name && currentAudio && !currentAudio.paused) {
                stopCurrentSound();
            } else {
                if (currentAudio) stopCurrentSound();
                playSound(sound.url, sound.name, button);
            }
        });
        
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const success = addToDashboard({
                id: sound.name,
                name: sound.name,
                duration: null,
                previewUrl: sound.url,
                icon: sound.icon
            });
            if (success) {
                showTemporaryMessage(addBtn, "✅ Toegevoegd!", "#27ae60");
            }
        });
        
        container.appendChild(button);
        container.appendChild(addBtn);
        fixedSoundboardDiv.appendChild(container);
    });
}

// ========================================
// ZOEKFUNCTIE (FREESOUND API)
// ========================================
async function searchSounds(query) {
    if (!query.trim()) {
        showError("Voer een zoekterm in!");
        return;
    }

    searchResultsDiv.innerHTML = '<div class="loading">🔍 Bezig met zoeken...</div>';

    try {
        const url = `${API_BASE_URL}/search/?q=${encodeURIComponent(query)}&token=${API_KEY}&format=json&page_size=12&fields=id,name,duration,previews`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP fout: ${response.status}`);
        
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            searchResultsDiv.innerHTML = '<div class="placeholder">😕 Geen geluiden gevonden. Probeer een ander woord!</div>';
        }
    } catch (error) {
        console.error(error);
        showError("Kon geen verbinding maken met Freesound. Controleer je API key.");
    }
}

function displaySearchResults(results) {
    searchResultsDiv.innerHTML = "";

    results.forEach(sound => {
        const previewUrl = sound.previews?.["preview-hq-mp3"] || sound.previews?.["preview-lq-mp3"];
        
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        
        const button = document.createElement("button");
        button.className = "sound-btn";
        button.setAttribute("data-id", sound.id);
        button.setAttribute("data-preview-url", previewUrl || "");
        button.setAttribute("data-name", escapeHtml(sound.name));
        button.setAttribute("data-icon", "🎵");
        button.innerHTML = `<span class="sound-icon">🎵</span><span class="sound-name">${escapeHtml(sound.name.substring(0, 30))}</span><span class="sound-duration" style="font-size:0.65rem; color:#aaa;">⏱️ ${formatDuration(sound.duration)}</span>`;
        
        const addBtn = document.createElement("button");
        addBtn.className = "action-btn add";
        addBtn.setAttribute("data-id", sound.id);
        addBtn.setAttribute("data-name", escapeHtml(sound.name));
        addBtn.setAttribute("data-duration", sound.duration);
        addBtn.setAttribute("data-preview-url", previewUrl || "");
        addBtn.textContent = "⭐ Toevoegen aan dashboard";
        
        if (!previewUrl) {
            button.disabled = true;
            button.style.opacity = "0.5";
            addBtn.disabled = true;
            addBtn.style.opacity = "0.5";
            addBtn.textContent = "⛔ Geen preview beschikbaar";
        }
        
        container.appendChild(button);
        container.appendChild(addBtn);
        searchResultsDiv.appendChild(container);
        
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
            addToDashboard({
                id: sound.id,
                name: sound.name,
                duration: sound.duration,
                previewUrl: previewUrl,
                icon: "🎵"
            });
        });
    });
}

// ========================================
// DASHBOARD FUNCTIES
// ========================================
function renderDashboard() {
    if (!dashboardDiv) return;
    
    if (dashboardSounds.length === 0) {
        dashboardDiv.innerHTML = '<div class="placeholder">⭐ Klik op ⭐ bij vaste knoppen of zoekresultaten om toe te voegen</div>';
        if (dashboardCountSpan) dashboardCountSpan.textContent = "(0)";
        return;
    }

    dashboardDiv.innerHTML = "";
    if (dashboardCountSpan) dashboardCountSpan.textContent = `(${dashboardSounds.length})`;

    dashboardSounds.forEach(sound => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        
        const button = document.createElement("button");
        button.className = "sound-btn";
        button.setAttribute("data-id", sound.id);
        button.setAttribute("data-preview-url", sound.previewUrl);
        button.setAttribute("data-icon", sound.icon || "🎵");
        
        const durationHtml = sound.duration ? `<span class="sound-duration" style="font-size:0.65rem; color:#aaa;">⏱️ ${formatDuration(sound.duration)}</span>` : "";
        button.innerHTML = `<span class="sound-icon">${sound.icon || "🎵"}</span><span class="sound-name">${escapeHtml(sound.name.substring(0, 30))}</span>${durationHtml}`;
        
        const volumeContainer = document.createElement("div");
        volumeContainer.className = "volume-control";
        volumeContainer.innerHTML = `
            <span style="font-size:0.7rem;">🔊</span>
            <input type="range" min="0" max="1" step="0.01" value="${currentVolume}" class="volume-slider" data-id="${sound.id}">
        `;
        
        const removeBtn = document.createElement("button");
        removeBtn.className = "action-btn remove";
        removeBtn.setAttribute("data-id", sound.id);
        removeBtn.textContent = "🗑️ Verwijderen";
        
        container.appendChild(button);
        container.appendChild(volumeContainer);
        container.appendChild(removeBtn);
        dashboardDiv.appendChild(container);
        
        button.addEventListener("click", () => {
            if (!sound.previewUrl) return;
            if (currentPlayingId === sound.id && currentAudio && !currentAudio.paused) {
                stopCurrentSound();
            } else {
                if (currentAudio) stopCurrentSound();
                const slider = volumeContainer.querySelector(".volume-slider");
                playSound(sound.previewUrl, sound.id, button, slider);
            }
        });
        
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentPlayingId === sound.id) stopCurrentSound();
            dashboardSounds = dashboardSounds.filter(s => s.id !== sound.id);
            saveDashboard();
            renderDashboard();
        });
        
        const slider = volumeContainer.querySelector(".volume-slider");
        slider.addEventListener("input", (e) => {
            e.stopPropagation();
            const newVolume = parseFloat(e.target.value);
            if (currentPlayingId === sound.id && currentAudio) {
                currentAudio.volume = newVolume;
            }
            currentVolume = newVolume;
        });
    });
}

// ========================================
// LOCALSTORAGE
// ========================================
function saveDashboard() {
    try {
        localStorage.setItem("soundboard_dashboard", JSON.stringify(dashboardSounds));
    } catch (error) {
        console.error("Kon niet opslaan in localStorage:", error);
    }
}

function loadDashboard() {
    try {
        const saved = localStorage.getItem("soundboard_dashboard");
        if (saved) {
            dashboardSounds = JSON.parse(saved);
            renderDashboard();
        }
    } catch (error) {
        console.error("Kon niet laden uit localStorage:", error);
        dashboardSounds = [];
    }
}

// ========================================
// INITIALISATIE
// ========================================
if (searchBtn) {
    searchBtn.addEventListener("click", () => searchSounds(searchInput.value));
}

if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchSounds(searchInput.value);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadFixedSounds();
    loadDashboard();
    console.log("🎵 Soundboard geladen! Vaste knoppen kunnen toegevoegd worden aan dashboard.");
}); 
