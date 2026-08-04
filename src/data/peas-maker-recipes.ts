import type { Recipe } from '@/data/mock-data';

// Gegenereerd uit https://www.peasmaker.nl/pages/recepten op 2026-08-04.
// Alleen gestructureerde receptgegevens worden bewaard; voor de volledige bereiding opent Tably de bron.
const peasMakerImages: Record<string, Recipe['image']> = {
  "broccoli-met-venkelgehakt": require('@/assets/images/peas-maker/broccoli-met-venkelgehakt.jpg'),
  "midden-oosterse-wraps": require('@/assets/images/peas-maker/midden-oosterse-wraps.jpg'),
  "chili-sin-carne": require('@/assets/images/peas-maker/chili-sin-carne.jpg'),
  "orzopasta": require('@/assets/images/peas-maker/orzopasta.jpg'),
  "vegan-zuurvlees": require('@/assets/images/peas-maker/vegan-zuurvlees.jpg'),
  "vegan-butter-chicken": require('@/assets/images/peas-maker/vegan-butter-chicken.jpg'),
  "vegan-kip-pasteitjes": require('@/assets/images/peas-maker/vegan-kip-pasteitjes.jpg'),
  "vegan-gyros": require('@/assets/images/peas-maker/vegan-gyros.jpg'),
  "quinoa-salade": require('@/assets/images/peas-maker/quinoa-salade.jpg'),
  "vegan-kip-cashew": require('@/assets/images/peas-maker/vegan-kip-cashew.jpg'),
  "vegan-shoarma": require('@/assets/images/peas-maker/vegan-shoarma.webp'),
  "vegan-cacciatore": require('@/assets/images/peas-maker/vegan-cacciatore.webp'),
  "vegan-bolognese": require('@/assets/images/peas-maker/vegan-bolognese.webp'),
  "amerikaanse-salade": require('@/assets/images/peas-maker/amerikaanse-salade.webp'),
  "vegan-mac-and-cheese": require('@/assets/images/peas-maker/vegan-mac-and-cheese.webp'),
  "kapuska": require('@/assets/images/peas-maker/kapuska.webp'),
  "vegan-kippensoep": require('@/assets/images/peas-maker/vegan-kippensoep.webp'),
  "vegan-sushi-bowl": require('@/assets/images/peas-maker/vegan-sushi-bowl.jpg'),
  "broodje-vegan-tonijnsalade": require('@/assets/images/peas-maker/broodje-vegan-tonijnsalade.jpg'),
  "vegan-hartige-taart": require('@/assets/images/peas-maker/vegan-hartige-taart.jpg'),
  "vegan-vol-au-vent": require('@/assets/images/peas-maker/vegan-vol-au-vent.jpg'),
  "kerrie-noedels": require('@/assets/images/peas-maker/kerrie-noedels.jpg'),
  "vegan-sate-curry": require('@/assets/images/peas-maker/vegan-sate-curry.jpg'),
  "vegan-panang-curry": require('@/assets/images/peas-maker/vegan-panang-curry.jpg'),
  "vegan-enchiladas": require('@/assets/images/peas-maker/vegan-enchiladas.jpg'),
  "vegan-kip-broodje": require('@/assets/images/peas-maker/vegan-kip-broodje.jpg'),
  "taco-salade": require('@/assets/images/peas-maker/taco-salade.jpg'),
  "caribische-curry": require('@/assets/images/peas-maker/caribische-curry.jpg'),
  "vegan-bobotie": require('@/assets/images/peas-maker/vegan-bobotie.jpg'),
  "vegan-korma-curry": require('@/assets/images/peas-maker/vegan-korma-curry.jpg'),
  "vegan-babi-pangang": require('@/assets/images/peas-maker/vegan-babi-pangang.jpg'),
  "vegan-hachee": require('@/assets/images/peas-maker/vegan-hachee.jpg'),
  "vegan-saucijzenbroodje": require('@/assets/images/peas-maker/vegan-saucijzenbroodje.jpg'),
  "vegan-haggisballen": require('@/assets/images/peas-maker/vegan-haggisballen.jpg'),
  "vegan-makreelrillette": require('@/assets/images/peas-maker/vegan-makreelrillette.jpg'),
  "pasta-ragu": require('@/assets/images/peas-maker/pasta-ragu.jpg'),
  "massaman-curry": require('@/assets/images/peas-maker/massaman-curry.jpg'),
  "noedels-met-broccoli": require('@/assets/images/peas-maker/noedels-met-broccoli.jpg'),
  "vegan-shepherd-s-pie": require('@/assets/images/peas-maker/vegan-shepherd-s-pie.jpg'),
  "nasi-goreng": require('@/assets/images/peas-maker/nasi-goreng.jpg'),
  "vegan-moussaka": require('@/assets/images/peas-maker/vegan-moussaka.jpg'),
  "pasteitjes": require('@/assets/images/peas-maker/pasteitjes.jpg'),
  "vegan-kapsalon": require('@/assets/images/peas-maker/vegan-kapsalon.jpg'),
  "vegan-bitterballen": require('@/assets/images/peas-maker/vegan-bitterballen.jpg'),
  "filodeeghapje": require('@/assets/images/peas-maker/filodeeghapje.jpg'),
  "vegan-banh-mi": require('@/assets/images/peas-maker/vegan-banh-mi.jpg'),
  "vegan-souvlaki": require('@/assets/images/peas-maker/vegan-souvlaki.jpg'),
  "vegan-huzarensalade": require('@/assets/images/peas-maker/vegan-huzarensalade.jpg'),
  "vegan-roti": require('@/assets/images/peas-maker/vegan-roti.jpg'),
  "vegan-ramen": require('@/assets/images/peas-maker/vegan-ramen.jpg'),
  "vegan-zoetzure-kip": require('@/assets/images/peas-maker/vegan-zoetzure-kip.jpg'),
  "vegan-pasta-pesto": require('@/assets/images/peas-maker/vegan-pasta-pesto.jpg'),
  "vegan-kipstukjes": require('@/assets/images/peas-maker/vegan-kipstukjes.jpg'),
  "vegan-sushi": require('@/assets/images/peas-maker/vegan-sushi.jpg'),
  "vegan-burrito": require('@/assets/images/peas-maker/vegan-burrito.jpg'),
  "vegan-kip-kerrie-salade": require('@/assets/images/peas-maker/vegan-kip-kerrie-salade.jpg'),
  "vegan-sloppy-joes": require('@/assets/images/peas-maker/vegan-sloppy-joes.jpg'),
  "vegan-sate": require('@/assets/images/peas-maker/vegan-sate.jpg'),
  "vegan-pizza": require('@/assets/images/peas-maker/vegan-pizza.jpg'),
  "vegan-groene-curry": require('@/assets/images/peas-maker/vegan-groene-curry.jpg'),
  "vegan-fajita": require('@/assets/images/peas-maker/vegan-fajita.jpg'),
  "vegan-bulgogi": require('@/assets/images/peas-maker/vegan-bulgogi.jpg'),
  "vegan-carbonara": require('@/assets/images/peas-maker/vegan-carbonara.jpg'),
  "vegan-bapao": require('@/assets/images/peas-maker/vegan-bapao.jpg'),
  "griekse-ovenschotel": require('@/assets/images/peas-maker/griekse-ovenschotel.jpg'),
  "vegan-risotto": require('@/assets/images/peas-maker/vegan-risotto.jpg'),
  "vegan-tikka-masala": require('@/assets/images/peas-maker/vegan-tikka-masala.jpg'),
  "vegan-caesar-salad": require('@/assets/images/peas-maker/vegan-caesar-salad.jpg'),
  "vegan-burger": require('@/assets/images/peas-maker/vegan-burger.jpg'),
  "vegan-lasagne": require('@/assets/images/peas-maker/vegan-lasagne.jpg'),
  "vegan-rendang": require('@/assets/images/peas-maker/vegan-rendang.jpg'),
  "aziatisch-wokgerecht": require('@/assets/images/peas-maker/aziatisch-wokgerecht.jpg'),
  "vegan-tacos": require('@/assets/images/peas-maker/vegan-tacos.jpg'),
  "vegan-gehaktballen": require('@/assets/images/peas-maker/vegan-gehaktballen.jpg'),
  "vegan-tonijnsalade": require('@/assets/images/peas-maker/vegan-tonijnsalade.jpg'),
  "handi-curry": require('@/assets/images/peas-maker/handi-curry.jpg'),
  "vegan-sate-bladerdeeghapjes": require('@/assets/images/peas-maker/vegan-sate-bladerdeeghapjes.jpg'),
};

