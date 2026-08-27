### Technologie
Projekt je implementován v doporučeném Reactu. Spouští se tedy příkazem `npm start` v kořenovém adresáři (před prvním spuštěním je potřeba instalovat závislosti pomocí `npm install`).

### Zrojové soubory
Implementace je v `App.js` a `App.css`. Navržená struktura XML je `cars.xml`.

### Poznámky
- Návrh XML struktury počítá s tím, že model má danou cenu a DPH (chápu že v reálu by to nefungovalo a vidím, že i v ukázkové tabulce to pro jeden řádek neplatí). Tato struktura snižuje duplikaci dat a vede na mírně zajímavější kód.  
- V kódu je navíc funkce `AggregatedTablePerWeek`, která agreguje ceny přes jednotlivé týdny (šlo by jednoduše změnit pouze na víkendy), kterou jsem vytvořil jako první, než mi došlo že zadání to pravděpodobně myslí agregovat přes všechny víkendy dohromady.
