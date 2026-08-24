# Personagezoeker - Technisch Plan

## Bestandenstructuur

personagezoeker/
├── index.html
├── plan.md
├── documentatie.md
├── AGENT.md
├── css/
│ └── styles.css
└── js/
└── script.js


## API Gebruik
- **Endpoint**: `https://rickandmortyapi.com/api/character/?name={query}`
- **Methode**: GET met `fetch` en `async/await`
- **Response**: JSON met `results` array van personages

## Functionaliteiten
1. **Zoeken** – input + knop, toont personagekaarten
2. **Details** – modal met afbeelding, status, soort, herkomst, locatie, afleveringen
3. **Favorieten** – hartje toevoegen/verwijderen, opslag in localStorage
4. **Foutafhandeling** – lege zoekopdracht, geen resultaten, netwerkfout

## Datastructuur Favorieten
```json
[
  {
    "id": 1,
    "name": "Rick Sanchez",
    "image": "https://...",
    "status": "Alive",
    "species": "Human"
  }
]

## Design
- Responsive grid (1 kolom mobiel, 4 kolom desktop)
- Modaal venster voor details
- Hartjes: grijs (niet favoriet) / rood (favoriet)
- Status badges: groen (Alive), rood (Dead), grijs (Unknown)
