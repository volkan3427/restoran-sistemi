const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. REWRITE THE HTML OF SIPARIS PANEL
const panelHtmlRegex = /<div class="siparis-panel" id="siparis-panel">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- HIZLI SATIŞ SAYFASI -->/;

const newPanelHtml = `<div class="siparis-panel" id="siparis-panel" style="flex:3; background:#1e293b; overflow:hidden;">
  <!-- MASA SEÇİLMEDİĞİNDE GÖSTERİLEN BÖLÜM -->
  <div id="sp-bos-durum" class="bos-panel" style="width:100%; height:100%; display:flex;">
    <div class="ikon">👆</div>
    <div>Sipariş girmek için soldaki masalardan birini seçin...</div>
  </div>

  <!-- MASA SEÇİLDİĞİNDE GÖSTERİLEN ANA YAPILANMA (3 SÜTUN) -->
  <div id="sp-dolu-durum" style="display:none; width:100%; height:100%;" class="sp-uclu-duzen">
    
    <!-- Sütun 1: MENÜ, KATEGORİ -->
    <div class="menu-alan sp-sutun-1" style="display:flex; flex-direction:row;">
      <div class="kat-sidebar" id="sp-kat-sidebar"></div>
      <div class="urun-panel" id="sp-urun-panel"></div>
    </div>

    <!-- Sütun 2: ADİSYON -->
    <div class="adisyon-kapsayici sp-sutun-2" style="background:#0f172A; display:flex; flex-direction:column;">
      <div class="panel-baslik" style="border-bottom: 2px solid #334155; padding: 12px 14px; display:flex; justify-content:space-between; flex-shrink:0;">
        <span id="sp-masa-isim">Masa</span>
        <button class="kapat-btn" onclick="panelKapat()">×</button>
      </div>
      
      <div class="adisyon" style="flex:1; display:flex; flex-direction:column; padding:0; overflow:hidden;">
        <h3 style="display:flex; justify-content:space-between; align-items:center; padding: 10px; flex-shrink:0;">
          Adisyon 
          <div style="display:flex; gap:6px;">
            <button onclick="masaTasiAc()" style="background:#3498db; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🔄 Taşı</button>
            <button onclick="masaBirlestirAc()" style="background:#9b59b6; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🤝 Birleştir</button>
            <button onclick="adisyonuTamamenSifirla()" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🗑️ Sıfırla</button>
          </div>
        </h3>
        <div class="adisyon-liste-ici" id="sp-adisyon-liste" style="flex:1; overflow-y:auto; padding: 0 10px;"></div>
      </div>

      <div class="alt-panel" style="padding: 10px; flex-shrink:0;">
        <div class="toplam-satir">
          <span class="toplam-label">Toplam</span>
          <span class="toplam-deger" id="sp-toplam-tutar">0₺</span>
        </div>
        
        <div id="sp-indirim-alani"></div>
        <div id="sp-onay-buton-alani" style="margin-top: 8px;"></div>
        
        <div class="butonlar mobilde-goster" style="margin-top:8px;" id="sp-mobil-odeme-btn-kutu">
          <button class="btn btn-kapat" onclick="odemeAc()" style="width:100%;">💳 Ödeme Al</button>
        </div>
      </div>
    </div>

    <!-- Sütun 3: ÖDEME ALANI (Masaüstünde Gösterilir) -->
    <div class="odeme-sutun desktop-goster sp-sutun-3" id="sp-odeme-sutun" style="padding: 16px; display: flex; flex-direction: column;">
      
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">Parçalı tahsilat için ürün seçebilirsiniz:</div>
      <div style="display:flex; gap:10px; margin-bottom:10px;">
         <button class="tumu-sec-btn" onclick="tumuSec()" style="flex:1;">☑️ Tümünü Seç</button>
         <button class="tumu-sec-btn" onclick="odemeListesiRender()" style="flex:1;">🔄 Seçimi Sıfırla</button>
      </div>
      <div class="odeme-urun-listesi" id="sp-odeme-urun-listesi" style="flex:1; min-height:0; overflow-y:auto; padding-right:5px; margin-bottom:15px;"></div>

      <div class="odeme-alt-bilgi" style="margin-top: auto; padding-top: 15px; border-top:1px solid #334155;">
        <div class="odeme-satir"><span>Ara Toplam:</span><span id="sp-ode-toplam">0₺</span></div>
        <div class="odeme-satir" style="color:#ef4444;"><span>İndirim:</span><span id="sp-ode-indirim">0₺</span></div>
        <div class="odeme-satir odeme-net"><span>Kalan Ödenecek:</span><span id="sp-ode-kalan">0₺</span></div>
      </div>

      <div class="odeme-butonlar" style="margin-top: 15px;">
        <button class="btn btn-iptal" style="width:100%; border:1px solid #334155; margin-bottom:10px; padding:15px; font-weight:bold; font-size:15px;" onclick="indirimAc()">İndirim Yap</button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-onayla" style="flex:1; padding:20px 10px; font-weight:800; font-size:16px; border-radius:12px;" onclick="odemeYontemSec(this, 'nakit')">💵 Nakit</button>
          <button class="btn btn-kapat" style="flex:1; padding:20px 10px; font-weight:800; font-size:16px; border-radius:12px; background:#3b82f6;" onclick="odemeYontemSec(this, 'kart')">💳 Kart</button>
        </div>
      </div>

    </div>

  </div>
</div>
<!-- HIZLI SATIŞ SAYFASI -->`;

