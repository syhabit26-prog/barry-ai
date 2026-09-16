export function buildDropshippingSite(
  storeName: string,
  tagline: string,
  category: string = "sneakers",
  color?: { primary: string; secondary: string },
  mood?: { id: string; name: string }
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${storeName} | Boutique en ligne</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#eaeded;color:#0f1111;overflow-x:hidden}

/* ═══ HEADER AMAZON ═══ */
.header-top{background:#131921;color:#fff;padding:8px 0}
.header-main{background:#232f3e;color:#fff;padding:12px 0}
.header-wrapper{max-width:1500px;margin:0 auto;padding:0 20px;display:flex;align-items:center;gap:20px}
.logo{font-size:24px;font-weight:900;letter-spacing:-1px;color:#fff;text-decoration:none;flex-shrink:0;cursor:pointer}
.logo span{color:#ff9900}
.search-bar{flex:1;display:flex;max-width:800px}
.search-bar input{flex:1;padding:10px 16px;border:none;border-radius:4px 0 0 4px;font-size:15px;outline:none}
.search-bar button{background:#febd69;border:none;padding:0 20px;border-radius:0 4px 4px 0;cursor:pointer;font-size:18px;color:#131921;font-weight:bold;transition:background 0.2s}
.search-bar button:hover{background:#f3a847}
.header-nav{display:flex;align-items:center;gap:24px;font-size:13px}
.header-nav-item{display:flex;flex-direction:column;cursor:pointer;line-height:1.2}
.header-nav-item .small{font-size:11px;color:#ccc}
.header-nav-item .bold{font-weight:700;font-size:14px}
.cart-btn{display:flex;align-items:flex-end;gap:6px;cursor:pointer;position:relative}
.cart-icon{font-size:32px;line-height:1}
.cart-count{position:absolute;top:0;left:14px;background:#ff9900;color:#131921;font-weight:bold;font-size:11px;padding:1px 5px;border-radius:10px}
.cart-label{font-size:14px;font-weight:700;margin-bottom:4px}

/* ═══ BARRE DE NAVIGATION ═══ */
.nav-bar{background:#37475a;color:#fff;padding:8px 0;font-size:14px}
.nav-wrapper{max-width:1500px;margin:0 auto;padding:0 20px;display:flex;gap:24px;flex-wrap:wrap}
.nav-link{cursor:pointer;transition:color 0.2s;text-decoration:none;color:#fff}
.nav-link:hover{color:#febd69}

/* ═══ HERO / BANNIÈRE ═══ */
.hero{background:linear-gradient(135deg,#232f3e 0%,#37475a 100%);color:#fff;padding:60px 20px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 50%,rgba(255,153,0,0.15),transparent 60%);pointer-events:none}
.hero-content{position:relative;z-index:1;max-width:900px;margin:0 auto}
.hero-badge{display:inline-block;padding:6px 16px;background:rgba(255,153,0,0.2);border:1px solid rgba(255,153,0,0.4);border-radius:20px;color:#febd69;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:20px;text-transform:uppercase}
.hero h1{font-size:clamp(32px,5vw,52px);font-weight:900;margin-bottom:16px;line-height:1.2}
.hero h1 span{color:#ff9900}
.hero p{font-size:18px;color:rgba(255,255,255,0.85);margin-bottom:32px;line-height:1.6;max-width:600px;margin-left:auto;margin-right:auto}
.hero-cta{display:inline-block;padding:14px 32px;background:#ff9900;color:#131921;font-weight:700;font-size:16px;border-radius:8px;text-decoration:none;cursor:pointer;border:none;transition:all 0.2s}
.hero-cta:hover{background:#febd69;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,153,0,0.4)}

/* ═══ BANNIÈRE AVANTAGES ═══ */
.benefits-bar{background:#fff;border-bottom:1px solid #ddd;padding:16px 20px}
.benefits-wrapper{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
.benefit{display:flex;align-items:center;gap:12px;font-size:14px;color:#0f1111}
.benefit-icon{font-size:24px;flex-shrink:0}
.benefit strong{font-weight:700;display:block;margin-bottom:2px}
.benefit small{color:#565959;font-size:12px}

/* ═══ CONTENU PRINCIPAL ═══ */
.container{max-width:1500px;margin:0 auto;padding:24px 20px}
.section-title{font-size:24px;font-weight:700;margin-bottom:20px;color:#0f1111}
.section-title span{color:#c7511f}

/* ═══ GRILLE PRODUITS ═══ */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.product-card{background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden;transition:all 0.2s;cursor:pointer;display:flex;flex-direction:column}
.product-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.15);transform:translateY(-2px)}
.product-image{position:relative;aspect-ratio:1;overflow:hidden;background:#f7f7f7;padding:12px}
.product-image img{width:100%;height:100%;object-fit:contain;transition:transform 0.3s}
.product-card:hover .product-image img{transform:scale(1.05)}
.product-badge{position:absolute;top:8px;left:8px;padding:4px 10px;background:#cc0c39;color:#fff;font-size:11px;font-weight:700;border-radius:4px;text-transform:uppercase}
.product-info{padding:14px;flex:1;display:flex;flex-direction:column;gap:8px}
.product-title{font-size:14px;font-weight:500;color:#0f1111;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:40px}
.product-rating{display:flex;align-items:center;gap:6px;font-size:13px}
.stars{color:#ff9900;letter-spacing:-1px}
.review-count{color:#007185;font-size:12px}
.product-price{margin-top:auto}
.price-current{font-size:22px;font-weight:700;color:#0f1111}
.price-old{font-size:13px;color:#565959;text-decoration:line-through;margin-left:6px}
.price-discount{font-size:12px;color:#cc0c39;font-weight:700;margin-left:6px}
.product-actions{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.btn-amazon{padding:10px 14px;border:none;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;width:100%}
.btn-amazon.stripe{background:#ffd814;color:#0f1111}
.btn-amazon.stripe:hover{background:#f7ca00}
.btn-amazon.paypal{background:#ff9900;color:#fff}
.btn-amazon.paypal:hover{background:#f3a847}
.btn-amazon:disabled{opacity:0.5;cursor:wait}

/* ═══ NEWSLETTER ═══ */
.newsletter{background:#232f3e;color:#fff;padding:48px 20px;text-align:center}
.newsletter h2{font-size:28px;font-weight:700;margin-bottom:12px}
.newsletter p{color:rgba(255,255,255,0.75);margin-bottom:24px;font-size:15px}
.newsletter-form{display:flex;gap:12px;max-width:500px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.newsletter-form input{flex:1;min-width:240px;padding:12px 16px;border:none;border-radius:6px;font-size:15px;outline:none}
.newsletter-form button{padding:12px 28px;background:#ff9900;color:#131921;font-weight:700;border:none;border-radius:6px;cursor:pointer;font-size:15px;transition:background 0.2s}
.newsletter-form button:hover{background:#febd69}

/* ═══ FOOTER ═══ */
.footer-back-top{background:#37475a;color:#fff;padding:16px;text-align:center;cursor:pointer;font-size:14px;font-weight:600}
.footer-back-top:hover{background:#485769}
.footer-main{background:#232f3e;color:#fff;padding:48px 20px}
.footer-wrapper{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:32px}
.footer-col h3{font-size:16px;font-weight:700;margin-bottom:16px}
.footer-col a{display:block;color:rgba(255,255,255,0.75);text-decoration:none;font-size:13px;margin-bottom:10px;cursor:pointer;transition:color 0.2s}
.footer-col a:hover{color:#febd69;text-decoration:underline}
.footer-bottom{background:#131921;color:#fff;padding:24px 20px;text-align:center;font-size:12px}
.footer-logo{font-size:20px;font-weight:900;margin-bottom:8px}
.footer-logo span{color:#ff9900}

/* ═══ LOADING ═══ */
.loading{text-align:center;padding:80px 20px;font-size:16px;color:#565959;grid-column:1/-1}
.loading::before{content:'';display:block;width:40px;height:40px;margin:0 auto 20px;border:4px solid #f3f3f3;border-top-color:#ff9900;border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  .header-wrapper{flex-wrap:wrap;gap:12px}
  .search-bar{order:3;flex-basis:100%}
  .header-nav{display:none}
  .grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
  .hero h1{font-size:28px}
  .hero p{font-size:16px}
  .nav-wrapper{overflow-x:auto}
}
</style>
</head>
<body>

<!-- ═══ HEADER ═══ -->
<header>
  <div class="header-main">
    <div class="header-wrapper">
      <a class="logo" href="#top">${storeName}<span>.</span></a>

      <div class="search-bar">
        <input type="text" placeholder="Rechercher dans ${storeName}..." id="search-input" onkeydown="if(event.key==='Enter')doSearch()">
        <button onclick="doSearch()">🔍</button>
      </div>

      <div class="header-nav">
        <div class="header-nav-item">
          <span class="small">Bonjour</span>
          <span class="bold">Identifiez-vous</span>
        </div>
        <div class="header-nav-item">
          <span class="small">Retours</span>
          <span class="bold">et Commandes</span>
        </div>
        <div class="cart-btn" onclick="scrollToProducts()">
          <span class="cart-icon">🛒</span>
          <span class="cart-count">0</span>
          <span class="cart-label">Panier</span>
        </div>
      </div>
    </div>
  </div>

  <div class="nav-bar">
    <div class="nav-wrapper">
      <a class="nav-link" onclick="scrollToProducts()">☰ Toutes nos catégories</a>
      <a class="nav-link" onclick="scrollToProducts()">Meilleures ventes</a>
      <a class="nav-link" onclick="scrollToProducts()">Nouveautés</a>
      <a class="nav-link" onclick="scrollToProducts()">Promotions</a>
      <a class="nav-link" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Service client</a>
    </div>
  </div>
</header>

<!-- ═══ HERO ═══ -->
<section class="hero" id="top">
  <div class="hero-content">
    <div class="hero-badge">✨ Nouveautés 2026</div>
    <h1>Bienvenue sur <span>${storeName}</span></h1>
    <p>${tagline} — Livraison offerte dès 25€ d'achat. Paiement 100% sécurisé.</p>
    <button class="hero-cta" onclick="scrollToProducts()">Découvrir nos produits →</button>
  </div>
</section>

<!-- ═══ AVANTAGES ═══ -->
<div class="benefits-bar">
  <div class="benefits-wrapper">
    <div class="benefit">
      <span class="benefit-icon">🚚</span>
      <div>
        <strong>Livraison gratuite</strong>
        <small>Dès 25€ d'achat</small>
      </div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">🔒</span>
      <div>
        <strong>Paiement sécurisé</strong>
        <small>Stripe & PayPal</small>
      </div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">↩️</span>
      <div>
        <strong>Retours 30 jours</strong>
        <small>Satisfait ou remboursé</small>
      </div>
    </div>
    <div class="benefit">
      <span class="benefit-icon">💬</span>
      <div>
        <strong>Support 24/7</strong>
        <small>À votre écoute</small>
      </div>
    </div>
  </div>
</div>

<!-- ═══ PRODUITS ═══ -->
<div class="container" id="products">
  <h2 class="section-title">Nos <span>meilleures ventes</span></h2>
  <div id="products-grid" class="grid">
    <div class="loading">Chargement des produits...</div>
  </div>
</div>

<!-- ═══ NEWSLETTER ═══ -->
<section class="newsletter">
  <h2>Inscrivez-vous à notre newsletter</h2>
  <p>Recevez -10% sur votre première commande et nos offres exclusives</p>
  <div class="newsletter-form">
    <input type="email" placeholder="Votre adresse email" id="email-input">
    <button onclick="subscribe()">S'inscrire</button>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<div class="footer-back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  ↑ Retour en haut
</div>

<footer class="footer-main" id="contact">
  <div class="footer-wrapper">
    <div class="footer-col">
      <h3>À propos de ${storeName}</h3>
      <a>Qui sommes-nous</a>
      <a>Nos engagements</a>
      <a>Carrières</a>
      <a>Presse</a>
    </div>
    <div class="footer-col">
      <h3>Gagnez de l'argent</h3>
      <a>Vendez sur ${storeName}</a>
      <a>Programme d'affiliation</a>
      <a>Devenez partenaire</a>
    </div>
    <div class="footer-col">
      <h3>Moyens de paiement</h3>
      <a>💳 Cartes bancaires</a>
      <a>🅿️ PayPal</a>
      <a>🔒 Paiement sécurisé SSL</a>
    </div>
    <div class="footer-col">
      <h3>Besoin d'aide ?</h3>
      <a>Votre compte</a>
      <a>Vos commandes</a>
      <a>Livraison</a>
      <a>Retours et remboursements</a>
    </div>
  </div>
</footer>

<div class="footer-bottom">
  <div class="footer-logo">${storeName}<span>.</span></div>
  <p>© 2026 ${storeName}. Tous droits réservés. · Paiement sécurisé par Stripe et PayPal</p>
</div>

<script>
(function(){
  var grid = document.getElementById('products-grid');
  var category = '${category}';
  fetch('/api/cj/products?limit=12&search=' + encodeURIComponent(category))
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.products || data.products.length===0){
        grid.innerHTML = '<div class="loading">Aucun produit disponible</div>';
        return;
      }
      var html = '';
      for(var i=0;i<data.products.length;i++){
        var p = data.products[i];
        var name = String(p.name).replace(/'/g,'').replace(/"/g,'');
        var price = parseFloat(p.price) || 99.99;
        var oldPrice = p.oldPrice || (price * 1.3);
        var rating = p.rating || 4.5;
        var reviews = p.reviews || 100;
        var badge = p.badge || 'NOUVEAU';
        var discount = Math.round((1 - price / oldPrice) * 100);
        var fullStars = Math.round(rating);
        var stars = '';
        for(var s=0;s<5;s++){ stars += (s < fullStars) ? '★' : '☆'; }
        html += '<div class="product-card">';
        html += '<div class="product-image">';
        html += '<img src="' + p.image + '" alt="' + name + '" onerror="this.src=\\'https://placehold.co/400x400/f7f7f7/999?text=Image\\'">';
        if(badge) html += '<div class="product-badge">' + badge + '</div>';
        html += '</div>';
        html += '<div class="product-info">';
        html += '<div class="product-title">' + name + '</div>';
        html += '<div class="product-rating"><span class="stars">' + stars + '</span><span class="review-count">' + reviews + '</span></div>';
        html += '<div class="product-price">';
        html += '<span class="price-current">' + price.toFixed(2) + ' €</span>';
        if(oldPrice > price) {
          html += '<span class="price-old">' + oldPrice.toFixed(2) + ' €</span>';
          html += '<span class="price-discount">-' + discount + '%</span>';
        }
        html += '</div>';
        html += '<div class="product-actions">';
        html += '<button class="btn-amazon stripe" onclick="buyProductStripe(this,\\'' + name + '\\',' + price + ',\\'' + p.image + '\\',\\'' + (p.sku||'') + '\\')">Ajouter au panier</button>';
        html += '<button class="btn-amazon paypal" onclick="buyProductPaypal(this,\\'' + name + '\\',' + price + '\\')">Acheter maintenant</button>';
        html += '</div>';
        html += '</div></div>';
      }
      grid.innerHTML = html;
    })
    .catch(function(err){
      grid.innerHTML = '<div class="loading">Erreur : ' + err.message + '</div>';
    });
})();

function scrollToProducts(){
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
}

function doSearch(){
  var q = document.getElementById('search-input').value.trim();
  if(!q) return;
  var grid = document.getElementById('products-grid');
  grid.innerHTML = '<div class="loading">Recherche...</div>';
  fetch('/api/cj/products?limit=12&search=' + encodeURIComponent(q))
    .then(function(r){return r.json();})
    .then(function(data){
      if(!data.products || data.products.length===0){
        grid.innerHTML = '<div class="loading">Aucun résultat pour "' + q + '"</div>';
        return;
      }
      var html = '';
      for(var i=0;i<data.products.length;i++){
        var p = data.products[i];
        var name = String(p.name).replace(/'/g,'').replace(/"/g,'');
        var price = parseFloat(p.price) || 99.99;
        var oldPrice = p.oldPrice || (price * 1.3);
        var rating = p.rating || 4.5;
        var reviews = p.reviews || 100;
        var badge = p.badge || '';
        var fullStars = Math.round(rating);
        var stars = '';
        for(var s=0;s<5;s++){ stars += (s < fullStars) ? '★' : '☆'; }
        html += '<div class="product-card">';
        html += '<div class="product-image"><img src="' + p.image + '" alt="' + name + '" onerror="this.src=\\'https://placehold.co/400x400/f7f7f7/999?text=Image\\'">';
        if(badge) html += '<div class="product-badge">' + badge + '</div>';
        html += '</div>';
        html += '<div class="product-info">';
        html += '<div class="product-title">' + name + '</div>';
        html += '<div class="product-rating"><span class="stars">' + stars + '</span><span class="review-count">' + reviews + '</span></div>';
        html += '<div class="product-price"><span class="price-current">' + price.toFixed(2) + ' €</span><span class="price-old">' + oldPrice.toFixed(2) + ' €</span></div>';
        html += '<div class="product-actions">';
        html += '<button class="btn-amazon stripe" onclick="buyProductStripe(this,\\'' + name + '\\',' + price + ',\\'' + p.image + '\\',\\'' + (p.sku||'') + '\\')">Ajouter au panier</button>';
        html += '<button class="btn-amazon paypal" onclick="buyProductPaypal(this,\\'' + name + '\\',' + price + '\\')">Acheter maintenant</button>';
        html += '</div></div></div>';
      }
      grid.innerHTML = html;
    });
}

window.buyProductStripe = function(btn, name, price, image, sku){
  var original = btn.innerHTML;
  btn.innerHTML = '⏳ Redirection...';
  btn.disabled = true;
  fetch('/api/stripe/checkout-product', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({productName:name, price:price, imageUrl:image, sku:sku})
  })
  .then(function(r){return r.json();})
  .then(function(d){
    if(d.url){
      window.open(d.url, '_blank');
      btn.innerHTML = original;
      btn.disabled = false;
    } else {
      alert('Erreur Stripe : ' + (d.error||'inconnue'));
      btn.innerHTML = original;
      btn.disabled = false;
    }
  })
  .catch(function(err){
    alert('Erreur : ' + err.message);
    btn.innerHTML = original;
    btn.disabled = false;
  });
};

window.buyProductPaypal = function(btn, name, price){
  var original = btn.innerHTML;
  btn.innerHTML = '⏳ Redirection...';
  btn.disabled = true;
  fetch('/api/paypal/create-order', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({amount: price, currency: 'EUR', productName: name})
  })
  .then(function(r){return r.json();})
  .then(function(d){
    var link = d.links && d.links.find(function(l){return l.rel === 'approve';});
    if(link && link.href){
      window.open(link.href, '_blank');
      btn.innerHTML = original;
      btn.disabled = false;
    } else {
      alert('Erreur PayPal : ' + (d.error || 'inconnue'));
      btn.innerHTML = original;
      btn.disabled = false;
    }
  })
  .catch(function(err){
    alert('Erreur : ' + err.message);
    btn.innerHTML = original;
    btn.disabled = false;
  });
};

function subscribe(){
  var email = document.getElementById('email-input').value;
  if(email && email.includes('@')){alert('✅ Merci ! Vérifiez votre email pour -10%');}
  else{alert('❌ Email invalide');}
}
</script>
</body>
</html>`;
}