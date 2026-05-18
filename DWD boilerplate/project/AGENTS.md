# Project: Freesound Dashboard
## Technologieën
- Vanilla HTML, CSS, JavaScript
- Fetch API (async/await)
- LocalStorage
- Geen frameworks, geen Bootstrap

## Code conventies
- Gebruik `querySelector` / `querySelectorAll`, geen `getElementById`
- Scheiding: declaraties, functies, event handlers, initialisatie
- Elke functie heeft een duidelijke naam en commentaar
- Gebruik `const` en `let`, geen `var`

## Design
- Responsive (mobile + desktop)
- Eenvoudig, clean, buttons met duidelijke feedback

## Wat mag de agent doen?
- Bestanden aanmaken/wijzigen
- Kleine features per keer implementeren
- Steeds testen of het werkt

## Wat mag de agent niet doen?
- Geen hele opdracht in 1 keer schrijven
- Geen externe libraries toevoegen
- Geen code kopiëren zonder bronvermelding

### Code organisatie in script.js (in deze volgorde!)
```javascript
// 1. DECLARATIES (const, let variabelen)
// 2. HULPFUNCTIES (helper functies)
// 3. HOOFDFUNCTIES (search, play, dashboard)
// 4. EVENT HANDLERS (koppelen van events)
// 5. INITIALISATIE (start de app)
