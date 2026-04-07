const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. panelRender içine degisiklikVarMi hesabını ve siparisiKaydet butonunu ekleyelim
const regexGonderBtn = /\$\{gonderilecekVarMi \? `\<button class="btn btn-onayla" style="width:100\%; margin-bottom: 8px; border-radius: 8px; font-weight: bold; background-color: #f39c12; border: 1px solid #d68910; color: white; padding: 12px; font-size: 14px;" onclick="siparisiGonder\(\)"\>🚀 Seçili Ürünleri Adisyona Ekle & Yazdır\<\/button\>` : ''\}/;

const btnString = "${gonderilecekVarMi ? `<button class=\"btn btn-onayla\" style=\"width:100%; margin-bottom: 8px; border-radius: 8px; font-weight: bold; background-color: #f39c12; border: 1px solid #d68910; color: white; padding: 12px; font-size: 14px;\" onclick=\"siparisiGonder()\">🚀 Yeni Eklenenleri Yazdır & Masayı Kaydet</button>` : (JSON.stringify(masa.adisyon) !== JSON.stringify(window._seciliMasaYedekAdisyon || []) ? `<button class=\"btn btn-onayla\" style=\"width:100%; margin-bottom: 8px; border-radius: 8px; font-weight: bold; background-color: #e74c3c; border: 1px solid #c0392b; color: white; padding: 12px; font-size: 14px;\" onclick=\"siparisiKaydet()\">💾 Tablodan Silinenleri Onayla (Kaydet)</button>` : '')}";

if (regexGonderBtn.test(code)) {
    code = code.replace(regexGonderBtn, btnString);
    console.log("Button regex matched and replaced.");
} else {
    console.log("Button regex NOT matched.");
}

// 2. siparisiGonder() fonksiyonundan hemen sonra siparisiKaydet() fonksiyonunu ekle
const regexGonderFunc = /(function siparisiGonder\(\) \{[\s\S]*?bildirimGoster\('Masa güncellendi', '#27ae60'\);\r?\n    \}\r?\n  \})/;

const t = "\n\n  function siparisiKaydet() {\n    if (!seciliMasa) return;\n    window._seciliMasaYedekAdisyon = null;\n    masalariKaydet();\n    panelKapat();\n    bildirimGoster('Masa güncellendi, silinenler kaldırıldı', '#27ae60');\n  }";

if (regexGonderFunc.test(code)) {
    code = code.replace(regexGonderFunc, "$1" + t);
    console.log("Function regex matched and added.");
} else {
    console.log("Function regex NOT matched.");
}

// 3. ortakMasalariCek içindeki üstüne yazma korumasını ekle
const regexOrtakMasalar = /if \(yeniJson !== mevcutJson && yeniJson !== _sonOrtakMasalarDegisikligi\) \{\s*masalar = data;/;
const replacementOrtakMasalar = `if (yeniJson !== mevcutJson && yeniJson !== _sonOrtakMasalarDegisikligi) {
        if (seciliMasa && data[seciliMasa]) {
            data[seciliMasa].adisyon = Object.assign([], masalar[seciliMasa].adisyon);
            data[seciliMasa].acilisZamani = masalar[seciliMasa].acilisZamani;
            data[seciliMasa].isim = masalar[seciliMasa].isim;
        }
        masalar = data;`;

if (regexOrtakMasalar.test(code)) {
    code = code.replace(regexOrtakMasalar, replacementOrtakMasalar);
    console.log("Ortak masalar regex matched and replaced.");
} else {
    console.log("Ortak masalar regex NOT matched.");
}


fs.writeFileSync('index.html', code, 'utf8');
console.log('Script completed.');
