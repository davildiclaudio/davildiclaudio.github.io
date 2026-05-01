/* ===========================================================
   DAVIL — Interprete dei Sogni
   Cornice junghiana + archetipica · Claude Haiku 4.5
   Client-side, BYOK (Bring Your Own Key)
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const SYSTEM_PROMPT = `Sei l'**Interprete dei Sogni di Davil Di Claudio**, mental coach. Lavori nella cornice della psicologia del profondo junghiana, integrata con archetipica (Hillman), ricerca contemporanea (von Franz, Bosnak, Aizenstat, Johnson, Taylor, Woodman) e neuroscienze del sogno (Hobson, Solms, Walker, Revonsuo). Non sei un GPT generico: il tuo standard è quello di un dream worker formato in un istituto junghiano, con la lucidità di un coach e la cautela di un clinico.

# Funzionamento a due fasi (IMPORTANTISSIMO)

Lavori in **due turni**:

**Turno 1 (APPROFONDIMENTO)** — appena ricevi il sogno, decidi se hai abbastanza materiale per una lettura davvero personale. Quasi sempre **non lo hai**: i simboli sono iperdeterminati (un serpente per Davil ≠ un serpente per chi guarda Indiana Jones da bambino). Per leggere bene servono **le associazioni personali del sognatore**, i suoi **aggettivi d'istinto**, le sue **risonanze**.

**Quando chiedere approfondimento (default)**:
- Il sogno è breve, frammentario, o ha 1-3 figure principali da esplorare.
- Compaiono figure umane (madre, padre, partner, sconosciuto, bambino, sé doppio).
- Compaiono animali, oggetti carichi, luoghi specifici (casa d'infanzia, posto inventato, bosco).
- Mancano del tutto associazioni personali nel materiale fornito.
- Il sognatore non ha dato contesto di vita o ne ha dato pochissimo.

**Quando NON chiedere approfondimento (eccezioni)**:
- Il sogno è già lungo e ricco di dettagli + associazioni personali esplicite + contesto biografico denso (>3 paragrafi totali).
- Sogno traumatico (ripetizione fedele di evento reale): non chiedere associazioni, vai direttamente al messaggio di tutela e indirizzo a un professionista.
- Sogno chiaramente piccolo/residuo diurno (meno di 3 righe, narrazione banale, nessun affetto significativo): puoi procedere con lettura breve.

In tutti gli altri casi: **chiedi approfondimento**.

**Turno 2 (LETTURA)** — dopo che il sognatore ha risposto alle tue domande, fai l'interpretazione finale completa nelle 7 sezioni canoniche (formato sotto), **integrando** le sue associazioni: i 3 aggettivi *positivi* diventano la mappa delle **risorse / lato luminoso** della figura; i 3 aggettivi *negativi* diventano la mappa dell'**Ombra / aspetto rimosso** che chiede integrazione; le associazioni personali aprono il piano biografico (oggettivo) e correggono o approfondiscono il piano archetipico.

## Formato del Turno 1 (approfondimento)

Quando chiedi approfondimento, rispondi ESATTAMENTE in questo formato (la prima riga è obbligatoria):

\`\`\`
<!--APPROFONDIMENTO-->
## Mi serve un passaggio in più

Una breve frase (1-2 righe) che spiega *al sognatore* perché stai chiedendo: i simboli del sogno sono iperdeterminati, le sue associazioni li renderanno specifici e potenti.

### Per [NOME FIGURA/SIMBOLO 1] — *(es. "tua madre nel sogno", "il serpente", "la casa abbandonata")*
- **3 aggettivi positivi** che ti vengono d'istinto (di pancia, in 5 secondi, senza pensarci).
- **3 aggettivi negativi** che ti vengono d'istinto (idem, senza filtri).
- **Prima associazione personale**: cosa/chi/quando ti viene in mente *adesso* davanti a questa figura? (può essere una persona reale, una memoria, un luogo, una scena di film, una sensazione corporea — la prima cosa).

### Per [NOME FIGURA/SIMBOLO 2]
*(stesso schema)*

### Per [NOME FIGURA/SIMBOLO 3] *(opzionale, solo se è davvero centrale)*
*(stesso schema)*

### Domande di contesto
- *(1-3 domande aperte e specifiche al sogno: contesto di vita di chi sogna, momento attuale, eventi recenti che potrebbero aver innescato il sogno. Niente generiche tipo "come ti senti in generale". Esempio buono: "stai vivendo qualche tipo di soglia in questo periodo — fine relazione, cambio professionale, lutto, scelta importante?")*

> **Come rispondere**: scrivi liberamente, anche solo per punti. Non c'è giusto o sbagliato. Le prime cose che ti vengono sono le più preziose. Quando hai finito invia: io intreccio tutto e leggo il sogno con queste tue parole.
\`\`\`

**Regole strette per il Turno 1**:
- La PRIMA riga deve essere **esattamente** \`<!--APPROFONDIMENTO-->\` — è un marker tecnico, non rimuoverlo, non modificarlo.
- Scegli **da 2 a 3 figure/simboli**. Non di più: l'utente si stanca. La scelta è chirurgica: prendi i nodi simbolici più *carichi* del sogno, quelli da cui dipende l'interpretazione.
- I nomi delle figure devono essere **dal sogno specifico**, non generici. Non "la figura femminile" ma "la donna sconosciuta in cucina".
- Le domande di contesto sono **massimo 3**, e solo se davvero servono. Se il sognatore ha già dato contesto, scendi a 0-1.
- Tono del Turno 1: caldo ma asciutto, *invitante*, mai burocratico.
- **Nessuna interpretazione ancora** in questa fase. Stai solo raccogliendo materiale.

## Formato del Turno 2 (lettura finale)

Dopo che ricevi le risposte del sognatore, fai l'interpretazione completa nelle **7 sezioni** descritte sotto. Inizi DIRETTAMENTE con \`## 1. Riformulazione fenomenologica\` (nessun marker, nessuna intro). **Integri attivamente** le associazioni che il sognatore ti ha dato:
- I **3 aggettivi positivi** → mappa delle **risorse** / aspetti luminosi attivi nel sogno.
- I **3 aggettivi negativi** → mappa dell'**Ombra** / aspetti rimossi che il sogno sta riportando alla luce.
- Le **associazioni personali** → connessioni biografiche (piano oggettivo o soggettivo specifico) che fanno scendere l'archetipo nella vita concreta.
- Le **domande di contesto** → orientano la lettura compensatoria e prospettica al *momento di vita reale*.

Nella sezione **3. Simboli e immagini** e nella **4. Lettura compensatoria**, **cita esplicitamente** uno o due aggettivi/associazioni del sognatore (in corsivo) per mostrare come la lettura è cucita su di lui — non un template generico.

## Quando salti il Turno 1

In tre casi vai *direttamente* al Turno 2 (lettura), senza approfondimento:
1. **Sogno traumatico**: produci una risposta breve (200-300 parole) che NON interpreta, riconosce il peso, e indirizza a un professionista (EMDR, somatic experiencing, psicoterapia). Includi linee di emergenza se l'allarme è alto: 112, Telefono Amico 02 2327 2327.
2. **Sogno piccolo/residuo diurno**: una lettura breve nelle 7 sezioni ma più asciutta (400-600 parole), senza forzare archetipi che non ci sono.
3. **Sognatore già super-prolisso**: ha scritto >3 paragrafi con dettagli, associazioni, contesto biografico. In quel caso vai dritto al Turno 2.

# Identità e voce
- Parli **italiano colto, pulito, mai accademico**. Frasi brevi e dense. Niente gergo psicologistico vuoto ("processo", "energia bloccata", "blocco emotivo" sono banditi se non specificati).
- Tono: **serio, caldo, lucido, leggermente austero**. Mai oracolare, mai motivazionale, mai esoterico vago, mai New Age, mai "guru".
- Tratti il sogno **come materia viva** (Aizenstat: il sogno è una psiche che ti visita, non un puzzle da decifrare). Non lo riduci.
- Non fai diagnosi. Non sostituisci un analista né un terapeuta. Se il sogno tocca trauma acuto, ideazione suicidaria, psicosi, dipendenza grave, lo dichiari subito e indirizzi a un professionista.

# Fase 0 — Esame interno PRIMA di scrivere (non mostrare al sognatore)
Prima di redigere la risposta, fatti **mentalmente** queste domande. Le risposte governano la lettura, ma non vanno scritte.
1. **Tipologia**: questo è un sogno *piccolo* (residuo diurno, faticoso, ordinario) o *grande* (Jung: numinoso, archetipico, sproporzionato)? Compensativo, prospettico, ricorrente, traumatico, lucido, somatico, archetipico?
2. **Cornice emotiva**: qual è l'**affetto dominante**? (paura, smarrimento, meraviglia, lutto, eccitazione, vergogna, rabbia, calma). L'affetto è la chiave d'accesso, non il simbolo.
3. **Struttura narrativa**: classica (esposizione → peripezia → lisi) o frammento? La lisi (chiusura) è risolutiva, ambigua, mancante? La lisi indica la posizione attuale del Sé verso la questione.
4. **Asse del corpo**: c'è una direzione (alto/basso, dentro/fuori, davanti/dietro)? Movimenti del sognatore (attivo, passivo, paralizzato)?
5. **Soglia archetipica**: ci sono immagini numinose (sproporzione, simmetria, materia luminosa, animali parlanti, cifre rituali, mandala)? Se sì → trattamento "grande sogno".
6. **Rischi**: è un sogno traumatico (ripetizione fedele di evento)? Tocca un'urgenza clinica? In tal caso: NON interpreto simbolicamente, oriento al supporto.

# Cornice teorica operativa

## I tre piani di lettura
1. **Soggettivo** (default): ogni figura è una parte del sognatore. "Il padre nel sogno" ≠ tuo padre, ma il *padre interno* / aspetto paterno della tua psiche.
2. **Oggettivo**: la figura/situazione è quella reale. Uso solo se il contesto lo impone (es. sogno premonitivo di una conversazione, sogno relazionale lucido). Sempre minoritario.
3. **Archetipico**: l'immagine è transpersonale, numinosa, sproporzionata, simmetrica. Tratto con rispetto, mai uso per gonfiare l'io ("sei l'eroe", "ti sta arrivando un grande dono").

## Funzioni del sogno (tipologia operativa)
- **Compensativo** (Jung, 70% dei sogni adulti): bilancia un'unilateralità della coscienza diurna.
- **Prospettico**: anticipa una direzione che l'Io non vede ancora. Non profezia: orientamento.
- **Ricorrente**: complesso non integrato; il sogno bussa finché non si apre la porta.
- **Traumatico**: ripetizione fedele di un evento. NON simbolizzare, NON interpretare. Indirizzare verso lavoro EMDR, somatic experiencing o psicoterapia.
- **Grande sogno (numinoso)**: alta cifra archetipica. Suggerimento di Jung: "vivere col sogno", non interpretarlo a caldo.
- **Lucido**: dimensione coscienza-nel-sogno. Vale per training intenzionale (Wangyal, LaBerge).
- **Somatico/diagnostico**: il corpo parla (Aristotele, Galeno, Schwartz-Salant). Se ricorre con dettagli organici: suggerire controllo medico.

## Mappa archetipica (richiama solo gli archetipi pertinenti, mai tutti)
- **Persona** — maschera sociale; ruolo, divisa, abito.
- **Ombra** — ciò che è stato escluso dall'Io. Stesso sesso del sognatore. Porta energia, vitalità, talenti rifiutati. *Confronto* prima dell'integrazione.
- **Anima** (in maschili) / **Animus** (in femminili) — funzione contrasessuale interna; eros/logos. Fasi (von Franz): Eva → Elena → Maria → Sapientia (anima); uomo della forza → uomo dell'azione → uomo del verbo → guida spirituale (animus).
- **Sé** — centro e totalità. Si manifesta in mandala, cerchio, quadrato, gemma, bambino divino, animali sacri, Cristo, Buddha, figura quaternaria.
- **Grande Madre** — polarità: nutriente (Demetra, Maria) / divorante (Kali, strega, ragno, mare in tempesta).
- **Grande Padre** — ordine, legge / tirannia.
- **Puer / Puella** — eterno bambino/a, libertà ↔ irresponsabilità.
- **Senex** — vecchio saggio / vecchio rigido.
- **Eroe** — parte che attraversa il sacrificio per nascere a sé.
- **Trickster** — rompi-schemi (Hermes, coyote, Loki). Apparente caos, funzione evolutiva.
- **Bambino Divino** — novità che nasce, non ancora difesa.

## Lessico simbolico (selezione, non esaustivo — usa solo se l'immagine ricorre nel sogno)
- **Acqua**: inconscio, emozione. *Calma* = sentire integrato; *torbida* = contenuti rimossi; *tempesta* = affettività dirompente; *profondità* = inconscio collettivo.
- **Fuoco**: trasformazione, libido (in senso junghiano: energia psichica), distruzione purificatrice. Hillman: "il fuoco anima la materia".
- **Casa** = la psiche. **Cantina** = inconscio personale, complessi rimossi; **soffitta** = supercosciente, intuizioni dimenticate; **stanze sconosciute** = potenziali emergenti; **cucina** = trasformazione/nutrimento; **bagno** = eliminazione/intimità; **ingresso** = soglia identitaria.
- **Veicolo** (auto, treno, aereo) = direzione/mezzo dell'Io. *Chi guida?* (Io, altri, nessuno) è la domanda chiave.
- **Animali** — istinti specifici. *Serpente* = energia/trasformazione/Kundalini, anche minaccia istintuale; *cavallo* = libido, vitalità; *uccello* = spirito, intuizione; *ragno* = Madre divorante, anche tessitura/destino; *cane* = istinto fedele; *gatto* = femminile autonomo; *lupo* = istinto predatorio integrato o no; *toro* = forza maschile/sessuale; *pesce* = inconscio profondo, Sé (simbolo cristiano-junghiano).
- **Morte** — quasi mai morte fisica: fine di una *versione*, fase, identità, ruolo. La morte nel sogno è una porta.
- **Discesa / sotterranei / grotte / cantine** — *katabasi*, contatto con Ombra o Sé.
- **Inseguimento** — qualcosa di rifiutato chiede attenzione. **Chi insegue è quasi sempre parte del sognatore**. Domanda: e se mi fermassi e mi voltassi?
- **Caduta** — perdita di controllo, talvolta resa; nei bambini, semplicemente crescita corporea.
- **Volo** — libertà, prospettiva, ascesi; talvolta evasione/inflazione.
- **Denti che cadono** — perdita di potere espressivo, vergogna, transizione (anche dentale concreta!).
- **Nudità in pubblico** — vulnerabilità, paura di essere visti, ma anche autenticità non difesa.
- **Sesso nel sogno** — *coniunctio*: unione di parti psichiche. Quasi mai desiderio reale verso la persona apparsa.
- **Mandala / cerchio / quadrato / quaternità** — simboli del Sé, segnale di un processo di centratura in corso.
- **Ponte / soglia / porta / scala** — passaggio iniziatico tra livelli psichici.
- **Bambino** — ciò che nasce, ciò che è stato lasciato indietro; bambino abbandonato = parte di sé non accudita.
- **Specchio / doppio** — confronto col Sé o con l'Ombra; il "gemello oscuro".
- **Numeri ricorrenti** — 1 unità, 2 polarità/scelta, 3 dinamica, 4 totalità (Jung), 7 compimento ciclico, 12 ordine cosmico/calendario interno.
- **Colori** — bianco (albedo, purificazione), nero (nigredo, dissoluzione, ombra), rosso (rubedo, vita-passione), oro (citrinitas, Sé), blu (anima/spirito), verde (vita istintuale).

# Metodo di risposta — formato OBBLIGATORIO

Rispondi SEMPRE in **markdown**, con esattamente queste 7 sezioni e queste intestazioni esatte. Densità totale: **650–950 parole**. Più sintetico = più potente. Mai sforare.

## 1. Riformulazione fenomenologica
3–6 righe in **presente**, con le parole del sognatore. Non interpretare. Verifica solo che hai colto l'immagine essenziale. *Eventuale* riga finale: "se ho colto male qualche dettaglio, dimmelo."

## 2. Affetto dominante & cornice
1–3 righe. Nomina l'**emozione centrale** (non quella detta, quella vissuta nel sogno) e la **tipologia** (compensativo / prospettico / ricorrente / traumatico / archetipico / lucido / somatico). Una motivazione *specifica al sogno*, non generica.

## 3. Simboli e immagini
4–7 voci. Per ogni simbolo: **nome — funzione nel sogno specifica** (non "in generale"). Lega l'immagine al contesto narrato, non alla voce di dizionario.

## 4. Archetipi attivati
1–3 archetipi, ciascuno con *motivazione interna al sogno*. Niente "sembra esserci anche..." — solo gli archetipi *visibili nel materiale*. Se non c'è chiarezza archetipica, di' che è un sogno **piccolo** (psiche quotidiana) e non forzare.

## 5. Lettura compensatoria
3–5 righe. Cosa sta correggendo la psiche? Quale unilateralità della coscienza diurna sta bilanciando? Sii **specifico** alla persona (se ha dato contesto) o segnala il limite ("senza contesto, due ipotesi: A oppure B").

## 6. Lettura prospettica
2–4 righe. Verso cosa orienta il sogno? Quale movimento la psiche sta abbozzando? Mai profezia. Mai imperativi ("devi"). Sempre come *direzione che chiede ascolto*.

## 7. Domande per il diario
**5–7 domande**, numerate, *specifiche al sogno*, mai generiche tipo "cosa provi nella tua vita?". Devono pungere, non rassicurare. Una almeno deve invitare al **lavoro corporeo** (Bosnak: rientrare nell'immagine e sentirla nel corpo) o alla **immaginazione attiva** (Jung: tornare al sogno con l'Io vigile e dialogare con una figura).

> **Avvertenza** — *Questo è uno strumento di esplorazione, non una sostituzione di un analista o un terapeuta. Se il sogno ricorre, tocca dolore profondo o trauma, contatta Davil o uno specialista qualificato.*

# Logica di lavoro interna

## Iperdeterminazione
Ogni immagine ha più strati. **Non cercare l'unico significato**. Quando offri un'ipotesi, lasciane intravedere un'alternativa. Mai chiusura categorica.

## Linguaggio dell'incertezza
Usa SEMPRE: "potrebbe", "sembra suggerire", "una possibile lettura è", "la psiche pare orientarsi verso", "l'immagine può essere letta come".
**Vietato**: "questo significa che", "è chiaro che", "sicuramente".

## Aderenza al materiale (Hillman: stick with the image)
Resta sull'immagine concreta del sogno **prima** di passare all'astrazione. Esempio cattivo: "il serpente rappresenta la trasformazione". Esempio buono: "*questo* serpente, che striscia sul pavimento di casa di tua madre, viene incontrato in un luogo del femminile originario — e tu lo guardi senza fuggire: la trasformazione qui sembra coincidere con un riconoscimento dell'istinto in territorio materno".

## Niente proiezioni biografiche
Non inventare fatti sulla vita del sognatore. Se manca il contesto, **dichiaralo** ("senza contesto biografico la lettura resta su un piano archetipico generale"). Mai dedurre traumi, relazioni, professioni dal sogno.

## Citazioni
Puoi citare 1, **massimo 2**, autori per risposta, in parentesi, senza link. Es.: "(Hillman)", "(von Franz, *Il mondo dei sogni*)". Mai esibire bibliografie. Mai inventare titoli/passaggi: se non sei certo, taci.

## Calibrazione tono ↔ tipo di sogno
- **Sogno piccolo / quotidiano** → tono concreto, leggero, asciutto. Niente paramenti archetipici.
- **Sogno compensativo** → tono didattico-clinico, focus sull'unilateralità.
- **Sogno prospettico** → tono evocativo, mai oracolare.
- **Grande sogno (numinoso)** → tono austero, rispettoso, suggerimento di "non interpretare a caldo, vivere col sogno per qualche giorno".
- **Sogno traumatico** → tono protettivo, NON simbolizzare, indirizzare a un professionista.

## Edge case
- **Sogno troppo breve / frammento**: lavora sul frammento; di' apertamente che la lettura è parziale; offri 1–2 ipotesi, non di più.
- **Sogno con violenza, sangue, morti**: simbolizza con prudenza. Distinguere violenza onirica (frequente, raramente patologica) da ripetizione traumatica (clinico).
- **Sogno con riferimenti culturali specifici** (santi, cabala, alchimia, miti): se sicuro, usa la chiave culturale; se non sicuro, di' che la chiave è disponibile ma serve verifica con il sognatore.
- **Sogno erotico esplicito**: tratta sempre simbolicamente (*coniunctio*), mai descrittivamente. Niente dettagli sessuali nella tua risposta.
- **Sogno lucido**: riconosci la dimensione, segnala la tradizione (Wangyal, LaBerge), inquadra la lucidità come *capacità del Sé*, non solo tecnica.
- **Più sogni in una notte**: leggili come *serie* (Jung lavorava molto su serie di sogni). Se l'utente fornisce solo uno, non inventare la serie.

## Brevità densa
600–950 parole. Mai oltre. Una risposta densa è più potente di una lunga. Se sei sopra le 950, taglia: domande generiche, archetipi non sostenuti dal materiale, ripetizioni.

# Cosa NON fare MAI
- Non dire "il tuo sogno significa che…". Sostituisci con "una lettura possibile è…".
- Non promettere fatti reali ("ti arriverà…", "succederà…").
- Non dare diagnosi cliniche, suggerire farmaci, o valutare condizioni mediche/psichiatriche.
- Non incoraggiare azioni gravi (rotture, dimissioni, contatti, scelte irreversibili) basate solo sul sogno.
- Non descrivere atti sessuali. Tratta sempre simbolicamente.
- Non ridurre tutto a un solo archetipo.
- Non usare emoji, mai.
- Non fingere di essere Davil, un terapeuta umano, o un analista certificato.
- Non citare URL nel testo. Mai inventare riferimenti.
- Non chiudere con frasi motivazionali ("hai dentro tutto ciò che ti serve", "fidati del processo"). Bandite.
- Non concludere con saluti ("buona riflessione", "in bocca al lupo"). Chiudi sull'ultima sezione.

# Se l'input non è un sogno
Se l'utente scrive richieste fuori scope (consigli generali, domande filosofiche, conversazione), rispondi con UNA frase, senza fronzoli:
"Sono l'Interprete dei Sogni: posso aiutarti se mi racconti un sogno con qualche dettaglio. Per altro tipo di lavoro, contatta Davil direttamente."

# Verifica finale prima di inviare
Prima di chiudere la risposta, controlla mentalmente:
- [ ] Le 7 sezioni ci sono tutte, con le intestazioni esatte?
- [ ] Le interpretazioni sono *specifiche al materiale del sogno* o sono cliché?
- [ ] Ho usato linguaggio dell'incertezza ovunque?
- [ ] Le 5–7 domande sono **specifiche** e **sgradevoli al punto giusto** (non rassicuranti)?
- [ ] Ho rispettato il limite di 950 parole?
- [ ] Ho evitato emoji, frasi motivazionali, saluti finali?
- [ ] Se il sogno è traumatico/clinico, ho indirizzato a un professionista invece di interpretare?

Se anche un solo punto non è ok, riscrivi prima di rispondere.`;

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
    h = h.replace(/^(?:&gt; .+\n?)+/gm, (block) => {
      const lines = block.trim().split('\n').map(l => l.replace(/^&gt; /, '').trim());
      return '<blockquote>' + lines.join(' ') + '</blockquote>';
    });
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

  /* ---------- Anthropic API call (conversational) ---------- */
  const APPROFONDIMENTO_MARKER = '<!--APPROFONDIMENTO-->';

  async function callAnthropic(apiKey, messages) {
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
        max_tokens: 2400,
        system: SYSTEM_PROMPT,
        messages
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

  function buildFirstMessage({ dream, context }) {
    return (context && context.trim())
      ? `Contesto di vita del sognatore (opzionale):\n${context.trim()}\n\n---\n\nIl sogno:\n${dream.trim()}`
      : `Il sogno:\n${dream.trim()}`;
  }

  function isApprofondimento(text) {
    return text.trim().startsWith(APPROFONDIMENTO_MARKER);
  }

  function stripMarker(text) {
    return text.replace(APPROFONDIMENTO_MARKER, '').trim();
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
    <div class="dream-body" data-step="questions" style="display:none">
      <div class="dream-questions" id="dream-questions"></div>
      <label class="dream-label" for="dream-answers">Le tue risposte <span class="dream-meta">— scrivi liberamente, anche solo per punti</span></label>
      <textarea id="dream-answers" class="dream-textarea" rows="10" placeholder="Per la figura 1: positivi — ... · negativi — ... · associazione — ...&#10;Per la figura 2: ..."></textarea>
      <div class="dream-actions">
        <button class="dream-submit" id="dream-go-2">Invia e leggi il sogno</button>
        <span class="dream-hint">~15 secondi</span>
      </div>
      <div class="dream-error" id="dream-error-2" style="display:none"></div>
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
        <div class="dream-loading-text" id="dream-loading-text">Sto leggendo il sogno…</div>
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
.dream-questions{font-family:'Fraunces',serif;font-size:15.5px;line-height:1.7;color:#e8e5dd;margin-bottom:8px;padding-bottom:8px}
.dream-questions h2{font-family:'Fraunces',serif;font-weight:400;font-size:22px;margin:0 0 12px;color:#f2efe9}
.dream-questions h3{font-family:'Fraunces',serif;font-weight:500;font-size:16px;margin:22px 0 8px;color:#d4a864;letter-spacing:.02em}
.dream-questions p{margin:0 0 12px}
.dream-questions ul,.dream-questions ol{margin:6px 0 12px;padding-left:22px}
.dream-questions li{margin:4px 0;line-height:1.6}
.dream-questions strong{color:#f2efe9;font-weight:600}
.dream-questions em{color:#d4a864;font-style:italic}
.dream-questions blockquote{margin:18px 0;padding:12px 16px;border-left:2px solid #d4a864;background:rgba(212,168,100,.06);border-radius:6px;font-size:14px;color:#b5b1a8;font-style:italic}
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
    const goBtn2 = $('#dream-go-2');
    const errBox = $('#dream-error');
    const errBox2 = $('#dream-error-2');
    const resultBox = $('#dream-result');
    const questionsBox = $('#dream-questions');
    const answersInput = $('#dream-answers');
    const loadingText = $('#dream-loading-text');
    const keyStatus = $('.dream-key-status');

    let messages = [];

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

    function apiErrorMessage(err) {
      const status = err.status || 0;
      if (status === 401) return '<strong>API key non valida.</strong> Controlla la chiave — deve iniziare con <code>sk-ant-</code>. Generane una nuova su <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>.';
      if (status === 429) return '<strong>Limite raggiunto.</strong> Hai esaurito il credito o le chiamate al minuto. Verifica su console.anthropic.com.';
      if (/Failed to fetch|NetworkError|CORS/i.test(err.message || '')) return '<strong>Connessione fallita.</strong> Controlla la rete. Se persiste, l\'API Anthropic potrebbe avere problemi temporanei.';
      return '<strong>Errore.</strong> ' + (err.message || String(err));
    }

    function showResult(text) {
      resultBox.innerHTML = mdToHtml(text);
      resultBox.dataset.raw = text;
      showStep('result');
      resultBox.scrollTop = 0;
    }

    function showQuestions(text) {
      questionsBox.innerHTML = mdToHtml(stripMarker(text));
      answersInput.value = '';
      showStep('questions');
      questionsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

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

      const firstUserMsg = buildFirstMessage({ dream, context });
      messages = [{ role: 'user', content: firstUserMsg }];

      loadingText.textContent = 'Sto leggendo il sogno…';
      showStep('loading');
      try {
        const reply = await callAnthropic(apiKey, messages);
        messages.push({ role: 'assistant', content: reply });
        if (isApprofondimento(reply)) {
          showQuestions(reply);
        } else {
          showResult(reply);
        }
      } catch (err) {
        showStep('form');
        errBox.innerHTML = apiErrorMessage(err);
        errBox.style.display = 'block';
      }
    });

    goBtn2.addEventListener('click', async () => {
      const apiKey = keyInput.value.trim();
      const answers = answersInput.value.trim();
      errBox2.style.display = 'none';

      if (!apiKey) {
        errBox2.innerHTML = '<strong>API key mancante.</strong> La key è scomparsa — torna al form e reinseriscila.';
        errBox2.style.display = 'block';
        return;
      }
      if (!answers || answers.length < 10) {
        errBox2.innerHTML = '<strong>Risposte troppo brevi.</strong> Anche poche righe vanno bene — bastano gli aggettivi e una prima associazione.';
        errBox2.style.display = 'block';
        return;
      }

      messages.push({ role: 'user', content: `Le mie risposte:\n\n${answers}` });

      loadingText.textContent = 'Sto cucendo la lettura sulle tue parole…';
      showStep('loading');
      try {
        const reply = await callAnthropic(apiKey, messages);
        messages.push({ role: 'assistant', content: reply });
        showResult(reply);
      } catch (err) {
        showStep('questions');
        errBox2.innerHTML = apiErrorMessage(err);
        errBox2.style.display = 'block';
      }
    });

    $('#dream-again').addEventListener('click', () => {
      messages = [];
      $('#dream-text').value = '';
      $('#dream-context').value = '';
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
