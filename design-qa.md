# Design QA — gebruikersvoorletter en compacte weekheader

## Vergelijkingsbasis

- Visuele bron: `/var/folders/6y/xg59vs2d2hd_jzp5pm2tr5dw0000gn/T/codex-clipboard-d1d152eb-69b4-4eb8-bd6e-e96db5f2a1cd.png`
- Implementatie weekscherm: `/Users/jasperhuting/.codex/visualizations/2026/08/04/019fccf8-c293-73a3-9bc7-d50b2c7c56da/tably-header-qa/implementation-week.png`
- Implementatie accountscherm: `/Users/jasperhuting/.codex/visualizations/2026/08/04/019fccf8-c293-73a3-9bc7-d50b2c7c56da/tably-header-qa/implementation-account.png`
- Genormaliseerde vergelijking: `/Users/jasperhuting/.codex/visualizations/2026/08/04/019fccf8-c293-73a3-9bc7-d50b2c7c56da/tably-header-qa/comparison.png`
- Apparaat en staat: iPhone 17 Pro-simulator, iOS 26.5, ingelogde gebruiker, week 3–9 augustus met dinsdag geselecteerd.
- Bronafmetingen: 776 × 586 px; de bron is een uitsnede zonder apparaatstatusbalk.
- Implementatieafmetingen: 1206 × 2622 px, 402 × 874 pt bij 3× dichtheid.
- Normalisatie: de bron is naar 1206 × 910 px geschaald; de overeenkomstige appregio is op 1206 × 910 px uitgesneden na de statusbalk.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

- De vaste `T` is op het weekscherm vervangen door de echte `J` van het gekoppelde gezinslid.
- De accountkaart gebruikt dezelfde echte gebruikersvoorletter in plaats van de merkplaceholder.
- De ruimte boven en onder de weeknavigatie is verkleind, waardoor `Weekplanning` nu in dezelfde uitsnede zichtbaar wordt.
- De pijliconen zijn iets kleiner, terwijl de bestaande tikvlakken behouden blijven.

## Vereiste kwaliteitsvlakken

- Typografie: bestaande lettertypen, gewichten en hiërarchie zijn behouden; geen nieuwe afbrekingen in de header.
- Ritme en uitlijning: logo, avatar, weektitel en datumstrip blijven uitgelijnd; alleen de bedoelde verticale ruimte is teruggebracht.
- Kleuren en tokens: bestaande Tably-kleuren en semantische tokens zijn ongewijzigd.
- Beeldkwaliteit: logo en receptafbeeldingen behouden hun oorspronkelijke bron, scherpte en uitsnede.
- Copy: merkregel, datumtekst en weeklabel zijn ongewijzigd.

## Vergelijkingsgeschiedenis

1. Broncontrole: vaste `T`, veel witruimte en grote visuele nadruk op de pijlen vastgesteld.
2. Implementatie: echte voorletterafleiding toegevoegd, beide vaste `T`-waarden verwijderd en de weekheader compacter gemaakt.
3. Controle na wijziging: weekscherm en accountscherm op de simulator vastgelegd; de genormaliseerde vergelijking laat de bedoelde veranderingen zien zonder regressie in logo, datumstrip of weekinhoud.

## Verificatie

- Weekscherm en accountscherm openen correct in Expo Go.
- `npm run lint` is geslaagd.
- `npx tsc --noEmit` is geslaagd.
- Tijdens de native controle zijn geen runtimefouten gelogd.
- De losse webpreview blijft beperkt door een bestaande server-renderingfout in de Supabase-opslag; dit raakt de native app en deze wijziging niet.

final result: passed

---

# Design QA — persoonlijke ingrediëntenvoorkeuren

## Vergelijkingsbasis

