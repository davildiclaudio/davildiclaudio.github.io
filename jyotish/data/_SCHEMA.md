# Database Jyotish — Architettura

## Stato attuale

| File | Sezione | Stato |
|------|---------|-------|
| `rashi.json` | Sezione 1 — 12 Rashi | COMPLETO (densità alta, ~500 parole/Rashi) |
| `nakshatra.json` | Sezione 2 — 27 Nakshatra | DA GENERARE (chiedere "continua nakshatra 1-9", poi 10-18, poi 19-27) |
| `bhava.json` | Sezione 3 — 12 Bhava (case) | DA GENERARE (chiedere "continua bhava") |
| `graha.json` | Sezione 4 — 9 Graha (pianeti) | DA GENERARE (chiedere "continua graha") |
| `dasha.json` | Sezione 5 — Vimshottari Dasha | DA GENERARE |
| `yoga.json` | Sezione 6 — Yoga e combinazioni | DA GENERARE |
| `rimedi.json` | Sezione 7 — Rimedi vedici | DA GENERARE |

## Perché modulare

Generare 200.000+ parole in una singola conversazione è oltre i limiti di output di un singolo turno (~8-16k token = ~6-12k parole). Splittando in 7 file e chiedendo blocco per blocco si ottiene la massima densità senza degradazione qualitativa.

## Schema JSON consigliato per ogni sezione

### Nakshatra (esempio struttura)
```json
{
  "_meta": {...},
  "nakshatra": [
    {
      "id": 1,
      "nome": "Ashwini",
      "gradi": "0°00' - 13°20' Mesha",
      "signore_pianetario": "Ketu",
      "divinita_governante": "Ashwini Kumara (i due gemelli celesti, medici degli dei)",
      "simbolo": "Testa di cavallo",
      "shakti": "Shidhra-vyapani-shakti — il potere di raggiungere le cose rapidamente",
      "mito": "...",
      "personalita": "...",
      "tema_karmico": "...",
      "salute_professione_relazioni": {...},
      "casta": "Vaishya",
      "varna": "Vaishya",
      "gana": "Deva",
      "yoni": "Cavallo (Ashva), maschile",
      "guna": "Rajas/Tamas/Sattva",
      "tattva": "Prithvi",
      "pada": [
        {"numero": 1, "navamsa": "Mesha", "descrizione": "..."},
        {"numero": 2, "navamsa": "Vrishabha", "descrizione": "..."},
        {"numero": 3, "navamsa": "Mithuna", "descrizione": "..."},
        {"numero": 4, "navamsa": "Karka", "descrizione": "..."}
      ],
      "mantra": "...",
      "personaggi_famosi": [...]
    }
  ]
}
```

### Bhava (12 case)
```json
{
  "bhava": [
    {
      "numero": 1,
      "nome_sanscrito": "Tanu Bhava",
      "italiano": "Casa del corpo / Lagna",
      "significazioni_primarie": "...",
      "significazioni_secondarie": "...",
      "karaka": "Sole (per il Sé)",
      "benefici_qui": "...",
      "malefici_qui": "...",
      "signore_in_altre_case": {
        "1": "...", "2": "...", "3": "...",
        "...": "...", "12": "..."
      },
      "salute": "...",
      "ricchezza": "...",
      "relazioni": "..."
    }
  ]
}
```

### Graha (9 pianeti)
```json
{
  "graha": [
    {
      "id": 1,
      "nome": "Surya",
      "italiano": "Sole",
      "karakatva": "...",
      "esaltazione": "Mesha 10°",
      "debilitazione": "Tula 10°",
      "segno_proprio": "Simha",
      "segni_amici": ["Mesha","Karka","Vrischika","Dhanu","Meena"],
      "segni_nemici": ["Vrishabha","Tula"],
      "neutri": ["Mithuna","Kanya"],
      "forte": "...",
      "debole": "...",
      "combusto": "...",
      "ruolo_per_bhava": {"1":"...", "2":"..."},
      "rimedi": {...},
      "salute": "...",
      "drishti": "Aspetto pieno alla 7ª casa",
      "fisico_mentale": "..."
    }
  ]
}
```

### Dasha
```json
{
  "vimshottari": [
    {
      "pianeta": "Surya",
      "durata_anni": 6,
      "mahadasha_descrizione": "...",
      "aree_attive": [...],
      "test_karmico": "...",
      "antardasha_favorevoli": [...],
      "antardasha_difficili": [...],
      "fare": [...],
      "evitare": [...],
      "pratiche_spirituali": [...]
    }
  ]
}
```

### Yoga
```json
{
  "yoga": [
    {
      "categoria": "Pancha Mahapurusha",
      "yoga": [
        {
          "nome": "Ruchaka Yoga",
          "formazione": "Marte in Mesha/Vrischika/Makara in casa angolare (1,4,7,10) dal Lagna",
          "effetti": "...",
          "esempio_personaggio": "..."
        }
      ]
    }
  ]
}
```

### Rimedi
```json
{
  "gemstones": [...],
  "mantras": [...],
  "yantras": [...],
  "donazioni": [...],
  "digiuni": [...],
  "templi": [...]
}
```

## Come usare in JavaScript

```js
const rashiData = await fetch('./data/rashi.json').then(r => r.json());
const nakshatraData = await fetch('./data/nakshatra.json').then(r => r.json());
// ecc.

function getRashiInterpretation(rashiId) {
  return rashiData.rashi.find(r => r.id === rashiId);
}
```

## Prossimi passi suggeriti

1. **Nakshatra**: chiedere "continua con Nakshatra 1-9 al livello di densità di rashi.json" (Ashwini → Ashlesha)
2. **Nakshatra 10-18**: Magha → Jyeshtha
3. **Nakshatra 19-27**: Moola → Revati
4. **Bhava**: tutti i 12 in un colpo (più snelli per item)
5. **Graha**: tutti i 9
6. **Dasha + Yoga + Rimedi**: ultimi tre file
