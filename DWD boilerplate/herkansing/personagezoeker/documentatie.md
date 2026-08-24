# Documentatie AI Opgave - Personagezoeker

## Initiële prompt
 Ik moet een single page applicatie maken voor het vak DWD. Het is een AI-opgave en telt mee voor 20% van mijn examen. De opdracht heet "Personagezoeker" en gebruikt de Rick and Morty API (https://rickandmortyapi.com/documentation). De applicatie moet een zoekfunctie hebben waarmee je personages kan opzoeken op naam. De resultaten moeten worden weergegeven als personagekaarten met minstens de naam, afbeelding, status en soort. Wanneer de gebruiker op een kaart klikt, moeten er meer details getoond worden in een modaal venster: afbeelding, status (Alive/Dead/unknown), soort, herkomst, laatst gekende locatie en de afleveringen waarin het personage voorkomt. Er moet ook een favorietensysteem zijn: de gebruiker moet personages kunnen toevoegen aan een favorietenlijst via een hartje. Favoriete personages moeten duidelijk zichtbaar zijn (rood hartje). De gebruiker moet ook personages uit de favorieten kunnen verwijderen. De favorieten moeten bewaard blijven bij het herladen van de pagina via localStorage. Verder moet de app goede feedback geven bij een lege zoekopdracht, geen resultaten of een netwerkfout. Het is de bedoeling dat ik enkel gebruik maak van vanilla HTML, CSS en JavaScript – geen frameworks zoals Bootstrap. Voor het ophalen van data moet ik de fetch API gebruiken met async/await syntax. De code moet voorzien zijn van duidelijke commentaar en de structuur moet zijn: Declaraties, dan Functies, dan Event Handlers, dan Events. Het design moet responsive zijn: 1 kolom op mobiel, 4 kolommen op desktop. Ik heb jou nodig om de volledige code te genereren in aparte bestanden: index.html, css/styles.css, js/script.js, plan.md, documentatie.md en AGENT.md. Zorg dat alles werkt, geen validatiefouten heeft en voldoet aan alle eisen uit de opgave.

## Plan van aanpak (door AI gegenereerd)
1. HTML structuur: zoekbalk, grid voor kaarten, modaal venster voor details
2. CSS: responsive design (grid 1 kolom mobiel, 4 kolom desktop), hartjes, status badges
3. JavaScript: fetch API met async/await voor data ophalen, localStorage voor favorieten, event delegation voor klikken

## Gebruikte agents
- Claude (via chat interface)
- Geen andere agents

## Gespreksverloop (bondig)
1. **Stap 1** – Ik vroeg om een basis HTML/CSS/JS met zoekfunctie op de Rick and Morty API. Claude genereerde de bestanden met een zoekbalk en resultatenweergave.
2. **Stap 2** – Ik vroeg om favorietenfunctionaliteit met localStorage. Claude voegde de hartjes toe en de opslag van favorieten.
3. **Stap 3** – Ik vroeg om een modaal venster voor details. Claude voegde de modal toe met afbeelding, status, soort, herkomst, locatie en afleveringen.
4. **Stap 4** – Ik vroeg om foutafhandeling en meldingen. Claude voegde validatie toe voor lege zoekopdracht, geen resultaten en netwerkfouten.
5. **Stap 5** – Ik vroeg om responsive verbeteringen en design. Claude paste de CSS aan met een grid en status badges.
