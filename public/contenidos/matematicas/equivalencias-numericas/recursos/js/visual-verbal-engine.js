(function() {
  // Motor compartido para visual verbal y visual no verbal de equivalencias.
  const STYLE_ID = 'equiv-vv-style';
  const STYLE_TEXT = `
*{box-sizing:border-box}body{margin:0;font-family:'Nunito',sans-serif;background:linear-gradient(135deg,#f7f1ff,#ede7f6);color:#4a148c;min-height:100vh}.cabecera{background:linear-gradient(135deg,#8e24aa,#5e35b1);color:#fff;text-align:center;padding:28px 20px;border-bottom:6px solid #ffd54f;box-shadow:0 8px 20px rgba(0,0,0,.18);position:relative}.cabecera h1{margin:0;font-family:'Fredoka One',cursive;font-size:2.35rem;text-shadow:2px 2px 0 rgba(0,0,0,.15)}.cabecera .subtitulo{margin-top:10px;font-size:1.05rem;font-weight:700}.badge-estilo{display:inline-block;margin-top:14px;background:#ffd54f;color:#4a148c;border:3px solid #fff;border-radius:999px;padding:10px 24px;font-weight:800;box-shadow:0 4px 0 #d39e00}.btn-volver-menu{position:absolute;top:18px;left:18px;width:54px;height:54px;border-radius:50%;border:3px solid #fff;background:#ffd54f;color:#4a148c;font-size:1.35rem;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 0 #d39e00;transition:.2s}.btn-volver-menu:hover{transform:translateY(-2px);background:#fff3c4}.barra-progreso{max-width:980px;margin:24px auto 0;background:#fff;border-radius:999px;border:3px solid #7b1fa2;box-shadow:0 6px 0 #d1c4e9;padding:12px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}.progreso-texto{font-weight:800;color:#6a1b9a;white-space:nowrap}.barra-fondo{flex:1;min-width:140px;height:14px;background:#ede7f6;border-radius:999px;overflow:hidden;border:2px solid #d1c4e9}.barra-relleno{width:0;height:100%;background:linear-gradient(90deg,#ab47bc,#7e57c2);transition:width .3s}.progreso-num{background:#7b1fa2;color:#fff;padding:7px 14px;border-radius:999px;font-weight:800}.contenedor{max-width:1020px;margin:26px auto 42px;padding:0 16px}.tarjeta{background:#fff;border-radius:28px;border:3px solid #7b1fa2;box-shadow:0 10px 0 #d1c4e9;padding:26px}.titulo-pagina{font-family:'Fredoka One',cursive;font-size:1.95rem;color:#6a1b9a;margin-bottom:16px;border-left:8px solid #ffd54f;padding-left:18px}.texto-destacado{background:#faf5ff;border:2px dashed #ce93d8;border-radius:18px;padding:16px 18px;color:#5e35b1;font-weight:700;margin-bottom:18px;line-height:1.5}.recuadro{background:#f7f1ff;border-radius:20px;padding:18px;border-left:7px solid #ffd54f;margin:18px 0;line-height:1.55}.recuadro h4{margin:0 0 8px;color:#6a1b9a;font-weight:900}.model-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:18px 0}.model-panel{background:#fff;border:3px solid #d1a6ff;border-radius:22px;padding:18px;box-shadow:0 6px 0 #e1bee7;position:relative;overflow:hidden}.model-panel::before,.formula-card::before,.ticket-card::before,.statement-card::before,.coupon-card::before{content:'';position:absolute;inset:0 auto auto 0;width:100%;height:8px;background:rgba(255,255,255,.55)}.panel-title{text-align:center;font-weight:900;color:#6a1b9a;margin-bottom:12px}.panel-note{margin-top:12px;color:#6a1b9a;font-weight:700;line-height:1.45;text-align:center}.formula-board{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:18px 0}.formula-card{background:linear-gradient(135deg,#fffdf3,#fff8dc);border:3px solid #ffd54f;border-radius:18px;padding:14px 16px;box-shadow:0 5px 0 #ffe082;position:relative;overflow:hidden}.formula-title{text-align:center;font-weight:900;color:#6a1b9a;margin-bottom:8px}.formula-line{text-align:center;color:#5e35b1;font-weight:800;line-height:1.45}.equiv-row,.ticket-row{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}.equiv-sign{font-size:1.35rem;font-weight:900;color:#7b1fa2}.token-chip{min-width:94px;padding:10px 14px;border-radius:18px;background:#faf5ff;border:3px solid #ba68c8;box-shadow:0 5px 0 #d1c4e9;text-align:center;font-weight:900;color:#5e35b1;display:inline-flex;align-items:center;justify-content:center}.token-chip.dec{background:#eef6ff;border-color:#64b5f6;color:#1565c0;box-shadow:0 5px 0 #bbdefb}.token-chip.pct{background:#fff4e5;border-color:#ffb74d;color:#ef6c00;box-shadow:0 5px 0 #ffe0b2}.token-chip.frac{background:#f4ecff;border-color:#9575cd;color:#6a1b9a;box-shadow:0 5px 0 #d1c4e9}.token-chip.word{background:#edf7f1;border-color:#81c784;color:#2e7d32;box-shadow:0 5px 0 #c8e6c9}.fraction-stack{display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}.fraction-bar{width:34px;border-top:3px solid currentColor;margin:4px 0}.strip-box{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:4px;max-width:360px;margin:0 auto;padding:10px;border-radius:18px;background:#fff;border:4px solid #7b1fa2;box-shadow:0 6px 0 #d1c4e9}.strip-cell{aspect-ratio:1.15/1;border-radius:6px;background:#fff8e1;border:1px solid #d1c4e9}.strip-cell.fill{background:linear-gradient(135deg,#ffca28,#ff8f00);border-color:#ef6c00}.hundred-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;max-width:300px;margin:0 auto;padding:10px;border-radius:18px;background:#fff;border:4px solid #7b1fa2;box-shadow:0 6px 0 #d1c4e9}.grid-cell{aspect-ratio:1/1;border-radius:6px;background:#f3e5f5;border:1px solid #d1c4e9}.grid-cell.fill{background:linear-gradient(135deg,#ba68c8,#7e57c2);border-color:#7b1fa2}.pizza-wrap{display:flex;justify-content:center}.pizza-disc{--total:8;--fill:4;width:158px;height:158px;border-radius:50%;border:8px solid #ffb74d;box-shadow:0 6px 0 #d39e00;background:repeating-conic-gradient(from -90deg,rgba(255,255,255,.18) 0 calc(360deg/var(--total) - 2deg),rgba(123,31,162,.85) calc(360deg/var(--total) - 2deg) calc(360deg/var(--total))),conic-gradient(from -90deg,#ffe082 0 calc(360deg*var(--fill)/var(--total)),#f3e5f5 calc(360deg*var(--fill)/var(--total)) 360deg);position:relative}.pizza-disc::after{content:'';position:absolute;inset:12px;border-radius:50%;border:2px dashed rgba(123,31,162,.28)}.line-wrap{width:min(680px,100%);position:relative;height:124px;margin:0 auto}.line-track{position:absolute;left:8%;right:8%;top:58px;height:6px;border-radius:999px;background:#7b1fa2}.line-mark{position:absolute;top:26px;width:0;height:42px;border-left:4px solid #7b1fa2;transform:translateX(-50%)}.line-mark span{position:absolute;top:44px;left:50%;transform:translateX(-50%);font-weight:800;color:#6a1b9a;font-size:.9rem}.line-point{position:absolute;top:8px;width:34px;height:34px;border-radius:50%;background:#ffd54f;border:3px solid #7b1fa2;box-shadow:0 4px 0 #d39e00;transform:translateX(-50%)}.support-box{background:linear-gradient(135deg,#fffdf3,#f8f5ff);border:3px solid #d1c4e9;border-radius:22px;padding:18px;margin:14px 0 18px}.support-title{text-align:center;font-weight:900;color:#6a1b9a;margin-bottom:10px}.choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}.choice-card{background:#fff;border:3px solid #7b1fa2;border-radius:22px;padding:16px;box-shadow:0 5px 0 #d1c4e9;cursor:pointer;transition:.2s;display:flex;flex-direction:column;gap:12px;min-height:210px}.choice-card:hover{transform:translateY(-3px);background:#fcf9ff}.choice-card.selected{border-color:#ab47bc;background:#f7ecff}.choice-card.correcta{border-color:#43a047;background:#e8f5e9;color:#2e7d32}.choice-card.incorrecta{border-color:#e53935;background:#ffebee;color:#c62828}.choice-visual{display:flex;justify-content:center;align-items:center;min-height:92px}.choice-main{font-weight:900;color:#6a1b9a;line-height:1.35;text-align:center}.choice-note{font-weight:700;color:#7b1fa2;text-align:center;line-height:1.35;font-size:.95rem}.statement-card,.ticket-card,.coupon-card{background:linear-gradient(135deg,#fff,#faf5ff);border:2px dashed #d1c4e9;border-radius:18px;padding:12px;width:100%;position:relative;overflow:hidden}.statement-title,.ticket-head,.coupon-store{font-weight:900;color:#6a1b9a;text-align:center;margin-bottom:8px}.statement-body,.ticket-note{color:#5e35b1;font-weight:700;text-align:center;line-height:1.4}.coupon-head{display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}.coupon-badge{display:inline-flex;align-items:center;justify-content:center;padding:5px 12px;border-radius:999px;background:#fff3c4;border:2px solid #ffca28;color:#7b1fa2;font-weight:900;font-size:.85rem}.ticket-model{margin-bottom:10px}.activity-box{background:linear-gradient(135deg,#faf5ff,#f3e5f5);border:3px dashed #ba68c8;border-radius:24px;padding:22px;margin-top:24px}.activity-box h3{text-align:center;color:#6a1b9a;font-size:1.35rem;font-weight:900;margin-bottom:10px}.activity-prompt{text-align:center;font-weight:800;color:#6a1b9a;line-height:1.45;margin-bottom:4px}.sequence-shell{display:grid;gap:18px}.sequence-slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.sequence-slot{min-height:130px;background:#fff;border:3px dashed #ab47bc;border-radius:20px;box-shadow:0 5px 0 #e1bee7;padding:12px;display:flex;align-items:center;justify-content:center;text-align:center;color:#7b1fa2;font-weight:800}.sequence-slot.has-card{border-style:solid}.sequence-slot-label{display:inline-flex;width:30px;height:30px;border-radius:50%;background:#7b1fa2;color:#fff;align-items:center;justify-content:center;font-weight:900;margin-bottom:10px}.bank-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.bank-card{background:#fff;border:3px solid #7b1fa2;border-radius:20px;box-shadow:0 5px 0 #d1c4e9;padding:14px;cursor:pointer;transition:.2s;text-align:center}.bank-card:hover{transform:translateY(-2px)}.bank-card.used{opacity:.35;pointer-events:none}.symbol-guide{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:10px 0 0}.symbol-item{min-width:110px;padding:10px 12px;border-radius:18px;background:#fff;border:3px solid #d1c4e9;box-shadow:0 4px 0 #ece2ff;text-align:center}.symbol-mark{font-size:1.4rem;font-weight:900;color:#7b1fa2}.symbol-text{font-size:.9rem;font-weight:800;color:#5e35b1}.action-row{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin-top:18px}.btn-accion{border:none;border-radius:999px;padding:12px 26px;font-weight:800;background:linear-gradient(135deg,#ab47bc,#7e57c2);color:#fff;box-shadow:0 5px 0 #5e35b1;transition:.2s}.btn-accion:hover:not(:disabled){transform:translateY(-2px)}.btn-accion:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}.mensaje-feedback{margin-top:16px;padding:14px 16px;border-radius:16px;font-weight:800;text-align:center;display:none;line-height:1.45}.mensaje-ok{background:#e8f5e9;color:#2e7d32;border:2px solid #43a047}.mensaje-warn{background:#fff3e0;color:#ef6c00;border:2px solid #fb8c00}.mensaje-feedback.visible{display:block}.navegador{display:flex;justify-content:space-between;align-items:center;gap:15px;background:#fff;border:3px solid #7b1fa2;border-radius:999px;padding:12px 16px;margin-top:28px;box-shadow:0 8px 0 #d1c4e9;position:sticky;bottom:18px;z-index:20}.btn-nav{border:none;border-radius:999px;padding:12px 22px;font-weight:800;background:linear-gradient(135deg,#ab47bc,#7e57c2);color:#fff;box-shadow:0 5px 0 #5e35b1;transition:.2s}.btn-nav:hover:not(:disabled){transform:translateY(-2px)}.btn-nav:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.contador{font-weight:900;color:#6a1b9a;font-size:1.1rem}.boton-quiz{display:inline-block;margin:28px auto 0;text-decoration:none;background:#ffd54f;color:#4a148c;border:4px solid #7b1fa2;padding:16px 34px;border-radius:999px;font-weight:800;font-size:1.2rem;box-shadow:0 7px 0 #d39e00;transition:.2s}.boton-quiz:hover{transform:translateY(-3px);background:#fff3c4;color:#4a148c}.boton-quiz.bloqueado{opacity:.55;cursor:not-allowed;background:#e0e0e0;color:#7a7a7a;border-color:#bdbdbd;box-shadow:0 7px 0 #9e9e9e;pointer-events:none}.hint-line{text-align:center;font-weight:700;color:#7b1fa2;margin-top:12px}.theme-coral{background:linear-gradient(135deg,#fff8f4,#ffe7dd)!important;border-color:#ff8a65!important;box-shadow:0 6px 0 #ffccbc!important}.theme-jade{background:linear-gradient(135deg,#f4fff7,#def5e6)!important;border-color:#66bb6a!important;box-shadow:0 6px 0 #c8e6c9!important}.theme-sky{background:linear-gradient(135deg,#f5fbff,#dff1ff)!important;border-color:#4fc3f7!important;box-shadow:0 6px 0 #b3e5fc!important}.theme-gold{background:linear-gradient(135deg,#fffdf2,#fff1bf)!important;border-color:#ffca28!important;box-shadow:0 6px 0 #ffe082!important}.theme-indigo{background:linear-gradient(135deg,#f6f4ff,#e6e1ff)!important;border-color:#7986cb!important;box-shadow:0 6px 0 #c5cae9!important}.theme-mint{background:linear-gradient(135deg,#f2fffd,#d7f7ef)!important;border-color:#4db6ac!important;box-shadow:0 6px 0 #b2dfdb!important}.theme-coral .panel-title,.theme-coral .ticket-head,.theme-coral .statement-title,.theme-coral .formula-title,.theme-coral .support-title,.theme-coral .coupon-store{color:#bf360c!important}.theme-jade .panel-title,.theme-jade .ticket-head,.theme-jade .statement-title,.theme-jade .formula-title,.theme-jade .support-title,.theme-jade .coupon-store{color:#2e7d32!important}.theme-sky .panel-title,.theme-sky .ticket-head,.theme-sky .statement-title,.theme-sky .formula-title,.theme-sky .support-title,.theme-sky .coupon-store{color:#0277bd!important}.theme-gold .panel-title,.theme-gold .ticket-head,.theme-gold .statement-title,.theme-gold .formula-title,.theme-gold .support-title,.theme-gold .coupon-store{color:#a56a00!important}.theme-indigo .panel-title,.theme-indigo .ticket-head,.theme-indigo .statement-title,.theme-indigo .formula-title,.theme-indigo .support-title,.theme-indigo .coupon-store{color:#3949ab!important}.theme-mint .panel-title,.theme-mint .ticket-head,.theme-mint .statement-title,.theme-mint .formula-title,.theme-mint .support-title,.theme-mint .coupon-store{color:#00695c!important}.equiv-vnv .texto-destacado{text-align:center;font-size:1rem}.equiv-vnv .recuadro{padding:14px 16px}.equiv-vnv .choice-grid{grid-template-columns:repeat(auto-fit,minmax(290px,1fr))}.equiv-vnv .choice-card{min-height:280px;padding:18px}.equiv-vnv .choice-main{font-size:.95rem}.equiv-vnv .choice-note{font-size:.86rem;opacity:.95}.equiv-vnv .choice-visual{min-height:175px}.equiv-vnv .choice-card .ticket-model{display:flex;justify-content:center}.equiv-vnv .choice-card .hundred-grid{width:min(280px,100%);max-width:none;padding:10px;gap:4px}.equiv-vnv .choice-card .strip-box{width:min(300px,100%);max-width:none;padding:12px;gap:5px}.equiv-vnv .choice-card .grid-cell{border-radius:5px;border-width:1.5px}.equiv-vnv .choice-card .strip-cell{border-radius:7px}.equiv-vnv .choice-card:has(.compact-choice){min-height:150px;padding:16px}.equiv-vnv .choice-card:has(.compact-choice) .choice-visual{min-height:78px}.equiv-vnv .choice-card .token-chip{transform:scale(1.05)}.equiv-vnv .model-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.equiv-vnv .ticket-row{gap:8px}.equiv-vnv .token-chip{min-width:86px;padding:10px 12px}.equiv-vnv .support-box{background:linear-gradient(135deg,#ffffff,#f6f2ff)}.equiv-vnv .support-box .token-chip,.equiv-vnv .support-box .equiv-row,.equiv-vnv .support-box .strip-box,.equiv-vnv .support-box .hundred-grid,.equiv-vnv .support-box .pizza-wrap,.equiv-vnv .support-box .line-wrap{margin-left:auto;margin-right:auto}@media (max-width:768px){.cabecera h1{font-size:2rem}.titulo-pagina{font-size:1.55rem}.btn-volver-menu{position:static;margin:0 auto 16px}.barra-progreso{margin-inline:16px}.navegador{flex-direction:column;border-radius:24px}.pizza-disc{width:140px;height:140px}.choice-grid,.bank-grid,.sequence-slots{grid-template-columns:1fr}.equiv-vnv .choice-card{min-height:245px}.equiv-vnv .choice-visual{min-height:150px}.equiv-vnv .choice-card .hundred-grid{width:min(250px,100%)}.equiv-vnv .choice-card:has(.compact-choice){min-height:135px}.equiv-vnv .choice-card:has(.compact-choice) .choice-visual{min-height:64px}}
  `;

    // Inyecta una sola vez los estilos base del motor.
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_TEXT;
    document.head.appendChild(style);
  }
  function strip(total, fill, cls) {
    return '<div class="strip-box ' + (cls || '') + '" style="--cols:' + total + '">' + Array.from({ length: total }, function(_, i) { return '<span class="strip-cell' + (i < fill ? ' fill' : '') + '"></span>'; }).join('') + '</div>';
  }

  function grid(fill, cls) {
    return '<div class="hundred-grid ' + (cls || '') + '">' + Array.from({ length: 100 }, function(_, i) { return '<span class="grid-cell' + (i < fill ? ' fill' : '') + '"></span>'; }).join('') + '</div>';
  }

  function pizza(total, fill, cls) {
    return '<div class="pizza-wrap ' + (cls || '') + '"><div class="pizza-disc" style="--total:' + total + ';--fill:' + fill + '"></div></div>';
  }

  function line(total, point) {
    const start = 8;
    const end = 92;
    const marks = [];
    for (let i = 0; i <= total; i += 1) {
      const left = start + ((end - start) * i / total);
      let label = '';
      if (i === 0) label = '0';
      if (i === total) label = '1';
      marks.push('<div class="line-mark" style="left:' + left + '%"><span>' + label + '</span></div>');
    }
    const pointLeft = start + ((end - start) * point / total);
    return '<div class="line-wrap"><div class="line-track"></div>' + marks.join('') + '<div class="line-point" style="left:' + pointLeft + '%"></div></div>';
  }

  function fracChip(num, den, cls) {
    return '<div class="token-chip ' + (cls || 'frac') + '"><div class="fraction-stack"><span>' + num + '</span><span class="fraction-bar"></span><span>' + den + '</span></div></div>';
  }

  function decChip(text, cls) { return '<div class="token-chip ' + (cls || 'dec') + '">' + text + '</div>'; }
  function pctChip(text, cls) { return '<div class="token-chip ' + (cls || 'pct') + '">' + text + '</div>'; }
  function wordChip(text, cls) { return '<div class="token-chip ' + (cls || 'word') + '">' + text + '</div>'; }
  function equivRow(items) { return '<div class="equiv-row">' + items.join('<span class="equiv-sign">=</span>') + '</div>'; }
  function panel(title, body, note, cls) { return '<div class="model-panel ' + (cls || '') + '"><div class="panel-title">' + title + '</div>' + body + (note ? '<div class="panel-note">' + note + '</div>' : '') + '</div>'; }
  function formula(title, body, cls) { return '<div class="formula-card ' + (cls || '') + '"><div class="formula-title">' + title + '</div><div class="formula-line">' + body + '</div></div>'; }
  function choice(visual, main, note) { return '<div class="choice-visual">' + visual + '</div><div class="choice-main">' + main + '</div>' + (note ? '<div class="choice-note">' + note + '</div>' : ''); }
  function ticket(title, model, trio, note, cls) { return '<div class="ticket-card ' + (cls || '') + '"><div class="ticket-head">' + title + '</div><div class="ticket-model">' + (model || '') + '</div><div class="ticket-row">' + trio + '</div>' + (note ? '<div class="ticket-note">' + note + '</div>' : '') + '</div>'; }
  function coupon(name, badge, trio, cls) { return '<div class="coupon-card ' + (cls || '') + '"><div class="coupon-head"><span class="coupon-badge">' + badge + '</span><span class="coupon-store">' + name + '</span></div><div class="ticket-row">' + trio + '</div></div>'; }
  function statement(title, body, cls) { return '<div class="statement-card ' + (cls || '') + '"><div class="statement-title">' + title + '</div><div class="statement-body">' + body + '</div></div>'; }

  const builders = { strip, grid, pizza, line, fracChip, decChip, pctChip, wordChip, equivRow, panel, formula, choice, ticket, coupon, statement };
  window.EquivVisualVerbalBuilders = builders;

    // Arranca una pagina completa, controla avance y registra resultados.
  function boot(config) {
    ensureStyle();
    const totalPaginas = config.pages.length;
    const pages = config.pages;
    const contenidoId = config.contenidoId || 6;
    const nivel = config.nivel;
    const estilo = config.estilo || 'visual_verbal';
    if (document.body) {
      document.body.classList.remove('equiv-vv', 'equiv-vnv');
      document.body.classList.add(estilo === 'visual_no_verbal' ? 'equiv-vnv' : 'equiv-vv');
    }
    const sectionPrefix = config.sectionPrefix;
    let paginaActual = 1;
    const actividadesResueltas = {};
    const paginasRegistradas = {};
    const pageStates = {};
    const sonidos = {
      pasarPagina: new Audio('/contenidos/matematicas/recursos/sonidos/whoosh.mp3'),
      correcto: new Audio('/contenidos/matematicas/recursos/sonidos/ding.mp3'),
      incorrecto: new Audio('/contenidos/matematicas/recursos/sonidos/error.mp3')
    };
    Object.values(sonidos).forEach(function(audio) { audio.volume = 0.2; });

    const apartados = {};
    for (let i = 1; i <= totalPaginas; i += 1) {
      apartados[sectionPrefix + '_p' + i] = { pagina: i, apartadoClave: sectionPrefix + '_p' + i, tipoActividad: 'reforzamiento' };
      actividadesResueltas[i] = false;
    }

    const tracker = window.createReforzamientoTracker ? window.createReforzamientoTracker({
      contenidoId: contenidoId,
      nivel: nivel,
      estilo: estilo,
      detalleBase: { bloque: 'equivalencias_numericas', motor: sectionPrefix },
      apartados: apartados
    }) : null;

    const session = window.createReforzamientoSessionTracker ? window.createReforzamientoSessionTracker({
      contenidoId: contenidoId,
      nivel: nivel,
      estilo: estilo
    }) : null;

    function playSound(key) {
      const audio = sonidos[key];
      if (!audio || !audio.src) return;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(function() {});
      } catch (err) {}
    }

    function sectionKey(page) { return sectionPrefix + '_p' + page; }
    function registrarVisible() { if (tracker) tracker.markPageVisibleByNumber(paginaActual, { motor: sectionPrefix }); }
    function registrarError(page, tipo) { if (tracker) tracker.addError(sectionKey(page), 1, { ejercicio: tipo || 'principal' }); }
    function registrarAcierto(page, tipo) {
      if (!tracker || paginasRegistradas[page]) return;
      paginasRegistradas[page] = true;
      tracker.addCorrect(sectionKey(page), 1, { ejercicio: tipo || 'principal' });
      tracker.complete(sectionKey(page), { detalle: { motor: sectionPrefix, pagina: page, ejercicio: tipo || 'principal' } });
    }
    function shuffleDifferent(values, disallowed) {
      const base = values.slice();
      if (base.length <= 1) return base;
      let candidate = base.slice();
      let tries = 0;
      const blocked = disallowed || [];
      while (tries < 30) {
        for (let i = candidate.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = candidate[i];
          candidate[i] = candidate[j];
          candidate[j] = temp;
        }
        const signature = candidate.join('|');
        if (!blocked.includes(signature)) return candidate;
        candidate = base.slice();
        tries += 1;
      }
      return base.slice().reverse();
    }

    function getPageState(page) {
      if (!pageStates[page]) pageStates[page] = { selected: null, slots: null, order: null, solved: false, lastWrong: false };
      return pageStates[page];
    }

    function hideFeedback() {
      document.getElementById('feedbackOk').classList.remove('visible');
      document.getElementById('feedbackWarn').classList.remove('visible');
    }

    function showOk(text) {
      hideFeedback();
      const el = document.getElementById('feedbackOk');
      el.innerHTML = text;
      el.classList.add('visible');
    }

    function showWarn(text) {
      hideFeedback();
      const el = document.getElementById('feedbackWarn');
      el.innerHTML = text;
      el.classList.add('visible');
    }

    function resolverPagina(page) {
      actividadesResueltas[page] = true;
      registrarAcierto(page, pages[page - 1].activity.errorKey);
      actualizarNavegacion();
      if (page === totalPaginas) {
        const btn = document.getElementById('btnMiniQuiz');
        if (btn) btn.classList.remove('bloqueado');
      }
    }

    function renderChoiceActivity(page, activity, state) {
      const choiceMap = {};
      activity.choices.forEach(function(choice) { choiceMap[choice.value] = choice; });
      if (!state.order) {
        const original = activity.choices.map(function(choice) { return choice.value; });
        state.order = shuffleDifferent(original, [original.join('|')]);
      }
      const html = '<div class="choice-grid">' + state.order.map(function(value) {
        const choice = choiceMap[value];
        let cls = 'choice-card';
        if (state.selected === value) cls += ' selected';
        if (state.solved && choice.correct) cls += ' correcta';
        if (state.lastWrong && state.selected === value) cls += ' incorrecta';
        return '<button class="' + cls + '" data-value="' + value + '" type="button">' + choice.html + '</button>';
      }).join('') + '</div>';
      document.getElementById('rootActividad').innerHTML = html;
      document.querySelectorAll('#rootActividad .choice-card').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (state.solved) return;
          state.selected = btn.dataset.value;
          state.lastWrong = false;
          hideFeedback();
          renderCurrentPage();
        });
      });
    }

    function renderSequenceActivity(activity, state) {
      const itemMap = {};
      activity.items.forEach(function(item) { itemMap[item.value] = item; });
      if (!state.order) {
        const original = activity.items.map(function(item) { return item.value; });
        state.order = shuffleDifferent(original, [original.join('|'), activity.correctOrder.join('|')]);
      }
      if (!state.slots) state.slots = Array(activity.correctOrder.length).fill(null);
      const slotsHtml = state.slots.map(function(value, index) {
        const item = value ? itemMap[value] : null;
        const hasCard = value ? ' has-card' : '';
        return '<button class="sequence-slot' + hasCard + '" type="button" data-slot="' + index + '"><div><div class="sequence-slot-label">' + (index + 1) + '</div>' + (item ? item.html : '<div class="hint-line">Coloca una tarjeta aqu&iacute;</div>') + '</div></button>';
      }).join('');
      const used = new Set(state.slots.filter(Boolean));
      const bankHtml = state.order.map(function(value) {
        const item = itemMap[value];
        const cls = 'bank-card' + (used.has(value) ? ' used' : '');
        return '<button class="' + cls + '" type="button" data-value="' + value + '">' + item.html + '</button>';
      }).join('');
      document.getElementById('rootActividad').innerHTML = '<div class="sequence-shell"><div class="sequence-slots">' + slotsHtml + '</div><div class="bank-grid">' + bankHtml + '</div></div>';
      document.querySelectorAll('#rootActividad .bank-card').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (state.solved || btn.classList.contains('used')) return;
          const emptyIndex = state.slots.findIndex(function(value) { return !value; });
          if (emptyIndex === -1) return;
          state.slots[emptyIndex] = btn.dataset.value;
          state.lastWrong = false;
          hideFeedback();
          renderCurrentPage();
        });
      });
      document.querySelectorAll('#rootActividad .sequence-slot').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (state.solved) return;
          const index = Number(btn.dataset.slot);
          if (!state.slots[index]) return;
          state.slots[index] = null;
          state.lastWrong = false;
          hideFeedback();
          renderCurrentPage();
        });
      });
    }

    function renderQuizButton() {
      const wrap = document.getElementById('quizWrap');
      if (paginaActual !== totalPaginas) { wrap.innerHTML = ''; return; }
      const bloqueo = actividadesResueltas[totalPaginas] ? '' : ' bloqueado';
      wrap.innerHTML = '<a href="quiz.html" class="boton-quiz' + bloqueo + '" id="btnMiniQuiz"><i class="fas fa-puzzle-piece me-2"></i>Ir al Mini-Quiz</a>';
      const btn = document.getElementById('btnMiniQuiz');
      btn.addEventListener('click', async function(event) {
        event.preventDefault();
        if (!actividadesResueltas[totalPaginas]) return;
        if (session) await session.complete({ eventoCierre: 'quiz' });
        window.location.href = 'quiz.html';
      });
    }
    function renderCurrentPage() {
      const page = pages[paginaActual - 1];
      const state = getPageState(paginaActual);
      document.getElementById('tituloPagina').innerHTML = '<i class="fas ' + page.icon + ' me-2"></i>' + page.title;
      document.getElementById('leadPagina').innerHTML = page.lead;
      document.getElementById('contenidoPagina').innerHTML = page.contentHtml;
      document.getElementById('promptActividad').innerHTML = page.activity.prompt;
      document.getElementById('supportActividad').innerHTML = page.activity.supportHtml || '';
      hideFeedback();
      if (page.activity.type === 'choice') renderChoiceActivity(paginaActual, page.activity, state);
      if (page.activity.type === 'sequence') renderSequenceActivity(page.activity, state);
      if (state.solved) showOk(page.activity.ok);
      document.getElementById('btnVerificar').disabled = state.solved;
      document.getElementById('btnBorrar').disabled = state.solved;
      renderQuizButton();
      actualizarNavegacion();
      registrarVisible();
    }

    function actualizarNavegacion() {
      document.getElementById('progresoTexto').innerText = 'Pgina ' + paginaActual + ' de ' + totalPaginas;
      document.getElementById('contadorPagina').innerText = paginaActual + '/' + totalPaginas;
      const porcentaje = (paginaActual / totalPaginas) * 100;
      document.getElementById('barraRelleno').style.width = porcentaje + '%';
      document.getElementById('progresoNum').innerText = Math.round(porcentaje) + '%';
      document.getElementById('btnAnterior').disabled = paginaActual === 1;
      document.getElementById('btnSiguiente').disabled = (paginaActual === totalPaginas || !actividadesResueltas[paginaActual]);
    }

    function verificarActual() {
      const page = pages[paginaActual - 1];
      const state = getPageState(paginaActual);
      if (state.solved) return;
      if (page.activity.type === 'choice') {
        if (!state.selected) { showWarn('Selecciona una tarjeta antes de verificar.'); return; }
        const choice = page.activity.choices.find(function(item) { return item.value === state.selected; });
        if (choice && choice.correct) {
          state.solved = true;
          playSound('correcto');
          resolverPagina(paginaActual);
          renderCurrentPage();
        } else {
          state.lastWrong = true;
          registrarError(paginaActual, page.activity.errorKey);
          playSound('incorrecto');
          renderCurrentPage();
          showWarn(page.activity.warn);
        }
      } else if (page.activity.type === 'sequence') {
        if (state.slots.some(function(value) { return !value; })) { showWarn('Completa todos los espacios antes de verificar.'); return; }
        const signature = state.slots.join('|');
        if (signature === page.activity.correctOrder.join('|')) {
          state.solved = true;
          playSound('correcto');
          resolverPagina(paginaActual);
          renderCurrentPage();
        } else {
          state.lastWrong = true;
          registrarError(paginaActual, page.activity.errorKey);
          playSound('incorrecto');
          showWarn(page.activity.warn);
        }
      }
    }

    function limpiarActual() {
      const page = pages[paginaActual - 1];
      const state = getPageState(paginaActual);
      if (state.solved) return;
      state.lastWrong = false;
      hideFeedback();
      if (page.activity.type === 'choice') state.selected = null;
      if (page.activity.type === 'sequence') state.slots = Array(page.activity.correctOrder.length).fill(null);
      renderCurrentPage();
    }

    function cambiarPagina(direccion) {
      if ((direccion > 0 && (paginaActual === totalPaginas || !actividadesResueltas[paginaActual])) || (direccion < 0 && paginaActual === 1)) return;
      paginaActual += direccion;
      playSound('pasarPagina');
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function volverAlMenu() { window.location.href = '../../menu.html'; }

    document.getElementById('btnVerificar').addEventListener('click', verificarActual);
    document.getElementById('btnBorrar').addEventListener('click', limpiarActual);
    document.getElementById('btnAnterior').addEventListener('click', function() { cambiarPagina(-1); });
    document.getElementById('btnSiguiente').addEventListener('click', function() { cambiarPagina(1); });
    document.querySelector('.btn-volver-menu').addEventListener('click', function() { volverAlMenu(); });
    if (session) session.start();
    renderCurrentPage();
  }

  window.EquivVisualVerbalEngine = { boot: boot };
})();

