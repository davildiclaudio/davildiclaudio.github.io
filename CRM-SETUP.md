# 🚀 Setup CRM Esterno (Tutto Gratuito)

Il sito ora funziona già "out of the box" con un CRM locale (`admin.html` legge da `localStorage` del browser). Ma se vuoi:

- **Ricevere ogni nuovo lead per email** in tempo reale
- **Centralizzare tutti i lead** in un Google Sheet condiviso (così li vedi anche dal telefono o da altri dispositivi)
- **Inviare automaticamente email** di conferma e auto-responder

allora segui i 3 step qui sotto. Ogni servizio è gratuito entro limiti generosi.

---

## ① Web3Forms — notifica email per ogni lead (250 mail/mese gratis)

**Cosa fa**: ogni volta che qualcuno lascia dati in un form del sito, ti arriva un'email in inbox.

**Setup**:
1. Vai su [web3forms.com](https://web3forms.com)
2. Inserisci la tua email (`davildiclaudio@gmail.com`) e clicca "Get Access Key"
3. Conferma l'email che ti arriva e copia la **Access Key** (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. Apri il file `crm-config.js` nella radice del repository
5. Sostituisci `'YOUR_WEB3FORMS_KEY'` con la tua Access Key
6. Commit e push

✅ Da ora ogni nuovo lead ti arriva in tempo reale in inbox con il dettaglio della sezione del sito da cui proviene.

---

## ② Google Sheets — CRM centralizzato consultabile da ovunque

**Cosa fa**: ogni lead viene scritto come riga su un Google Sheet che puoi aprire da qualsiasi dispositivo.

**Setup**:

### A. Crea il foglio
1. Vai su [sheets.google.com](https://sheets.google.com) e crea un nuovo foglio
2. Nominalo "Davil CRM Lead"
3. Nella prima riga inserisci le intestazioni: `Timestamp | Sezione | Nome | Email | Telefono | Codice | UA`

### B. Crea l'Apps Script
1. Nel foglio, vai su **Estensioni → Apps Script**
2. Cancella il contenuto del file `Code.gs` e incolla questo:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.source || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.code || '',
      data.ua || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', error: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Salva (icona floppy disk o `⌘S` / `Ctrl+S`)

### C. Deploy come Web App
1. Click su **Deploy → New deployment**
2. Tipo: **Web app**
3. Description: "Davil CRM relay"
4. Execute as: **Me (davildiclaudio@gmail.com)**
5. Who has access: **Anyone** (necessario perché il sito chiama l'endpoint senza auth)
6. Click **Deploy**
7. Autorizza l'accesso quando richiesto
8. Copia l'**URL del Web App** (formato: `https://script.google.com/macros/s/AKfyc.../exec`)

### D. Connetti al sito
1. Apri `crm-config.js`
2. Sostituisci `'YOUR_GOOGLE_APPS_SCRIPT_URL'` con l'URL appena copiato
3. Commit e push

✅ Da ora ogni lead viene scritto in tempo reale sul tuo Google Sheet.

---

## ③ EmailJS — auto-responder + link conferma email (200 mail/mese gratis)

**Cosa fa**: invia automaticamente:
- Email di benvenuto al visitatore con la password Area Membri
- Email di **conferma double opt-in** con il link di attivazione
- Notifica a Davil

**Setup**:

### A. Account
1. Vai su [emailjs.com](https://www.emailjs.com) e crea un account
2. Vai su **Email Services → Add New Service**
3. Scegli **Gmail**, connetti `davildiclaudio@gmail.com`
4. Copia il **Service ID** (formato: `service_xxxxxxx`)

### B. Template
Crea **3 template** in Email Templates:

**Template 1 — `tpl_davil_notif`** (notifica nuovo lead a te)
```
To: davildiclaudio@gmail.com
Subject: Nuovo lead · {{source}} · {{name}}
Body:
Nuovo contatto da {{source}}
Nome: {{name}}
Email: {{email}}
Tel: {{phone}}
Codice: {{code}}
Quando: {{ts}}
```

**Template 2 — `tpl_user_code`** (auto-responder al visitatore)
```
To: {{to_email}}
Subject: Benvenuto/a in Davil
Body:
Ciao {{name}},
grazie per esserti registrato/a a {{source}}.
Il tuo codice di accesso: {{code}}
Riceverai i materiali nelle ore successive.
— Davil
```

**Template 3 — `tpl_confirm`** (link conferma email)
```
To: {{to_email}}
Subject: Conferma la tua email · Davil
Body:
Ciao {{name}},
clicca per confermare la tua iscrizione all'Area Membri:
{{confirm_link}}

Codice: {{code}}
— Davil
```

### C. Public Key
1. Su EmailJS vai su **Account → General**
2. Copia la **Public Key**

### D. Connetti al sito
1. Apri `crm-config.js`
2. Imposta `enabled: true`
3. Sostituisci tutte le `YOUR_*` con i valori copiati:
   - `publicKey`: dalla Public Key
   - `serviceId`: il service ID Gmail
   - `tplDavil`: l'ID del template 1
   - `tplUser`: l'ID del template 2
   - `tplConfirm`: l'ID del template 3
4. Commit e push

✅ Da ora ogni registrazione invia automaticamente le email.

---

## Riassunto file modificati

Solo `crm-config.js` deve essere editato. Tutti gli altri file restano invariati. Esempio finale:

```javascript
window.DAVIL_CRM_CONFIG = {
  web3formsKey: 'a1b2c3d4-e5f6-1234-5678-90abcdef1234',
  notifyEmail: 'davildiclaudio@gmail.com',
  sheetsWebhookUrl: 'https://script.google.com/macros/s/AKfyc.../exec'
};

window.DAVIL_EMAIL = {
  enabled: true,
  publicKey: 'a1b2c3d4_publicKey',
  serviceId: 'service_a1b2c3',
  tplDavil:  'template_davil123',
  tplUser:   'template_user456',
  tplConfirm:'template_confirm789',
  fromAddr:  'davildiclaudio@gmail.com'
};
```

---

## ④ Supabase — backend autenticazione cross-device (50.000 utenti gratis)

**Cosa fa**: gli utenti possono registrarsi e accedere all'Area Membri **da qualsiasi dispositivo** (Mac, iPhone, PC). Senza questo, il login funziona solo nello stesso browser dove ci si è registrati.

**Setup (~5 minuti)**:

1. Vai su [supabase.com](https://supabase.com) e clicca **Sign Up** (puoi usare GitHub)
2. **New Project**:
   - Name: `davil-coscienza` (o quello che vuoi)
   - Database Password: scegline una forte e salvala
   - Region: **West EU (Ireland)** per essere GDPR-friendly
   - Pricing Plan: **Free**
3. Aspetta ~2 minuti che il progetto sia creato
4. Vai su **Project Settings → API**:
   - Copia "**Project URL**" (es: `https://xxxxxxx.supabase.co`)
   - Copia "**anon public**" key (lunga stringa che inizia con `eyJ...`)
5. Vai su **Authentication → URL Configuration**:
   - **Site URL**: `https://davil-life-leadership-coaching.it`
   - In **Redirect URLs** aggiungi:
     - `https://davil-life-leadership-coaching.it/area-membri.html`
     - `https://davil-life-leadership-coaching.it/**` (wildcard)
6. Vai su **Authentication → Email Templates → Confirm signup**:
   - Personalizza Subject e Body del template di conferma email
   - Esempio Subject: `Conferma la tua email · Davil`
7. Apri `crm-config.js` e modifica `window.DAVIL_SUPABASE`:
   ```javascript
   window.DAVIL_SUPABASE = {
     enabled:  true,
     url:      'https://xxxxxxx.supabase.co',  // il tuo Project URL
     anonKey:  'eyJ...',                         // la tua anon public key
     redirectTo: 'https://davil-life-leadership-coaching.it/area-membri.html'
   };
   ```
8. Commit e push

✅ Da ora ogni registrazione crea un account vero su Supabase, l'email di conferma viene inviata automaticamente, e l'utente può loggarsi da qualsiasi dispositivo.

**Per vedere gli utenti registrati**: vai su Supabase → **Authentication → Users**.

---

## Cosa funziona già senza setup

Anche **senza configurare nulla**:
- Tutti i lead vengono salvati nel browser di chi visita
- `admin.html` permette di vederli (password `davil-coscienza-2026`)
- Il modal di registrazione mostra il link di conferma direttamente in pagina
- Esportazione CSV dei lead

Quindi puoi anche **non configurare niente** e usare il CRM in modalità locale. Le integrazioni qui sopra servono solo se vuoi centralizzare i dati e ricevere notifiche email reali.

---

## Conformità GDPR

Tutti gli step sono già conformi al GDPR perché:
- Web3Forms è EU-friendly (server EU, conforme GDPR)
- Google Sheets è uno strumento di lavoro tuo personale
- EmailJS è certificato GDPR (server EU disponibile)
- I consensi sono raccolti esplicitamente nei form
- L'utente può chiedere cancellazione scrivendo a `davildiclaudio@gmail.com` e tu hai gli strumenti per eliminare la riga (Google Sheets) o l'entry localStorage (admin.html → Elimina GDPR)

⚠️ **Aggiorna `privacy.html`** dopo aver attivato Web3Forms/Google/EmailJS per dichiarare che usi questi processor esterni.
