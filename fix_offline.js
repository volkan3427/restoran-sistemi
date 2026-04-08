const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the siparisSaatiGeceMi logic that was bleeding all items to night shift
html = html.replace('let buSiparisGeceHesabi = 0;\n      const siparisSaatiGeceMi = (k.saat >= "00:00" && k.saat <= "08:00");', 'let buSiparisGeceHesabi = 0;');
html = html.replace('if ((u.isGece || siparisSaatiGeceMi) && !isTatli) {', 'if (u.isGece && !isTatli) {');
console.log('Night ciro fixed');

// 2. Add offline internet warning div
if(!html.includes('id="internet-durum"')) {
    html = html.replace('<body>', '<body>\n<div id="internet-durum" style="display:none; position:fixed; top:0; left:0; width:100%; background:#ef4444; color:#fff; text-align:center; padding:10px; font-size:14px; font-weight:bold; z-index:9999; box-shadow:0 4px 6px rgba(0,0,0,0.3);">⚠️ İNTERNET BAĞLANTISI KOPTU! Şuan çevrimdışı çalışıyorsunuz, veriler kaydediliyor ancak diğer cihazlarla eşitlenmiyor.</div>');
}

// 3. Add event listeners
if(!html.includes("window.addEventListener('offline'")) {
    const scriptTagIndex = html.lastIndexOf('</script>');
    const listeners = `
  window.addEventListener('offline', () => {
    const el = document.getElementById('internet-durum');
    if(el) el.style.display = 'block';
  });
  window.addEventListener('online', () => {
    const el = document.getElementById('internet-durum');
    if(el) el.style.display = 'none';
    bildirimGoster('Bağlantı tekrar sağlandı! Senkronizasyon aktif.', '#22c55e');
  });
`;
    html = html.substring(0, scriptTagIndex) + listeners + '\n' + html.substring(scriptTagIndex);
}
console.log('Offline warning added');

fs.writeFileSync('index.html', html, 'utf8');
console.log('All updates successful!');
