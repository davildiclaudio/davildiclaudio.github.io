/* === Guard sessione + utilities condivise area membri === */
(function(){
  document.documentElement.classList.add('am-locked');
  var SESSION_KEY = 'davil_access_v1';
  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch(_){}
  if (!session || !session.email) {
    window.location.replace('/?accedi=1');
    return;
  }
  document.addEventListener('DOMContentLoaded', function(){
    document.documentElement.classList.remove('am-locked');
    document.querySelectorAll('[data-am-username]').forEach(function(el){
      el.textContent = session.name || session.email.split('@')[0] || 'amico';
    });
    // Logout button
    document.querySelectorAll('[data-am-logout]').forEach(function(b){
      b.addEventListener('click', function(){
        try { localStorage.removeItem(SESSION_KEY); } catch(_){}
        window.location.href = '/';
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
  });
})();