if(panelHtmlRegex.test(html)){
   html = html.replace(panelHtmlRegex, newPanelHtml);
   console.log("Replaced HTML skeleton successfully.");
} else {
   console.log("Could not find HTML skeleton regex!");
}

// 2. CSS STYLES FOR THE 3 COLUMNS AND MOBILE
const newCss = `
    /* ===== STATIK 3 SUTUN DUZENI ===== */
    .siparis-panel {
       display: none;
    }
    .siparis-panel.aktif {
       display: flex; /* Masa tıklandığında gösterilir */
    }
    .sp-sutun-1 { flex: 1.1; }
    .sp-sutun-2 { flex: 1.1; }
    .sp-sutun-3 { flex: 1.1; background: #0f172A; }
    
    @media (min-width: 901px) {
      #sayfa-garson { flex-direction: row; }
      .sp-uclu-duzen { display: flex !important; flex-direction: row !important; }
      .sp-sutun-1 { border-right: 2px solid #334155; }
      .sp-sutun-2 { border-right: 2px solid #334155; }
      .desktop-goster { display: flex !important; }
      .mobilde-goster { display: none !important; }
    }
    @media (max-width: 900px) {
      .sp-uclu-duzen { display: flex !important; flex-direction: column !important; overflow-y:auto; }
      .desktop-goster { display: none !important; }
      .adisyon { height: auto !important; min-height: 10vh !important; max-height: 45vh !important; }
    }
`;
html = html.replace('</style>', newCss + '\n</style>');

// 3. REWRITE panelRender LOGIC
const jsStart = html.indexOf('function panelRender() {');
const jsEnd = html.indexOf('function kategoriSec(k)');

