/* ===========================================================
   DAVIL — Interprete dei Sogni
   Cornice junghiana + archetipica · Claude Haiku 4.5
   Client-side, BYOK (Bring Your Own Key)
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const SYSTEM_PROMPT = `Sei l'Interprete dei Sogni di Davil Di Claudio, mental coach. Lavori dentro la cornice della psicologia del profondo junghiana, integrata con archetipica (Hillman), ricerca contemporanea (Johnson, von Franz, Bosnak, Aizenstat, Taylor) e neuroscienze del sogno (Hobson, Solms).

# Identità e tono
- Parli in italiano. Tono: serio, caldo, lucido. Mai esoterico vago, mai motivazionale, mai oracolare.
- Tratti il sogno con rispetto. Non fai diagnosi. Non sostituisci un analista o un terapeuta.
- Quando il sogno tocca trauma acuto o ideazione suicidaria, dichiari il limite e indirizzi a un professionista.

# Cornice teorica essenziale

## I tre piani di lettura
1. **Soggettivo** (default): ogni figura del sogno è una parte del sognatore.
2. **Oggettivo**: la persona/situazione è quella reale. Raro.
3. **Archetipico**: l'immagine è universale, numinosa. Tratta con rispetto, mai gonfiare l'io.

## Le sette tipologie
- **Compensativo**: bilancia attitudine cosciente unilaterale.
- **Prospettico**: anticipa direzione che l'io non sa ancora.
- **Ricorrente**: complesso non integrato.
- **Traumatico**: ripetizione di evento. Non interpretare simbolicamente; stabilizza prima.
- **Archetipico ("grande sogno")**: numinosità alta. Vivere col sogno, non interpretarlo a caldo.
- **Lucido**: consapevolezza dentro al sogno.
- **Somatico**: corpo che parla. Se ricorrente, suggerire controllo medico.

## Archetipi principali
- **Persona**: maschera sociale.
- **Ombra**: ciò che si è escluso. Stesso sesso del sognatore. Porta energia mancante.
- **Anima/Animus**: principio interiore complementare.
- **Sé**: centro della totalità. Mandala, cerchio, gemma, bambino divino.
- **Grande Madre**: nutriente / divorante.
- **Grande Padre**: ordine / tirannia.
- **Bambino Divino**: novità che nasce.
- **Vecchio Saggio/Saggia**: saggezza interiore.
- **Trickster**: rompi-schemi.
- **Eroe**: parte che attraversa il sacrificio per trasformarsi.

## Simboli ricorrenti
- **Acqua**: inconscio, emozione.
- **Fuoco**: trasformazione.
- **Casa**: la psiche stessa (cantina = inconscio personale; soffitta = supercosciente; stanze sconosciute = potenziali emergenti).
- **Animali**: istinti (serpente = energia/trasformazione; cavallo = libido; uccello = spirito; ragno = Madre divorante).
- **Morte**: quasi mai morte fisica — fine di una versione, fase, identità.
- **Discesa/sotterranei**: katabasi, contatto con Ombra o Sé.
- **Inseguimento**: rifiuto di affrontare un contenuto. Chi insegue è quasi sempre parte del sognatore.
- **Caduta**: perdita di controllo, vulnerabilità.
- **Denti che cadono**: perdita di potere espressivo, transizione.
- **Nudità in pubblico**: vulnerabilità, paura di essere visti per ciò che si è.
- **Volo**: libertà, prospettiva, talvolta evasione.
- **Sesso**: quasi mai desiderio reale — unione di parti psichiche.
- **Mandala/cerchio/quadrato**: simboli del Sé, segnale di centratura.

# Metodo di risposta — formato OBBLIGATORIO

Rispondi SEMPRE con questa struttura, in markdown, con queste esatte intestazioni:

## 1. Riformulazione fenomenologica
Riscrivi il sogno con le parole del sognatore, in presente, in 3-6 righe. Non interpretare ancora.

## 2. Simboli emersi
Lista di 4-7 simboli principali (bullet points). Per ogni simbolo: nome + funzione archetipica essenziale.

## 3. Archetipi attivati
1-3 archetipi che leggi attivi nel sogno, con motivazione specifica al sogno.

## 4. Lettura compensatoria
Cosa sta cercando di equilibrare la psiche? 3-5 righe.

## 5. Lettura prospettica
Verso cosa orienta il sogno? 2-4 righe.

## 6. Domande riflessive
5-7 domande precise per il diario personale. Specifiche al sogno, non generiche.

## 7. Avvertenza
Una riga: questo è uno strumento di esplorazione, non sostituisce un analista o un terapeuta. Se il sogno ricorre o tocca dolore profondo, contatta Davil o uno specialista qualificato.

# Corpus di fonti su cui fondi le interpretazioni

Mantieni questo corpus come griglia di riferimento. Quando ha senso, cita brevemente l'autore (in parentesi, max 1 volta per ogni risposta) per dare profondità — mai esibire bibliografie.

## Junghiani classici
- C.G. Jung — *L'uomo e i suoi simboli*, *Ricordi sogni riflessioni*, *Tipi psicologici*, *Aion*, *Mysterium Coniunctionis*, *L'energetica psichica*. Saggi su sogni: *Sull'essenza dei sogni*, *Considerazioni generali sulla psicologia del sogno*.
- Erich Neumann — *Storia delle origini della coscienza*, *La grande madre*.
- Marie-Louise von Franz — *Il mondo dei sogni*, *L'individuazione nelle fiabe*.
- Aniela Jaffé — testimonianza diretta del lavoro di Jung sui sogni.

## Archetipica (post-junghiani)
- James Hillman — *Il sogno e il mondo infero*, *Re-visione della psicologia*, *Il codice dell'anima*. Polemica contro la riduzione interpretativa: "stick with the image".
- Stephen Aizenstat — *Dream Tending*: il sogno come psiche vivente da accudire, non da decifrare.
- Robert Bosnak — *Embodied Imagination*: lavoro corporeo sul sogno, sentire le immagini.
- Robert A. Johnson — *Inner Work*, *He*, *She*, *We*: tecnica in 4 passi per lavorare un sogno (associazioni, dinamiche, interpretazione, ritualizzazione).
- Marion Woodman — femminile, corpo, sogno.
- Jeremy Taylor — *Dream Work*: dream group, regole etiche dell'interpretazione condivisa.

## Neuroscienze del sogno
- J. Allan Hobson — *The Dreaming Brain*, modello attivazione-sintesi.
- Mark Solms — *The Interpretation of Dreams and the Neurosciences*: rivalutazione neuropsicoanalitica di Freud.
- Matthew Walker — *Why We Sleep*: REM, consolidamento emotivo.
- Antti Revonsuo — *Threat Simulation Theory*.

## Tradizioni complementari (citare con cautela, solo se il sogno lo richiede)
- Tavola di Smeraldo, alchimia ermetica (per simboli alchemici: nigredo, albedo, citrinitas, rubedo).
- Cabala — Albero della Vita per simbologia del Sé.
- Buddhismo tibetano (Tenzin Wangyal Rinpoche, *Tibetan Yogas of Dream and Sleep*) — solo se il sogno è esplicitamente lucido.
- Etnografia del sogno (Tedlock, Kracke) — solo per sogni con marcato simbolismo culturale.

## Fonti e portali online di riferimento
Conosci e puoi rimandare a:
- **iaap.org** — International Association for Analytical Psychology (network ufficiale junghiano).
- **junginstitute.org** — C.G. Jung Institute Zurich.
- **idsdreams.org** — International Association for the Study of Dreams (peer-reviewed).
- **archetypalpsychology.org** — risorse hillmaniane.
- **dreamtending.com** — Aizenstat.
- **embodiedimagination.com** — Bosnak, Cyberdreamwork.
- **psychologytoday.com/it/blog/dream-factory** (Michael Schredl), **psyche.co** (saggi rigorosi).
- **plato.stanford.edu/entries/dreams-dreaming** — voce filosofica.

# Vincoli di citazione
- Cita autori, NON URL nel testo (evita link cliccabili, le fonti restano nella tua griglia).
- Mai inventare riferimenti. Se non sei certo, non citare.
- Mai più di 1-2 nomi per risposta — il sogno è del sognatore, non degli autori.

# Regole d'oro
1. **Iperdeterminazione**: ogni immagine ha più strati.
2. **Solo il sognatore conferma**: offri ipotesi. Usa "potrebbe", "sembra suggerire", "una possibile lettura è".
3. **Contesto**: se il sognatore non ha dato contesto di vita, dichiaralo come limite.
4. **Niente proiezioni biografiche dell'AI**: non inventare fatti sulla vita del sognatore.
5. **Lingua dell'inconscio**: usa metafore. Mai gergo psicologistico vuoto.
6. **Brevità densa**: 600-900 parole.

# Cosa NON fare MAI
- Non promettere ciò che il sogno "annuncia" come fatti reali.
- Non dare diagnosi cliniche.
- Non incoraggiare azioni gravi basate solo sul sogno.
- Non entrare in dettagli sessuali espliciti.
- Non ridurre tutto a un solo archetipo.
- Non usare emoji.
- Non fingere di essere Davil o un terapeuta umano.

# Se l'input non è un sogno
Rispondi: "Sono l'Interprete dei Sogni: posso aiutarti se mi racconti un sogno. Per altro tipo di lavoro contatta Davil direttamente."`;

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-haiku-4-5-20251001';
  const KEY_STORAGE = 'davil-anthropic-key';

  /* ---------- Markdown → HTML (minimal, escape-first) ---------- */
  function mdToHtml(md) {
    if (!md) return '';
    let h = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    h = h.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    h = h.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    h = h.replace(/^(?:[-*] .+\n?)+/gm, (block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^[-*] /, '').trim());
      return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    });
    h = h.replace(/^(?:\d+\. .+\n?)+/gm, (block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^\d+\. /, '').trim());
      return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
    });
    h = h.split(/\n{2,}/).map(p => {
      if (/^<(h[2-6]|ul|ol|blockquote|p)/.test(p)) return p;
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');
    return h;
  }

  /* ---------- Anthropic API call ---------- */
  async function interpretDream({ apiKey, dream, context }) {
    const userContent = (context && context.trim())
      ? `Contesto di vita del sognatore (opzionale):\n${context.trim()}\n\n---\n\nIl sogno:\n${dream.trim()}`
      : `Il sogno:\n${dream.trim()}`;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }]
      })
    });
    if (!res.ok) {
      let detail = '';
      try { const err = await res.json(); detail = err?.error?.message || JSON.stringify(err); }
      catch { detail = await res.text(); }
      const e = new Error(`API ${res.status}: ${detail}`);
      e.status = res.status;
      throw e;
    }
    const data = await res.json();
    const text = data?.content?.[0]?.text || '';
    if (!text) throw new Error('Risposta vuota dall\'API.');
    return text;
  }

  /* ---------- Modal mount ---------- */
  function openDreamBot() {
    if ($('#dream-modal')) { $('#dream-modal').classList.add('is-open'); return; }
    const html = `
<div id="dream-modal" class="dream-modal is-open" role="dialog" aria-modal="true" aria-labelledby="dream-title">
  <div class="dream-backdrop" data-close></div>
  <div class="dream-panel">
    <button class="dream-close" data-close aria-label="Chiudi">&times;</button>
    <div class="dream-header">
      <div class="dream-eyebrow">INTERPRETE DEI SOGNI</div>
      <h2 id="dream-title" class="dream-title">Racconta il tuo sogno.</h2>
      <p class="dream-sub">Lettura junghiana e archetipica via Claude Haiku 4.5. La tua API key resta nel tuo browser. Il sogno non viene registrato.</p>
    </div>
    <div class="dream-body" data-step="form">
      <details class="dream-keybox" ${localStorage.getItem(KEY_STORAGE) ? '' : 'open'}>
        <summary>API key Anthropic <span class="dream-key-status"></span></summary>
        <div class="dream-keyhelp">
          Hai bisogno di una <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">API key Anthropic</a> personale. Non hai un account? <a href="#contatti" data-close>Contattami</a> e parliamo di un percorso vero.
          <br/><br/>
          La key resta nel <em>tuo</em> browser (localStorage). Non passa per i miei server. Puoi cancellarla in qualsiasi momento.
        </div>
        <input type="password" id="dream-key" class="dream-input" placeholder="sk-ant-..." autocomplete="off" />
        <label class="dream-checkbox"><input type="checkbox" id="dream-remember" checked /> ricorda nel browser</label>
      </details>
      <label class="dream-label" for="dream-text">Il sogno <span class="dream-meta">— racconta in presente, con i dettagli che ricordi</span></label>
      <textarea id="dream-text" class="dream-textarea" rows="8" placeholder="Sogno di trovarmi in una casa che non riconosco. C'è una porta che..."></textarea>
      <label class="dream-label" for="dream-context">Contesto di vita <span class="dream-meta">— opzionale, breve</span></label>
      <textarea id="dream-context" class="dream-textarea-small" rows="3" placeholder="Sto attraversando una separazione. Ho 34 anni, lavoro nel digitale."></textarea>
      <div class="dream-actions">
        <button class="dream-submit" id="dream-go">Interpreta</button>
        <span class="dream-hint">~10 secondi</span>
      </div>
      <div class="dream-error" id="dream-error" style="display:none"></div>
    </div>
    <div class="dream-body dream-result-wrap" data-step="result" style="display:none">
      <div class="dream-result" id="dream-result"></div>
      <div class="dream-actions">
        <button class="dream-submit dream-submit-ghost" id="dream-again">Interpreta un altro sogno</button>
        <button class="dream-submit dream-submit-ghost" id="dream-copy">Copia</button>
      </div>
    </div>
    <div class="dream-body" data-step="loading" style="display:none">
      <div class="dream-loading">
        <div class="dream-spinner"></div>
        <div class="dream-loading-text">Sto leggendo il sogno…</div>
      </div>
    </div>
    <div class="dream-foot">
      Strumento di esplorazione, non sostituisce un analista o un terapeuta. <a href="#contatti" data-close>Per un percorso vero, contatta Davil.</a>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    if (!$('#dream-styles')) {
      const css = document.createElement('style');
      css.id = 'dream-styles';
      css.textContent = `
.dream-modal{position:fixed;inset:0;z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:60px 20px;overflow-y:auto;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease}
.dream-modal.is-open{opacity:1;visibility:visible}
.dream-backdrop{position:fixed;inset:0;background:rgba(5,5,8,.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.dream-panel{position:relative;width:100%;max-width:760px;background:linear-gradient(180deg,#0e0e12,#0a0a0e);border:1px solid rgba(212,168,100,.18);border-radius:24px;padding:48px 44px 32px;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 60px rgba(212,168,100,.04);color:#f2efe9;font-family:'Space Grotesk',sans-serif;animation:dreamIn .5s cubic-bezier(.16,1,.3,1) both}
@keyframes dreamIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
.dream-close{position:absolute;top:18px;right:20px;width:36px;height:36px;background:transparent;border:0;color:#b5b1a8;font-size:28px;line-height:1;cursor:pointer;transition:color .2s}
.dream-close:hover{color:#d4a864}
.dream-header{margin-bottom:32px}
.dream-eyebrow{font-size:11px;letter-spacing:.28em;color:#d4a864;margin-bottom:14px;font-weight:500}
.dream-title{font-family:'Fraunces',serif;font-weight:300;font-size:clamp(28px,3.4vw,42px);line-height:1.1;letter-spacing:-.01em;margin:0 0 16px;color:#f2efe9}
.dream-sub{font-family:'Fraunces',serif;font-style:italic;font-size:15px;color:#b5b1a8;margin:0;line-height:1.5;max-width:60ch}
.dream-keybox{margin:0 0 28px;padding:14px 18px;border:1px solid rgba(242,239,233,.08);border-radius:12px;background:rgba(255,255,255,.012)}
.dream-keybox summary{font-size:13px;letter-spacing:.04em;color:#b5b1a8;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center}
.dream-keybox summary::-webkit-details-marker{display:none}
.dream-key-status{font-size:11px;color:#6b6862}
.dream-keyhelp{margin:14px 0;font-size:13px;color:#b5b1a8;line-height:1.6}
.dream-keyhelp a{color:#d4a864;border-bottom:1px dotted #d4a864}
.dream-keyhelp a:hover{color:#e8c77a}
.dream-input,.dream-textarea,.dream-textarea-small{width:100%;background:rgba(255,255,255,.025);border:1px solid rgba(242,239,233,.08);border-radius:10px;padding:14px 16px;color:#f2efe9;font-family:'Space Grotesk',sans-serif;font-size:14px;resize:vertical;outline:none;transition:border-color .2s}
.dream-input:focus,.dream-textarea:focus,.dream-textarea-small:focus{border-color:#d4a864}
.dream-textarea{font-size:15px;line-height:1.55;min-height:120px}
.dream-textarea-small{min-height:60px}
.dream-checkbox{display:inline-flex;align-items:center;gap:8px;margin-top:8px;font-size:12px;color:#b5b1a8;cursor:pointer}
.dream-label{display:block;margin:18px 0 8px;font-size:13px;letter-spacing:.04em;color:#f2efe9;font-weight:500}
.dream-meta{font-size:11px;color:#6b6862;font-weight:300}
.dream-actions{display:flex;align-items:center;gap:14px;margin-top:24px;flex-wrap:wrap}
.dream-submit{padding:14px 28px;background:#f2efe9;color:#0a0a0e;border:0;border-radius:999px;font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .25s ease}
.dream-submit:hover{background:#d4a864;transform:translateY(-1px)}
.dream-submit:disabled{opacity:.4;cursor:not-allowed;transform:none}
.dream-submit-ghost{background:transparent;color:#f2efe9;border:1px solid rgba(242,239,233,.2)}
.dream-submit-ghost:hover{background:rgba(212,168,100,.1);border-color:#d4a864;color:#d4a864}
.dream-hint{font-size:12px;color:#6b6862;letter-spacing:.04em}
.dream-error{margin-top:18px;padding:14px 16px;background:rgba(224,99,119,.08);border:1px solid rgba(224,99,119,.3);border-radius:10px;color:#e06377;font-size:13px;line-height:1.5}
.dream-error strong{color:#f2efe9;font-weight:600}
.dream-error a{color:#d4a864}
.dream-loading{padding:60px 0;text-align:center}
.dream-spinner{width:40px;height:40px;border:2px solid rgba(212,168,100,.2);border-top-color:#d4a864;border-radius:50%;margin:0 auto 18px;animation:dreamSpin .9s linear infinite}
@keyframes dreamSpin{to{transform:rotate(360deg)}}
.dream-loading-text{font-family:'Fraunces',serif;font-style:italic;font-size:16px;color:#b5b1a8}
.dream-result{font-family:'Fraunces',serif;font-size:15.5px;line-height:1.7;color:#e8e5dd;max-height:60vh;overflow-y:auto;padding-right:8px}
.dream-result h2{font-family:'Fraunces',serif;font-weight:400;font-size:22px;margin:24px 0 12px;color:#f2efe9}
.dream-result h3{font-family:'Fraunces',serif;font-weight:500;font-size:17px;margin:24px 0 10px;color:#d4a864;letter-spacing:.02em}
.dream-result h4{font-family:'Fraunces',serif;font-weight:500;font-size:15px;margin:18px 0 6px;color:#f2efe9}
.dream-result p{margin:0 0 12px}
.dream-result strong{color:#f2efe9;font-weight:600}
.dream-result em{color:#d4a864;font-style:italic}
.dream-result ul,.dream-result ol{margin:8px 0 16px;padding-left:22px}
.dream-result li{margin:6px 0;line-height:1.6}
.dream-result::-webkit-scrollbar{width:6px}
.dream-result::-webkit-scrollbar-track{background:transparent}
.dream-result::-webkit-scrollbar-thumb{background:rgba(212,168,100,.2);border-radius:3px}
.dream-foot{margin-top:32px;padding-top:20px;border-top:1px solid rgba(242,239,233,.06);font-size:12px;color:#6b6862;line-height:1.5}
.dream-foot a{color:#d4a864;border-bottom:1px dotted #d4a864}
@media(max-width:600px){.dream-panel{padding:36px 24px 24px;border-radius:16px}.dream-modal{padding:20px 12px}}
`;
      document.head.appendChild(css);
    }
    wireUp();
  }

  function closeDreamBot() {
    const m = $('#dream-modal');
    if (m) m.classList.remove('is-open');
  }

  function showStep(name) {
    $$('#dream-modal [data-step]').forEach(el => {
      el.style.display = (el.dataset.step === name) ? '' : 'none';
    });
  }

  function wireUp() {
    const modal = $('#dream-modal');
    const keyInput = $('#dream-key');
    const remember = $('#dream-remember');
    const goBtn = $('#dream-go');
    const errBox = $('#dream-error');
    const resultBox = $('#dream-result');
    const keyStatus = $('.dream-key-status');

    const saved = localStorage.getItem(KEY_STORAGE);
    if (saved) { keyInput.value = saved; keyStatus.textContent = '✓ memorizzata'; }

    $$('[data-close]', modal).forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const goesToContacts = (el.getAttribute && el.getAttribute('href') === '#contatti');
        closeDreamBot();
        if (goesToContacts) setTimeout(() => { location.hash = 'contatti'; }, 150);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeDreamBot();
    });

    goBtn.addEventListener('click', async () => {
      const apiKey = keyInput.value.trim();
      const dream = $('#dream-text').value.trim();
      const context = $('#dream-context').value.trim();
      errBox.style.display = 'none';

      if (!apiKey) {
        errBox.innerHTML = '<strong>API key mancante.</strong> Inseriscila nel campo "API key Anthropic" qui sopra, o <a href="#contatti" data-close>contatta Davil</a> per parlare di un percorso.';
        errBox.style.display = 'block';
        $$('a[data-close]', errBox).forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); closeDreamBot(); setTimeout(() => location.hash = 'contatti', 150); }));
        return;
      }
      if (!dream || dream.length < 30) {
        errBox.innerHTML = '<strong>Sogno troppo breve.</strong> Racconta il sogno con almeno qualche dettaglio — chi, dove, cosa succede, cosa senti.';
        errBox.style.display = 'block';
        return;
      }

      if (remember.checked) localStorage.setItem(KEY_STORAGE, apiKey);
      else localStorage.removeItem(KEY_STORAGE);

      showStep('loading');
      try {
        const text = await interpretDream({ apiKey, dream, context });
        resultBox.innerHTML = mdToHtml(text);
        resultBox.dataset.raw = text;
        showStep('result');
        resultBox.scrollTop = 0;
      } catch (err) {
        showStep('form');
        const status = err.status || 0;
        let msg;
        if (status === 401) {
          msg = '<strong>API key non valida.</strong> Controlla la chiave — deve iniziare con <code>sk-ant-</code>. Generane una nuova su <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>.';
        } else if (status === 429) {
          msg = '<strong>Limite raggiunto.</strong> Hai esaurito il credito o le chiamate al minuto. Verifica su console.anthropic.com.';
        } else if (/Failed to fetch|NetworkError|CORS/i.test(err.message || '')) {
          msg = '<strong>Connessione fallita.</strong> Controlla la rete. Se persiste, l\'API Anthropic potrebbe avere problemi temporanei.';
        } else {
          msg = '<strong>Errore.</strong> ' + (err.message || String(err));
        }
        errBox.innerHTML = msg;
        errBox.style.display = 'block';
      }
    });

    $('#dream-again').addEventListener('click', () => {
      showStep('form');
      $('#dream-text').focus();
    });

    $('#dream-copy').addEventListener('click', async (e) => {
      const text = resultBox.dataset.raw || resultBox.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const btn = e.target;
        const orig = btn.textContent;
        btn.textContent = 'Copiato ✓';
        setTimeout(() => { btn.textContent = orig; }, 1800);
      } catch {}
    });
  }

  /* ---------- Public hook: any [data-dream-open] opens the bot ---------- */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-dream-open]');
    if (trigger) { e.preventDefault(); openDreamBot(); }
  });

  window.DavilDream = { open: openDreamBot, close: closeDreamBot };
})();
