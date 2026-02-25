/* eslint-disable no-magic-numbers */
/* eslint-disable no-lone-blocks */

// Oefening 1 – Console meldingen
console.log('\n%c=== Console meldingen ===', 'color: #0c0');
{
	console.log('Console opdracht zegt: test');
	console.warn('Console opdracht zegt: let op');
	console.error('Console opdracht zegt: ');
}

// Oefening 2 – Console opmaak
console.log('\n%c=== Console opmaak ===', 'color: #0c0');
{
	console.log('%cDit bericht is rood', 'color: red');
	console.log('%cDit is 24px groot', 'font-size: 24px');
	console.log('%cDit bericht is blauw op geel met padding', 'background-color: yellow; color: blue; padding: 5px');
	console.log('%cDeze tekst bevat een %cpaars %cwoord', 'color: black', 'color: #ff00ff', 'color: black');
}

// Oefening 3 – Variabelen
console.log('\n%c=== Variabelen ===', 'color: #0c0');
{
	const vak = 'DWD';
	let punten = 8;
	punten += 5;
	const MAX_PUNTEN = 20;
	console.log(`Vak: ${vak}; Score: ${punten}; dit is ${MAX_PUNTEN - punten} onder het maximum`);
}

// Oefening 4 – String interpolatie
console.log('\n%c=== String interpolatie ===', 'color: #0c0');
{
	const product = 'bananen';
	let aantal = 9;
	const stukprijs = 0.35;
	totaal = aantal*stukprijs;
	console.log(`Ik koop ${aantal} ${product} voor ${totaal} euro.`);

	let basis = 6;
	let hoogte = 4;
	oppervlakte = basis*hoogte/2;
	console.log(`Een driehoek met basis ${basis} m en hoogte ${hoogte} m heeft oppervlakte ${oppervlakte} m².`);
}

// Oefening 5 – Multiline strings
console.log('\n%c=== Multiline strings ===', 'color: #0c0');
{
	let naam = 'Yasmin Al-Hassan'
	let telefoon = '012 34 56 78'
	const kaartje = `+-------------------+
| Contact
|
| ${naam}
| ${telefoon}
+-------------------+`;
console.log(kaartje);
}

// Oefening 6 – Speciale waarden
console.log('\n%c=== Speciale waarden ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 7 – Arrays
console.log('\n%c=== Arrays ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 8 – Objecten
console.log('\n%c=== Objecten ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 9 – Datatypes
console.log('\n%c=== Datatypes ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 10 – Type conversie
console.log('\n%c=== Type conversie ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 11 – String methodes
console.log('\n%c=== String methodes ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 12 – Array methodes
console.log('\n%c=== Array methodes ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 13 – Selecties
console.log('\n%c=== Selecties ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 14 – Iteraties
console.log('\n%c=== Iteraties ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 15 – For-of en forEach
console.log('\n%c=== For-of en forEach ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 16 – Functies
console.log('\n%c=== Functies ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 17 – Math
console.log('\n%c=== Math ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

// Oefening 18 – Spread operator
console.log('\n%c=== Spread operator ===', 'color: #0c0');
{
	// vul hier aan
	// ...
}

