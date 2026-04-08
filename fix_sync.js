const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add var declaration at the top level
if(!html.includes('window._cevrimdisiDegisiklikVar')) {
    html = html.replace('let seciliOdemeYontemi = \'nakit\';', 'let seciliOdemeYontemi = \'nakit\';\n  window._cevrimdisiDegisiklikVar = false;');
}

// 2. Modify firebaseGonder to detect failures
const targetGonder = 
`  async function firebaseGonder(yol, veri) {
    if (!firebaseUrl) return;
    try {
      await fetch(\`\${firebaseUrl}/\${yol}.json\`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(veri)
      });
    } catch(e) {}
  }`;

const replacementGonder = 
`  async function firebaseGonder(yol, veri) {
    if (!firebaseUrl) return;
    try {
      await fetch(\`\${firebaseUrl}/\${yol}.json\`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(veri)
      });
    } catch(e) {
      if (!navigator.onLine) {
        window._cevrimdisiDegisiklikVar = true;
      }
    }
  }`;

html = html.replace(targetGonder, replacementGonder);

// 3. Modify ortakMasalariCek so it doesn't overwrite if offline changes exist
const targetCek = `    if (Date.now() - window._sonMasaYukleme < 4000) return;`;
const replacementCek = `    if (Date.now() - window._sonMasaYukleme < 4000) return;\n    if (window._cevrimdisiDegisiklikVar) return; // Prevent overwriting unsynced offline data`;
html = html.replace(targetCek, replacementCek);

// 4. Update the 'online' event listener
const oldOnline = `window.addEventListener('online', () => {
    const el = document.getElementById('internet-durum');
    if(el) el.style.display = 'none';
    bildirimGoster('Bağlantı tekrar sağlandı! Senkronizasyon aktif.', '#22c55e');
  });`;

const newOnline = `window.addEventListener('online', () => {
    const el = document.getElementById('internet-durum');
    if(el) el.style.display = 'none';
    
    if (window._cevrimdisiDegisiklikVar) {
       bildirimGoster('Bağlantı sağlandı! Çevrimdışı veriler yükleniyor...', '#f39c12');
       firebaseSync();
       setTimeout(() => {
         window._cevrimdisiDegisiklikVar = false;
         bildirimGoster('Çevrimdışı veriler başarıyla eşitlendi!', '#22c55e');
       }, 2000);
    } else {
       bildirimGoster('Bağlantı tekrar sağlandı! Senkronizasyon aktif.', '#22c55e');
    }
  });`;
html = html.replace(oldOnline, newOnline);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Sync fixes applied');
