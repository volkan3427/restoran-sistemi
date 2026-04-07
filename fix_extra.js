const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /masalariKaydet\(\);\s*panelRender\(\);\s*bildirimGoster\(\`\+ \$\{extraAd\} Eklendi\`, '#f97316'\);\s*\}/g;
const matchCount = (code.match(regex) || []).length;

if (matchCount > 0) {
    code = code.replace(regex, `// masalariKaydet();\n    panelRender();\n    bildirimGoster(\`+ \${extraAd} Eklendi\`, '#f97316');\n  }`);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log('Success, replaced ' + matchCount + ' occurrences.');
} else {
    console.log('Regex un-matched');
}
