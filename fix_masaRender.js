const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function masaRender() {');
const endIdx = html.indexOf('function gecenSure(zaman) {');

if (startIdx !== -1 && endIdx !== -1) {
    const oldFn = html.substring(startIdx, endIdx);
    
    const newFn = `function masaRender() {
    const grid = document.getElementById('masa-grid');
    grid.innerHTML = '';
    let bos = 0, dolu = 0;

    masaNoları.forEach(i => {
       const masa = masalar[i];
       const doluMu = masa.adisyon && masa.adisyon.length > 0;
       if (doluMu) dolu++; else bos++;

       const topDiv = document.createElement('div');
       topDiv.className = \`masa \${doluMu ? 'dolu' : 'bos'} \${seciliMasa === i ? 'secili' : ''}\`;
       topDiv.onclick = () => masaSec(i);

       const urunSayisi = doluMu ? masa.adisyon.reduce((s, u) => s + (u.adet||1), 0) : 0;
       
       let htmlStr = \`
          <div class="masa-baslik">\${masa.isim || ('Masa ' + i)}</div>
       \`;

       if (doluMu) {
          const sure = masa.acilisZamani ? gecenSure(masa.acilisZamani) : '';
          const renk = masa.acilisZamani ? masaSureRenk(masa.acilisZamani) : '#22c55e';
          const toplam = masa.adisyon.reduce((s, u) => s + birimFiyat(u) * u.adet, 0);
          const yAdet = masa.adisyon.reduce((s, u) => s + (u.yazdirilanAdet || 0), 0);
          const isGece = masa.adisyon.some(u => u.isGece);
          const tumuYazdirildi = (yAdet === urunSayisi);
          const isPaket = (masa.isim || "").toLowerCase().includes('paket');

          htmlStr += \`
            \${!isPaket ? \`<div class="masa-sure" style="color:\${renk}">⏳ \${sure}</div>\` : ''}
            <div class="masa-tutar">\${toplam}₺</div>
            \${isGece ? '<div style="position:absolute; top:4px; right:4px; font-size:14px;" title="Gece İşlemi">🌙</div>' : ''}
            \${!tumuYazdirildi ? '<div class="gonder-pulse" style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); font-size:16px;" title="Gönderilmemiş Ürün Var">⚠️</div>' : ''}
          \`;
       } else {
          htmlStr += \`<div class="masa-tutar" style="color:#94a3b8; font-size:11px;">Masa Boş</div>\`;
       }
       
       topDiv.innerHTML = htmlStr;
       grid.appendChild(topDiv);
    });

    document.getElementById('bos-sayi').textContent = bos;
    document.getElementById('dolu-sayi').textContent = dolu;
  }

  `;
    html = html.substring(0, startIdx) + newFn + html.substring(endIdx);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("masaRender successfully replaced to remove groups.");
} else {
    console.log("Could not find masaRender boundaries!");
}
