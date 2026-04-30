# Profilo Esoterico-Archetipico — Specifica Tecnica

App web (HTML/JS singolo file) che, dato nome+cognome+data+ora+luogo di nascita, calcola un profilo completo attingendo a numerologia, astrologia, sistemi maya/cinesi, tarocchi e archetipi junghiani.

Pensata per il lavoro di mental coach (Davil): lente archetipica, non oracolo. Linguaggio coach denso, italiano, integrabile col lessico personale.

---

## 1. Numerologia Pitagorica

### Tabella lettere → numeri
```
1: A J S    2: B K T    3: C L U    4: D M V    5: E N W
6: F O X    7: G P Y    8: H Q Z    9: I R
```
Vocali per Soul Urge: A E I O U (Y opzionale via toggle).

### Calcoli
| Numero | Formula |
|---|---|
| Life Path | Riduci GG, MM, AAAA separatamente; somma; preserva 11/22/33 |
| Expression / Destino | Somma tutte le lettere del nome completo |
| Soul Urge / Anima | Solo vocali |
| Personality | Solo consonanti |
| Birthday | Il giorno di nascita |
| Maturity | Life Path + Expression |

### Master Numbers
11, 22, 33 non si riducono.

### Archetipo per cifra
1 Pioniere · 2 Diplomatico · 3 Comunicatore · 4 Costruttore · 5 Esploratore · 6 Guaritore · 7 Mistico · 8 Manager · 9 Saggio · 11 Visionario · 22 Architetto · 33 Maestro.

Fonti: Hans Decoz (worldnumerology.com), ProfessionalNumerology.

---

## 2. Numerologia Caldea (Cheiro)

### Tabella (no 9 — sacro)
```
1: A I J Q Y    2: B K R    3: C G L S    4: D M T
5: E H N X      6: U V W    7: O Z        8: F P
```

### Compound Numbers 10–52
Tavola di Cheiro: ogni somma non ridotta porta un significato mistico distinto (es. 17 = Stella di Venere, 19 = Il Sole, 27 = Lo Scettro). Per N>52 ridurre prima a un compound ≤52.

Fonte: Cheiro, *Book of Numbers*; ProfessionalNumerology, Astroccult.

---

## 3. Numerologia Kabbalistica / Gematria

22 lettere ebraiche → 22 Arcani Maggiori → corrispondenze astrologiche (Golden Dawn).

```
Aleph(1)  Matto      Aria
Beth(2)   Mago       Mercurio
Gimel(3)  Papessa    Luna
Daleth(4) Imperatrice Venere
Heh(5)    Imperatore Ariete
Vav(6)    Papa       Toro
Zayin(7)  Amanti     Gemelli
Cheth(8)  Carro      Cancro
Teth(9)   Forza      Leone
Yod(10)   Eremita    Vergine
Kaph(20)  Fortuna    Giove
Lamed(30) Giustizia  Bilancia
Mem(40)   Appeso     Acqua
Nun(50)   Morte      Scorpione
Samekh(60) Temperanza Sagittario
Ayin(70)  Diavolo    Capricorno
Peh(80)   Torre      Marte
Tzaddi(90) Stelle    Acquario
Qoph(100) Luna       Pesci
Resh(200) Sole       Sole
Shin(300) Giudizio   Fuoco
Tau(400)  Mondo      Saturno
```

Adattamento latino: mappa ordinale ciclica modulo 22.

---

## 4. Astrologia Occidentale

Segno solare: tabella tropicale standard (cusp ±1 giorno; per precisione serve longitudine eclittica reale).

Tema natale completo: libreria `circular-natal-horoscope-js` (effemeridi Moshier, ±1 arcmin, anni 3000 a.C.–3000 d.C.).

Geocoding: Nominatim/OSM (1 req/s, User-Agent obbligatorio).

---

## 5. Zodiaco Cinese

12 animali × 5 elementi (ciclo 60). Anno cinese inizia al Capodanno cinese (gennaio/febbraio): tabella hard-coded 1900–2050.

```
Topo Bue Tigre Coniglio Drago Serpente Cavallo Capra Scimmia Gallo Cane Maiale
```

Elemento decennale: ultima cifra anno → Metallo(0,1) Acqua(2,3) Legno(4,5) Fuoco(6,7) Terra(8,9).

---

## 6. Maya / Dreamspell (Argüelles)

20 Sigilli × 13 Toni = 260 kin. Algoritmo:

1. JDN da data Gregoriana (Fliegel-Van Flandern)
2. `days = JDN - 584283` (correlazione GMT)
3. Sigillo: `((days+19) mod 20)+1`
4. Tono: `((days+3) mod 13)+1`

Differenza Dreamspell/Tzolkin tradizionale: Dreamspell salta 29 febbraio. Per il pubblico Davil → Dreamspell.

---

## 7. Arcani Maggiori — Birth Cards (Arrien/Greer)

```
Personality = riduci(GG+MM+AAAA) a 1-22
Soul = riduci ulteriormente a 1-9
Year Card = riduci(GG+MM+ANNO_CORRENTE) a 1-22
```

Eccezione 19: Personality = Sole (XIX), Soul = Mago (1).

---

## 8. Archetipi Junghiani (Pearson/Mark, 12)

Ego: Innocente, Uomo Comune, Eroe, Custode.
Anima: Esploratore, Fuorilegge, Amante, Creatore.
Sé: Sovrano, Mago, Saggio, Folle.

Mappatura suggerita numero→archetipo per output coach.

---

## Architettura

Single HTML/JS file. Pure client-side. Nessun dato salvato.

- Form: nome, cognome, data, ora, luogo
- Calcoli: pure JS
- Rendering: card-based per ogni sistema
- Linguaggio: italiano coach-style

## Avvertenza etica

Strumento di self-reflection, non oracolo. Ogni numero/segno è messaggero, non sentenza — coerente con la visione Davil: "il sintomo è messaggero dell'Anima".

## Fonti chiave

- Hans Decoz · World Numerology
- Cheiro · *Book of Numbers*
- Mary K. Greer · *Tarot Birth Cards*
- Liz Greene · CPA London
- Caroline Myss · *Sacred Contracts*
- José Argüelles · *Mayan Factor*
- circular-natal-horoscope-js (libreria effemeridi)
