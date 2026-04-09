const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target1Start = html.indexOf('function _odemeRender() {');
const target1End = html.indexOf('function odemeListesiRender() {');

const newOdemeRender = `function _odemeRender() {
    const masa = masalar[seciliMasa];
    const masaIsim = masa.isim || \`Masa \${seciliMasa}\`;
    const tamToplam = masa.adisyon.reduce((s,u) => s + birimFiyat(u)*u.adet, 0);
    const seciliToplam = masa.adisyon.reduce((s,u,i) => s + birimFiyat(u)*(odemeAdetler[i]||0), 0);
    const kalan = tamToplam - seciliToplam;
    const indirim = masa.indirim || 0;
    const hepsiSecili = kalan === 0;
    const netToplam = hepsiSecili ? Math.max(0, seciliToplam - indirim) : seciliToplam;

    const urunlerHtml = masa.adisyon.map((u, i) => {
      const secili = (odemeAdetler[i]||0) > 0;
      const bp = birimFiyat(u);
      const ekstraMetin = (u.ekstralar||[]).map(e=>e.ad).join(', ');
      return \`
        <div class="odeme-urun-item\${secili ? ' secili' : ''}" id="ou-item-\${i}">
          <div class="ou-adi" onclick="odemeUrunToggle(\${i})">
            \${u.ad}
            \${ekstraMetin ? \`<div style="font-size:10px;color:#f97316;margin-top:2px;">+ \${ekstraMetin}</div>\` : ''}
          </div>
          <div class="ou-stok">/\${u.adet}</div>
          <div class="ou-adet-ctrl">
            <button onclick="odemeAdetDegistir(\${i},-1)">−</button>
            <span id="ou-adet-\${i}">\${odemeAdetler[i]||0}</span>
            <button onclick="odemeAdetDegistir(\${i},+1)">+</button>
          </div>
          <div class="ou-fiyat" id="ou-fiyat-\${i}">\${bp*(odemeAdetler[i]||0)}₺</div>
        </div>\`;
    }).join('');

    // DUAL RENDERING ARCHITECTURE
    if (window.innerWidth > 900) {
        // Desktop - Update static 3rd column
        const uList = document.getElementById('sp-odeme-urun-listesi');
        if(uList) uList.innerHTML = urunlerHtml;
        
        const tToplam = document.getElementById('sp-ode-toplam');
        if(tToplam) tToplam.textContent = netToplam + '₺';
        
        const tIndirim = document.getElementById('sp-ode-indirim');
        if(tIndirim) tIndirim.textContent = (indirim > 0 && hepsiSecili) ? indirim + '₺' : '0₺';
        
        const tKalan = document.getElementById('sp-ode-kalan');
        if(tKalan) tKalan.textContent = kalan > 0 ? \`Masada kalan: \${kalan}₺\` : 'Tüm ürünler ödenecek';
        
    } else {
        // Mobile - Classic sliding panel
        sagPanelAc(\`
          <div class="sag-panel-baslik">
            <button class="sag-panel-geri" onclick="modalKapat()">‹</button>
            <span style="flex:1;font-size:13px;">💳 \${masaIsim}</span>
          </div>
          <div class="sag-panel-icerik">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px 4px;">
              <span style="font-size:11px;color:#94a3b8;">Tıkla seç, + / − ile adet</span>
              <button class="tumu-sec-btn" style="margin:0;padding:5px 10px;font-size:11px;" onclick="tumuSec()">☑️ Tümü</button>
            </div>
            <div class="odeme-urun-listesi" id="odeme-urun-listesi">\${urunlerHtml}</div>
            <div class="odeme-secim-toplam" id="odeme-toplam">\${netToplam}₺</div>
            \${indirim > 0 && hepsiSecili ? \`<div style="text-align:center;font-size:11px;color:#8b5cf6;font-weight:600;">🏷️ \${indirim}₺ indirim uygulandı</div>\` : ''}
            <div class="odeme-secim-info" id="odeme-info">\${kalan > 0 ? \`Masada kalan: \${kalan}₺\` : 'Tüm ürünler ödenecek'}</div>
          </div>
          <div class="sag-panel-alt">
            <button class="btn btn-indirim" style="width: 100%; margin-bottom: 8px; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 8px;" onclick="indirimAc()">🏷️ İndirim Tanımla</button>
            <div class="odeme-yontemleri" style="margin-bottom:0;">
              <button class="odeme-btn\${seciliOdemeYontemi==='nakit'?' secili':''}" onclick="odemeYontemSec(this,'nakit')">💵 Nakit</button>
              <button class="odeme-btn\${seciliOdemeYontemi==='kart'?' secili':''}" onclick="odemeYontemSec(this,'kart')">💳 Kart</button>
            </div>
          </div>
        \`);
    }
  }

  `;

if (target1Start !== -1 && target1End !== -1) {
   html = html.substring(0, target1Start) + newOdemeRender + html.substring(target1End);
   console.log("Successfully replaced _odemeRender for dual targeted support!");
} else {
   console.log("FAILED to find _odemeRender");
}

const target2Start = html.indexOf('function odemeToplamGuncelle() {');
const target2End = html.indexOf('function hizliTemizle() {'); // or something after it

const newOdemeGuncelle = `function odemeToplamGuncelle() {
    if (!seciliMasa) return;
    const masa = masalar[seciliMasa];
    let toplam = 0;
    masa.adisyon.forEach((u, i) => { toplam += birimFiyat(u) * (odemeAdetler[i]||0); });
    const tamToplam = masa.adisyon.reduce((s,u) => s + birimFiyat(u)*u.adet, 0);
    const kalan = tamToplam - toplam;
    const indirim = masa.indirim || 0;
    const hepsiSecili = kalan === 0;
    const netToplam = hepsiSecili ? Math.max(0, toplam - indirim) : toplam;

    // Mobile targets
    const tEl = document.getElementById('odeme-toplam');
    const iEl = document.getElementById('odeme-info');
    if (tEl) tEl.textContent = \`\${netToplam}₺\`;
    if (iEl) iEl.textContent = kalan > 0 ? \`Masada kalan: \${kalan}₺\` : 'Tüm ürünler ödenecek';
    
    // Desktop targets
    const dtEl = document.getElementById('sp-ode-toplam');
    if (dtEl) dtEl.textContent = netToplam + '₺';
    const dIEl = document.getElementById('sp-ode-indirim');
    if (dIEl) dIEl.textContent = (indirim > 0 && hepsiSecili) ? indirim + '₺' : '0₺';
    const dkEl = document.getElementById('sp-ode-kalan');
    if (dkEl) dkEl.textContent = kalan > 0 ? \`Masada kalan: \${kalan}₺\` : 'Tüm ürünler ödenecek';
  }

  `;

  // We should just use regex to replace odemeToplamGuncelle
  const regexGuncelle = /function odemeToplamGuncelle\(\) \{[\s\S]*?if \(iEl\) iEl\.textContent = kalan > 0 \? `Masada kalan: \$\{kalan\}₺` : 'Tüm ürünler ödenecek';\s*\}/;
  if(regexGuncelle.test(html)) {
      html = html.replace(regexGuncelle, newOdemeGuncelle);
      console.log("Successfully replaced odemeToplamGuncelle!");
  } else {
      console.log("FAILED to replace odemeToplamGuncelle");
  }

fs.writeFileSync('index.html', html, 'utf8');
