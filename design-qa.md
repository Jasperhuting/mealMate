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