const peasMakerRecipeData: (Omit<Recipe, 'image'> & { imageKey: string })[] = [
  {
    "id": "peasmaker-broccoli-met-venkelgehakt",
    "clientKey": "peasmaker-broccoli-met-venkelgehakt",
    "title": "Broccoli met venkelgehakt",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "broccoli-met-venkelgehakt",
    "ingredients": [
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-2",
        "name": "groentebouillonblokje",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-3",
        "name": "natuurazijn",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-4",
        "name": "venkelzaad",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-5",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-6",
        "name": "paprikapoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-7",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-8",
        "name": "chilivlokken",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-9",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-10",
        "name": "maïzena",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-11",
        "name": "broccoli",
        "amount": 500,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-12",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broccoli-met-venkelgehakt-13",
        "name": "Crema balsamico",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/broccoli-met-venkelgehakt"
  },
  {
    "id": "peasmaker-midden-oosterse-wraps",
    "clientKey": "peasmaker-midden-oosterse-wraps",
    "title": "Midden-Oosterse wraps",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "midden-oosterse-wraps",
    "ingredients": [
      {
        "id": "peasmaker-midden-oosterse-wraps-1",
        "name": "XL tortillawraps",
        "amount": 4,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-2",
        "name": "komkommer",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-3",
        "name": "hummus",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-4",
        "name": "grote avocado",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-5",
        "name": "granaatappelpitjes",
        "amount": 4,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-6",
        "name": "Verse muntblaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-midden-oosterse-wraps-7",
        "name": "Sriracha saus, voor garnering",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/midden-oosterse-wraps"
  },
  {
    "id": "peasmaker-chili-sin-carne",
    "clientKey": "peasmaker-chili-sin-carne",
    "title": "Chili sin carne",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "chili-sin-carne",
    "ingredients": [
      {
        "id": "peasmaker-chili-sin-carne-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-chili-sin-carne-2",
        "name": "ui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-3",
        "name": "knoflook",
        "amount": 4,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-4",
        "name": "groene paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-5",
        "name": "rode paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-6",
        "name": "kidneybonen in blik",
        "amount": 800,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-chili-sin-carne-7",
        "name": "tomatenblokjes in blik",
        "amount": 400,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-chili-sin-carne-8",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-chili-sin-carne-9",
        "name": "groentebouillonblokje",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-10",
        "name": "tomatenpuree",
        "amount": 70,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-chili-sin-carne-11",
        "name": "donkere basterdsuiker",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-12",
        "name": "cacaopoeder",
        "amount": 0.5,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-chili-sin-carne-13",
        "name": "gerookte paprikapoeder",
        "amount": 2,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-chili-sin-carne-14",
        "name": "laurierblaadjes",
        "amount": 2,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-chili-sin-carne-15",
        "name": "komijnpoeder",
        "amount": 2,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-chili-sin-carne-16",
        "name": "chilivlokken",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-chili-sin-carne-17",
        "name": "blokjes pure chocolade 70%",
        "amount": 2,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-chili-sin-carne-18",
        "name": "Zout naar smaak",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/chili-sin-carne"
  },
  {
    "id": "peasmaker-orzopasta",
    "clientKey": "peasmaker-orzopasta",
    "title": "Orzopasta",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "orzopasta",
    "ingredients": [
      {
        "id": "peasmaker-orzopasta-1",
        "name": "orzo",
        "amount": 170,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-orzopasta-2",
        "name": "doperwten, bevroren",
        "amount": 125,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-3",
        "name": "prei",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-4",
        "name": "groentebouillonblokje",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-5",
        "name": "water",
        "amount": 800,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-orzopasta-6",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-7",
        "name": "Peas Maker Stukjes",
        "amount": 75,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-orzopasta-8",
        "name": "twee handjes spinazie",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-9",
        "name": "pakje vegan kruidenroomkaas",
        "amount": 140,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-orzopasta-10",
        "name": "edelgistvlokken",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-orzopasta-11",
        "name": "versgemalen zwarte peper en zout",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/orzopasta"
  },
  {
    "id": "peasmaker-vegan-zuurvlees",
    "clientKey": "peasmaker-vegan-zuurvlees",
    "title": "Vegan zuurvlees",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-zuurvlees",
    "ingredients": [
      {
        "id": "peasmaker-vegan-zuurvlees-1",
        "name": "klontje plantaardige boter",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-2",
        "name": "grote witte ui",
        "amount": 125,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-3",
        "name": "appelstroop",
        "amount": 6,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-4",
        "name": "appelazijn",
        "amount": 150,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-5",
        "name": "water",
        "amount": 800,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-6",
        "name": "laurierblaadjes",
        "amount": 2,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-7",
        "name": "kruidnagels",
        "amount": 4,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-8",
        "name": "jeneverbessen",
        "amount": 4,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-9",
        "name": "zout",
        "amount": 1.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-10",
        "name": "uienpoeder",
        "amount": 1.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-11",
        "name": "korianderpoeder",
        "amount": 1.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-12",
        "name": "mosterdpoeder",
        "amount": 1.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-13",
        "name": "paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-14",
        "name": "knoflookpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-15",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-16",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-zuurvlees-17",
        "name": "plakken ontbijtkoek",
        "amount": 90,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-zuurvlees"
  },
  {
    "id": "peasmaker-vegan-butter-chicken",
    "clientKey": "peasmaker-vegan-butter-chicken",
    "title": "Vegan butter chicken",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "vegan-butter-chicken",
    "ingredients": [
      {
        "id": "peasmaker-vegan-butter-chicken-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-2",
        "name": "plantaardige yoghurt",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-3",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-4",
        "name": "garam masala",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-5",
        "name": "korianderpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-6",
        "name": "komijnpoeder",
        "amount": 0.5,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-7",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-8",
        "name": "chilipoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-9",
        "name": "rode uien",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-10",
        "name": "tomaten",
        "amount": 1,
        "unit": "kg",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-11",
        "name": "Klontje plantaardige boter",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-12",
        "name": "rauwe cashewnoten",
        "amount": 100,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-13",
        "name": "knoflook",
        "amount": 4,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-14",
        "name": "water",
        "amount": 175,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-15",
        "name": "el kokosbloesemsuiker",
        "amount": 25,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-16",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-17",
        "name": "gedroogde fenegriekblad",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-18",
        "name": "garam masala",
        "amount": 2,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-19",
        "name": "kaneelpoeder",
        "amount": 2,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-20",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-21",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-butter-chicken-22",
        "name": "gemberpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-butter-chicken"
  },
  {
    "id": "peasmaker-vegan-kip-pasteitjes",
    "clientKey": "peasmaker-vegan-kip-pasteitjes",
    "title": "Vegan kip pasteitjes",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 65,
    "imageKey": "vegan-kip-pasteitjes",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kip-pasteitjes-1",
        "name": "Peas Maker Stukjes",
        "amount": 75,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-2",
        "name": "klontjes plantaardige boter",
        "amount": 2,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-3",
        "name": "kleine witte ui",
        "amount": 60,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-4",
        "name": "knoflookpasta",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-5",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-6",
        "name": "gedroogde chilivlokken",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-7",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-8",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-9",
        "name": "bloem",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-10",
        "name": "geraspte vegan Parmezaan",
        "amount": 60,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-11",
        "name": "plantaardige room",
        "amount": 2,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-12",
        "name": "plakjes diepvries bladerdeeg",
        "amount": 10,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-13",
        "name": "Mango chutney",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-pasteitjes-14",
        "name": "Zwarte sesamzaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kip-pasteitjes"
  },
  {
    "id": "peasmaker-vegan-gyros",
    "clientKey": "peasmaker-vegan-gyros",
    "title": "Vegan gyros",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-gyros",
    "ingredients": [
      {
        "id": "peasmaker-vegan-gyros-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-gyros-2",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-gyros-3",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-gyros-4",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-gyros-5",
        "name": "oregano",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-gyros-6",
        "name": "zoete paprikapoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-gyros-7",
        "name": "mosterd",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-gyros-8",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-gyros-9",
        "name": "komijnpoeder",
        "amount": 0.5,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-gyros-10",
        "name": "agavesiroop",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-gyros-11",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-gyros-12",
        "name": "gedroogde chilivlokken",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-gyros-13",
        "name": "pitabroodjes",
        "amount": 5,
        "unit": "stuk",
        "department": "Brood en gebak"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-gyros"
  },
  {
    "id": "peasmaker-quinoa-salade",
    "clientKey": "peasmaker-quinoa-salade",
    "title": "Quinoa salade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "quinoa-salade",
    "ingredients": [
      {
        "id": "peasmaker-quinoa-salade-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-quinoa-salade-2",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-3",
        "name": "appelazijn",
        "amount": 1.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-4",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-5",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-6",
        "name": "korianderpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-7",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-8",
        "name": "komijnpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-quinoa-salade-9",
        "name": "quinoa",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-10",
        "name": "komkommer",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-11",
        "name": "radijsjes",
        "amount": 115,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-12",
        "name": "stengels bosui",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-13",
        "name": "gedroogde cranberries",
        "amount": 80,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-14",
        "name": "geroosterde walnoten",
        "amount": 50,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-quinoa-salade-15",
        "name": "geroosterde pompoenpitten",
        "amount": 30,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-16",
        "name": "verse peterselie",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-17",
        "name": "verse koriander",
        "amount": 40,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-18",
        "name": "muntblaadjes",
        "amount": 10,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-19",
        "name": "blok vegan feta",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-20",
        "name": "olijfolie",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-21",
        "name": "citroensap",
        "amount": 3,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-22",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-quinoa-salade-23",
        "name": "korianderpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-quinoa-salade-24",
        "name": "komijnpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/quinoa-salade"
  },
  {
    "id": "peasmaker-vegan-kip-cashew",
    "clientKey": "peasmaker-vegan-kip-cashew",
    "title": "Vegan kip cashew",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-kip-cashew",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kip-cashew-1",
        "name": "Peas Maker Stukjes",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-2",
        "name": "zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-3",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-4",
        "name": "maïzena",
        "amount": 40,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-5",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-6",
        "name": "sojasaus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-7",
        "name": "natuurazijn",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-8",
        "name": "agavesiroop",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-9",
        "name": "maïzena",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-10",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-11",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-12",
        "name": "rode chilipeper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-13",
        "name": "rode paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-14",
        "name": "gele paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-15",
        "name": "geroosterde cashewnoten,",
        "amount": 65,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-kip-cashew-16",
        "name": "stengels bosui",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kip-cashew"
  },
  {
    "id": "peasmaker-vegan-shoarma",
    "clientKey": "peasmaker-vegan-shoarma",
    "title": "Vegan shoarma",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-shoarma",
    "ingredients": [
      {
        "id": "peasmaker-vegan-shoarma-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-shoarma-2",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-3",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-4",
        "name": "mosterd",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-5",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-6",
        "name": "zoete paprikapoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-7",
        "name": "korianderpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-8",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-shoarma-9",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-10",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-11",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-12",
        "name": "kaneelpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-shoarma-13",
        "name": "kardemompoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-shoarma-14",
        "name": "kurkumapoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-shoarma-15",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-16",
        "name": "wraps",
        "amount": 4,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-vegan-shoarma-17",
        "name": "tahin",
        "amount": 60,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-18",
        "name": "water",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-19",
        "name": "citroensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-20",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-21",
        "name": "zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-22",
        "name": "witte ui",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-23",
        "name": "verse peterselie",
        "amount": 1,
        "unit": "handje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shoarma-24",
        "name": "tomatenpuree",
        "amount": 35,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-25",
        "name": "water",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-26",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-27",
        "name": "sriracha saus",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-28",
        "name": "agavesiroop",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-29",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shoarma-30",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-shoarma"
  },
  {
    "id": "peasmaker-vegan-cacciatore",
    "clientKey": "peasmaker-vegan-cacciatore",
    "title": "Vegan cacciatore",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 35,
    "imageKey": "vegan-cacciatore",
    "ingredients": [
      {
        "id": "peasmaker-vegan-cacciatore-1",
        "name": "olijfolie",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-2",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-cacciatore-3",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-4",
        "name": "snoeptomaatjes",
        "amount": 30,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-cacciatore-5",
        "name": "droge witte wijn",
        "amount": 125,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-6",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-cacciatore-7",
        "name": "water",
        "amount": 500,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-8",
        "name": "groentebouillonblokje",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-cacciatore-9",
        "name": "kaneelpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-cacciatore-10",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-cacciatore-11",
        "name": "tak verse rozemarijn",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-cacciatore-12",
        "name": "zwarte olijven",
        "amount": 20,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-13",
        "name": "agavesiroop",
        "amount": 2,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-cacciatore-14",
        "name": "Zout",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-cacciatore"
  },
  {
    "id": "peasmaker-vegan-bolognese",
    "clientKey": "peasmaker-vegan-bolognese",
    "title": "Vegan bolognese",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 85,
    "imageKey": "vegan-bolognese",
    "ingredients": [
      {
        "id": "peasmaker-vegan-bolognese-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bolognese-2",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-3",
        "name": "plantaardige boter",
        "amount": 2,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bolognese-4",
        "name": "witte ui",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bolognese-5",
        "name": "wortel",
        "amount": 175,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bolognese-6",
        "name": "stengels bleekselderij",
        "amount": 2,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-7",
        "name": "droge witte wijn",
        "amount": 150,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-8",
        "name": "blokje groentebouillon",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bolognese-9",
        "name": "tomatenpuree",
        "amount": 70,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-10",
        "name": "gepelde tomaten",
        "amount": 800,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-11",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-12",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bolognese-13",
        "name": "nootmuskaat",
        "amount": 1,
        "unit": "snufje",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bolognese-14",
        "name": "edelgistvlokken",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-15",
        "name": "water",
        "amount": 200,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bolognese-16",
        "name": "plantaardige melk",
        "amount": 150,
        "unit": "ml",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bolognese-17",
        "name": "pasta (Rummo Radiatori) of glutenrvije pasta",
        "amount": 500,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bolognese-18",
        "name": "Vegan geraspte kaas of vegan Parmezaan",
        "amount": 1,
        "unit": "stuk",
        "department": "Zuivel, boter en eieren"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-bolognese"
  },
  {
    "id": "peasmaker-amerikaanse-salade",
    "clientKey": "peasmaker-amerikaanse-salade",
    "title": "Amerikaanse salade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "amerikaanse-salade",
    "ingredients": [
      {
        "id": "peasmaker-amerikaanse-salade-1",
        "name": "vegan mayonaise",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-amerikaanse-salade-2",
        "name": "plantaardige yoghurt",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-amerikaanse-salade-3",
        "name": "citroensap",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-amerikaanse-salade-4",
        "name": "gedroogde dille",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-amerikaanse-salade-5",
        "name": "gedoogde bieslook",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-amerikaanse-salade-6",
        "name": "gedroogde peterselie",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-amerikaanse-salade-7",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-amerikaanse-salade-8",
        "name": "uienpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-amerikaanse-salade-9",
        "name": "Zout en versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-amerikaanse-salade-10",
        "name": "sriracha saus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-amerikaanse-salade-11",
        "name": "ahornsiroop",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/amerikaanse-salade"
  },
  {
    "id": "peasmaker-vegan-mac-and-cheese",
    "clientKey": "peasmaker-vegan-mac-and-cheese",
    "title": "Vegan mac and cheese",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "vegan-mac-and-cheese",
    "ingredients": [
      {
        "id": "peasmaker-vegan-mac-and-cheese-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-2",
        "name": "sojasaus",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-3",
        "name": "ahornsiroop",
        "amount": 2,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-4",
        "name": "gerookte paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-5",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-6",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-7",
        "name": "Maccheroni pasta",
        "amount": 500,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-8",
        "name": "vegan geraspte kaas",
        "amount": 1,
        "unit": "zakje",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-9",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-10",
        "name": "plantaardige melk",
        "amount": 500,
        "unit": "ml",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-11",
        "name": "edelgistvlokken",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-12",
        "name": "tapiocameel",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-13",
        "name": "zout, of meer",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-14",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-mac-and-cheese-15",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-mac-and-cheese"
  },
  {
    "id": "peasmaker-kapuska",
    "clientKey": "peasmaker-kapuska",
    "title": "Kapuska",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 105,
    "imageKey": "kapuska",
    "ingredients": [
      {
        "id": "peasmaker-kapuska-1",
        "name": "witte ui",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-2",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-3",
        "name": "rode peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-4",
        "name": "olijfolie",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-kapuska-5",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-kapuska-6",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-kapuska-7",
        "name": "sumak",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-kapuska-8",
        "name": "zout",
        "amount": 1.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-kapuska-9",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-10",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-kapuska-11",
        "name": "witte kool",
        "amount": 800,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-12",
        "name": "groentebouillon",
        "amount": 750,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-13",
        "name": "citroensap",
        "amount": 1,
        "unit": "scheut",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kapuska-14",
        "name": "plantaardige yoghurt",
        "amount": 6,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-kapuska-15",
        "name": "vegan mayonaise",
        "amount": 3,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-kapuska-16",
        "name": "gedroogde bieslook",
        "amount": 2,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-kapuska-17",
        "name": "zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/kapuska"
  },
  {
    "id": "peasmaker-vegan-kippensoep",
    "clientKey": "peasmaker-vegan-kippensoep",
    "title": "Vegan kippensoep",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "vegan-kippensoep",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kippensoep-1",
        "name": "plantaardige boter",
        "amount": 6,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kippensoep-2",
        "name": "witte of gele ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-3",
        "name": "winterpeen",
        "amount": 190,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kippensoep-4",
        "name": "stengels bleekselderij",
        "amount": 2,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kippensoep-5",
        "name": "champignons",
        "amount": 250,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-6",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-7",
        "name": "bloem",
        "amount": 45,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kippensoep-8",
        "name": "aardappels",
        "amount": 450,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-9",
        "name": "Peas Maker Stukjes",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kippensoep-10",
        "name": "groentebouillon",
        "amount": 1500,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-11",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-12",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kippensoep-13",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-14",
        "name": "doperwten, bevroren",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kippensoep-15",
        "name": "mais",
        "amount": 140,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kippensoep-16",
        "name": "haverroom",
        "amount": 120,
        "unit": "ml",
        "department": "Zuivel, boter en eieren"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kippensoep"
  },
  {
    "id": "peasmaker-vegan-sushi-bowl",
    "clientKey": "peasmaker-vegan-sushi-bowl",
    "title": "Vegan sushi bowl",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-sushi-bowl",
    "ingredients": [
      {
        "id": "peasmaker-vegan-sushi-bowl-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-2",
        "name": "sojasaus",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-3",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-4",
        "name": "sesamolie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-5",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-6",
        "name": "Sushirijst",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-7",
        "name": "Komkommer",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-8",
        "name": "Snoeptomaatjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-9",
        "name": "Bosui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-10",
        "name": "Avocado",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-11",
        "name": "Norivel",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-12",
        "name": "Zwarte sesamzaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-13",
        "name": "Partje limoen",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-14",
        "name": "vegan mayonaise",
        "amount": 2,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-15",
        "name": "sriracha saus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-bowl-16",
        "name": "water",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sushi-bowl"
  },
  {
    "id": "peasmaker-broodje-vegan-tonijnsalade",
    "clientKey": "peasmaker-broodje-vegan-tonijnsalade",
    "title": "Broodje vegan tonijnsalade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 15,
    "imageKey": "broodje-vegan-tonijnsalade",
    "ingredients": [
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-1",
        "name": "vegan mayonaise",
        "amount": 6,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-2",
        "name": "ketchup",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-3",
        "name": "witte ui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-4",
        "name": "appel",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-5",
        "name": "tomaten",
        "amount": 2,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-6",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-7",
        "name": "Zout",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-8",
        "name": "flatbreads",
        "amount": 8,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-broodje-vegan-tonijnsalade-9",
        "name": "zak rucola",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/broodje-vegan-tonijnsalade"
  },
  {
    "id": "peasmaker-vegan-hartige-taart",
    "clientKey": "peasmaker-vegan-hartige-taart",
    "title": "Vegan hartige taart",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 75,
    "imageKey": "vegan-hartige-taart",
    "ingredients": [
      {
        "id": "peasmaker-vegan-hartige-taart-1",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-2",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-3",
        "name": "stengel bleekselderij",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-4",
        "name": "wortel",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-5",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-6",
        "name": "oesterzwammen",
        "amount": 200,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-7",
        "name": "takjes tijm",
        "amount": 2,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-8",
        "name": "gerookte paprika",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-9",
        "name": "kruidnagelpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-10",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-11",
        "name": "HP saus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-12",
        "name": "vegan rode wijn",
        "amount": 125,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-13",
        "name": "vegan rode port",
        "amount": 125,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-14",
        "name": "groentebouillon",
        "amount": 500,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-15",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-16",
        "name": "bloem",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-17",
        "name": "Zout en versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-18",
        "name": "rol kant-en-klare bladerdeeg",
        "amount": 1,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-vegan-hartige-taart-19",
        "name": "rol kant-en-klare quiche & taartdeeg",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-hartige-taart"
  },
  {
    "id": "peasmaker-vegan-vol-au-vent",
    "clientKey": "peasmaker-vegan-vol-au-vent",
    "title": "Vegan vol au vent",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-vol-au-vent",
    "ingredients": [
      {
        "id": "peasmaker-vegan-vol-au-vent-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-2",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-3",
        "name": "uienpoeder",
        "amount": 0.75,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-4",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-5",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-6",
        "name": "paprikapoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-7",
        "name": "koude groentebouillon",
        "amount": 375,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-8",
        "name": "plantaardige boter",
        "amount": 40,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-9",
        "name": "bloem",
        "amount": 40,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-10",
        "name": "sherry of cognac",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-11",
        "name": "haverroom",
        "amount": 1.5,
        "unit": "el",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-12",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-vol-au-vent-13",
        "name": "pasteibakjes",
        "amount": 6,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-vol-au-vent"
  },
  {
    "id": "peasmaker-kerrie-noedels",
    "clientKey": "peasmaker-kerrie-noedels",
    "title": "Kerrie noedels",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "kerrie-noedels",
    "ingredients": [
      {
        "id": "peasmaker-kerrie-noedels-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-kerrie-noedels-2",
        "name": "rode curry pasta",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-kerrie-noedels-3",
        "name": "kerriepoeder",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-kerrie-noedels-4",
        "name": "groentebouillon",
        "amount": 250,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kerrie-noedels-5",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-kerrie-noedels-6",
        "name": "kokosmelk",
        "amount": 200,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-kerrie-noedels-7",
        "name": "lichtbruine basterdsuiker",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kerrie-noedels-8",
        "name": "citroensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kerrie-noedels-9",
        "name": "stengels paksoi",
        "amount": 3,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-kerrie-noedels-10",
        "name": "mie noedel nestjes",
        "amount": 225,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/kerrie-noedels"
  },
  {
    "id": "peasmaker-vegan-sate-curry",
    "clientKey": "peasmaker-vegan-sate-curry",
    "title": "Vegan saté curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-sate-curry",
    "ingredients": [
      {
        "id": "peasmaker-vegan-sate-curry-1",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-2",
        "name": "oesterzwammen",
        "amount": 200,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-3",
        "name": "witte uien",
        "amount": 250,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-curry-4",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-curry-5",
        "name": "conimex nasikruiden",
        "amount": 0.5,
        "unit": "zakje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-curry-6",
        "name": "ketjap manis",
        "amount": 6,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-7",
        "name": "ketchup",
        "amount": 6,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-8",
        "name": "appelazijn",
        "amount": 3,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-curry-9",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-10",
        "name": "Peas Maker Stukjes",
        "amount": 150,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sate-curry-11",
        "name": "water",
        "amount": 700,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-12",
        "name": "100% pindakaas naturel",
        "amount": 270,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-sate-curry-13",
        "name": "sambal badjak",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-curry-14",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sate-curry"
  },
  {
    "id": "peasmaker-vegan-panang-curry",
    "clientKey": "peasmaker-vegan-panang-curry",
    "title": "Vegan panang curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-panang-curry",
    "ingredients": [
      {
        "id": "peasmaker-vegan-panang-curry-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-panang-curry-2",
        "name": "panang currypasta",
        "amount": 8,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-panang-curry-3",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-panang-curry-4",
        "name": "komijnpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-panang-curry-5",
        "name": "korianderpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-panang-curry-6",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-panang-curry-7",
        "name": "kokosmelk",
        "amount": 400,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-panang-curry-8",
        "name": "suiker",
        "amount": 3,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-panang-curry-9",
        "name": "limoensap",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-panang-curry-10",
        "name": "100 % pindakaas naturel",
        "amount": 1,
        "unit": "el",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-panang-curry-11",
        "name": "courgette",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-panang-curry-12",
        "name": "cherrytomaten, gehalveerd",
        "amount": 20,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-panang-curry-13",
        "name": "Thaise basilicum",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-panang-curry"
  },
  {
    "id": "peasmaker-vegan-enchiladas",
    "clientKey": "peasmaker-vegan-enchiladas",
    "title": "Vegan enchiladas",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 60,
    "imageKey": "vegan-enchiladas",
    "ingredients": [
      {
        "id": "peasmaker-vegan-enchiladas-1",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-enchiladas-2",
        "name": "zoete paprikapoeder",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-enchiladas-3",
        "name": "milde paprikapoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-enchiladas-4",
        "name": "water",
        "amount": 500,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-enchiladas-5",
        "name": "passata",
        "amount": 120,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-enchiladas-6",
        "name": "korianderpoeder",
        "amount": 1.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-enchiladas-7",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-enchiladas"
  },
  {
    "id": "peasmaker-vegan-kip-broodje",
    "clientKey": "peasmaker-vegan-kip-broodje",
    "title": "Vegan kip broodje",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "vegan-kip-broodje",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kip-broodje-1",
        "name": "Peas Maker Stukjes",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-2",
        "name": "water",
        "amount": 300,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-3",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-4",
        "name": "edelgistvlokken",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-5",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-6",
        "name": "zout",
        "amount": 0.75,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-7",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-8",
        "name": "paprikapoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-9",
        "name": "maïzena",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-10",
        "name": "plantaardige olie om in te bakken",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-broodje-11",
        "name": "Vegan kaasplakjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kip-broodje"
  },
  {
    "id": "peasmaker-taco-salade",
    "clientKey": "peasmaker-taco-salade",
    "title": "Taco salade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "taco-salade",
    "ingredients": [
      {
        "id": "peasmaker-taco-salade-1",
        "name": "IJsbergsla",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-2",
        "name": "tomaat",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-3",
        "name": "komkommer",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-4",
        "name": "Avocado",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-5",
        "name": "Klein blikje mais",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-taco-salade-6",
        "name": "Zwarte bonen",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-taco-salade-7",
        "name": "Verse koriander",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-8",
        "name": "Sweet chilli pepper tortilla chips",
        "amount": 1,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-taco-salade-9",
        "name": "plantaardige yoghurt",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-taco-salade-10",
        "name": "vegan mayonaise",
        "amount": 2,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-taco-salade-11",
        "name": "citroensap",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-12",
        "name": "agavesiroop",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-taco-salade-13",
        "name": "mosterd",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-taco-salade-14",
        "name": "gerookte paprikapoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-taco-salade-15",
        "name": "komijnpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-taco-salade-16",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-taco-salade-17",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/taco-salade"
  },
  {
    "id": "peasmaker-caribische-curry",
    "clientKey": "peasmaker-caribische-curry",
    "title": "Caribische curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "caribische-curry",
    "ingredients": [
      {
        "id": "peasmaker-caribische-curry-1",
        "name": "kokosolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-caribische-curry-2",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-3",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-4",
        "name": "verse gember geraspt",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-5",
        "name": "kerriepoeder",
        "amount": 2,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-caribische-curry-6",
        "name": "appelazijn",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-7",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-8",
        "name": "pimentpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-caribische-curry-9",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-10",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-caribische-curry-11",
        "name": "groentebouillon",
        "amount": 700,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-12",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-caribische-curry-13",
        "name": "zoete aardappel",
        "amount": 280,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-14",
        "name": "groene paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-caribische-curry-15",
        "name": "takjes verse tijm",
        "amount": 3,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-caribische-curry-16",
        "name": "madame Jeanette",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/caribische-curry"
  },
  {
    "id": "peasmaker-vegan-bobotie",
    "clientKey": "peasmaker-vegan-bobotie",
    "title": "Vegan bobotie",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 50,
    "imageKey": "vegan-bobotie",
    "ingredients": [
      {
        "id": "peasmaker-vegan-bobotie-1",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bobotie-2",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bobotie-3",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bobotie-4",
        "name": "kerriepoeder",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-5",
        "name": "kurkumapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-6",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-7",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bobotie-8",
        "name": "gemberpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bobotie-9",
        "name": "kaneelpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-10",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bobotie-11",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bobotie-12",
        "name": "rozijnen",
        "amount": 25,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-bobotie-13",
        "name": "bloem",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-14",
        "name": "mango chutney",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bobotie-15",
        "name": "plantaardige yoghurt, naar keuze",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bobotie-16",
        "name": "kikkererwtenmeel",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bobotie-17",
        "name": "Flinke snuf kala namak",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bobotie-18",
        "name": "laurierblaadjes",
        "amount": 3,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-19",
        "name": "basmati rijst",
        "amount": 180,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-20",
        "name": "kurkumapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-21",
        "name": "kaneelpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bobotie-22",
        "name": "plantaardige boter",
        "amount": 20,
        "unit": "g",
        "department": "Vega en plantaardig"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-bobotie"
  },
  {
    "id": "peasmaker-vegan-korma-curry",
    "clientKey": "peasmaker-vegan-korma-curry",
    "title": "Vegan korma curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 35,
    "imageKey": "vegan-korma-curry",
    "ingredients": [
      {
        "id": "peasmaker-vegan-korma-curry-1",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-2",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-korma-curry-3",
        "name": "kaneelstok",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-korma-curry-4",
        "name": "komijnzaad",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-korma-curry-5",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-6",
        "name": "gemberpasta",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-7",
        "name": "korianderpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-8",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-korma-curry-9",
        "name": "kurkumapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-korma-curry-10",
        "name": "kokosmelk",
        "amount": 250,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-korma-curry-11",
        "name": "verse koriander, fijngehakt",
        "amount": 10,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-12",
        "name": "appelazijn",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-13",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-korma-curry-14",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-korma-curry-15",
        "name": "kleine hete groene peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-16",
        "name": "doperwten, diepvries",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-korma-curry-17",
        "name": "kokosyoghurt",
        "amount": 4,
        "unit": "el",
        "department": "Vega en plantaardig"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-korma-curry"
  },
  {
    "id": "peasmaker-vegan-babi-pangang",
    "clientKey": "peasmaker-vegan-babi-pangang",
    "title": "Vegan babi pangang",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 35,
    "imageKey": "vegan-babi-pangang",
    "ingredients": [
      {
        "id": "peasmaker-vegan-babi-pangang-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-2",
        "name": "water",
        "amount": 200,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-3",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-4",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-5",
        "name": "gemberpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-6",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-7",
        "name": "Steranijs",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-8",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-9",
        "name": "rode ui",
        "amount": 80,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-10",
        "name": "knoflook",
        "amount": 1,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-11",
        "name": "verse gember",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-12",
        "name": "sambal badjak",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-13",
        "name": "Klontje plantaardige boter",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-14",
        "name": "blikje tomatenpuree",
        "amount": 70,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-15",
        "name": "bloem",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-16",
        "name": "gekookt water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-17",
        "name": "suiker",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-18",
        "name": "appelazijn",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-babi-pangang-19",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-babi-pangang"
  },
  {
    "id": "peasmaker-vegan-hachee",
    "clientKey": "peasmaker-vegan-hachee",
    "title": "Vegan hachee",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-hachee",
    "ingredients": [
      {
        "id": "peasmaker-vegan-hachee-1",
        "name": "plantaardige boter",
        "amount": 1,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-hachee-2",
        "name": "rode ui",
        "amount": 80,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-3",
        "name": "water",
        "amount": 400,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-4",
        "name": "laurier",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-hachee-5",
        "name": "kruidnagels",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-6",
        "name": "sojasaus",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-7",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-8",
        "name": "HP saus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-9",
        "name": "schenkstroop",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-10",
        "name": "ketjap manis",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-11",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-12",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-13",
        "name": "pimentpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-hachee-14",
        "name": "zout",
        "amount": 0.125,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-hachee-15",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-hachee-16",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-hachee-17",
        "name": "maïzena",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-hachee"
  },
  {
    "id": "peasmaker-vegan-saucijzenbroodje",
    "clientKey": "peasmaker-vegan-saucijzenbroodje",
    "title": "Vegan saucijzenbroodje",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 50,
    "imageKey": "vegan-saucijzenbroodje",
    "ingredients": [
      {
        "id": "peasmaker-vegan-saucijzenbroodje-1",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-2",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-3",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-4",
        "name": "nootmuskaatpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-5",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-6",
        "name": "paneermeel",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-7",
        "name": "HP saus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-saucijzenbroodje-8",
        "name": "bladerdeeg",
        "amount": 5,
        "unit": "vellen",
        "department": "Brood en gebak"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-saucijzenbroodje"
  },
  {
    "id": "peasmaker-vegan-haggisballen",
    "clientKey": "peasmaker-vegan-haggisballen",
    "title": "Vegan haggisballen",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 55,
    "imageKey": "vegan-haggisballen",
    "ingredients": [
      {
        "id": "peasmaker-vegan-haggisballen-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-haggisballen-2",
        "name": "water",
        "amount": 600,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-3",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-4",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-5",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-6",
        "name": "versgemalen zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-7",
        "name": "nootmuskaat",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-haggisballen-8",
        "name": "korianderpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-9",
        "name": "witte ui",
        "amount": 80,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-10",
        "name": "havermout",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-11",
        "name": "bloem",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-haggisballen-12",
        "name": "Paneermeel",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-haggisballen-13",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-14",
        "name": "plantaardige boter",
        "amount": 25,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-haggisballen-15",
        "name": "tomatenpuree",
        "amount": 20,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-16",
        "name": "Schotse whisky",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-17",
        "name": "haverroom",
        "amount": 200,
        "unit": "ml",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-haggisballen-18",
        "name": "suiker",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-haggisballen-19",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-haggisballen-20",
        "name": "versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-haggisballen"
  },
  {
    "id": "peasmaker-vegan-makreelrillette",
    "clientKey": "peasmaker-vegan-makreelrillette",
    "title": "Vegan makreelrillette",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-makreelrillette",
    "ingredients": [
      {
        "id": "peasmaker-vegan-makreelrillette-1",
        "name": "venkel",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-2",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-3",
        "name": "natuurazijn",
        "amount": 125,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-4",
        "name": "suiker",
        "amount": 95,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-5",
        "name": "nori",
        "amount": 0.5,
        "unit": "vel",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-6",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-7",
        "name": "water",
        "amount": 225,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-8",
        "name": "natuurazijn",
        "amount": 1.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-9",
        "name": "zout",
        "amount": 0.75,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-10",
        "name": "kleine sjalot",
        "amount": 22,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-11",
        "name": "vegan mayonaise",
        "amount": 3,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-12",
        "name": "fijne mosterd",
        "amount": 4,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-13",
        "name": "olijfolie",
        "amount": 2,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-14",
        "name": "zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-15",
        "name": "versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-16",
        "name": "komkommer",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-makreelrillette-17",
        "name": "verse dille",
        "amount": 1,
        "unit": "handje",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-makreelrillette"
  },
  {
    "id": "peasmaker-pasta-ragu",
    "clientKey": "peasmaker-pasta-ragu",
    "title": "Pasta ragu",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "pasta-ragu",
    "ingredients": [
      {
        "id": "peasmaker-pasta-ragu-1",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-2",
        "name": "witte ui",
        "amount": 140,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasta-ragu-3",
        "name": "laurierblaadjes",
        "amount": 2,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-pasta-ragu-4",
        "name": "rode wijn",
        "amount": 100,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-5",
        "name": "water",
        "amount": 300,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-6",
        "name": "tomatenblokjes",
        "amount": 1,
        "unit": "blik",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-7",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-8",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-9",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasta-ragu-10",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasta-ragu-11",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasta-ragu-12",
        "name": "versgemalen zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasta-ragu-13",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-pasta-ragu-14",
        "name": "verse basilicum",
        "amount": 15,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasta-ragu-15",
        "name": "Bucatini pasta",
        "amount": 300,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/pasta-ragu"
  },
  {
    "id": "peasmaker-massaman-curry",
    "clientKey": "peasmaker-massaman-curry",
    "title": "Massaman curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "massaman-curry",
    "ingredients": [
      {
        "id": "peasmaker-massaman-curry-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-massaman-curry-2",
        "name": "massaman currypasta",
        "amount": 4,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-massaman-curry-3",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-massaman-curry-4",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-massaman-curry-5",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-massaman-curry-6",
        "name": "witte ui",
        "amount": 70,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-massaman-curry-7",
        "name": "zoete aardappel",
        "amount": 340,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-massaman-curry-8",
        "name": "kokosmelk",
        "amount": 250,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-massaman-curry-9",
        "name": "kokosbloesemsuiker",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/massaman-curry"
  },
  {
    "id": "peasmaker-noedels-met-broccoli",
    "clientKey": "peasmaker-noedels-met-broccoli",
    "title": "Noedels met broccoli",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "noedels-met-broccoli",
    "ingredients": [
      {
        "id": "peasmaker-noedels-met-broccoli-1",
        "name": "broccoli",
        "amount": 300,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-2",
        "name": "ramen woknoedels",
        "amount": 200,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-3",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-4",
        "name": "water",
        "amount": 90,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-5",
        "name": "sojasaus",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-6",
        "name": "lichtbruine basterdsuiker",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-7",
        "name": "maïzena",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-8",
        "name": "sesamolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-9",
        "name": "knoflook, geperst",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-10",
        "name": "verse gember, geraspt",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-11",
        "name": "witte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-noedels-met-broccoli-12",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/noedels-met-broccoli"
  },
  {
    "id": "peasmaker-vegan-shepherd-s-pie",
    "clientKey": "peasmaker-vegan-shepherd-s-pie",
    "title": "Vegan shepherd’s pie",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 50,
    "imageKey": "vegan-shepherd-s-pie",
    "ingredients": [
      {
        "id": "peasmaker-vegan-shepherd-s-pie-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-2",
        "name": "witte ui",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-3",
        "name": "stengels bleekselderij",
        "amount": 135,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-4",
        "name": "wortels",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-5",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-6",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-7",
        "name": "HP saus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-8",
        "name": "groentebouillon",
        "amount": 600,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-9",
        "name": "Peas Maker Stukjes",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-10",
        "name": "maïzena",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-11",
        "name": "kruimige aardappels",
        "amount": 1,
        "unit": "kg",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-12",
        "name": "plantaardige boter",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-13",
        "name": "plantaardige melk",
        "amount": 50,
        "unit": "ml",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-14",
        "name": "geraspte vegan Parmezaan",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-shepherd-s-pie-15",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-shepherd-s-pie"
  },
  {
    "id": "peasmaker-nasi-goreng",
    "clientKey": "peasmaker-nasi-goreng",
    "title": "Nasi goreng",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 15,
    "imageKey": "nasi-goreng",
    "ingredients": [
      {
        "id": "peasmaker-nasi-goreng-1",
        "name": "g witte ui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-nasi-goreng-2",
        "name": "knoflook",
        "amount": 3,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-nasi-goreng-3",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-nasi-goreng-4",
        "name": "rode peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-nasi-goreng-5",
        "name": "gekookte en afgekoelde basmati rijst",
        "amount": 475,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-nasi-goreng-6",
        "name": "sojasaus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-nasi-goreng-7",
        "name": "ketjap manis",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-nasi-goreng-8",
        "name": "groentebouillonblokje",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/nasi-goreng"
  },
  {
    "id": "peasmaker-vegan-moussaka",
    "clientKey": "peasmaker-vegan-moussaka",
    "title": "Vegan moussaka",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 135,
    "imageKey": "vegan-moussaka",
    "ingredients": [
      {
        "id": "peasmaker-vegan-moussaka-1",
        "name": "Peas Maker Stukjes",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-moussaka-2",
        "name": "olijfolie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-3",
        "name": "grote witte ui",
        "amount": 170,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-4",
        "name": "knoflook",
        "amount": 1,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-5",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-6",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-7",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-8",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-9",
        "name": "kaneelpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-moussaka-10",
        "name": "gedroogde tijm",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-moussaka-11",
        "name": "pimentpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-moussaka-12",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-13",
        "name": "grote (800 g) aardappels",
        "amount": 4,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-14",
        "name": "aubergines",
        "amount": 690,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-moussaka-15",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-16",
        "name": "plantaardige boter",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-moussaka-17",
        "name": "glutenvrije bloem",
        "amount": 60,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-moussaka-18",
        "name": "plantaardige melk",
        "amount": 500,
        "unit": "ml",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-moussaka-19",
        "name": "geraspte vegan Parmezaan",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-20",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-moussaka-21",
        "name": "nootmuskaat",
        "amount": 1,
        "unit": "snufje",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-moussaka"
  },
  {
    "id": "peasmaker-pasteitjes",
    "clientKey": "peasmaker-pasteitjes",
    "title": "Pasteitjes",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 120,
    "imageKey": "pasteitjes",
    "ingredients": [
      {
        "id": "peasmaker-pasteitjes-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-pasteitjes-2",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasteitjes-3",
        "name": "witte ui",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-4",
        "name": "knoflook",
        "amount": 1,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-5",
        "name": "groentebouillonblokje",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-6",
        "name": "witte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-7",
        "name": "suiker",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-8",
        "name": "wortel",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-9",
        "name": "doperwten, diepvries",
        "amount": 60,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-10",
        "name": "bloem",
        "amount": 250,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-pasteitjes-11",
        "name": "suiker",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-pasteitjes-12",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasteitjes-13",
        "name": "plantaardige boter",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-pasteitjes-14",
        "name": "plantaardige olie",
        "amount": 30,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasteitjes-15",
        "name": "water",
        "amount": 5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-pasteitjes-16",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "l",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/pasteitjes"
  },
  {
    "id": "peasmaker-vegan-kapsalon",
    "clientKey": "peasmaker-vegan-kapsalon",
    "title": "Vegan kapsalon",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "vegan-kapsalon",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kapsalon-1",
        "name": "patat of gebakken aardappels",
        "amount": 600,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-2",
        "name": "Vegan geraspte kaas",
        "amount": 1,
        "unit": "stuk",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-kapsalon-3",
        "name": "Tomaat",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-4",
        "name": "IJsbergsla",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-5",
        "name": "Rode ui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-6",
        "name": "vegan mayonaise",
        "amount": 4,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kapsalon-7",
        "name": "citroensap",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-8",
        "name": "klein teentje knoflook",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-9",
        "name": "verse peterselie, fijngehakt",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kapsalon-10",
        "name": "Eventueel wat water",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kapsalon"
  },
  {
    "id": "peasmaker-vegan-bitterballen",
    "clientKey": "peasmaker-vegan-bitterballen",
    "title": "Vegan bitterballen",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 405,
    "imageKey": "vegan-bitterballen",
    "ingredients": [
      {
        "id": "peasmaker-vegan-bitterballen-1",
        "name": "Peas Maker Stukjes",
        "amount": 40,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bitterballen-2",
        "name": "plantaardige boter",
        "amount": 55,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bitterballen-3",
        "name": "bloem",
        "amount": 60,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bitterballen-4",
        "name": "groenbouillon",
        "amount": 350,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bitterballen-5",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bitterballen-6",
        "name": "Flinke snuf versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bitterballen-7",
        "name": "Paneermeel",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bitterballen-8",
        "name": "Panko",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bitterballen-9",
        "name": "plantaardige olie",
        "amount": 750,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-bitterballen"
  },
  {
    "id": "peasmaker-filodeeghapje",
    "clientKey": "peasmaker-filodeeghapje",
    "title": "Filodeeghapje",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "filodeeghapje",
    "ingredients": [
      {
        "id": "peasmaker-filodeeghapje-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-filodeeghapje-2",
        "name": "vegan feta",
        "amount": 100,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-filodeeghapje-3",
        "name": "verse dille",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-filodeeghapje-4",
        "name": "verse peterselie",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-filodeeghapje-5",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-filodeeghapje-6",
        "name": "gedroogde oregano",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-filodeeghapje-7",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-filodeeghapje-8",
        "name": "filo bladerdeeg",
        "amount": 1,
        "unit": "pakje",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-filodeeghapje-9",
        "name": "Olijfolie, voor het bestrijken",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/filodeeghapje"
  },
  {
    "id": "peasmaker-vegan-banh-mi",
    "clientKey": "peasmaker-vegan-banh-mi",
    "title": "Vegan bánh mì",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 15,
    "imageKey": "vegan-banh-mi",
    "ingredients": [
      {
        "id": "peasmaker-vegan-banh-mi-1",
        "name": "wortel",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-2",
        "name": "natuurazijn",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-3",
        "name": "suiker",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-4",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-5",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-banh-mi-6",
        "name": "coconut amonis",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-7",
        "name": "natuurazijn",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-8",
        "name": "five spice kruiden",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-9",
        "name": "gemberpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-10",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-11",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-12",
        "name": "witte Franse stokbroden",
        "amount": 2,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-13",
        "name": "Vegan paté",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-banh-mi-14",
        "name": "Vegan Mayonaise",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-banh-mi-15",
        "name": "Komkommer",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-banh-mi-16",
        "name": "Verse koriander",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-banh-mi"
  },
  {
    "id": "peasmaker-vegan-souvlaki",
    "clientKey": "peasmaker-vegan-souvlaki",
    "title": "Vegan souvlaki",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-souvlaki",
    "ingredients": [
      {
        "id": "peasmaker-vegan-souvlaki-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-souvlaki-2",
        "name": "olijfolie extra vierge",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-3",
        "name": "Citroenrasp van een halve citroen",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-4",
        "name": "citroensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-5",
        "name": "rode wijnazijn",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-6",
        "name": "gedroogde oregano",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-souvlaki-7",
        "name": "ahornsiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-8",
        "name": "verse tijm",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-souvlaki-9",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-10",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-11",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-12",
        "name": "komkommer",
        "amount": 250,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-13",
        "name": "stevige plantaardige yoghurt",
        "amount": 150,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-souvlaki-14",
        "name": "klein teentje knoflook",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-souvlaki-15",
        "name": "witte wijnazijn",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-16",
        "name": "verse dille, fijngehakt",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-17",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-souvlaki-18",
        "name": "zout en versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-souvlaki"
  },
  {
    "id": "peasmaker-vegan-huzarensalade",
    "clientKey": "peasmaker-vegan-huzarensalade",
    "title": "Vegan huzarensalade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-huzarensalade",
    "ingredients": [
      {
        "id": "peasmaker-vegan-huzarensalade-1",
        "name": "Peas Maker Stukjes",
        "amount": 30,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-2",
        "name": "ketchup",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-3",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-4",
        "name": "uienpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-5",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-6",
        "name": "gerookte paprikapoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-7",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-8",
        "name": "aardappelen",
        "amount": 500,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-9",
        "name": "augurk",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-10",
        "name": "kleine rode ui",
        "amount": 20,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-11",
        "name": "appel",
        "amount": 0.5,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-12",
        "name": "doperwten, diepvries",
        "amount": 50,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-13",
        "name": "vegan mayonaise",
        "amount": 100,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-huzarensalade-14",
        "name": "grove mosterd",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-huzarensalade"
  },
  {
    "id": "peasmaker-vegan-roti",
    "clientKey": "peasmaker-vegan-roti",
    "title": "Vegan roti",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 45,
    "imageKey": "vegan-roti",
    "ingredients": [
      {
        "id": "peasmaker-vegan-roti-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-roti-2",
        "name": "witte ui",
        "amount": 125,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-roti-3",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-roti-4",
        "name": "tomaat",
        "amount": 190,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-roti-5",
        "name": "garam masala",
        "amount": 2,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-roti-6",
        "name": "vegan bouillonpoeder met kipsmaak",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-roti-7",
        "name": "Indiase kerriepoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-roti-8",
        "name": "gedroogde chilivlokken",
        "amount": 1,
        "unit": "snufje",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-roti-9",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-roti-10",
        "name": "aardappelen, vastkokend",
        "amount": 1,
        "unit": "kg",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-roti-11",
        "name": "water",
        "amount": 500,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-roti-12",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-roti-13",
        "name": "kousenband",
        "amount": 300,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-roti"
  },
  {
    "id": "peasmaker-vegan-ramen",
    "clientKey": "peasmaker-vegan-ramen",
    "title": "Vegan ramen",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "vegan-ramen",
    "ingredients": [
      {
        "id": "peasmaker-vegan-ramen-1",
        "name": "instant noedels",
        "amount": 3,
        "unit": "pakjes",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-ramen-2",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-ramen-3",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-4",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-ramen-5",
        "name": "sojasaus",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-ramen-6",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-ramen-7",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-8",
        "name": "stengels paksoi",
        "amount": 160,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-9",
        "name": "champignons",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-10",
        "name": "tomaat",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-11",
        "name": "stengels bosui",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-12",
        "name": "taugé",
        "amount": 125,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-ramen-13",
        "name": "witte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-ramen"
  },
  {
    "id": "peasmaker-vegan-zoetzure-kip",
    "clientKey": "peasmaker-vegan-zoetzure-kip",
    "title": "Vegan zoetzure kip",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-zoetzure-kip",
    "ingredients": [
      {
        "id": "peasmaker-vegan-zoetzure-kip-1",
        "name": "zoete chilisaus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-2",
        "name": "ketchup",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-3",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-4",
        "name": "natuurazijn",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-5",
        "name": "sojasaus",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-6",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-7",
        "name": "sesamolie",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-8",
        "name": "witte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-9",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-10",
        "name": "sojasaus",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-11",
        "name": "witte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-12",
        "name": "maïzena",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-13",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-14",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-15",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-16",
        "name": "gele paprika",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-17",
        "name": "ananas",
        "amount": 160,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-18",
        "name": "courgette",
        "amount": 195,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-19",
        "name": "snoeptomaatjes",
        "amount": 150,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-zoetzure-kip-20",
        "name": "stengels bosui",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-zoetzure-kip"
  },
  {
    "id": "peasmaker-vegan-pasta-pesto",
    "clientKey": "peasmaker-vegan-pasta-pesto",
    "title": "Vegan pasta pesto",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "vegan-pasta-pesto",
    "ingredients": [
      {
        "id": "peasmaker-vegan-pasta-pesto-1",
        "name": "knoflook",
        "amount": 1,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-2",
        "name": "rucola",
        "amount": 40,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-3",
        "name": "basilicum",
        "amount": 15,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-4",
        "name": "zonnebloempitten, geroosterd",
        "amount": 2,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-5",
        "name": "edelgistvlokken",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-6",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-7",
        "name": "extra vierge olijfolie",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-8",
        "name": "glutenvrije pasta",
        "amount": 300,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-9",
        "name": "citroensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pasta-pesto-10",
        "name": "zongedroogde tomaatjes",
        "amount": 6,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-pasta-pesto"
  },
  {
    "id": "peasmaker-vegan-kipstukjes",
    "clientKey": "peasmaker-vegan-kipstukjes",
    "title": "Vegan kipstukjes",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "vegan-kipstukjes",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kipstukjes-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-2",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-3",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-4",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-5",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-6",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-7",
        "name": "limoensap",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-8",
        "name": "glutenvrije sojasaus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-9",
        "name": "agavesiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-10",
        "name": "sjalot",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-11",
        "name": "komkommer",
        "amount": 225,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-12",
        "name": "Flinke hand verse korianderblaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kipstukjes-13",
        "name": "Flinke hand verse muntblaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kipstukjes"
  },
  {
    "id": "peasmaker-vegan-sushi",
    "clientKey": "peasmaker-vegan-sushi",
    "title": "Vegan sushi",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 60,
    "imageKey": "vegan-sushi",
    "ingredients": [
      {
        "id": "peasmaker-vegan-sushi-1",
        "name": "Peas Maker Stukjes",
        "amount": 25,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sushi-2",
        "name": "vegan mayonaise",
        "amount": 2,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sushi-3",
        "name": "sriracha saus",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sushi-4",
        "name": "rijstazijn",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sushi-5",
        "name": "witte sesamzaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sushi-6",
        "name": "zwarte sesamzaadjes",
        "amount": 1,
        "unit": "stuk",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sushi-7",
        "name": "Avocado",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sushi-8",
        "name": "Komkommer",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sushi"
  },
  {
    "id": "peasmaker-vegan-burrito",
    "clientKey": "peasmaker-vegan-burrito",
    "title": "Vegan burrito",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 90,
    "imageKey": "vegan-burrito",
    "ingredients": [
      {
        "id": "peasmaker-vegan-burrito-1",
        "name": "bloem",
        "amount": 300,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-burrito-2",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-3",
        "name": "lauwwarm water",
        "amount": 180,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-4",
        "name": "plantaardige olie",
        "amount": 60,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-5",
        "name": "rijpe avocado’s",
        "amount": 2,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-6",
        "name": "klein teentje knoflook",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-7",
        "name": "verse koriander",
        "amount": 1,
        "unit": "handje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-8",
        "name": "groene serranopeper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-9",
        "name": "limoensap",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-10",
        "name": "witte ui",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-11",
        "name": "zout",
        "amount": 0.125,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-12",
        "name": "water",
        "amount": 100,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-13",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-burrito-14",
        "name": "natuurazijn",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-15",
        "name": "zoete paprikapoeder",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-16",
        "name": "gerookte paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-17",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-18",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-burrito-19",
        "name": "gedroogde oregano",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-burrito-20",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burrito-21",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burrito-22",
        "name": "gedroogde chilivlokken",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-burrito-23",
        "name": "gekookt water",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-burrito"
  },
  {
    "id": "peasmaker-vegan-kip-kerrie-salade",
    "clientKey": "peasmaker-vegan-kip-kerrie-salade",
    "title": "Vegan kip kerrie salade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 10,
    "imageKey": "vegan-kip-kerrie-salade",
    "ingredients": [
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-1",
        "name": "Peas Maker Stukjes",
        "amount": 20,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-2",
        "name": "appelazijn",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-3",
        "name": "ahornsiroop",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-4",
        "name": "kerriepoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-5",
        "name": "uienpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-6",
        "name": "zout",
        "amount": 0.125,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-7",
        "name": "versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-8",
        "name": "vegan mayonaise",
        "amount": 4,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-kip-kerrie-salade-9",
        "name": "doperwten, diepvries",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-kip-kerrie-salade"
  },
  {
    "id": "peasmaker-vegan-sloppy-joes",
    "clientKey": "peasmaker-vegan-sloppy-joes",
    "title": "Vegan sloppy joes",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-sloppy-joes",
    "ingredients": [
      {
        "id": "peasmaker-vegan-sloppy-joes-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-2",
        "name": "groene paprika",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-3",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-4",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-5",
        "name": "knoflook",
        "amount": 2,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-6",
        "name": "tomatenpuree",
        "amount": 70,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-7",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-8",
        "name": "bruine suiker",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-9",
        "name": "appelazijn",
        "amount": 0.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-10",
        "name": "mosterd",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-11",
        "name": "zout",
        "amount": 0.75,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-12",
        "name": "gerookte paprikapoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-13",
        "name": "chilivlokken",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-14",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-15",
        "name": "witte kool",
        "amount": 350,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-16",
        "name": "appel",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-17",
        "name": "plantaardig yoghurt",
        "amount": 100,
        "unit": "g",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-18",
        "name": "vegan mayonaise",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-19",
        "name": "appelazijn",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-20",
        "name": "ahornsiroop",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-21",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-22",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-23",
        "name": "witte hamburgerbroodjes of glutenvrij brood",
        "amount": 5,
        "unit": "stuk",
        "department": "Brood en gebak"
      },
      {
        "id": "peasmaker-vegan-sloppy-joes-24",
        "name": "Plantaardige boter",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sloppy-joes"
  },
  {
    "id": "peasmaker-vegan-sate",
    "clientKey": "peasmaker-vegan-sate",
    "title": "Vegan saté",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-sate",
    "ingredients": [
      {
        "id": "peasmaker-vegan-sate-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-sate-2",
        "name": "sojasaus",
        "amount": 3,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-3",
        "name": "ketjap manis",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-4",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-5",
        "name": "pindakaas",
        "amount": 125,
        "unit": "g",
        "department": "Ontbijt, broodbeleg en bakproducten"
      },
      {
        "id": "peasmaker-vegan-sate-6",
        "name": "water",
        "amount": 200,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-7",
        "name": "palmsuiker",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-8",
        "name": "azijn",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-9",
        "name": "ketjap manis",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-10",
        "name": "sriracha saus",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-sate-11",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-12",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-sate-13",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sate"
  },
  {
    "id": "peasmaker-vegan-pizza",
    "clientKey": "peasmaker-vegan-pizza",
    "title": "Vegan pizza",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 110,
    "imageKey": "vegan-pizza",
    "ingredients": [
      {
        "id": "peasmaker-vegan-pizza-1",
        "name": "lauwwarm water",
        "amount": 350,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pizza-2",
        "name": "instant droge gist",
        "amount": 1,
        "unit": "zakje",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pizza-3",
        "name": "bloem, plus extra voor het bestuiven van je werkblad en het deeg",
        "amount": 500,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-4",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pizza-5",
        "name": "Olijfolie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pizza-6",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-pizza-7",
        "name": "gerookte paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-8",
        "name": "gekneusde venkelzaad",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-pizza-9",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-10",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-11",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-pizza-12",
        "name": "suiker",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-13",
        "name": "versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-14",
        "name": "appelazijn",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-pizza-15",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-pizza"
  },
  {
    "id": "peasmaker-vegan-groene-curry",
    "clientKey": "peasmaker-vegan-groene-curry",
    "title": "Vegan groene curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-groene-curry",
    "ingredients": [
      {
        "id": "peasmaker-vegan-groene-curry-1",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-groene-curry-2",
        "name": "groene currypasta",
        "amount": 4,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-groene-curry-3",
        "name": "water",
        "amount": 300,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-groene-curry-4",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-groene-curry-5",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-groene-curry-6",
        "name": "kokosmelk",
        "amount": 250,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-groene-curry-7",
        "name": "suiker",
        "amount": 1.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-groene-curry-8",
        "name": "broccoli",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-groene-curry-9",
        "name": "wortel",
        "amount": 60,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-groene-curry-10",
        "name": "kousenband",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-groene-curry-11",
        "name": "courgette",
        "amount": 175,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-groene-curry-12",
        "name": "Thaise basilicum",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-groene-curry"
  },
  {
    "id": "peasmaker-vegan-fajita",
    "clientKey": "peasmaker-vegan-fajita",
    "title": "Vegan fajita",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-fajita",
    "ingredients": [
      {
        "id": "peasmaker-vegan-fajita-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-fajita-2",
        "name": "sojasaus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-fajita-3",
        "name": "limoensap",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-4",
        "name": "ahornsiroop",
        "amount": 0.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-fajita-5",
        "name": "knoflookpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-6",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-fajita-7",
        "name": "gerookte paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-8",
        "name": "cayennepeper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-9",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-10",
        "name": "rode paprika",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-11",
        "name": "groene paprika",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-12",
        "name": "Plantaardige olie",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-fajita-13",
        "name": "tomaten",
        "amount": 200,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-fajita-14",
        "name": "witte ui",
        "amount": 45,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-15",
        "name": "avocado",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-16",
        "name": "koriander",
        "amount": 2,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-17",
        "name": "limoensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-fajita-18",
        "name": "zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-fajita-19",
        "name": "mini tortilla wraps",
        "amount": 12,
        "unit": "stuk",
        "department": "Brood en gebak"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-fajita"
  },
  {
    "id": "peasmaker-vegan-bulgogi",
    "clientKey": "peasmaker-vegan-bulgogi",
    "title": "Vegan bulgogi",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 20,
    "imageKey": "vegan-bulgogi",
    "ingredients": [
      {
        "id": "peasmaker-vegan-bulgogi-1",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bulgogi-2",
        "name": "witte ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bulgogi-3",
        "name": "knoflook",
        "amount": 1,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bulgogi-4",
        "name": "sojasaus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bulgogi-5",
        "name": "mirin",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bulgogi-6",
        "name": "abrikozenjam",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bulgogi-7",
        "name": "Flinke snuf versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bulgogi-8",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bulgogi-9",
        "name": "sesamolie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bulgogi-10",
        "name": "sesamzaadjes",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bulgogi-11",
        "name": "stengel bosui",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-bulgogi"
  },
  {
    "id": "peasmaker-vegan-carbonara",
    "clientKey": "peasmaker-vegan-carbonara",
    "title": "Vegan carbonara",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-carbonara",
    "ingredients": [
      {
        "id": "peasmaker-vegan-carbonara-1",
        "name": "Peas Maker Stukjes",
        "amount": 40,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-carbonara-2",
        "name": "sojasaus",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-3",
        "name": "ahornsiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-4",
        "name": "gerookte paprikapoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-carbonara-5",
        "name": "knoflookpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-carbonara-6",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-7",
        "name": "haverroom",
        "amount": 250,
        "unit": "ml",
        "department": "Zuivel, boter en eieren"
      },
      {
        "id": "peasmaker-vegan-carbonara-8",
        "name": "vegan Parmezaan, geraspt",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-9",
        "name": "kala namak",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-10",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-carbonara-11",
        "name": "spaghetti",
        "amount": 250,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-carbonara-12",
        "name": "Verse peterselie",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-carbonara"
  },
  {
    "id": "peasmaker-vegan-bapao",
    "clientKey": "peasmaker-vegan-bapao",
    "title": "Vegan bapao",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 120,
    "imageKey": "vegan-bapao",
    "ingredients": [
      {
        "id": "peasmaker-vegan-bapao-1",
        "name": "water, lauwwarm",
        "amount": 175,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-2",
        "name": "instant droge gist",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-3",
        "name": "suiker",
        "amount": 3,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bapao-4",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-5",
        "name": "bloem",
        "amount": 325,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bapao-6",
        "name": "bakpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-bapao-7",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-8",
        "name": "kleine witte ui",
        "amount": 70,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bapao-9",
        "name": "klein teentje knoflook",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-bapao-10",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-11",
        "name": "water",
        "amount": 300,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-12",
        "name": "sojasaus",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-13",
        "name": "ketjap manis",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-14",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-bapao-15",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-bapao-16",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-bapao"
  },
  {
    "id": "peasmaker-griekse-ovenschotel",
    "clientKey": "peasmaker-griekse-ovenschotel",
    "title": "Griekse ovenschotel",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 50,
    "imageKey": "griekse-ovenschotel",
    "ingredients": [
      {
        "id": "peasmaker-griekse-ovenschotel-1",
        "name": "Peas Maker Stukjes",
        "amount": 60,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-2",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-3",
        "name": "witte wijnazijn",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-4",
        "name": "gedroogde oregano",
        "amount": 1.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-5",
        "name": "gedroogde chilivlokken",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-6",
        "name": "rode ui",
        "amount": 35,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-7",
        "name": "vegan feta",
        "amount": 100,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-8",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-9",
        "name": "grote tomaat",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-griekse-ovenschotel-10",
        "name": "groene paprika",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/griekse-ovenschotel"
  },
  {
    "id": "peasmaker-vegan-risotto",
    "clientKey": "peasmaker-vegan-risotto",
    "title": "Vegan risotto",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 35,
    "imageKey": "vegan-risotto",
    "ingredients": [
      {
        "id": "peasmaker-vegan-risotto-1",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-risotto-2",
        "name": "venkelzaad",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-risotto-3",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-4",
        "name": "arrowrootpoeder",
        "amount": 1,
        "unit": "el",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-risotto-5",
        "name": "vegan Parmezaan",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-6",
        "name": "peterselie",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-7",
        "name": "droge witte wijn",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-8",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-9",
        "name": "versgemalen zwarte peper",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-10",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-11",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-12",
        "name": "rode ui",
        "amount": 90,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-13",
        "name": "kastanje champignons",
        "amount": 125,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-14",
        "name": "risottorijst",
        "amount": 140,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-risotto-15",
        "name": "droge witte wijn",
        "amount": 150,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-risotto-16",
        "name": "groentebouillon",
        "amount": 500,
        "unit": "ml",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-risotto-17",
        "name": "vegan Parmezaan",
        "amount": 20,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-risotto"
  },
  {
    "id": "peasmaker-vegan-tikka-masala",
    "clientKey": "peasmaker-vegan-tikka-masala",
    "title": "Vegan tikka masala",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "vegan-tikka-masala",
    "ingredients": [
      {
        "id": "peasmaker-vegan-tikka-masala-1",
        "name": "rode ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-2",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-3",
        "name": "gemberpasta",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-4",
        "name": "knoflookpasta",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-5",
        "name": "tikka masala paste",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-6",
        "name": "kurkumapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-7",
        "name": "komijnpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-8",
        "name": "korianderpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-9",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-10",
        "name": "suiker",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-11",
        "name": "tomatenpuree",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-12",
        "name": "water",
        "amount": 400,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-13",
        "name": "gedroogde fenegriekblad",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-14",
        "name": "citroensap",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-15",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-tikka-masala-16",
        "name": "haverroom, glutenvrije optie",
        "amount": 150,
        "unit": "ml",
        "department": "Zuivel, boter en eieren"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-tikka-masala"
  },
  {
    "id": "peasmaker-vegan-caesar-salad",
    "clientKey": "peasmaker-vegan-caesar-salad",
    "title": "Vegan caesar salad",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-caesar-salad",
    "ingredients": [
      {
        "id": "peasmaker-vegan-caesar-salad-1",
        "name": "volkoren baguette (gebruik glutenvrij brood om deze salade glutenvrij te houden)",
        "amount": 75,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-2",
        "name": "olijfolie",
        "amount": 1,
        "unit": "scheut",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-3",
        "name": "versgemalen zwarte peper en zout",
        "amount": 1,
        "unit": "snufje",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-4",
        "name": "vegan mayonaise",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-5",
        "name": "hummus",
        "amount": 50,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-6",
        "name": "mosterd, fijn",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-7",
        "name": "citroensap",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-8",
        "name": "kappertjes, fijngehakt",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-9",
        "name": "vegan Parmezaan, geraspt",
        "amount": 40,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-10",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-11",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-12",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-13",
        "name": "knoflookpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-14",
        "name": "uienpoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-15",
        "name": "zout",
        "amount": 0.25,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-16",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-caesar-salad-17",
        "name": "kropjes baby romaine sla",
        "amount": 300,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-caesar-salad"
  },
  {
    "id": "peasmaker-vegan-burger",
    "clientKey": "peasmaker-vegan-burger",
    "title": "Vegan burger",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-burger",
    "ingredients": [
      {
        "id": "peasmaker-vegan-burger-1",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-burger-2",
        "name": "zout",
        "amount": 0.75,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-3",
        "name": "appelazijn",
        "amount": 1,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burger-4",
        "name": "uienpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burger-5",
        "name": "knoflookpoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burger-6",
        "name": "paprikapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burger-7",
        "name": "ahornsiroop",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-8",
        "name": "zwarte peper",
        "amount": 0.5,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-burger-9",
        "name": "edelgistvlokken",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-10",
        "name": "tomatenpuree",
        "amount": 1.5,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-11",
        "name": "havermout",
        "amount": 30,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-12",
        "name": "water",
        "amount": 4,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-burger-13",
        "name": "Plantaardige olie en plantaardige boter",
        "amount": 1,
        "unit": "stuk",
        "department": "Vega en plantaardig"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-burger"
  },
  {
    "id": "peasmaker-vegan-lasagne",
    "clientKey": "peasmaker-vegan-lasagne",
    "title": "Vegan lasagne",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 70,
    "imageKey": "vegan-lasagne",
    "ingredients": [
      {
        "id": "peasmaker-vegan-lasagne-1",
        "name": "Peas Maker Stukjes",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-lasagne-2",
        "name": "olijfolie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-3",
        "name": "witte ui",
        "amount": 140,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-lasagne-4",
        "name": "knoflook",
        "amount": 2,
        "unit": "teen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-lasagne-5",
        "name": "wortels",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-lasagne-6",
        "name": "rode paprika",
        "amount": 290,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-lasagne-7",
        "name": "gedroogde oregano",
        "amount": 2,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-lasagne-8",
        "name": "kaneelpoeder",
        "amount": 0.25,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-lasagne-9",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-10",
        "name": "zwarte peper",
        "amount": 0.25,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-lasagne-11",
        "name": "tomatenpuree",
        "amount": 140,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-12",
        "name": "water",
        "amount": 500,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-13",
        "name": "plantaardige boter",
        "amount": 50,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-lasagne-14",
        "name": "bloem",
        "amount": 60,
        "unit": "g",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-lasagne-15",
        "name": "havermelk",
        "amount": 600,
        "unit": "ml",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-lasagne-16",
        "name": "zout",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-17",
        "name": "edelgistvlokken",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-lasagne-18",
        "name": "lasagnebladen",
        "amount": 250,
        "unit": "g",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-lasagne"
  },
  {
    "id": "peasmaker-vegan-rendang",
    "clientKey": "peasmaker-vegan-rendang",
    "title": "Vegan rendang",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 30,
    "imageKey": "vegan-rendang",
    "ingredients": [
      {
        "id": "peasmaker-vegan-rendang-1",
        "name": "plantaardige olie",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-rendang-2",
        "name": "zakjeboemboe rendang",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-rendang-3",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-rendang-4",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-rendang-5",
        "name": "kokosmelk",
        "amount": 250,
        "unit": "ml",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-vegan-rendang-6",
        "name": "Zout",
        "amount": 1,
        "unit": "stuk",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-rendang"
  },
  {
    "id": "peasmaker-aziatisch-wokgerecht",
    "clientKey": "peasmaker-aziatisch-wokgerecht",
    "title": "Aziatisch wokgerecht",
    "subtitle": "Volledig recept in het gratis Peas Maker e-book",
    "minutes": 30,
    "imageKey": "aziatisch-wokgerecht",
    "ingredients": [],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/aziatisch-wokgerecht"
  },
  {
    "id": "peasmaker-vegan-tacos",
    "clientKey": "peasmaker-vegan-tacos",
    "title": "Vegan tacos",
    "subtitle": "Volledig recept in het gratis Peas Maker e-book",
    "minutes": 30,
    "imageKey": "vegan-tacos",
    "ingredients": [],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-tacos"
  },
  {
    "id": "peasmaker-vegan-gehaktballen",
    "clientKey": "peasmaker-vegan-gehaktballen",
    "title": "Vegan gehaktballen",
    "subtitle": "Volledig recept in het gratis Peas Maker e-book",
    "minutes": 30,
    "imageKey": "vegan-gehaktballen",
    "ingredients": [],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-gehaktballen"
  },
  {
    "id": "peasmaker-vegan-tonijnsalade",
    "clientKey": "peasmaker-vegan-tonijnsalade",
    "title": "Vegan tonijnsalade",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 10,
    "imageKey": "vegan-tonijnsalade",
    "ingredients": [
      {
        "id": "peasmaker-vegan-tonijnsalade-1",
        "name": "nori",
        "amount": 0.5,
        "unit": "vel",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-2",
        "name": "Peas Maker Stukjes",
        "amount": 40,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-3",
        "name": "water",
        "amount": 150,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-4",
        "name": "azijn",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-5",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-6",
        "name": "vegan mayonaise",
        "amount": 3,
        "unit": "el",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-7",
        "name": "mosterd, fijn",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-8",
        "name": "witte ui",
        "amount": 1.5,
        "unit": "el",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-9",
        "name": "augurk",
        "amount": 1,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-vegan-tonijnsalade-10",
        "name": "Versgemalen zwarte peper",
        "amount": 1,
        "unit": "stuk",
        "department": "Aardappelen, groente en fruit"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-tonijnsalade"
  },
  {
    "id": "peasmaker-handi-curry",
    "clientKey": "peasmaker-handi-curry",
    "title": "Handi curry",
    "subtitle": "Plantaardig recept van Peas Maker",
    "minutes": 25,
    "imageKey": "handi-curry",
    "ingredients": [
      {
        "id": "peasmaker-handi-curry-1",
        "name": "rode ui",
        "amount": 100,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-handi-curry-2",
        "name": "plantaardige olie",
        "amount": 2,
        "unit": "el",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-handi-curry-3",
        "name": "knoflook",
        "amount": 3,
        "unit": "tenen",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-handi-curry-4",
        "name": "grote tomaat",
        "amount": 200,
        "unit": "g",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-handi-curry-5",
        "name": "gemberpasta",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-handi-curry-6",
        "name": "komijnzaad",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-handi-curry-7",
        "name": "korianderzaad",
        "amount": 1,
        "unit": "tl",
        "department": "Aardappelen, groente en fruit"
      },
      {
        "id": "peasmaker-handi-curry-8",
        "name": "kurkumapoeder",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-handi-curry-9",
        "name": "chilipoeder",
        "amount": 0.5,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-handi-curry-10",
        "name": "zout",
        "amount": 0.5,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-handi-curry-11",
        "name": "Peas Maker Stukjes",
        "amount": 80,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-handi-curry-12",
        "name": "water",
        "amount": 250,
        "unit": "ml",
        "department": "Conserven, soepen, sauzen, oliën"
      },
      {
        "id": "peasmaker-handi-curry-13",
        "name": "kokosyoghurt",
        "amount": 125,
        "unit": "g",
        "department": "Vega en plantaardig"
      },
      {
        "id": "peasmaker-handi-curry-14",
        "name": "garam masala",
        "amount": 1,
        "unit": "tl",
        "department": "Wereldkeukens, kruiden, pasta en rijst"
      },
      {
        "id": "peasmaker-handi-curry-15",
        "name": "gedroogde fenegriekblad",
        "amount": 1,
        "unit": "tl",
        "department": "Conserven, soepen, sauzen, oliën"
      }
    ],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/handi-curry"
  },
  {
    "id": "peasmaker-vegan-sate-bladerdeeghapjes",
    "clientKey": "peasmaker-vegan-sate-bladerdeeghapjes",
    "title": "Vegan saté bladerdeeghapjes",
    "subtitle": "Volledig recept in het gratis Peas Maker e-book",
    "minutes": 30,
    "imageKey": "vegan-sate-bladerdeeghapjes",
    "ingredients": [],
    "sourceUrl": "https://www.peasmaker.nl/blogs/alle/vegan-sate-bladerdeeghapjes"
  }
];

export const peasMakerRecipes: Recipe[] = peasMakerRecipeData.map(({ imageKey, ...recipe }) => ({
  ...recipe,
  image: peasMakerImages[imageKey],
}));
