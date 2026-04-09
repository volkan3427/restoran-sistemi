const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The magical CSS
const magicCss = `
    /* ===== PURE 3 COLUMN ARCHITECTURE (DESKTOP) ===== */
    @media (min-width: 901px) {
        #sayfa-garson { flex-direction: row; }
        .siparis-panel { flex: 3; background: #1e293b; border-left: none; overflow: hidden; }
        #panel-icerik { width: 100%; height: 100%; display: flex; flex-direction: column; }
        
        /* Force sag-panel-kap to be 3 columns */
        .sag-panel-kap { 
            display: flex !important; 
            flex-direction: row !important; 
            width: 100% !important; 
            overflow: hidden;
        }
        
        .menu-alan { flex: 1.1; border-right: 2px solid #334155; }
        .adisyon { flex: 1.1; display: flex; flex-direction: column; padding:0; border-right: 2px solid #334155; overflow: hidden; }
        
        /* The sliding panel is forced to be static 3rd column! */
        .sag-panel {
            position: static !important;
            transform: translateX(0) !important;
            flex: 1.1 !important;
            width: auto !important;
            height: 100% !important;
            display: flex !important;
            border-left: none !important;
        }

        /* Hide the sliding "Kapat" (Geri) buttons inside the sag panel on Desktop */
        .sag-panel-baslik .sag-panel-geri { display: none !important; }
        .sag-panel-baslik { padding-left: 15px !important; }

        /* Make Odeme Btn Huge on Desktop, push to bottom */
        .sag-panel-alt { margin-top: auto; padding-top: 20px; }
        .sag-panel-alt .odeme-yontemleri button { padding: 25px 10px; font-size: 16px; font-weight: 900; border-radius: 12px; }
        .sag-panel-alt .btn-indirim { padding: 15px; font-size: 15px; border-radius: 12px; }

        /* Hide Odeme Al button in Adisyon on desktop because it's always open on 3rd column */
        .desktop-gizle { display: none !important; }
    }
    
    @media (max-width: 900px) {
        .adisyon { height: auto !important; min-height: 10vh !important; max-height: 45vh !important; }
    }
`;

html = html.replace('</style>', magicCss + '\n</style>');

// Hide Odeme Al button on Desktop
html = html.replace('onclick="odemeAc()">Ödeme Al</button>`}', 'onclick="odemeAc()">Ödeme Al</button>`}\n              <style>@media(min-width:901px){ .odeme-ac-btn{display:none!important;} }</style>');
html = html.replace('onclick="odemeAc()">Ödeme Al</button>', 'class="btn btn-kapat odeme-ac-btn" onclick="odemeAc()">Ödeme Al</button>');


// Make panelRender automatically populate 3rd column with Odeme on Desktop!
const regexPanelRender = /const yeniUrunPanel = document\.querySelector\('#panel-icerik \.urun-panel'\);\s*if \(yeniUrunPanel\) yeniUrunPanel\.scrollTop = scrollPos;\s*\}/;

const injection = `const yeniUrunPanel = document.querySelector('#panel-icerik .urun-panel');
    if (yeniUrunPanel) yeniUrunPanel.scrollTop = scrollPos;
    
    // NATIVE 3-COLUMN DESKTOP INJECTION
    if (window.innerWidth > 900) {
        if (!odemeAdetler || odemeAdetler.length !== masalar[seciliMasa].adisyon.length) {
            odemeAdetler = masalar[seciliMasa].adisyon.map(() => 0);
        }
        // If sag-panel is empty, or only contains payment from before, render payment!
        const p = document.getElementById('sag-panel');
        if(!p || p.innerHTML.trim() === '' || p.innerHTML.includes('💳')) {
            _odemeRender(); 
        }
    }
  }`;

if(regexPanelRender.test(html)) {
    html = html.replace(regexPanelRender, injection);
    console.log("Injected auto-payment rendering into panelRender.");
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Pure CSS 3-column architecture injected.");