const newPanelRender = `function panelRender() {
    const bosDurum = document.getElementById('sp-bos-durum');
    const doluDurum = document.getElementById('sp-dolu-durum');
    
    if (!seciliMasa) {
      bosDurum.style.display = 'flex';
      doluDurum.style.display = 'none';
      document.querySelector('.siparis-panel').style.display = 'none';
      return;
    }
    
    // Panel aktif
    document.querySelector('.siparis-panel').style.display = 'flex';
    document.querySelector('.siparis-panel').classList.add('aktif');
    bosDurum.style.display = 'none';
    doluDurum.style.display = 'flex';

    if(!window._odemeAdetlerSetEdildi && masalar[seciliMasa]) {
        odemeAdetler = masalar[seciliMasa].adisyon.map(() => 0);
        window._odemeAdetlerSetEdildi = true;
    }

    const masa = masalar[seciliMasa];
    const masaIsim = masa.isim || \`Masa \${seciliMasa}\`;
    const toplam = masa.adisyon.reduce((s,u) => s + birimFiyat(u)*u.adet, 0);
    const indirim = masa.indirim || 0;

    document.getElementById('sp-masa-isim').textContent = masaIsim;
    document.getElementById('sp-toplam-tutar').textContent = toplam + '₺';

    // Kategoriler ve urunler
    const kategoriler = Object.keys(menu).map(k =>
      \`<button class="kat-sidebar-btn \${k===aktifKategori?'aktif':''}" onclick="kategoriSec('\${k.replace(/'/g,"\\\\'")}')">
        <span>\${k}</span><span class="kat-ok">›</span>
      </button>\`
    ).join('');
    document.getElementById('sp-kat-sidebar').innerHTML = kategoriler;

    const urunler = (menu[aktifKategori] || []).map(u =>
      \`<div class="urun-satir" onclick="urunTikla('\${u.ad.replace(/'/g,"\\\\'")}',\${u.fiyat})">
        <span class="us-ad">\${u.ad}</span>
        <span class="us-fiyat">\${u.fiyat}₺</span>
      </div>\`
    ).join('');
    
    const urunPanel = document.getElementById('sp-urun-panel');
    const scroll = urunPanel.scrollTop;
    urunPanel.innerHTML = urunler;
    urunPanel.scrollTop = scroll; // scrolu koru

    // Adisyon 
    const adisyonlar = masa.adisyon.length === 0
      ? \`<div class="bos-adisyon">Henüz sipariş yok</div>\`
      : masa.adisyon.map((u,i) => {
          const bp = birimFiyat(u);
          const ekstraMetin = (u.ekstralar||[]).map(e=>e.ad).join(', ');
          const yAdet = u.yazdirilanAdet || 0;
          const beklemeAdet = u.adet - yAdet;
          const stil = beklemeAdet > 0 ? 'border-left: 4px solid #f39c12; background: rgba(243,156,18,0.1);' : '';
          return \`<div class="adisyon-item" style="\${stil}">
            <div class="urun-adi">
              \${u.ad}
              \${ekstraMetin ? \`<div style="font-size:10px;color:#f97316;margin-top:2px;">+ \${ekstraMetin}</div>\` : ''}
              \${beklemeAdet > 0 ? \`<div style="font-size:10px;color:#f39c12;margin-top:2px;font-weight:bold;">\${beklemeAdet} Adet Onay Bekliyor</div>\` : ''}
            </div>
            <div class="adet-ctrl">
              <button onclick="adetDusur(\${i})">−</button>
              <span>\${u.adet}</span>
              <button onclick="adetArttir(\${i})">+</button>
            </div>
            <div class="fiyat">\${bp*u.adet}₺</div>
          </div>\`;
        }).join('');
    document.getElementById('sp-adisyon-liste').innerHTML = adisyonlar;

    // Alt Panel (Indirim + SiparisGonder / Kaydet)
    if (indirim > 0) {
        document.getElementById('sp-indirim-alani').innerHTML = \`<div class="toplam-satir" style="color:#ef4444;font-size:12px;"><span>İndirim</span><span>-\${indirim}₺</span></div>
            <div class="toplam-satir"><span class="toplam-label" style="font-weight:bold;">Net Toplam</span><span class="toplam-deger" style="color:#22c55e;">\${Math.max(0,toplam-indirim)}₺</span></div>\`;
    } else {
        document.getElementById('sp-indirim-alani').innerHTML = '';
    }

    const gonderilecekVarMi = masa.adisyon.some(u => u.adet > (u.yazdirilanAdet || 0));
    if (gonderilecekVarMi) {
        document.getElementById('sp-onay-buton-alani').innerHTML = \`<button class="btn btn-onayla" style="width:100%; border-radius: 8px; font-weight: bold; background-color: #f39c12; border: none; color: white; padding: 12px; font-size: 14px;" onclick="siparisiGonder()">🚀 Yeni Eklenenleri Yazdır & Masayı Kaydet</button>\`;
    } else if (JSON.stringify(masa.adisyon) !== JSON.stringify(window._seciliMasaYedekAdisyon || [])) {
        document.getElementById('sp-onay-buton-alani').innerHTML = \`<button class="btn btn-onayla" style="width:100%; border-radius: 8px; font-weight: bold; background-color: #e74c3c; border: none; color: white; padding: 12px; font-size: 14px;" onclick="siparisiKaydet()">💾 Tablodan Silinenleri Onayla (Kaydet)</button>\`;
    } else {
        document.getElementById('sp-onay-buton-alani').innerHTML = '';
    }

    const btnKutu = document.getElementById('sp-mobil-odeme-btn-kutu');
    if(btnKutu) btnKutu.style.display = (!yoneticiModu && !garsonIzinler.odemeAl) ? 'none' : 'block';

    // Masaustunde oduyorsak cift baslik atar, hep calissin
    if (window.innerWidth > 900) { document.getElementById('sp-odeme-sutun').style.display='flex'; } else { document.getElementById('sp-odeme-sutun').style.display='none'; }
    if (!yoneticiModu && !garsonIzinler.odemeAl) document.getElementById('sp-odeme-sutun').style.display='none';
    
    _odemeRender(); // Hem masaustunu hem pop-up'i besler
  }
  
  `;

