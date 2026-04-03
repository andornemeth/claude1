# Sörkert Szimulátor / Beer Garden Simulator / Bašta Simulator

3D sörkert játék Three.js-sel, ahol pincérként söröket szolgálsz fel az asztalokhoz.

**Játék link:** https://andornemeth.github.io/claude1/

---

## Játékmenet

Egy napos sörkertben dolgozol pincérként. A vendégek (LEGO figurák) az asztaloknál ülnek és sörre várnak. A te feladatod, hogy a csaptól söröket hozz nekik, minél többet 90 másodperc alatt!

### Hogyan játssz

1. **Indítás** — Koppints a képernyőre (mobil) vagy kattints (PC)
2. **Sör felvétele** — Menj a **sárga pulthoz** (csap, a pálya hátuljában) és nyomd meg a **FELVSZ** gombot (mobil) vagy a **SPACE** billentyűt (PC)
3. **Kiszolgálás** — Nyomd meg a **LETESZ** gombot — a sör automatikusan a legközelebbi piros jelzésű asztalhoz kerül
4. **Ismétlés** — Menj vissza a csaphoz újabb sörért!

### Pontozás

- Minden kiszolgált sör **+1 pont**
- 90 másodperced van összesen
- Az asztalok folyamatosan kérnek új söröket (piros golyó jelzi)

---

## Irányítás

### Mobilon (Android / iOS)

| Művelet | Hogyan |
|---------|--------|
| Mozgás | **Bal kéz** — érintsd meg a képernyő bal felét és húzd az ujjad (joystick) |
| Sör felvétele | **Jobb alul** — narancssárga kör gomb (FELVSZ) a csap közelében |
| Sör letétele | **Jobb alul** — zöld kör gomb (LETESZ) bárhol a pályán |

### PC-n (billentyűzet + egér)

| Művelet | Hogyan |
|---------|--------|
| Mozgás | **WASD** vagy **nyílbillentyűk** |
| Sör felvétele / letétele | **SPACE** (szóköz) |

---

## A pálya elemei

| Elem | Leírás |
|------|--------|
| **Sárga pult (csap)** | A pálya hátsó részén — ide menj sörért |
| **Asztalok** | 12 asztal LEGO figurákkal, akik sörre várnak |
| **Piros golyó** | Az asztal felett lebeg — ez jelzi, hogy sört kérnek |
| **Zöld felvillanás** | Sikeres kiszolgálás visszajelzése |
| **Kerítés** | A sörkert határa — nem tudsz kilépni |
| **Fák** | Dekoráció a sörkert szélén |

---

## Nyelvek

A játék automatikusan felismeri a böngésző nyelvét:

- **Magyar** (`hu`) — alapértelmezett magyar böngészőhöz
- **Szerb** (`sr`) — szerb böngészőhöz
- **Angol** (`en`) — minden más nyelv esetén

---

## Technológia

- **Three.js r128** — 3D renderelés (CDN-ről töltődik)
- **Vanilla JavaScript** — egyetlen `index.html` fájl, nincs build lépés
- **GitHub Pages** — ingyenes hosting
- Egyedi LEGO minifigura stílusú 3D karakterek
- Érintőképernyős joystick + akció gomb
- Valós idejű árnyékok, napsütés, felhők

---

## Fejlesztés

A játék egyetlen `index.html` fájlból áll a `gh-pages` branchen.

```bash
# Klónozás
git clone https://github.com/andornemeth/claude1.git
cd claude1
git checkout gh-pages

# Megnyitás böngészőben
open index.html
```

Helyi teszteléshez egyszerűen nyisd meg az `index.html` fájlt a böngészőben, vagy használj egy helyi szervert:

```bash
python3 -m http.server 8000
# Majd nyisd meg: http://localhost:8000
```