- Source visual truth: `/Users/jasperhuting/.codex/generated_images/019fd64b-c130-7810-b653-120f6960cab5/exec-240e3777-5629-4da4-8650-7bd1e69e3bb1.png`
- Implementatie met voorbeeldvoorkeuren: `/tmp/mealmate-design-qa/recipes-chip-row.png`
- Gecombineerde vergelijking: `/tmp/mealmate-design-qa/combined.png`
- Profielscherm: `/tmp/mealmate-design-qa/account.png`
- Keuzescherm: `/tmp/mealmate-design-qa/disliked-deduped.png`
- Apparaat en staat: iPhone 17 Pro-simulator, iOS 26.5, ingelogde gebruiker en drie voorbeeldingrediënten op de eerste receptkaart.
- Normalisatie: bron en implementatie zijn naar dezelfde breedte en hoogte geschaald en naast elkaar geopend.

## Full-view vergelijking

- De ingrediëntnamen staan als compacte chips onder de beoordeling, zonder extra verklarende zin of teller op de receptkaart.
- Bij meerdere treffers staan de chips naast elkaar over de beschikbare kaartbreedte en wordt de warme kleur sterker.
- Pen, oog en ster blijven als drie even brede ronde acties rechts van de receptinformatie staan.
- De recepttitel heeft een zichtbare chevron en blijft de primaire route naar het receptdetail.
- Het profiel bevat één compacte voorkeurenregel; de aparte keuzelijst gebruikt bestaande Tably-typografie, kleuren, zoekveld en selectiestijl.

## Vereiste kwaliteitsvlakken

- Typografie: bestaande Tably-hiërarchie en gewichten zijn behouden; chiptekst blijft compact maar leesbaar.
- Ritme en uitlijning: de acties blijven op één regel rechts; de chips gebruiken de volledige kaartbreedte en veroorzaken geen verticale stapel bij drie voorbeeldwaarden.
- Kleuren en tokens: de basisinterface blijft groen en mint; alleen de persoonlijke waarschuwing gebruikt oplopend warm oranje.
- Beeldkwaliteit: bestaande receptfoto's zijn ongewijzigd, scherp en correct uitgesneden.
- Copy: uitsluitend de betreffende ingrediëntnamen staan op de kaart; `ingrediënten lust je niet` is niet toegevoegd.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden binnen de gekozen richting en de laatste instructie om de acties rechts te houden.

## Vergelijkingsgeschiedenis

1. Eerste implementatie plaatste drie langere ingrediëntchips onder elkaar in de smalle tekstkolom.
2. De chips zijn naar een kaartbrede rij onder de hoofdinhoud verplaatst.
3. De eindvergelijking toont drie chips naast elkaar, met de acties ongewijzigd rechts en zonder brede beoordelingsregel.

## Verificatie

- Profiel, keuzelijst en receptoverzicht zijn in de native debugbuild geopend.
- De keuzelijst is opgebouwd uit unieke ingrediënten die al in de geladen recepten voorkomen; schrijfwijzen met en zonder spatie rond `%` worden samengevoegd.
- De visuele treffers zijn met een uitsluitend tijdelijke ontwikkelstaat gecontroleerd; deze voorbeeldwaarden maken geen deel uit van de productiecode of OTA.
- Databaseversie `0021_personal_disliked_ingredients.sql` is op de gekoppelde omgeving toegepast en als lokaal/remote gelijk bevestigd.

final result: passed

---

# Design QA — ingelogde persoon benadrukt bij ‘Iedereen’

## Vergelijkingsbasis

- Visuele bron en gewenste staat: `/var/folders/6y/xg59vs2d2hd_jzp5pm2tr5dw0000gn/T/codex-clipboard-dd9860fa-526a-4d3e-a74f-5835b4a4b132.png`, aangevuld met de expliciete eis dat de ingelogde persoon vetgedrukt is.
- Implementatie: `/Users/jasperhuting/.codex/visualizations/2026/08/04/019fce02-ee51-7c52-bc1c-8f81a399b463/tably-current-user-qa/everyone-current-user-bold.png`.
- Apparaat en staat: iPhone 17 Pro-simulator, iOS 26.5, `Iedereen` geselecteerd en Jasper ingelogd.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