if (jsStart !== -1 && jsEnd !== -1) {
    html = html.substring(0, jsStart) + newPanelRender + html.substring(jsEnd);
    console.log("panelRender logic cleanly refactored.");
}

// 4. MULTI-TARGET EXPORTING IN _odemeRender
const renderTargetRegex = /function _odemeRender\(\) \{[\s\S]*?document\.getElementById\('odeme-liste'\)\.innerHTML = listHtml;[\s\S]*?\}/;

if(renderTargetRegex.test(html)) {
   html = html.replace(renderTargetRegex, (match) => {
       let rep = match;
       // Add dual rendering wrappers instead of direct calls
       rep = rep.replace("document.getElementById('odeme-masa-adi').textContent = masaIsim;", "if(document.getElementById('odeme-masa-adi')) document.getElementById('odeme-masa-adi').textContent = masaIsim;");
       rep = rep.replace("document.getElementById('odeme-toplam').textContent = toplam + '₺';", "if(document.getElementById('odeme-toplam')) document.getElementById('odeme-toplam').textContent = toplam + '₺';\n    if(document.getElementById('sp-ode-toplam')) document.getElementById('sp-ode-toplam').textContent = toplam + '₺';");
       rep = rep.replace("document.getElementById('odeme-indirim-tutar').textContent = masaIndirim + '₺';", "if(document.getElementById('odeme-indirim-tutar')) document.getElementById('odeme-indirim-tutar').textContent = masaIndirim + '₺';\n    if(document.getElementById('sp-ode-indirim')) document.getElementById('sp-ode-indirim').textContent = masaIndirim + '₺';");
       rep = rep.replace("document.getElementById('odeme-indirimli').textContent = odenmesiGereken + '₺';", "if(document.getElementById('odeme-indirimli')) document.getElementById('odeme-indirimli').textContent = odenmesiGereken + '₺';\n    if(document.getElementById('sp-ode-kalan')) document.getElementById('sp-ode-kalan').textContent = odenmesiGereken + '₺';");
       rep = rep.replace("document.getElementById('odeme-liste').innerHTML = listHtml;", "if(document.getElementById('odeme-urun-listesi')) document.getElementById('odeme-urun-listesi').innerHTML = listHtml;\n    if(document.getElementById('sp-odeme-urun-listesi')) document.getElementById('sp-odeme-urun-listesi').innerHTML = listHtml;");
       return rep;
   });
   console.log("Dual targeted _odemeRender correctly.");
}

// Write the file locally
fs.writeFileSync('index.html', html, 'utf8');
console.log("Local 3-column static architectural transition complete.");
