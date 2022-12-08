## Backend elindítása localhoston

Ahhoz hogy a backend megfelelően működjön, szükséges a **NodeJS** és az **npm** csomagkezelő, valamint egy futó **MySQL szerver**, amin van egy "szakdoga" nevű üres adatbázis.

Ha szükséges, az **ormconfig.js** fájlban változtatható az adatbázis neve, valamint az adatbázis kapcsolat paraméterei.

Amint ez elkészült, parancssorban a backend root mappájába navigálva futtassa le az `npm i` parancsot. Ezzel feltelepülnek a szükséges csomagok.

Ezután ugyanitt futtassa az `npm run start:dev` parancsot amitől a backend elindul és létrehozza a szükséges táblákat az adatbázisban.

**_Fontos:_** Első használat előtt, a **role** táblához hozzá kell adni három bejegyzést (pl MySQL Workbench, vagy bármilyen hasonló szoftver használatával). Ezek az alábbi táblázatban láthatóak. Fontos hogy pontosan ugyanígy szerepeljenek az adatok az adatbázisban.

| id  |     name     |
| :-: | :----------: |
|  1  |    owner     |
|  2  | projectOwner |
|  3  | contributor  |

Ezek után a backend használatra kész.
