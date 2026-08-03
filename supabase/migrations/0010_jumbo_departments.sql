update public.recipe_ingredients
set department = case
  when department = 'Groente & fruit' then 'Aardappelen, groente en fruit'
  when department = 'Pasta, rijst & wereldkeuken' then 'Wereldkeukens, kruiden, pasta en rijst'
  when department = 'Koeling' and lower(name) ~ '(kaas|brie|feta|mozzarella|parmezaan|salami|ham|bacon|tapas)'
    then 'Vleeswaren, kaas en tapas'
  when department = 'Koeling' and lower(name) ~ '(kip|gehakt|vlees|vis|zalm|rund|varken)'
    then 'Vlees, vis en vega'
  when department = 'Koeling' then 'Zuivel, boter en eieren'
  when department = 'Kruiden & houdbaar' and lower(name) ~ '(pasta|spaghetti|rijst|noedel|couscous|wrap|tortilla|kruid|currypasta)'
    then 'Wereldkeukens, kruiden, pasta en rijst'
  when department = 'Kruiden & houdbaar' then 'Conserven, soepen, sauzen, oliën'
  else department
end
where department in (
  'Groente & fruit',
  'Koeling',
  'Pasta, rijst & wereldkeuken',
  'Kruiden & houdbaar'
);

update public.shopping_items
set department = case
  when department = 'Groente & fruit' then 'Aardappelen, groente en fruit'
  when department = 'Pasta, rijst & wereldkeuken' then 'Wereldkeukens, kruiden, pasta en rijst'
  when department = 'Koeling' and lower(name) ~ '(kaas|brie|feta|mozzarella|parmezaan|salami|ham|bacon|tapas)'
    then 'Vleeswaren, kaas en tapas'
  when department = 'Koeling' and lower(name) ~ '(kip|gehakt|vlees|vis|zalm|rund|varken)'
    then 'Vlees, vis en vega'
  when department = 'Koeling' then 'Zuivel, boter en eieren'
  when department = 'Kruiden & houdbaar' and lower(name) ~ '(pasta|spaghetti|rijst|noedel|couscous|wrap|tortilla|kruid|currypasta)'
    then 'Wereldkeukens, kruiden, pasta en rijst'
  when department = 'Kruiden & houdbaar' then 'Conserven, soepen, sauzen, oliën'
  else department
end
where department in (
  'Groente & fruit',
  'Koeling',
  'Pasta, rijst & wereldkeuken',
  'Kruiden & houdbaar'
);
