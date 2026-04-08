const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /function kayitlariAl\(\) \{\s*try \{\s*const parsed = JSON\.parse\(localStorage\.getItem\('restoran_kayitlar'\) \|\| '\[\]'\);\s*const imzaSet = new Set\(\);\s*return parsed\.filter\(k => \{\s*const imza = JSON\.stringify\(k\);\s*if \(imzaSet\.has\(imza\)\) return false;\s*imzaSet\.add\(imza\);\s*return true;\s*\}\);\s*\} catch\(e\) \{ return \[\]; \}\s*\}/m;

const replacement = `function kayitlariAl() {
    try {
      const parsed = JSON.parse(localStorage.getItem('restoran_kayitlar') || '[]');
      const imzaSet = new Set();
      return parsed.filter(k => {
        const urunSayisi = k.urunler ? k.urunler.length : 0;
        const odenen = k.odenenToplam || 0;
        const imza = \`\${k.tarih}_\${k.saat}_\${k.masaNo}_\${odenen}_\${urunSayisi}\`;
        if (imzaSet.has(imza)) return false;
        imzaSet.add(imza);
        return true;
      });
    } catch(e) { return []; }
  }`;

if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("SUCCESS");
} else {
    // If it doesn't match precisely, find function kayitlariAl() {
    const idx = html.indexOf('function kayitlariAl() {');
    if (idx !== -1) {
        const endIdx = html.indexOf('}', html.indexOf('return []', idx)) + 4;
        html = html.substring(0, idx) + replacement + html.substring(endIdx);
        fs.writeFileSync('index.html', html, 'utf8');
        console.log("REPLACED BY INDEX");
    } else {
        console.log("NOT FOUND");
    }
}
