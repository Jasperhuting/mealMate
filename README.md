# Tably

**Save it. Plan it. Shop for it.**

Tably helpt huishoudens samen recepten onthouden, een weekmenu plannen en daar automatisch een boodschappenlijst van maken.

## Wat nu al werkt

- automatisch weekmenu voor de komende maandag tot en met zondag;
- een gerecht kiezen of vervangen;
- vóór het plannen aangeven welke ingrediënten al in huis zijn;
- automatische boodschappenlijst per winkelafdeling;
- losse boodschappen toevoegen, afvinken en verwijderen;
- per product zien voor welk gerecht het nodig is;
- boodschappen afvinken en tussen sessies synchroniseren;
- persoonlijke beoordelingen voor Jasper en Lisanne in het gedeelde huishouden;
- zelf gerechten met ingrediënten en een foto toevoegen en beveiligd in Supabase bewaren;
- recepttekst, een link, screenshot of kookboekfoto door AI laten omzetten naar een invulbaar recept;
- overzicht van het gedeelde huishouden.
- een eenmalige gezinscode maken en op een ander toestel deelnemen aan hetzelfde huishouden.
- registreren en inloggen via Apple of Google, met een afgeschermde app totdat de sessie geldig is.

Tably begint met een leeg huishouden. Recepten, ingrediënten, receptfoto's, weekmenu, voorraadkeuzes, boodschappen en persoonlijke beoordelingen worden in Supabase opgeslagen; een lokale cache houdt de laatst geladen recepten beschikbaar.

## Starten

1. Installeer de afhankelijkheden met `npm install`.
2. Start de app met `npm start`.
3. Druk op `i` voor de iOS-simulator of scan de QR-code met Expo Go.

Voor een webweergave kun je `npm run web` gebruiken.

## Supabase

Tably is gekoppeld aan een eigen Supabase-project in `eu-central-1`. De database bevat profielen, huishoudens, recepten, ingrediënten, weekplannen, beoordelingen en boodschappen. Row Level Security beperkt toegang tot leden van hetzelfde huishouden en receptfoto's staan in een privébucket.

Totdat het accountscherm af is, meldt de app een nieuw apparaat automatisch anoniem aan en maakt hij één huishouden aan. Dit account kan later aan een definitieve inlogmethode worden gekoppeld.

### AI-recepten activeren

De OpenAI-sleutel hoort uitsluitend in Supabase en nooit in de mobiele app. Zet hem als servergeheim en publiceer daarna de beveiligde functie:

```sh
supabase secrets set OPENAI_API_KEY=...
supabase secrets set OPENAI_RECIPE_MODEL=gpt-5.6
supabase functions deploy parse-recipe --use-api
```

De functie vereist een geldige Supabase-gebruiker. Totdat het gezinsaccountscherm er is, maakt de app daarvoor automatisch een anonieme gebruiker aan. Zo kan Tably recepttekst, links en foto's verwerken zonder de geheime OpenAI-sleutel op de telefoon te bewaren.

De AI-functie is al gepubliceerd; alleen het OpenAI-servergeheim moet nog worden toegevoegd.

## Belangrijkste mappen

- `src/app`: schermen en navigatie;
- `src/state`: lokale Tably-logica;
- `src/data`: voorbeeldrecepten en ingrediënten;
- `src/lib`: voorbereiding op externe diensten;
- `supabase/functions`: beveiligde AI-verwerking op de server;
- `supabase/migrations`: databaseschema met toegangsregels.
