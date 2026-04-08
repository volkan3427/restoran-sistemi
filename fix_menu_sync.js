const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `           for (const kat in menu) { delete menu[kat]; }
           for (const kat in fbMenu) { menu[kat] = fbMenu[kat]; }`;

const replacement = `           // Local menu sýrasını korumak için
           const localKategoriler = Object.keys(menu);
           const fireKategoriler = Object.keys(fbMenu);
           for (const kat in menu) {
             if (!fireKategoriler.includes(kat)) { delete menu[kat]; }
           }
           for (const kat of localKategoriler) {
             if (fireKategoriler.includes(kat)) { menu[kat] = fbMenu[kat]; }
           }
           for (const kat of fireKategoriler) {
             if (!localKategoriler.includes(kat)) { menu[kat] = fbMenu[kat]; }
           }`;

if (!code.includes(target)) {
  console.log("target not found. Windows newline check?");
  const newTarget = target.replace(/\n/g, '\r\n');
  if (code.includes(newTarget)) {
    code = code.split(newTarget).join(replacement.replace(/\n/g, '\r\n'));
    console.log("Used target with CRLF");
  } else {
    console.log("Still not found target");
  }
} else {
  code = code.split(target).join(replacement);
}

fs.writeFileSync('index.html', code, 'utf8');
console.log("Done");
