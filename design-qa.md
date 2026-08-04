# Design QA — onboarding voor een leeg gezin

## Comparison target

- Source visual truth: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-next-audit/04-family.png`, aangevuld met het goedgekeurde voorstel om de dubbele lege gezinssamenvatting te vervangen door één actiegerichte onboardingkaart.
- Implementation screenshot: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-family-onboarding/01-family-empty.png`.
- Side-by-side comparison: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-family-onboarding/03-family-empty-compare.png`.
- Interaction screenshot: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-family-onboarding/05-cta-interaction.png`.
- Viewport: iPhone 17 Pro simulator, 402 × 874 logische punten, 3× pixel density.
- Source pixels: 1206 × 2622.
- Implementation pixels: 1206 × 2622; geen density-normalisatie nodig.
- State: ingelogd huishouden met nul gezinsleden, drie recepten en drie geplande maaltijden.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

- Fonts and typography: de bestaande schermheader blijft ongewijzigd. De onboardingkaart gebruikt de bestaande systeemfont en hiërarchie; titel, uitleg, receptstatus en knoptekst zijn volledig leesbaar zonder truncatie of ongewenste wrapping.
- Spacing and layout rhythm: de losse huishoudkaart, sectietitel en lege smaakkaart zijn vervangen door één gegroepeerde kaart. De primaire actie staat volledig boven de vouw en `Deze week samen` volgt direct daarna. Kaartpadding, radius en schaduw sluiten aan op de bestaande MealMate-componenten.
- Colors and visual tokens: de kaart gebruikt uitsluitend het actuele oranje palet via de bestaande semantische tokens. Er zijn geen losse kleurwaarden aan deze flow toegevoegd.
- Image quality and asset fidelity: er zijn geen nieuwe rasterassets nodig. Het groepsicoon komt uit dezelfde bestaande iconenbibliotheek; gerechtbeelden en fallbacks zijn ongewijzigd.
- Copy and content: `Eet samen in MealMate`, de twee mogelijke vervolgroutes en `Gezin instellen` maken de eerste taak concreet. De relevante context dat drie recepten al klaarstaan blijft behouden zonder de eerdere nul-ledensamenvatting te herhalen.
- Accessibility: de primaire actie behoudt `accessibilityRole="button"` en een 52 pt hoge aanraakzone. Volledige VoiceOver- en Dynamic Type-controle valt buiten screenshot-QA.

## Full-view comparison evidence

De gecombineerde vergelijking toont links de eerdere toestand en rechts de implementatie. In de implementatie is de oplossing voor de lege toestand direct zichtbaar, terwijl het bestaande weekoverzicht, accountgedeelte en de tabbar dezelfde volgorde en vormgeving behouden.

## Focused region comparison evidence

Een extra crop was niet nodig: de onboardingkaart en de eerdere twee lege blokken zijn in de 2412 × 2622 side-by-side vergelijking groot genoeg om tekst, spacing, icoon en knop te beoordelen.

## Interaction verification

- `Gezin instellen` is in de simulator bediend.
- De actie opent de bestaande route `Gezin delen` als modal.
- Zowel `Maak uitnodigingscode` als de invoer voor deelname met een code zijn zichtbaar in de vervolgroute.
- De bestaande weergave voor huishoudens mét leden blijft conditioneel intact; de huidige testaccount bevat geen leden om die toestand live vast te leggen.
- Metro rapporteerde geen runtimefouten tijdens de visuele controle.
- `npm run lint` is geslaagd.
- `npx tsc --noEmit` is geslaagd.
- `git diff --check` is geslaagd.

## Comparison history

1. Voor wijziging: de lege toestand bestond uit een huishoudkaart, een losse smaak-empty-state en pas na het weekoverzicht een uitnodigingsactie.
2. Implementatie: deze drie onderdelen zijn bij nul leden vervangen door één onboardingkaart met een primaire actie boven de vouw.
3. Na vergelijking: de beoogde hiërarchie, copy en werkende vervolgroute zijn aanwezig; er waren geen P0/P1/P2-correcties nodig.

## Follow-up polish

- P3: de blauwe simulatoroverlay bedekt lokaal delen van screenshots; dit is geen MealMate-element en is afwezig in productie.
- Uitgesteld op verzoek: echte gerechtfoto's en een verzorgde fallback.

---

# Design QA — zichtbare beoordelingsflow

## Comparison target

