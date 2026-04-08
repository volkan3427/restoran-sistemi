const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix 1: odemeOnay
html = html.replace('odenenToplam += u.fiyat * secAdet;', 'odenenToplam += birimFiyat(u) * secAdet;');
console.log('Fix 1 applied');

// Fix 2: hizliOdemeOnay
html = html.replace(/urunler: hizliAdisyon\.map\(u => \(\{ad:u\.ad, fiyat:birimFiyat\(u\)/g, 'urunler: hizliAdisyon.map(u => ({ad:u.ad, fiyat:u.fiyat');
console.log('Fix 2 applied');

// Fix 3: raporRender fallback
html = html.replace(
    'let buSiparisGeceHesabi = 0;',
    'let buSiparisGeceHesabi = 0;\n      const siparisSaatiGeceMi = (k.saat >= "00:00" && k.saat <= "08:00");'
);
html = html.replace(
    'if (u.isGece && !isTatli) {',
    'if ((u.isGece || siparisSaatiGeceMi) && !isTatli) {'
);
console.log('Fix 3 applied');

// Fix 4: Inject Debug Box
const debugHtml = `      <div style="margin-top: 20px; background: #334155; padding: 15px; border-radius: 8px;">
        <h4 style="color:#f8fafc; margin-bottom:10px;">🔍 TEKNİK VERİ ANALİZİ</h4>
        <p style="color:#cbd5e1; font-size:12px; margin-bottom: 5px;">Aşağıda bu döneme ait en yüksek tutarlı 5 satış kopyası listelenmiştir. Lütfen bana listeyi iletin:</p>
        <ul style="color:#f97316; font-size: 13px; font-family: monospace;">
          \${
             [...filtreli]
               .sort((a,b) => (b.odenenToplam||0) - (a.odenenToplam||0))
               .slice(0, 5)
               .map(k => \`<li>\${k.tarih} \${k.saat} | Masa:\${k.masaNo||'Paket'} | Tutar:\${k.odenenToplam}₺ | Ürün Adedi:\${k.urunler?k.urunler.length:0}</li>\`)
               .join('')
          }
        </ul>
        <div style="margin-top:10px; color:#22c55e; font-weight:bold; font-size: 14px;">Toplam Kayıt: \${filtreli.length}</div>
      </div>
    </div>`;

html = html.replace('</div>\n    <div class="ozet-kutu" style="background:#fce7f3', '</div>\n        <div class="ozet-kutu" style="background:#fce7f3'); // Just normalization
html = html.replace(
    '<div class="oz-label" style="color:#be185d;">🌙 Arkadaş Payı</div>\n          <div class="oz-deger" style="color:#be185d;">${geceCirosu.toFixed(2)}₺</div>\n        </div>\n      </div>',
    '<div class="oz-label" style="color:#be185d;">🌙 Arkadaş Payı</div>\n          <div class="oz-deger" style="color:#be185d;">${geceCirosu.toFixed(2)}₺</div>\n        </div>\n      </div>\n' + debugHtml
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('All fixes applied successfully');
