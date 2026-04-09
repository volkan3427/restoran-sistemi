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
          const toplam = doluMu ? masa.adisyon.reduce((s,u) => s + birimFiyat(u) * u.adet, 0) : 0;
          const sure = masa.acilisZamani ? gecenSure(masa.acilisZamani) : '';
          const renk = doluMu && masa.acilisZamani ? masaSureRenk(masa.acilisZamani) : '#22c55e';
          
          const div = document.createElement('div');
          div.className = \`masa \${doluMu?'dolu':'bos'} \${seciliMasa===i?'secili':''}\`;
          if (doluMu) div.style.background = renk;
          const isim = masa.isim || \`M\${i}\`;
          div.innerHTML = \`
            <div class="masa-no">\${isim}</div>
            \${doluMu
              ? \`<div class="masa-sure">\${sure}</div><div class="masa-toplam">\${toplam}₺</div>\`
              : '<div class="masa-sure">Boş</div>'}
          \`;
          div.onclick = () => masaSec(i);
          grid.appendChild(div);
       });
    });

    const bs = document.getElementById('bos-say');
    if(bs) bs.textContent = \`Boş: \${bos}\`; else if(document.getElementById('bos-sayi')) document.getElementById('bos-sayi').textContent = bos;
    const ds = document.getElementById('dolu-say');
    if(ds) ds.textContent = \`Dolu: \${dolu}\`; else if(document.getElementById('dolu-sayi')) document.getElementById('dolu-sayi').textContent = dolu;
  }

  `;
    html = html.substring(0, startIdx) + newFn + html.substring(endIdx);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Fixed the original massive green square layout!");
}
