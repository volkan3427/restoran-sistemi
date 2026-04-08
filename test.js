const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');
const str = code.substring(code.indexOf('const gonderilecekVarMi'), code.indexOf('<div class="butonlar">') + 20);
fs.writeFileSync('temp.txt', str);
