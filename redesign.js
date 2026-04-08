const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Mobile Adisyon height adjustment CSS (Line ~386)
const oldMobileCss = '.adisyon { height: 45vh; max-height: none; }';
const newMobileCss = '.adisyon { height: auto !important; min-height: 10vh !important; max-height: 45vh !important; }';
html = html.replace(oldMobileCss, newMobileCss);

// 2. Add New 3-Column CSS
const newCss = `
    /* ===== MASAÜSTÜ 3 SÜTUN DÜZENİ ===== */
    @media (min-width: 901px) {
      .uclu-duzen { display: flex; flex-direction: row; height: 100%; width: 100%; }
      .uclu-duzen .menu-alan { flex: 1.1; border-right: 2px solid #334155; }
      .uclu-duzen .adisyon { flex: 1.1; display: flex; flex-direction: column; border-right: 2px solid #334155; padding:0; background:#0f172A; }
      .uclu-duzen .odeme-sutun { flex: 1.1; display: flex; flex-direction: column; background: #0f172a; padding: 0; }
      .mobilde-goster { display: none !important; }
    }
    @media (max-width: 900px) {
      .desktop-goster { display: none !important; }
    }

    /* Oynak Ödeme Ekranı CSS (Desktop'ta sarı kuleye yerleşir) */
    #hareketli-odeme-alani.desktop-mod {
      width: 100%; height: 100%; max-width: none; border-radius: 0;
      display: flex; flex-direction: column; background: transparent; padding: 16px; box-shadow: none;
    }
    #hareketli-odeme-alani.desktop-mod .kapat-btn { display: none; }
    #hareketli-odeme-alani.desktop-mod .odeme-butonlar { margin-top: auto; padding-top: 15px; }
    #hareketli-odeme-alani.desktop-mod .odeme-butonlar button { padding: 18px; font-size: 16px; font-weight: 800; border-radius: 12px; }
    #hareketli-odeme-alani.desktop-mod .odeme-liste { max-height: none; flex: 1; min-height: 0; }
`;
html = html.replace('</style>', newCss + '\n</style>');

// 3. Mark the modal inner content with ID "hareketli-odeme-alani"
html = html.replace('<div class="modal odeme-modal-kutu">', '<div class="modal odeme-modal-kutu" id="hareketli-odeme-alani">');

// 4. Modify panelRender literal assignment
const panelHtmlTarget = /<div class="sag-panel-kap \$\{panelAcik \? 'panel-acik' : ''\}"\>[\s\S]*?<div class="menu-alan">[\s\S]*?<div class="sag-panel \$\{panelAcik \? 'acik' : ''\}" id="sag-panel">\$\{panelHtml\}<\/div>\s*<\/div>/;

