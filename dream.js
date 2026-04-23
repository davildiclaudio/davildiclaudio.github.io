/* ==============================================================
   DAVIL · Interprete dei Sogni — integrazione AI BYO API-key
   - provider: Anthropic (Claude) o OpenAI (GPT)
   - la chiave resta in localStorage del browser, nulla sul server
   - system prompt: framework junghiano (archetipi, ombra, animus/anima,
     Grande Madre, alchimia come individuazione, amplificazione)
   ============================================================== */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);

  const els = {
    provider: $('#dreamProvider'),
    model:    $('#dreamModel'),
    key:      $('#dreamKey'),
    remember: $('#dreamRemember'),
    form:     $('#dreamForm'),
    input:    $('#dreamInput'),
    submit:   $('#dreamSubmit'),
    clear:    $('#dreamClear'),
    output:   $('#dreamOutput'),
    status:   $('#dreamStatus'),
  };
  if (!els.form) return; // sezione non presente

  const LS_KEY = 'davil.dream.cfg.v1';

  /* ---- modelli disponibili per provider ---- */
  const MODELS = {
    anthropic: [
      { id: 'claude-opus-4-7',     label: 'Claude Opus 4.7 (massimo)' },
      { id: 'claude-sonnet-4-6',   label: 'Claude Sonnet 4.6 (equilibrato)', default: true },
      { id: 'claude-haiku-4-5',    label: 'Claude Haiku 4.5 (rapido)' },
    ],
    openai: [
      { id: 'gpt-4o',              label: 'GPT-4o (equilibrato)', default: true },
      { id: 'gpt-4o-mini',         label: 'GPT-4o mini (rapido)' },
      { id: 'gpt-4.1',             label: 'GPT-4.1 (avanzato)' },
    ],
  };

  const populateModels = (provider) => {
    els.model.innerHTML = '';
    MODELS[provider].forEach(m => {
      const o = document.createElement('option');
      o.value = m.id; o.textContent = m.label;
      if (m.default) o.selected = true;
      els.model.appendChild(o);
    });
  };

  /* ---- config persistence ---- */
  const loadCfg = () => {
    try {
      const cfg = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (!cfg) return;
      els.provider.value = cfg.provider || 'anthropic';
      populateModels(els.provider.value);
      if (cfg.model) els.model.value = cfg.model;
      if (cfg.key) els.key.value = cfg.key;
      els.remember.checked = cfg.remember !== false;
    } catch {}
  };
  const saveCfg = () => {
    if (!els.remember.checked) { localStorage.removeItem(LS_KEY); return; }
    const cfg = {
      provider: els.provider.value,
      model:    els.model.value,
      key:      els.key.value,
      remember: true,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  };
  const refreshStatus = () => {
    const ok = !!els.key.value.trim();
    els.status.textContent = ok ? 'Configurata' : 'Non configurata';
    els.status.classList.toggle('ok', ok);
  };

  els.provider.addEventListener('change', () => { populateModels(els.provider.value); saveCfg(); });
  els.model.addEventListener('change', saveCfg);
  els.key.addEventListener('input', () => { refreshStatus(); saveCfg(); });
  els.remember.addEventListener('change', () => { if (!els.remember.checked) localStorage.removeItem(LS_KEY); else saveCfg(); });

  populateModels('anthropic');
  loadCfg();
  refreshStatus();

  /* ==========  SYSTEM PROMPT — framework junghiano autentico  ========== */
  const SYSTEM_PROMPT = `Sei un interprete di sogni che lavora all'interno del framework della psicologia analitica junghiana. La tua voce è quella di un analista esperto, sobrio, rispettoso, non diagnostico.

PRINCIPI DI METODO (Jung, Hillman, Neumann):
1. Il sogno è una manifestazione spontanea dell'inconscio e non va interpretato come enigma da decifrare, ma come comunicazione simbolica da "amplificare".
2. Usa il metodo dell'amplificazione: porta il simbolo personale sul piano archetipico attraverso richiami mitologici, alchemici, religiosi e culturali — senza MAI imporre un significato fisso.
3. La funzione compensatoria: il sogno bilancia l'atteggiamento cosciente unilaterale del sognatore. Chiediti sempre "cosa sta compensando questo sogno?".
4. Distingui piano oggettivo (persone reali della vita del sognatore) e piano soggettivo (figure come aspetti della psiche del sognatore — Hillman: "tutte le figure del sogno sono tu").
5. Archetipi principali da riconoscere quando emergono: Ombra, Anima/Animus, Sé, Persona, Vecchio Saggio, Grande Madre (Neumann), Trickster, Fanciulla, Puer/Senex.
6. Alchimia come metafora del processo di individuazione: nigredo (dissoluzione), albedo (purificazione), rubedo (integrazione). I simboli alchemici nel sogno indicano la fase del lavoro interiore.
7. Hillman (Il sogno e il mondo Infero): resistere alla traduzione diurna. Il sogno appartiene al mondo infero, non va "portato in superficie" ma abitato come immagine.
8. Neumann (La Grande Madre): le figure materne nei sogni vanno lette lungo l'asse elementare/trasformativo e positivo/negativo.
9. Liber Novus / Attiva Immaginazione: il dialogo con le figure interne è la via per integrarle, non per combatterle.

STRUTTURA DELLA TUA RISPOSTA (in italiano, tono caldo ma analitico):
• **Nucleo simbolico** — in 2-3 frasi, l'immagine o la dinamica centrale del sogno.
• **Amplificazioni archetipiche** — 2-4 risonanze mitologiche/alchemiche/culturali rilevanti, senza didascalismo.
• **Funzione compensatoria** — cosa sembra stare compensando nell'atteggiamento di veglia (ipotesi, non certezza).
• **Domande per il sognatore** — 3 domande aperte che il sognatore può abitare. NON fornire "la" risposta: offri una direzione di ricerca.
• **Indicazione di lavoro** — uno spunto concreto (attiva immaginazione, annotare associazioni personali, dialogo con una figura, etc.).

REGOLE FERREE:
- Non fornire mai interpretazioni deterministiche ("significa X"). Usa sempre "potrebbe evocare", "risuona con", "suggerisce".
- Non dare consigli medici, psichiatrici o sostituire terapia. Se il sogno contiene segnali di sofferenza grave (ideazione suicidaria, abuso, psicosi), menziona con delicatezza l'opportunità di un supporto professionale.
- Rispetta la sacralità del materiale onirico. Niente banalizzazioni.
- Se il sogno è povero di dettagli, chiedi elementi (emozione dominante, luogo, persone, colori) prima di interpretare.
- Lunghezza: 350-550 parole. Chiaro, ritmato, senza paragrafi troppo lunghi.

Sei al servizio del processo di individuazione del sognatore. Parli come un compagno di viaggio, non come un oracolo.`;

  /* ==========  CHIAMATE AI PROVIDERS  ========== */

  const callAnthropic = async (key, model, dream) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Ecco il mio sogno:\n\n${dream}` }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic ${res.status}: ${err}`);
    }
    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim();
    return text || '[Risposta vuota]';
  };

  const callOpenAI = async (key, model, dream) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: `Ecco il mio sogno:\n\n${dream}` },
        ],
        max_tokens: 1600,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI ${res.status}: ${err}`);
    }
    const data = await res.json();
    return (data.choices?.[0]?.message?.content || '[Risposta vuota]').trim();
  };

  /* ==========  Render markdown basico (**bold**, *italic*, linee vuote)  ========== */
  const renderMd = (txt) => {
    const esc = txt
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  /* ==========  Submit  ========== */
  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = els.key.value.trim();
    const dream = els.input.value.trim();
    const provider = els.provider.value;
    const model = els.model.value;

    if (!key) {
      els.output.className = 'dream-output visible error';
      els.output.innerHTML = `<p class="dream-title">Manca la API key</p><p>Apri <em>Configurazione AI</em> e inserisci la tua chiave di ${provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}.</p>`;
      return;
    }
    if (dream.length < 20) {
      els.output.className = 'dream-output visible error';
      els.output.innerHTML = `<p class="dream-title">Il sogno è troppo breve</p><p>Racconta almeno luogo, figure presenti, azione principale e l'emozione che dominava al risveglio (min. 20 caratteri).</p>`;
      return;
    }

    saveCfg();
    els.submit.disabled = true;
    els.output.className = 'dream-output visible';
    els.output.innerHTML = `<p class="dream-title">L'inconscio risponde…</p><div class="dream-loader"><i></i><i></i><i></i></div>`;

    try {
      const fn = provider === 'anthropic' ? callAnthropic : callOpenAI;
      const reply = await fn(key, model, dream);
      els.output.innerHTML = `<p class="dream-title">Lettura del sogno</p>${renderMd(reply)}`;
    } catch (err) {
      console.error(err);
      els.output.className = 'dream-output visible error';
      els.output.innerHTML = `<p class="dream-title">Errore</p><p>${String(err.message || err)}</p><p style="font-size:13px;opacity:.7;margin-top:12px">Verifica la validità della chiave, il nome del modello e la connessione.</p>`;
    } finally {
      els.submit.disabled = false;
    }
  });

  els.clear.addEventListener('click', () => {
    els.input.value = '';
    els.output.className = 'dream-output';
    els.output.innerHTML = '';
    els.input.focus();
  });
})();
