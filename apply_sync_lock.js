const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace catch(e) {} in firebaseGonder with offline detection flag
const regex1 = /async function firebaseGonder\(yol, veri\) \{[\s\S]*?body: JSON\.stringify\(veri\)[\s\S]*?\}\);[\s\S]*?\} catch\(e\) \{\}/;
if (regex1.test(html)) {
    html = html.replace(regex1, (match) => {
        return match.replace("catch(e) {}", "catch(e) { window._cevrimdisiDegisiklikVar = true; }");
    });
    console.log("firebaseGonder updated.");
} else {
    console.log("Could not find firebaseGonder target!");
}

// Inject sync lock into ortakMasalariCek
const regex2 = /async function ortakMasalariCek\(\)\s*\{\s*if\s*\(\!firebaseUrl\)\s*return;/;
if (regex2.test(html)) {
    html = html.replace(regex2, 'async function ortakMasalariCek() {\n    if (!firebaseUrl) return;\n    if (window._cevrimdisiDegisiklikVar) return; // Cevrimdisi degisiklik varsa ezme kilitlenir');
    console.log("ortakMasalariCek updated.");
} else {
    console.log("Could not find ortakMasalariCek target!");
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Done.");
