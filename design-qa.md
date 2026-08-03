# Design QA — duidelijkere huidige datum

## Comparison target

- Source visual truth: `/Users/jasperhuting/.codex/generated_images/019fc396-cd82-7e11-b1b9-07daef71d17b/exec-d6651225-67e4-4039-926d-6765604b9571.png`, aangevuld met de gebruikersvraag om de huidige datum visueel duidelijker te maken.
- Implementation screenshot, gekozen week: `/tmp/mealmate-week-today.png`
- Implementation screenshot, huidige week met vandaag zichtbaar: `/tmp/mealmate-week-current-week.png`
- Side-by-side comparison: `/tmp/mealmate-week-today-comparison.png`
- Viewport: iPhone 17 Pro simulator, 402 × 874 CSS-punten, 3× pixel density.
- Source pixels: 853 × 1844.
- Implementation pixels: 1206 × 2622; voor de side-by-side vergelijking genormaliseerd naar 853 × 1844.
- State: week 3–9 augustus met maandag geselecteerd; aanvullend week 27 juli–2 augustus om de vandaag-markering op zondag 2 augustus te controleren.

## Findings

Geen P0-, P1- of P2-afwijkingen gevonden.

- Fonts and typography: de nieuwe regel gebruikt het bestaande systeemlettertype, een rustige secundaire grootte en voldoende gewicht. De datum blijft volledig leesbaar zonder afbreken.
- Spacing and layout rhythm: de vandaagregel past onder het merk zonder overlap. De extra regel houdt de bestaande hiërarchie en kaartafstanden intact.
- Colors and visual tokens: de markering gebruikt uitsluitend bestaande sage- en teksttokens. Het contrast is duidelijk, maar concurreert niet met de geselecteerde dag.
- Image quality and asset fidelity: receptafbeeldingen, maskers en crops zijn onveranderd en scherp.
- Copy and content: `Vandaag · zondag 2 augustus` maakt de actuele datum expliciet. Wanneer vandaag in de getoonde week valt, krijgt het datumcijfer daarnaast een sage-ring.
- Accessibility and state: de dag blijft dezelfde toegankelijke tab; de vandaagmarkering verandert de geselecteerde toestand niet.

## Full-view comparison evidence

De gecombineerde vergelijking laat zien dat de merkregel, weekwisselaar, dagstrip, gekozen maaltijdkaart en weeklijst intact blijven. De actuele datum is toegevoegd als secundaire context direct onder MealMate. De bron en implementatie gebruiken bewust andere receptdata; dat is een dataverschil, geen ontwerpafwijking.

## Focused region comparison evidence

`/tmp/mealmate-week-current-week.png` toont de relevante toestand op volledige native resolutie: zondag 2 augustus heeft een duidelijke ronde sage-markering, terwijl maandag als geselecteerde dag donker gevuld blijft. Hierdoor zijn `vandaag` en `geselecteerd` twee afzonderlijke, begrijpelijke toestanden. Een aparte crop was niet nodig omdat beide toestanden op de volledige screenshot goed leesbaar zijn.

## Interaction verification

- Vorige week is op de simulator bediend en laadde 27 juli–2 augustus.
- De geselecteerde dag bleef maandag; vandaag werd onafhankelijk op zondag gemarkeerd.
- Metro rapporteerde geen runtimefouten tijdens deze interactie.
- TypeScript, Expo lint en de volledige iOS-export zijn geslaagd.

## Comparison history

1. Voor wijziging: alleen de geselecteerde dag was zichtbaar; de werkelijke huidige datum was niet expliciet aanwezig wanneer een andere week werd bekeken.
2. Fix: een vaste vandaagregel onder het merk en een datumring wanneer vandaag in de zichtbare week valt.
3. Na fix: beide toestanden zijn gelijktijdig herkenbaar zonder layoutverschuivingen of verborgen bediening.

## Follow-up polish

- P3: de blauwe Expo-ontwikkelknop kan in de simulator tijdelijk de knop voor de volgende week bedekken. Dit is geen MealMate-element en is afwezig in productie.

final result: passed
