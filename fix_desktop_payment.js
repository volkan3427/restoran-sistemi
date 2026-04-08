const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the ID of the payment container so the desktop logic can find it!
html = html.replace('id="odeme-modal">\n  <div class="modal">', 'id="odeme-modal">\n  <div class="modal" id="hareketli-odeme-alani">');
// Handle possible \r\n
html = html.replace('id="odeme-modal">\r\n  <div class="modal">', 'id="odeme-modal">\r\n  <div class="modal" id="hareketli-odeme-alani">');

console.log("Fixed element ID for moving payment pane.");

// 2. Eradicate "Salon/Deck/Bahçe" from masaRender()
const regexMasa = /function masaRender\(\) \{[\s\S]*?document\.getElementById\('bos-sayi'\)\.textContent = bos;[\s\S]*?\}/;

const cleanMasaRender = `function masaRender() {
    const grid = document.getElementById('masa-grid');
    grid.innerHTML = '';
    let bos = 0, dolu = 0;

    masaNoları.forEach(i => {
       const masa = masalar[i];
       const doluMu = masa.adisyon && masa.adisyon.length > 0;
       if (doluMu) dolu++; else bos++;

       const btn = document.createElement('div');
       btn.className = \`masa-btn \${doluMu ? 'dolu' : 'bos'}\`;
       if(seciliMasa === i) btn.classList.add('aktif');
       btn.onclick = () => masaSec(i);

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
           icerik += \`<div class="masa-tutar">Adet: \${urunSayisi}</div>
           \${isGece ? '<div style="position:absolute; top:2px; right:2px; font-size:12px;">🌙</div>' : ''}
           \${!tumuYazdirildi ? '<div class="gonder-pulse" style="position:absolute; top:20px; right:2px; font-size:12px;" title="Gönderilmemiş Ürün Var">⚠️</div>' : ''}
           </div>\`;
       }
       btn.innerHTML = icerik;
       grid.appendChild(btn);
    });

    document.getElementById('bos-sayi').textContent = bos;
    document.getElementById('dolu-sayi').textContent = dolu;
}`;

if (regexMasa.test(html)) {
    html = html.replace(regexMasa, cleanMasaRender);
    console.log("Removed table floor groups completely.");
} else {
    console.log("Could not match masaRender regex!");
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("All fixes applied successfully.");
