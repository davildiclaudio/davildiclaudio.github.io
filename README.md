# DAVIL — Life Leadership & Coaching

Sito one-page del brand **Davil International Consulting**. HTML/CSS/JS vanilla, zero build step, zero dipendenze locali.

## Struttura

```
sito-davil/
├── index.html              # Sito completo (10 sezioni)
├── style.css               # Tutto il CSS (dark theme + responsive)
├── script.js               # Animazioni GSAP/Lenis, cursor custom, micro-interactions
├── dream.js                # Interprete AI sogni (BYO API key)
├── 404.html                # Pagina 404 stilizzata
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── favicon.svg
│   ├── og-image.svg        # Open Graph/Twitter card
│   ├── logo-davil.svg      # Logo wordmark fallback
│   ├── caduceo.svg
│   ├── ikigai.svg
│   ├── fibonacci.svg
│   ├── albero-vita.svg
│   ├── hero-davil.png      # ⚠️ da caricare: foto brand
│   └── content/            # ⚠️ slot per le 10 slide PNG
├── ARCHIVIO.md             # Traccia dei PDF di riferimento (fuori cartella)
└── DA-FARE-INSIEME.md      # Punti aperti da completare insieme
```

## Sviluppo locale

```bash
cd sito-davil
python3 -m http.server 5173
# apri http://localhost:5173/
```

In alternativa:
```bash
npx serve .
# oppure
npx http-server -p 5173
```

## Dipendenze esterne (solo via CDN)

- [GSAP 3.12.5](https://gsap.com/) + ScrollTrigger — animazioni scroll-based
- [Lenis 1.0.42](https://lenis.studiofreight.com/) — smooth scroll
- Google Fonts: Space Grotesk + Fraunces

Nessun package manager. Tutto caricato via `<script>` da CDN: aprire `index.html` in un qualsiasi browser moderno.

## Interprete AI dei sogni

- Sezione `#sogni`, JS in `dream.js`.
- L'utente inserisce la propria **API key** (Anthropic o OpenAI). La chiave resta nel `localStorage` del suo browser e la richiesta parte in diretta verso il provider.
- Nessun dato passa dai nostri server.
- System prompt junghiano in `dream.js` (framework: Jung, Hillman, Neumann — archetipi, amplificazione, compensazione, alchimia come individuazione).

## Deploy

Il sito è 100% statico. Qualsiasi host funziona.

### Opzione 1 — Netlify (consigliata, gratis, HTTPS automatico)

1. Registra un account su https://app.netlify.com/
2. Trascina la cartella `sito-davil/` sulla schermata "Sites"
3. Netlify assegna un URL tipo `davil-coaching.netlify.app`
4. Dominio custom: Site settings → Domain management → Add custom domain → inserisci `davil-life-leadership-coaching.it` e segui le istruzioni per i record DNS.

### Opzione 2 — Vercel

1. Registrati su https://vercel.com/
2. `vercel` dalla cartella del progetto (o import via Git).
3. Dominio custom: Project Settings → Domains.

### Opzione 3 — GitHub Pages

1. Push della cartella in un repo GitHub.
2. Settings → Pages → source: `main` branch, root.
3. URL tipo `username.github.io/davil-site/`.

### Opzione 4 — Hosting classico (FTP)

1. Zippa la cartella.
2. Carica tutti i file nella root del tuo hosting via FTP/cPanel.
3. Assicurati che `index.html` sia alla radice.

## DNS per dominio custom

Su Netlify/Vercel, i record tipici sono:
- `A` record → IP fornito dall'host
- `CNAME` per `www.` → subdomain dell'host

Controlla dove hai registrato il dominio (Aruba, Register.it, GoDaddy…) e aggiungi i record dalla loro dashboard.

## Performance & SEO

- HTML semantico con landmark (`header`, `main`, `section`, `footer`).
- Meta tag Open Graph + Twitter Cards.
- JSON-LD: schema `ProfessionalService` + `FAQPage`.
- `robots.txt` + `sitemap.xml`.
- Lazy loading immagini.
- Font preconnect Google Fonts.
- Nessun tracker di terze parti (puoi aggiungere Plausible/Umami per analytics privacy-friendly).

## Accessibilità

- Navigazione tastiera ok.
- `prefers-reduced-motion` rispettato: tutte le animazioni vengono disattivate.
- Alt text su SVG decorativi via `aria-hidden`; alt descrittivi sulle immagini di contenuto.
- Focus states gestiti per link e bottoni.

## Manutenzione copy

- Testi principali: `index.html`.
- System prompt sogni: costante `SYSTEM_PROMPT` in `dream.js`.
- Testimonianze: attualmente placeholder — sostituire con citazioni reali da Trustpilot.
