const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Adisyon basligi yanina SIFIRLA butonu ekle
const regexAdisyonTitle = /\<h3\>Adisyon\<\/h3\>/;
const replacementAdisyonTitle = `<h3 style="display:flex; justify-content:space-between; align-items:center;">Adisyon <button onclick="adisyonuTamamenSifirla()" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">🗑️ Masayı Komple Sıfırla</button></h3>`;

if (regexAdisyonTitle.test(code)) {
    code = code.replace(regexAdisyonTitle, replacementAdisyonTitle);
    console.log("Adisyon title replaced");
}

const adisyonTamamenSifirlaFunc = `
  function adisyonuTamamenSifirla() {
    if (!seciliMasa) return;
    if (!confirm('DİKKAT: Bu masadaki tüm içerik (varsa eski siparişler dâhil) KALICI OLARAK silinecektir! Onaylıyor musunuz?')) return;
    masalar[seciliMasa].adisyon = [];
    masalar[seciliMasa].acilisZamani = null;
    masalar[seciliMasa].indirim = 0;
    window._seciliMasaYedekAdisyon = null; 
    masalariKaydet();
    masaRender();
    panelKapat();
    bildirimGoster('Masa veritabanından tamamen sıfırlandı.', '#e74c3c');
  }
`;

if (!code.includes('adisyonuTamamenSifirla() {')) {
    code = code.replace("function adisyonTemizle() {", adisyonTamamenSifirlaFunc + "\n  function adisyonTemizle() {");
    console.log("Function added");
}

fs.writeFileSync('index.html', code, 'utf8');
console.log('Done');
