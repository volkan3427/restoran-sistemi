const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('function masaRender() {');
const endIdx = html.indexOf('function gecenSure(zaman) {');

if (startIdx !== -1 && endIdx !== -1) {
    const newFn = `function masaRender() {
    const grid = document.getElementById('masa-grid');
    grid.innerHTML = '';
    let bos = 0, dolu = 0;

    const gruplar = {
       'Salon': [],
       'Deck': [],
       'Bahçe': [],
       'Diğer Masalar': []
    };

    masaNoları.forEach(i => {
       const masa = masalar[i];
       const isim = (masa.isim || \`M\${i}\`).trim();
       const basHarf = isim.charAt(0).toLowerCase();
       
       if (basHarf === 's' || basHarf === 'ş') gruplar['Salon'].push(i);
       else if (basHarf === 'd' || basHarf === 'v') gruplar['Deck'].push(i);
       else if (basHarf === 'b') gruplar['Bahçe'].push(i);
       else gruplar['Diğer Masalar'].push(i);
    });

    Object.keys(gruplar).forEach(grupAdi => {
       if (gruplar[grupAdi].length === 0) return;
       
       const baslik = document.createElement('div');
       baslik.style.gridColumn = '1 / -1';
       baslik.style.color = '#f97316';
       baslik.style.fontSize = '14px';
       baslik.style.fontWeight = 'bold';
       baslik.style.borderBottom = '1px solid #334155';
       baslik.style.paddingBottom = '6px';
       baslik.style.paddingTop = '10px';
       baslik.style.marginTop = '6px';
       baslik.style.textTransform = 'uppercase';
       baslik.style.letterSpacing = '1px';
       baslik.textContent = grupAdi;
       grid.appendChild(baslik);

       gruplar[grupAdi].forEach(i => {
          const masa = masalar[i];
          const doluMu = masa.adisyon && masa.adisyon.length > 0;
          if (doluMu) dolu++; else bos++;
          
          const div = document.createElement('div');
          div.className = \`masa-btn \${doluMu?'dolu':'bos'} \${seciliMasa===i?'secili':''}\`;
          
          const urunSayisi = doluMu ? masa.adisyon.reduce((s, u) => s + (u.adet||1), 0) : 0;
          let icerik = \`<div>\${masa.isim || ('Masa ' + i)}</div>\`;
          
          if (doluMu) {
              const yAdet = masa.adisyon.reduce((s, u) => s + (u.yazdirilanAdet || 0), 0);
              const isGece = masa.adisyon.some(u => u.isGece);
              const tumuYazdirildi = yAdet === urunSayisi;
              const saatFmt = saatFormatla(new Date(masa.acilisZamani));
              const isPaket = (masa.isim || "").toLowerCase().includes('paket');
              
              icerik += \`<div class="masa-alt-bilgi">\`;
              if(!isPaket) icerik += \`<div class="masa-sure" style="color:\${masaSureRenk(masa.acilisZamani)}">⏳ \${saatFmt}</div>\`;
              icerik += \`<div class="masa-tutar">Adet: \${urunSayisi}</div>\`;
              if(isGece) icerik += \`<div style="position:absolute; top:2px; right:2px; font-size:12px;">🌙</div>\`;
              if(!tumuYazdirildi) icerik += \`<div class="gonder-pulse" style="position:absolute; top:20px; right:2px; font-size:12px;" title="Gönderilmemiş Ürün Var">⚠️</div>\`;
              icerik += \`</div>\`;
          }
          div.innerHTML = icerik;
          div.onclick = () => masaSec(i);
          grid.appendChild(div);
       });
    });

    const b = document.getElementById('bos-sayi');
    if(b) b.textContent = bos;
    const d = document.getElementById('dolu-sayi');
    if(d) d.textContent = dolu;
  }

  `;
    html = html.substring(0, startIdx) + newFn + html.substring(endIdx);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Successfully rebuilt user's preferred grouped layout with the compact masa-btn css!");
} else {
    console.log("Failed to find masaRender");
}
