/* === Guard sessione + utilities condivise area membri === */
(function(){
  document.documentElement.classList.add('am-locked');
  var SESSION_KEY = 'davil_access_v1';
  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch(_){}

  // Init Supabase client se configurato e SDK presente
  if (window.DAVIL_SUPABASE && window.DAVIL_SUPABASE.enabled && window.supabase && !window.davilSb) {
    try { window.davilSb = window.supabase.createClient(window.DAVIL_SUPABASE.url, window.DAVIL_SUPABASE.anonKey); } catch(_){}
  }

  function applyUI(){
    document.documentElement.classList.remove('am-locked');
    document.querySelectorAll('[data-am-username]').forEach(function(el){
      el.textContent = (session && (session.name || (session.email||'').split('@')[0])) || 'amico';
    });
    // Logout button
    document.querySelectorAll('[data-am-logout]').forEach(function(b){
      b.addEventListener('click', function(){
        try { localStorage.removeItem(SESSION_KEY); } catch(_){}
        if (window.davilSb) {
          window.davilSb.auth.signOut().finally(function(){ window.location.href = '/'; });
        } else {
          window.location.href = '/';
        }
      });
    });
    // Marca menu attivo
    var path = window.location.pathname;
    document.querySelectorAll('.am-menu a').forEach(function(a){
      var href = a.getAttribute('href');
      if (!href) return;
      if (href === path || (path.endsWith('/index.html') && href === path.replace(/index\.html$/,''))) {
        a.classList.add('is-active');
      } else if (href !== '/' && path.indexOf(href.replace(/^\//,'')) >= 0) {
        a.classList.add('is-active');
      }
    });
  }

  function initUI(){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyUI);
    } else { applyUI(); }
  }

  function redirectLogin(){ window.location.replace('/?accedi=1'); }

  // Se Supabase attivo: verifica session lato server (cross-device)
  if (window.davilSb) {
    window.davilSb.auth.getSession().then(function(res){
      var sb = res && res.data && res.data.session;
      if (sb && sb.user) {
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify({
            email: sb.user.email,
            name: (sb.user.user_metadata && sb.user.user_metadata.name) || (sb.user.email||'').split('@')[0],
            ts: new Date().toISOString(),
            backend: 'supabase'
          }));
          session = JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch(_){}
        initUI();
      } else {
        redirectLogin();
      }
    }).catch(function(){
      // fallback: se localStorage ha session, usala
      if (session && session.email) initUI(); else redirectLogin();
    });
  } else {
    // Solo localStorage
    if (session && session.email) initUI(); else redirectLogin();
  }
})();
