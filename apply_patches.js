const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// PATCH 1: urunEkle kategori
const patch1Target = /masa\.adisyon\[mevcutIndex\]\.adet\+\+;\s*sonDuzenlenenIndex = mevcutIndex;\s*\} else \{\s*masa\.adisyon\.push\(\{ad, fiyat, adet:1, ekstralar: ekstralar\|\|\[\], yazdirilanAdet: 0, isGece\}\);/m;
const patch1Repl = `masa.adisyon[mevcutIndex].adet++;
      sonDuzenlenenIndex = mevcutIndex;
    } else {
      masa.adisyon.push({ad, fiyat, adet:1, ekstralar: ekstralar||[], yazdirilanAdet: 0, isGece, kategori: aktifMenuKat});`;

if (code.match(patch1Target)) {
  code = code.replace(patch1Target, patch1Repl);
  console.log("Applied Patch 1");
} else console.log("Failed Patch 1");

// PATCH 2: raporRender tatlilar
const patch2Target = /let buSiparisGeceHesabi = 0;\s*\(k\.urunler \|\| \[\]\)\.forEach\(u => \{\s*if \(u\.isGece\) \{\s*const bFiyat = u\.fiyat \+ \(u\.ekstralar\|\|\[\]\)\.reduce\(\(ms,e\)=>ms\+e\.fiyat, 0\);\s*buSiparisGeceHesabi \+= bFiyat \* \(u\.adet \|\| 1\);\s*\}\s*\}\);/m;
const patch2Repl = `let buSiparisGeceHesabi = 0;
      (k.urunler || []).forEach(u => {
        let isTatli = false;
        if (u.kategori) {
          isTatli = u.kategori.toLowerCase().includes('tatl');
        } else if (typeof menu !== 'undefined') {
          const tatliKatlari = Object.keys(menu).filter(k => k.toLowerCase().includes('tatl'));
          for (let kat of tatliKatlari) {
            if (menu[kat].some(t => t.ad === u.ad)) isTatli = true;
          }
        }
        if (u.isGece && !isTatli) {
          const bFiyat = u.fiyat + (u.ekstralar||[]).reduce((ms,e)=>ms+e.fiyat, 0);
          buSiparisGeceHesabi += bFiyat * (u.adet || 1);
        }
      });`;

if (code.match(patch2Target)) {
  code = code.replace(patch2Target, patch2Repl);
  console.log("Applied Patch 2");
} else console.log("Failed Patch 2");

// PATCH 3: siparisiGonder print grouping
const patch3Target = /let gonderildi = false;\s*masa\.adisyon\.forEach\(u => \{\s*let yAdet = u\.yazdirilanAdet \|\| 0;\s*if \(u\.adet > yAdet\) \{\s*const yeniSiparisAdet = u\.adet - yAdet;\s*siparisFisiYazdir\(masaIsim, u\.ad, u\.ekstralar \|\| \[\], yeniSiparisAdet\);\s*u\.yazdirilanAdet = u\.adet;\s*gonderildi = true;\s*\}\s*\}\);\s*\/\/\s*Siparis(.)\s*g(o|ö)nder/sm;

const patch3TargetAlt = /let gonderildi = false;[\s\S]*?gonderildi = true;\s*\}\s*\}\);/m;

const patch3Repl = `let gonderildi = false;
    let yazdirilacaklar = [];

    masa.adisyon.forEach(u => {
      let yAdet = u.yazdirilanAdet || 0;
      if (u.adet > yAdet) {
        const yeniSiparisAdet = u.adet - yAdet;
        yazdirilacaklar.push({ ad: u.ad, ekstralar: u.ekstralar || [], adet: yeniSiparisAdet });
        u.yazdirilanAdet = u.adet;
        gonderildi = true;
      }
    });

    if (yazdirilacaklar.length > 0) {
      if (yazdirilacaklar.length === 1) {
        siparisFisiYazdir(masaIsim, yazdirilacaklar[0].ad, yazdirilacaklar[0].ekstralar, yazdirilacaklar[0].adet);
      } else {
        const birlesikAd = yazdirilacaklar.map(u => {
          let e = u.ekstralar.length > 0 ? " (" + u.ekstralar.map(x=>x.ad).join(',') + ")" : "";
          return u.adet + "x " + u.ad + e;
        }).join('\\n');
        siparisFisiYazdir(masaIsim, "\\nÇOKLU SİPARİŞ\\n----------------\\n" + birlesikAd, [], "");
      }
    }`;

let m3 = code.match(patch3Target) || code.match(patch3TargetAlt);
if (m3) {
  code = code.replace(m3[0], patch3Repl + '\\n\\n    // Sipariş gönder');
  console.log("Applied Patch 3");
} else console.log("Failed Patch 3");

// Remove any lingering literal '\\n' which caused the syntax crash!
// Wait, the string '... \\n ...' above already has \\n literal logic handling.
// But we should NOT globally replace '\\n' with newlines, because the joined string \n inside template literal NEEDS to be a literal \n in the source!
// Wait - if I join('\\\\n'), the source code will contain \n.
// My string literal inside patch 3 says `.join('\\n')`. This writes `\n` to the source file correctly.

fs.writeFileSync('index.html', code, 'utf8');
console.log("Done");
