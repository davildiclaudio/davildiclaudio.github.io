/* ============================================================
   DAVIL · CONFIG CRM ESTERNO
   ------------------------------------------------------------
   Configura qui le chiavi dei servizi gratuiti per ricevere i
   lead anche fuori dal browser. Senza configurazione, i lead
   vengono comunque salvati in admin.html (localStorage).

   ✦ Vedi la guida completa: /CRM-SETUP.md
   ============================================================ */

window.DAVIL_CRM_CONFIG = {
  // 1. WEB3FORMS · 250 email/mese gratis · invia ogni lead alla tua email
  //    Setup: web3forms.com → registra la tua email → copia la "Access Key"
  web3formsKey: 'YOUR_WEB3FORMS_KEY',
  notifyEmail:  'davildiclaudio@gmail.com',

  // 2. GOOGLE SHEETS · centralizza tutti i lead in un foglio Google
  //    Setup: crea un Google Sheet → Extensions → Apps Script →
  //    incolla lo script in CRM-SETUP.md → Deploy come Web App →
  //    incolla qui l'URL di deploy (inizia con https://script.google.com/...)
  sheetsWebhookUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL'
};

/* ============================================================
   EmailJS · 200 mail/mese gratis · auto-responder ai lead
   ------------------------------------------------------------
   Setup: emailjs.com → connetti Gmail → crea 2 template
   (uno per Davil, uno per il visitatore) → copia gli ID qui
   ============================================================ */

window.DAVIL_EMAIL = {
  enabled:   false, // metti true dopo aver compilato le chiavi
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  tplDavil:  'YOUR_TEMPLATE_DAVIL_ID',  // notifica nuovo lead a Davil
  tplUser:   'YOUR_TEMPLATE_USER_ID',   // auto-responder al visitatore
  tplConfirm:'YOUR_TEMPLATE_CONFIRM_ID',// link conferma email per registrazione
  fromAddr:  'davildiclaudio@gmail.com'
};

/* ============================================================
   SUPABASE · backend autenticazione cross-device (free tier)
   ------------------------------------------------------------
   Free tier: 50.000 utenti attivi/mese · email verification incluso
   GDPR-compliant · server EU disponibile

   Setup (3 minuti):
   1. Vai su supabase.com → Sign Up con GitHub o email
   2. New Project → scegli region "West EU (Ireland)" per GDPR EU
   3. Imposta una Database Password (segnala a Davil)
   4. Aspetta ~2 min che il progetto sia creato
   5. Project Settings → API → copia "Project URL" e "anon public" key
   6. Authentication → URL Configuration:
      - Site URL: https://davil-life-leadership-coaching.it
      - Redirect URLs: aggiungi
        https://davil-life-leadership-coaching.it/area-membri.html
   7. Authentication → Email Templates → personalizza il template di conferma
   8. Incolla i valori qui sotto e metti enabled:true
   ============================================================ */

window.DAVIL_SUPABASE = {
  enabled:  true,
  url:      'https://zrictduhyvlwyuakudyu.supabase.co',
  anonKey:  'sb_publishable_QaO1ekpIKHhPMcMOCyY6dg_fMPTGZyh',
  // Page a cui Supabase reindirizza dopo conferma email
  redirectTo: 'https://davil-life-leadership-coaching.it/area-membri.html'
};