- Jasper is in de gezamenlijke stand zichtbaar vetter dan Lisanne.
- De nadruk wordt bepaald via het gekoppelde gebruikersaccount en werkt daardoor ook voor een ander ingelogd gezinslid.
- De afmetingen, uitlijning en geselecteerde staat van de compacte wisselaar zijn ongewijzigd gebleven.
- Bij een losse persoonskeuze blijft de gekozen tab zijn bestaande geselecteerde typografie en kleur houden.

## Verificatie

- De bron en de nieuwe native simulatorscreenshot zijn gezamenlijk visueel beoordeeld.
- De iOS-debugbuild is opnieuw opgebouwd en gestart zonder fouten.
- `npx tsc --noEmit`, `npm run lint` en `git diff --check` zijn geslaagd.

final result: passed

---

# Design QA — compacte persoonswisselaar in de weekplanning

## Vergelijkingsbasis

- Visuele bron/defaultstaat: `/Users/jasperhuting/Documents/projecten/MealMate/tmp/design-qa/person-switcher-jasper.png`
- Implementatie/gewisselde staat: `/Users/jasperhuting/Documents/projecten/MealMate/tmp/design-qa/person-switcher-lisanne.png`
- Apparaat en staat: iPhone 17 Pro-simulator, iOS 26.5, week 3–9 augustus, dinsdag geselecteerd; dezelfde data en viewport in de Jasper- en Lisanne-weergave.
- Bron- en implementatieafmetingen: 1206 × 2622 px, overeenkomend met 402 × 874 pt bij 3× dichtheid.
- Normalisatie: niet nodig; beide screenshots komen uit dezelfde native simulator, met dezelfde viewport, schaal en uitsnede.

## Full-view vergelijking

- De hoge woensdagkaart met meerdere gerechten is vervangen door één compacte gerechtregel voor de gekozen persoon.
- De persoonswisselaar staat direct onder `Weekplanning` en gebruikt weinig verticale ruimte.
- Bij het wisselen van Jasper naar Lisanne veranderen de teller, dagminiaturen, gerechtregels, lege staten en `voor …`-tekst mee.
- De bestaande dagselectie, actieregel en onderste navigatie behouden hun positie en visuele hiërarchie.

## Gerichte vergelijking

De twee volledige screenshots zijn in één gecombineerde vergelijking geopend. De wisselaar en de woensdagregel zijn groot genoeg om selectie, gerechtfoto, titel en persoonslabel betrouwbaar te beoordelen; een extra crop was niet nodig.

## Vereiste kwaliteitsvlakken

- Typografie: namen gebruiken compacte maar leesbare labels; de gekozen persoon heeft voldoende contrast en bestaande gerechtgewichten blijven behouden.
- Ritme en uitlijning: de schakelaar voegt slechts 44 pt hoogte toe; iedere dag blijft één regel hoog, ook als meerdere gezinsleden verschillende gerechten eten.
- Kleuren en tokens: de actieve keuze gebruikt bestaand donkergroen en wit; de inactieve keuze gebruikt bestaande mint-, tekst- en randtokens.
- Beeldkwaliteit: de receptfoto wisselt mee met de persoon en behoudt dezelfde ronde uitsnede en scherpte.
- Copy: teller, maaltijdmetadata en lege staat noemen steeds de actieve persoon; de knop `Gerecht wijzigen` maakt het doel duidelijker.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

## Vergelijkingsgeschiedenis

1. Voor de wijziging nam een dag met meerdere gerechten meerdere gestapelde regels in beslag.
2. De compacte persoonswisselaar en één persoonsgebonden dagregel zijn geïmplementeerd.
3. In de native simulator is van Jasper naar Lisanne en terug gewisseld. De geselecteerde chip en alle zichtbare weekgegevens veranderden zonder layoutverschuiving of verborgen bediening.

