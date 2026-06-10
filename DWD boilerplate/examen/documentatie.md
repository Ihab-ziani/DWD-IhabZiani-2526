# Documentatie AI Opgave - Recipe Finder

## Initiele prompt (aan Claude)
> Maak een volledige, werkende single page applicatie "Recipe Finder" volgens de specificaties: zoeken op trefwoord via TheMealDB API, toon eerste 20 resultaten als kaarten met naam, afbeelding, categorie, regio; klik voor details (instructies, ingrediënten); favorieten met hartje, opslag in localStorage; foutafhandeling; responsive; enkel vanilla HTML/CSS/JS. Lever alle bestanden.

## Door AI gegenereerde aanpak
Claude stelde voor om:
- Een modaal venster te gebruiken voor details.
- Favorieten op te slaan als array van objecten met minimale velden.
- Bij het laden van de pagina een voorbeeldzoekopdracht te tonen (bv. "chicken").
- Event delegation te gebruiken voor dynamische elementen.
- Async/await met try/catch voor API calls.

## Gebruikte agents
- Claude (via chat interface)
- Chatgpt (om prompt aan te maken)
- Geen andere agents.

## Gespreksverloop (bondige samenvatting)
1. **Stap 1 - basisstructuur**: Ik gaf de volledige opgave. Claude genereerde index.html, CSS, JS met zoekfunctie en kaarten.
2. **Stap 2 - favorieten**: Na testen bleek dat favorieten niet bleven bij herladen. Claude voegde localStorage toe en een functie `loadFavorites()`.
3. **Stap 3 - details**: Claude voegde een modaal venster toe met ingrediënten (loop over 20 mogelijke ingredient/measure pairs).
4. **Stap 4 - foutafhandeling**: Ik vroeg om duidelijke meldingen bij lege zoekopdracht en netwerkfouten. Claude implementeerde `showMessage()`.
5. **Stap 5 - extra feature**: Ik vroeg een "Toon favorieten" knop. Claude voegde `showFavorites()` toe die enkel de opgeslagen favorieten toont.
6. **Stap 6 - styling**: Claude verbeterde responsiveness en voegde hover-effecten toe.

Uiteindelijk getest in Chrome en Firefox, alle functionaliteiten werken.
