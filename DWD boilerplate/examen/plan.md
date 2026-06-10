# Recipe Finder - Technisch Plan

## Bestandenstructuur
- `index.html` - hoofdpagina met zoekveld, resultatencontainer, favorieten knop en modaal venster.
- `css/styles.css` - responsive styling (Grid/Flexbox), donker thema, hartjes, modaal.
- `js/script.js` - alle functionaliteit: API calls, favorieten (localStorage), modaal, event listeners.

## Belangrijkste functies
1. `searchRecipes(query)` - fetch naar TheMealDB, toont resultaten via `displayRecipes(meals)`.
2. `displayRecipes(meals)` - genereert HTML-kaarten met naam, afbeelding, categorie, regio, hartje.
3. `toggleFavorite(mealId, mealData)` - voegt toe of verwijdert uit localStorage, update UI.
4. `loadFavorites()` - laadt favorieten array uit localStorage.
5. `showFavorites()` - toont enkel favoriete recepten (opgeslagen objecten).
6. `showDetails(mealId)` - toont modaal met volledige details (ingrediënten, instructies).
7. `render()` - hertekent de huidige resultaten met correcte hartstatus.

## API Gebruik
- Zoek: `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
- Geen aparte detailcall nodig; alle data zit in zoekresultaat.

## Opslag Favorieten
- Key: `favoriteRecipes`
- Waarde: array van objecten `{ idMeal, strMeal, strMealThumb, strCategory, strArea }`
- Bij toevoegen/verwijderen wordt array geüpdatet en opgeslagen.

## Foutafhandeling
- Lege zoekopdracht → melding "Voer een trefwoord in"
- Geen resultaten → melding "Geen recepten gevonden"
- Netwerkfout → melding "Fout bij ophalen data"

## Design
- CSS Grid voor kaarten (responsive: 1 kolom mobiel, 2-4 desktop).
- Modaal venster met sluitknop, overlay.
- Hartjes: ♡ (grijs) en ❤️ (rood) met klik event.
- Klik op kaart toont details (behalve als er op hartje geklikt wordt).