## Verificatie

- Primaire interactie getest: tikken op `Lisanne` en `Jasper` wisselt de volledige weekweergave.
- De releasebuild is opnieuw gebouwd, geïnstalleerd en gestart in de iOS-simulator.
- `npx tsc --noEmit`, `npm run lint` en `git diff --check` zijn geslaagd.
- Tijdens openen en wisselen zijn geen crash of zichtbare runtimefout opgetreden.
- Wijzigen opent de planner met de actieve persoon als voorselectie; verwijderen is beperkt tot het zichtbare gerecht van die persoon.

final result: passed

---

# Design QA — duidelijke verdeling van gerechten per persoon

## Vergelijkingsbasis

- Visuele bron: `/var/folders/6y/xg59vs2d2hd_jzp5pm2tr5dw0000gn/T/codex-clipboard-33e7df17-8169-43bf-b7c9-ddf665a1c4df.png`
- Implementatie: `/tmp/mealmate-clear-assignments-final-v2.png`
- Apparaat en staat: iPhone 17 Pro-simulator, iOS 26.5, week 3–9 augustus, woensdag geselecteerd met twee gerechten en twee verschillende eters.
- Bronafmetingen: 640 × 144 px; probleemuitsnede van de oude samengevoegde gerechtregel.
- Implementatieafmetingen: 1206 × 2622 px, 402 × 874 pt bij 3× dichtheid.
- Normalisatie: de bron is als gerichte probleemuitsnede naast de volledige native implementatie beoordeeld; de relevante woensdagkaart is in beide beelden op leesbare schaal zichtbaar.

## Full-view vergelijking

- De oude titel `Friet met Kaassoufflé + 1` en afgekorte doorlopende subtitel zijn verdwenen.
- Ieder gerecht heeft nu een eigen foto, volledige titel, persoonsicoon, expliciete `Voor …`-regel en eigen tikpijl.
- De kaart groeit mee met lange gerechtstitels, zonder ellipsis of verborgen toewijzingen.
- Een dag met één gezamenlijk gerecht gebruikt de compacte tekst `voor iedereen`.

## Gerichte vergelijking

De gerichte woensdagkaart is afzonderlijk beoordeeld binnen de gecombineerde bron- en implementatieweergave. De namen `Jasper` en `Lisanne`, beide gerechtstitels en de twee afzonderlijke navigatiepijlen zijn volledig leesbaar; een extra crop was daardoor niet nodig.

## Vereiste kwaliteitsvlakken

- Typografie: gerechtstitels houden de bestaande zware Tably-hiërarchie; persoonsnamen gebruiken een kleinere groene ondersteuningsregel en lopen niet meer samen met de titel.
- Ritme en uitlijning: beide gerechten vormen gelijk opgebouwde regels met een subtiele scheidingslijn; de dagkolom en acties blijven op hun bestaande plek.
- Kleuren en tokens: uitsluitend bestaande Tably-groen-, mint- en randtokens zijn gebruikt.
- Beeldkwaliteit: ieder gerecht gebruikt zijn eigen bestaande `RecipeImage`, met ronde uitsnede en zonder nieuwe placeholders.
- Copy: `+ 1` is vervangen door volledige gerechtstitels en `Voor Jasper` / `Voor Lisanne`; technische accountnamen worden voor deze samenvatting tot een leesbare voornaam verkort.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

## Vergelijkingsgeschiedenis

1. Broncontrole: één samengevoegde titel, een afgekorte subtitel en geen duidelijke visuele koppeling tussen persoon en gerecht vastgesteld.
2. Eerste implementatie: afzonderlijke gerechtregels toegevoegd. De tweede lange titel werd nog na twee regels afgekapt en de accountnaam `jasper.huting` bleef zichtbaar.
3. Correctie: vaste regellimiet verwijderd, accountachtige namen leesbaar verkort en gezamenlijke gerechten als `voor iedereen` weergegeven.
4. Eindcontrole: beide volledige gerechten en hun toegewezen persoon zijn zonder truncatie zichtbaar in de native simulator.

