const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /async function menuYukleVeBirlestir\(\) \{[\s\S]*?menuFirebaseSync\(\);\r?\n  \}/;

const replacement = `async function menuYukleVeBirlestir() {
    if (!firebaseUrl) return;
    try {
      const r = await fetch(\`\${firebaseUrl}/menu.json\`);
      if (r.ok) {
        const fbMenu = await r.json();
        if (fbMenu && Object.keys(fbMenu).length > 0) {
           for (const kat in menu) { delete menu[kat]; }
           for (const kat in fbMenu) { menu[kat] = fbMenu[kat]; }
           
           if (document.getElementById('sayfa-hizli') && document.getElementById('sayfa-hizli').classList.contains('aktif')) {
               hizliSayfaRender();
           }
           if (document.getElementById('menu-yonetim-modal') && document.getElementById('menu-yonetim-modal').classList.contains('aktif')) {
               const aktifKatBtn = document.querySelector('.menu-kat-btn.aktif');
               if (aktifKatBtn) {
                   menuKatSec(aktifKatBtn.textContent);
               } else {
                   const ilkKat = Object.keys(menu)[0];
                   if (ilkKat) menuKatSec(ilkKat);
               }
           }
           if (typeof seciliMasa !== 'undefined' && seciliMasa) panelRender();
           
           return;
        }
      }
    } catch(e){}
    menuFirebaseSync();
  }`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log('Success');
} else {
    console.log('Regex un-matched');
}