const newPanelHtml = `<div class="sag-panel-kap \${panelAcik ? 'panel-acik' : ''} uclu-duzen">
        <div class="menu-alan">
          <div class="kat-sidebar">\${kategoriler}</div>
          <div class="urun-panel">\${urunler}</div>
        </div>
        <div class="adisyon">
          <h3 style="display:flex; justify-content:space-between; align-items:center; padding:10px;">
            Adisyon 
            <div style="display:flex; gap:6px;">
              <button onclick="masaTasiAc()" style="background:#3498db; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🔄 Taşı</button>
              <button onclick="masaBirlestirAc()" style="background:#9b59b6; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🤝 Birleştir</button>
              <button onclick="adisyonuTamamenSifirla()" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🗑️ Sıfırla</button>
            </div>
          </h3>
          <div style="flex:1; overflow-y:auto; padding:0 10px;">
             \${adisyonlar}
          </div>
          <div class="alt-panel" style="padding:10px;">
            <div class="toplam-satir">
              <span class="toplam-label">Toplam</span>
              <span class="toplam-deger">\${toplam}₺</span>
            </div>
            \${indirim > 0 ? \`<div class="toplam-satir" style="color:#ef4444;font-size:12px;"><span>İndirim</span><span>-\${indirim}₺</span></div>
            <div class="toplam-satir"><span class="toplam-label" style="font-weight:bold;">Net Toplam</span><span class="toplam-deger" style="color:#22c55e;">\${Math.max(0,toplam-indirim)}₺</span></div>\` : ''}
            
            \${gonderilecekVarMi ? \`<button class="btn btn-onayla" style="width:100%; margin-bottom: 8px; border-radius: 8px; font-weight: bold; background-color: #f39c12; border: 1px solid #d68910; color: white; padding: 12px; font-size: 14px;" onclick="siparisiGonder()">🚀 Yeni Eklenenleri Yazdır & Masayı Kaydet</button>\` : (JSON.stringify(masa.adisyon) !== JSON.stringify(window._seciliMasaYedekAdisyon || []) ? \`<button class="btn btn-onayla" style="width:100%; margin-bottom: 8px; border-radius: 8px; font-weight: bold; background-color: #e74c3c; border: 1px solid #c0392b; color: white; padding: 12px; font-size: 14px;" onclick="siparisiKaydet()">💾 Tablodan Silinenleri Onayla (Kaydet)</button>\` : '')}
            
            <div class="butonlar mobilde-goster">
              \${(!yoneticiModu && !garsonIzinler.odemeAl) ? '' : \`<button class="btn btn-kapat" onclick="odemeAc()">Ödeme Al</button>\`}
            </div>
          </div>
        </div>
        <div class="odeme-sutun desktop-goster" id="desktop-odeme-sutun"></div>
        <div class="sag-panel \${panelAcik ? 'acik' : ''}" id="sag-panel">\${panelHtml}</div>
      </div>`;

html = html.replace(panelHtmlTarget, newPanelHtml);

// 5. Inject safe removal logic to top of panelRender
const beforeRender = `  function panelRender() {
    const panel = document.getElementById('panel-icerik');`;
const rescueLogic = `  function panelRender() {
    const panel = document.getElementById('panel-icerik');
    const alan = document.getElementById('hareketli-odeme-alani');
    const overlay = document.getElementById('odeme-modal');
    if (alan && overlay && alan.parentElement.id !== 'odeme-modal') {
        overlay.appendChild(alan); // Safe keeping before nuking innerHTML
    }`;
html = html.replace(beforeRender, rescueLogic);

// 6. Inject odemeYerlesimiKontrol and call it right after innerHTML assignment in panelRender
const afterInnerHTML = `// geri yükle
    const yeniUrunPanel = document.querySelector('#panel-icerik .urun-panel');`;
const relocationLogic = `// 3lu düzen ödeme taşıma
    odemeYerlesimiKontrol();
    if (window.innerWidth > 900) {
        if (!odemeAdetler || odemeAdetler.length !== masalar[seciliMasa].adisyon.length) {
            odemeAdetler = masalar[seciliMasa].adisyon.map(() => 0);
        }
        _odemeRender(); // Desktopta ödeme sütununu her zaman diri tut
    }

    // geri yükle
    const yeniUrunPanel = document.querySelector('#panel-icerik .urun-panel');`;
html = html.replace(afterInnerHTML, relocationLogic);

// 7. Inject the actual window resize handler globally
const scriptInjection = `
  function odemeYerlesimiKontrol() {
     const alan = document.getElementById('hareketli-odeme-alani');
     if(!alan) return;
     if (window.innerWidth > 900 && document.getElementById('desktop-odeme-sutun')) {
         const hedef = document.getElementById('desktop-odeme-sutun');
         if(alan.parentElement.id === 'odeme-modal') {
             hedef.appendChild(alan);
             alan.classList.add('desktop-mod');
         }
     } else {
         const hedef = document.getElementById('odeme-modal');
         if(hedef && alan.parentElement.id !== 'odeme-modal') {
             hedef.appendChild(alan);
             alan.classList.remove('desktop-mod');
         }
     }
  }
  window.addEventListener('resize', odemeYerlesimiKontrol);
</script>`;
html = html.replace('</script>', scriptInjection);

// Write changes
fs.writeFileSync('index.html', html, 'utf8');
console.log('UI redesign applied perfectly!');