## Verificatie

- Beide gerechtregels openen afzonderlijk hun eigen receptdetail.
- `npm run lint` is geslaagd.
- `npx tsc --noEmit` is geslaagd.
- De actuele releasebuild is geïnstalleerd en visueel gecontroleerd op de iOS-simulator.

final result: passed

---

# Tably fresh-green color QA

- Source visual truth: `/Users/jasperhuting/.codex/generated_images/019fcdb6-6634-7691-a134-e7fc497545ed/exec-576d02ef-4c5c-48bf-9c34-14073087aa9f.png`
- Implementation screenshot: `/Users/jasperhuting/Documents/projecten/MealMate/tmp/design-qa/tably-green-implementation.png`
- Combined comparison: `/Users/jasperhuting/Documents/projecten/MealMate/tmp/design-qa/tably-green-comparison.png`
- Source pixels: 853 × 1844
- Implementation pixels: 1206 × 2622
- Implementation viewport: iPhone 17 Pro simulator, 402 × 874 points at 3× density
- Comparison normalization: both images normalized to 1844 px height and placed side by side
- State: authenticated weekly meal-planning screen, Tuesday 4 August selected

## Scope

The user explicitly requested a color-only implementation. Existing layout, information hierarchy, typography, content, and interactions were intentionally preserved. The selected visual direction is used as color reference rather than as a layout replacement.

## Full-view comparison evidence

- The implementation now carries the selected fresh-green character throughout navigation, active dates, headings, buttons, selection borders, soft surfaces, and supporting text.
- The base background is a light warm ivory, with white surfaces and pale mint selected/empty states, matching the healthy and fresh balance of the source direction.
- The original orange emphasis has been removed from normal brand and interaction states. Red remains only where it conveys a negative attendance state.
- The Tably wordmark and bowl mark retain their original geometry. Their updated green and crisp coral colors are visibly clean and no longer blend into brown.
- The development-only warning banner overlaps the very bottom of the captured simulator image. The persistent navigation remains sufficiently visible for color evaluation, and the banner is not part of the production UI.

## Focused-region evidence

No additional crop was needed. The full-height comparison shows the relevant color surfaces at readable scale: wordmark, week selector, selected-day treatment, primary and secondary actions, list states, and bottom navigation. The launcher icon was separately inspected at its full 1024 × 1024 resolution.

## Required fidelity surfaces

- Fonts and typography: unchanged by design; hierarchy and legibility are preserved.
- Spacing and layout rhythm: unchanged by design; no color edit introduced clipping or layout drift.
- Colors and visual tokens: fresh accessible green is consistently applied; coral is limited to the bowl mark; soft states use mint rather than peach/orange.
- Image quality and asset fidelity: meal imagery is unchanged; wordmark and bowl geometry are preserved; launcher and adaptive icons remain correctly sized and transparent where required.
- Copy and content: unchanged by design.

## Findings

No actionable P0, P1, or P2 differences remain within the requested color-only scope.

## Comparison history

1. Initial simulator pass found the main green palette applied, but the selected bottom-tab background still used the previous peach RGBA value.
2. The selected-tab color was changed to the shared pale-mint `palette.sageSoft` token and the simulator implementation was rebuilt and recaptured.
3. Post-fix evidence shows a consistent green/mint interaction system across the selected date, meal card, actions, and navigation.

## Residual test gaps

- The Expo web renderer currently fails during existing server-side auth initialization because `window` is referenced during server rendering. Native iOS validation was used instead.
- Android icon files and Expo configuration were validated statically; the visual runtime pass was performed on iOS.

final result: passed

---