- Source visual truth: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-rating-audit/01-recipes.png`, aangevuld met het goedgekeurde voorstel om beoordelen als expliciete actie te tonen.
- Implementation screenshot: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-rating-implementation/01-visible-family-setup-action.png`.
- Side-by-side comparison: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-rating-implementation/04-before-after.png`.
- Interaction screenshot: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-rating-implementation/02-family-sharing-route.png`.
- Direct-link fallback: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-rating-implementation/03-direct-link-fallback.png`.
- State: ingelogd huishouden met nul gezinsleden en drie recepten.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

- Hiërarchie: titel, receptgegevens en bewerkactie blijven de bovenste rij vormen. De nieuwe gezinsactie krijgt een eigen zachte actiebalk onderaan de kaart en kan niet meer worden verward met bewerken.
- Dichtheid: alle drie recepten blijven zichtbaar in de lijst; de kaarten zijn hoger, maar de extra ruimte heeft nu een concrete functie en de tabbar bedekt de laatste actie niet.
- Kleuren en vorm: de actiebalk gebruikt de bestaande zachte en donkere accenttokens, dezelfde hoekradius en dezelfde iconenbibliotheek als de rest van MealMate.
- Copy: `Gezin instellen om te beoordelen` legt zowel de blokkade als de volgende stap uit zonder eerst een nutteloos formulier te openen.
- Toegankelijkheid: beide acties hebben een eigen knoprol, beschrijvend label en minimaal 44 pt hoge aanraakzone. Volledige VoiceOver- en Dynamic Type-controle valt buiten screenshot-QA.

## Interaction verification

- De eerste actiebalk is in de simulator bediend en opent direct `Gezin delen`.
- Een directe of oude link naar `Gerecht beoordelen` toont bij nul gezinsleden een gerichte lege toestand met `Gezin instellen`; de misleidende bewaarknop is afwezig.
- De route voor huishoudens mét leden blijft de bestaande sterrenbeoordeling openen; de huidige testaccount bevat geen leden om die toestand live vast te leggen.
- `npm run lint` is geslaagd.
- `npx tsc --noEmit` is geslaagd.
- `git diff --check` is geslaagd.

---

# Design QA — los product toevoegen

## Comparison target

- Source visual truth: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-audit/02-add-product.png`, aangevuld met het goedgekeurde voorstel om de lange afdelingenlijst te vervangen door één compacte keuze.
- Implementation screenshot: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-implementation/09-form-compact.png`.
- Side-by-side comparison: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-implementation/12-before-after.png`.
- Afdelingskiezer: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-implementation/10-department-picker.png`.
- Gewijzigde keuze: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-implementation/11-department-selected.png`.
- Toetsenbordtoestand: `/Users/jasperhuting/.codex/visualizations/2026/08/03/019fc889-ca0d-7993-a132-d8a570060770/mealmate-shopping-implementation/08-form-keyboard-floating.png`.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

- Taaklengte: product, hoeveelheid, eenheid, gekozen afdeling en primaire actie staan zonder scrollen in één scherm.
- Afdelingskeuze: de huidige keuze is direct zichtbaar. De volledige lijst is verplaatst naar een sheet die dezelfde radiokaarten en geselecteerde toestand gebruikt als de bestaande boodschappenflow.
- Primaire actie: `Voeg toe aan lijst` blijft onderaan zichtbaar en wordt op iOS boven het softwaretoetsenbord geplaatst.
- Visuele consistentie: veld, sheet, iconen, radioknoppen en accentkleuren gebruiken uitsluitend bestaande MealMate-patronen en tokens.
- Toegankelijkheid: het compacte veld heeft een knoprol, actuele waarde en hint. De sheetopties behouden hun radiosemantiek en geselecteerde toestand. Volledige VoiceOver- en Dynamic Type-controle valt buiten screenshot-QA.

## Interaction verification

- Het compacte afdelingsveld is in de simulator bediend.
- De afdelingssheet opent met de huidige keuze zichtbaar en geselecteerd.
- `Brood en gebak` is geselecteerd; de sheet sluit en het formulier toont de nieuwe waarde.
- Het softwaretoetsenbord is aangezet; de primaire actie blijft volledig zichtbaar en bedienbaar boven het toetsenbord.
- Bestaande validatie en opslaglogica zijn inhoudelijk ongewijzigd.
- `npm run lint` is geslaagd.
- `npx tsc --noEmit` is geslaagd.
- `git diff --check` is geslaagd.

final result: passed