# Design QA — Iedereen in de persoonswisselaar

## Vergelijkingsbasis

- Source visual truth: `/var/folders/6y/xg59vs2d2hd_jzp5pm2tr5dw0000gn/T/codex-clipboard-dbf39cdc-2249-438e-9ae8-e055e7fd7946.png`
- Implementation screenshot: `/Users/jasperhuting/Documents/projecten/MealMate/tmp/design-qa/everyone-switcher.png`
- Viewport: iPhone 17 Pro-simulator, 402 × 874 pt bij 3× dichtheid.
- Bronafmetingen: 418 × 110 px; gerichte uitsnede van de tweepersoonswisselaar.
- Implementatieafmetingen: 1206 × 2622 px; volledige native appweergave.
- Normalisatie: de bron is als gerichte componentuitsnede naast de volledige implementatie beoordeeld; de wisselaar is in beide beelden op leesbare schaal zichtbaar.
- Staat: `Iedereen` geselecteerd, dinsdag geselecteerd, woensdag bevat twee verschillende gerechten.

## Full-view vergelijking

- De bestaande afgeronde Tably-wisselaar en de Jasper/Lisanne-opties zijn visueel behouden.
- `Iedereen` is als volwaardige eerste optie toegevoegd en past met beide personen binnen dezelfde schermbreedte.
- In de gezamenlijke stand blijft iedere dag één compacte regel hoog.
- Woensdag toont twee overlappende gerechtfoto's en twee regels die Jasper en Lisanne rechtstreeks aan hun gerecht koppelen.

## Gerichte vergelijking

De bronuitsnede en de volledige implementatie zijn samen geopend. De relevante verschillen — de extra optie, geselecteerde staat, binnenmarges, rand, iconen en namen — zijn duidelijk leesbaar; een aanvullende crop was niet nodig.

## Vereiste kwaliteitsvlakken

- Typografie: dezelfde naamgrootte en gewichten zijn behouden; `Iedereen` gebruikt dezelfde geselecteerde hiërarchie.
- Ritme en uitlijning: alle drie opties passen in één compacte capsule zonder horizontale overflow of extra regelhoogte.
- Kleuren en tokens: geselecteerd donkergroen, witte tekst, mint initialen en de bestaande randtoken zijn consistent toegepast.
- Beeldkwaliteit: bestaande receptfoto's blijven scherp; de gezamenlijke woensdagregel gebruikt twee echte receptbeelden in plaats van een placeholder.
- Copy en inhoud: `Iedereen`, `Jasper` en `Lisanne` zijn expliciet; bij verschillende gerechten noemt de regel zichtbaar wie wat eet.

## Findings

Geen openstaande P0-, P1- of P2-afwijkingen gevonden.

## Vergelijkingsgeschiedenis

1. Broncontrole: alleen Jasper en Lisanne konden afzonderlijk worden gekozen.
2. Implementatie: `Iedereen` toegevoegd als standaardkeuze en de gezamenlijke dagweergave compact gemaakt.
3. Native eindcontrole: de drie opties passen in één regel; dinsdag toont een gezamenlijk gerecht en woensdag toont twee persoonsgebonden gerechten zonder hogere dagkaart.

## Verificatie

- De releasebuild is gebouwd, geïnstalleerd en gestart in de iOS-simulator.
- `Iedereen` is als geselecteerde standaardstaat visueel gecontroleerd met geladen gezins- en maaltijddata.
- Primaire interactie getest: van `Iedereen` naar `Jasper` en terug wisselen werkt; teller, dagminiaturen en gerechtregels veranderen mee.
- De bestaande Jasper- en Lisanne-keuzes blijven afzonderlijke interactieve tabknoppen.
- `npx tsc --noEmit`, `npm run lint` en `git diff --check` zijn geslaagd.
- Geen crash of zichtbare runtimefout tijdens laden van de gezamenlijke weergave.

final result: passed
