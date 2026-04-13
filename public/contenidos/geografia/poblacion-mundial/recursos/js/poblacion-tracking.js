(function () {
  const path = (window.location.pathname || '').toLowerCase();
  if (!path.includes('/poblacion-mundial/contenido/')) return;
  if (!window.createReforzamientoTracker || !window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/poblacion-mundial\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const fileKey = nivel + '/' + estilo;

  const CONFIGS = {
    'facil/visual_verbal': {
      apartados: {
        p1_relacionar: { pagina: 1, apartadoClave: 'pagina1_relacionar', tipoActividad: 'relacionar' },
        p2_oraciones: { pagina: 2, apartadoClave: 'pagina2_oraciones', tipoActividad: 'completar' },
        p3_sopa: { pagina: 3, apartadoClave: 'pagina3_sopa', tipoActividad: 'sopa' }
      },
      setup: setupEasyVisualVerbal
    },
    'facil/visual_no_verbal': {
      apartados: {
        p1_arrastrar: { pagina: 1, apartadoClave: 'pagina1_arrastrar_imagenes', tipoActividad: 'arrastrar' },
        p2_seleccion: { pagina: 2, apartadoClave: 'pagina2_seleccion_visual', tipoActividad: 'seleccion' },
        p3_comparar: { pagina: 3, apartadoClave: 'pagina3_comparar_poblacion', tipoActividad: 'comparar' }
      },
      setup: setupEasyVisualNoVerbal
    },
    'facil/auditivo': {
      apartados: {
        p1_audio: { pagina: 1, apartadoClave: 'pagina1_audio_preguntas', tipoActividad: 'audio' },
        p2_vf: { pagina: 2, apartadoClave: 'pagina2_verdadero_falso', tipoActividad: 'verdadero_falso' },
        p3_pistas: { pagina: 3, apartadoClave: 'pagina3_pistas_auditivas', tipoActividad: 'pistas' }
      },
      setup: setupEasyAuditivo
    },
    'facil/kinestesico': {
      apartados: {
        p1_drag: { pagina: 1, apartadoClave: 'pagina1_arrastrar_paises', tipoActividad: 'arrastrar' },
        p2_mapa: { pagina: 2, apartadoClave: 'pagina2_mapa_poblacion', tipoActividad: 'mapa' },
        p3_orden: { pagina: 3, apartadoClave: 'pagina3_ordenar_ranking', tipoActividad: 'ordenar' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_arrastrar', tipoActividad: 'repaso' }
      },
      setup: setupEasyKinestesico
    },
    'normal/visual_verbal': {
      apartados: {
        p1_form: { pagina: 1, apartadoClave: 'pagina1_formulario', tipoActividad: 'completar' },
        p1_quiz: { pagina: 1, apartadoClave: 'pagina1_quiz_rapido', tipoActividad: 'quiz' },
        p2_form: { pagina: 2, apartadoClave: 'pagina2_formulario', tipoActividad: 'completar' },
        p2_text: { pagina: 2, apartadoClave: 'pagina2_texto_huecos', tipoActividad: 'texto' },
        p3_cultura: { pagina: 3, apartadoClave: 'pagina3_cultura_pistas', tipoActividad: 'quiz' },
        p3_form: { pagina: 3, apartadoClave: 'pagina3_formulario', tipoActividad: 'completar' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_final', tipoActividad: 'repaso' }
      },
      setup: setupNormalVisualVerbal
    },
    'normal/visual_no_verbal': {
      apartados: {
        p1_flags: { pagina: 1, apartadoClave: 'pagina1_banderas', tipoActividad: 'seleccion' },
        p1_symbols: { pagina: 1, apartadoClave: 'pagina1_simbolos', tipoActividad: 'simbolos' },
        p2_campo: { pagina: 2, apartadoClave: 'pagina2_ciudad_campo', tipoActividad: 'seleccion' },
        p2_pq: { pagina: 2, apartadoClave: 'pagina2_preguntas_imagen', tipoActividad: 'imagen' },
        p3_match: { pagina: 3, apartadoClave: 'pagina3_relacionar_culturas', tipoActividad: 'relacionar' },
        p3_cq: { pagina: 3, apartadoClave: 'pagina3_quiz_cultural', tipoActividad: 'quiz' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_visual', tipoActividad: 'repaso' }
      },
      setup: setupNormalVisualNoVerbal
    },
    'normal/auditivo': {
      apartados: {
        p1_cloze: { pagina: 1, apartadoClave: 'pagina1_completar_audio', tipoActividad: 'audio' },
        p1_quiz: { pagina: 1, apartadoClave: 'pagina1_quiz_audio', tipoActividad: 'quiz' },
        p2_ritmo: { pagina: 2, apartadoClave: 'pagina2_ritmo_audio', tipoActividad: 'ritmo' },
        p2_cloze: { pagina: 2, apartadoClave: 'pagina2_completar_audio', tipoActividad: 'audio' },
        p3_cultura: { pagina: 3, apartadoClave: 'pagina3_cultura_audio', tipoActividad: 'quiz' },
        p3_cloze: { pagina: 3, apartadoClave: 'pagina3_completar_audio', tipoActividad: 'audio' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_audio', tipoActividad: 'repaso' }
      },
      setup: setupNormalAuditivo
    },
    'normal/kinestesico': {
      apartados: {
        p1_drag: { pagina: 1, apartadoClave: 'pagina1_arrastrar', tipoActividad: 'arrastrar' },
        p1_sort: { pagina: 1, apartadoClave: 'pagina1_ordenar', tipoActividad: 'ordenar' },
        p2_match: { pagina: 2, apartadoClave: 'pagina2_relacionar', tipoActividad: 'relacionar' },
        p2_city: { pagina: 2, apartadoClave: 'pagina2_construir_ciudad', tipoActividad: 'construccion' },
        p3_culturas: { pagina: 3, apartadoClave: 'pagina3_culturas_drag', tipoActividad: 'arrastrar' },
        p3_actitudes: { pagina: 3, apartadoClave: 'pagina3_actitudes', tipoActividad: 'clasificar' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_quiz', tipoActividad: 'repaso' },
        p4_match: { pagina: 4, apartadoClave: 'pagina4_repaso_match', tipoActividad: 'relacionar' },
        p4_sort: { pagina: 4, apartadoClave: 'pagina4_repaso_ordenar', tipoActividad: 'ordenar' }
      },
      setup: setupNormalKinestesico
    }
  };

  const config = CONFIGS[fileKey];
  if (!config) return;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  function wrap(name, fn) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function () {
      const args = Array.from(arguments);
      return fn.call(this, original, args);
    };
  }

  function pages() {
    return Array.from(document.querySelectorAll('.pagina[id^="pagina"], .page'));
  }

  function activePageNumber() {
    const list = pages();
    const active = list.find(function (page) {
      return page.classList.contains('activa') || page.classList.contains('active');
    });
    if (!active) return 1;

    if (active.id && /^pagina\d+$/.test(active.id)) {
      return Number(active.id.replace('pagina', '')) || 1;
    }

    const idx = list.indexOf(active);
    return idx >= 0 ? idx + 1 : 1;
  }

  function totalPages() {
    return pages().length || 1;
  }

  function getKeysForPage(pageNumber) {
    return Object.keys(config.apartados).filter(function (key) {
      return Number(config.apartados[key].pagina) === Number(pageNumber);
    });
  }

  const tracker = window.createReforzamientoTracker({
    trackTime: false,
    contenidoId: 3,
    nivel,
    estilo,
    detalleBase: { bloque: 'poblacion_mundial' },
    apartados: config.apartados
  });

  const session = window.createReforzamientoSessionTracker({
    contenidoId: 3,
    nivel,
    estilo,
    detalleBase: { bloque: 'poblacion_mundial' }
  });

  function ok(key, count) {
    tracker.addCorrect(key, count || 1);
  }

  function err(key, count) {
    tracker.addError(key, count || 1);
  }

  async function finalizeKey(key, force) {
    const state = tracker.getState(key);
    if (!state || state.saved) return;
    if (!force && state.aciertos <= 0 && state.errores <= 0) return;
    await tracker.complete(key);
  }

  async function finalizePage(pageNumber, force) {
    const keys = getKeysForPage(pageNumber);
    for (const key of keys) {
      await finalizeKey(key, force);
    }
  }

  async function finalizeAll(force) {
    const keys = Object.keys(config.apartados);
    for (const key of keys) {
      await finalizeKey(key, force);
    }
  }

  function syncQuizButton() {
    const current = activePageNumber();
    const total = totalPages();
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer').forEach(function (button) {
      const display = current === total
        ? (button.classList.contains('quiz-btn-footer') ? 'inline-flex' : 'block')
        : 'none';
      button.style.display = display;
    });
    tracker.markPageVisibleByNumber(current);
  }

  function bindNavigation() {
    wrap('cambiarPag', async function (original, args) {
      const before = activePageNumber();
      const result = original.apply(this, args);
      const after = activePageNumber();
      if (before !== after) {
        await finalizePage(before, false);
      }
      syncQuizButton();
      return result;
    });

    wrap('goToPage', async function (original, args) {
      const before = activePageNumber();
      const result = original.apply(this, args);
      const after = activePageNumber();
      if (before !== after) {
        await finalizePage(before, false);
      }
      syncQuizButton();
      return result;
    });

    wrap('syncUI', function (original, args) {
      const result = original.apply(this, args);
      setTimeout(syncQuizButton, 0);
      return result;
    });

    const observer = new MutationObserver(function () {
      syncQuizButton();
    });

    pages().forEach(function (page) {
      observer.observe(page, { attributes: true, attributeFilter: ['class', 'style'] });
    });
  }

  function bindQuizLinks() {
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer').forEach(function (link) {
      if (link.dataset.reforzamientoSesionBound === 'true') return;
      const href = link.getAttribute('href');
      if (!href) return;

      link.dataset.reforzamientoSesionBound = 'true';
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        await finalizeAll(false);
        await session.complete();
        window.location.href = href;
      });
    });
  }

  function observeChildCount(selector, childSelector, key) {
    const root = document.querySelector(selector);
    if (!root) return;

    let seen = root.querySelectorAll(childSelector).length;
    const observer = new MutationObserver(function () {
      const current = root.querySelectorAll(childSelector).length;
      if (current > seen) {
        ok(key, current - seen);
        seen = current;
      }
    });

    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  }

  function setupEasyVisualVerbal() {
    wrap('parear', function (original, args) {
      const el = args[0];
      const col = args[1];
      const beforePairs = typeof paresOk === 'number' ? paresOk : 0;
      const hadSelection = !!selPar;
      const previousPar = hadSelection && selPar && selPar.el ? selPar.el.dataset.par : null;
      const previousCol = hadSelection && selPar ? selPar.col : null;
      const result = original.apply(this, args);
      if (typeof paresOk === 'number' && paresOk > beforePairs) {
        ok('p1_relacionar', paresOk - beforePairs);
      } else if (hadSelection && previousCol !== col && previousPar && el && previousPar !== el.dataset.par) {
        err('p1_relacionar', 1);
      }
      return result;
    });

    wrap('verificarOraciones', function (original, args) {
      const result = original.apply(this, args);
      const blanks = ['b1', 'b2', 'b3', 'b4', 'b5'];
      const filled = blanks.every(function (id) {
        const input = document.getElementById(id);
        return input && input.value.trim() !== '';
      });
      const correct = blanks.every(function (id) {
        const input = document.getElementById(id);
        return input && input.value.trim().toLowerCase() === String(input.dataset.ans || '').toLowerCase();
      });
      if (filled && correct) ok('p2_oraciones', 1);
      else err('p2_oraciones', 1);
      return result;
    });

    wrap('clickCelda', function (original, args) {
      const before = typeof encontradas === 'number' ? encontradas : 0;
      const hadFirst = !!primeraCelda;
      const result = original.apply(this, args);
      const after = typeof encontradas === 'number' ? encontradas : before;
      if (after > before) ok('p3_sopa', after - before);
      else if (hadFirst && !primeraCelda) err('p3_sopa', 1);
      return result;
    });
  }

  function setupEasyVisualNoVerbal() {
    wrap('verificarArrastreVisual', function (original, args) {
      const result = original.apply(this, args);
      const totalPlaced = document.querySelectorAll('#dropConc .img-colocada, #dropDisp .img-colocada').length;
      if (totalPlaced === 8) ok('p1_arrastrar', 1);
      else err('p1_arrastrar', 1);
      return result;
    });

    wrap('verificarSelImagen', function (original, args) {
      const qId = args[0];
      const beforeLocked = visualLocked[qId];
      const result = original.apply(this, args);
      if (!beforeLocked && visualLocked[qId]) {
        if (visualCorrect[qId]) ok('p2_seleccion', 1);
        else err('p2_seleccion', 1);
      }
      return result;
    });

    wrap('verificarComp', function (original, args) {
      const ronda = args[0];
      const beforeLocked = compLocked[ronda];
      const result = original.apply(this, args);
      if (!beforeLocked && compLocked[ronda]) {
        if (compCorrect[ronda]) ok('p3_comparar', 1);
        else err('p3_comparar', 1);
      }
      return result;
    });
  }

  function setupEasyAuditivo() {
    wrap('responderOpc', function (original, args) {
      const result = original.apply(this, args);
      if (args[1] === args[2]) ok('p1_audio', 1);
      else err('p1_audio', 1);
      return result;
    });

    wrap('respVF', function (original, args) {
      const result = original.apply(this, args);
      if (args[1] === args[2]) ok('p2_vf', 1);
      else err('p2_vf', 1);
      return result;
    });

    wrap('responderPista', function (original, args) {
      const result = original.apply(this, args);
      if (args[1] === args[2]) ok('p3_pistas', 1);
      else err('p3_pistas', 1);
      return result;
    });
  }

  function setupEasyKinestesico() {
    wrap('verificarDrag1', function (original, args) {
      const result = original.apply(this, args);
      const totalPlaced = document.querySelectorAll('#cAlta .colocado, #cBaja .colocado').length;
      if (totalPlaced === 8) ok('p1_drag', 1);
      else err('p1_drag', 1);
      return result;
    });

    wrap('verificarMapa', function (original, args) {
      const result = original.apply(this, args);
      const correctos = ['China', 'India', 'EE.UU.', 'Indonesia', 'Brasil'];
      const passed = correctos.every(function (pais) {
        return seleccionados.has(pais);
      }) && seleccionados.size === 5;
      if (passed) ok('p2_mapa', 1);
      else err('p2_mapa', 1);
      return result;
    });

    wrap('verificarOrden', function (original, args) {
      const result = original.apply(this, args);
      const items = Array.from(document.querySelectorAll('#seqPaises .seq-item'));
      const passed = items.every(function (item, index) {
        return item.dataset.val === ORDEN_CORRECTO[index];
      });
      if (passed) ok('p3_orden', 1);
      else err('p3_orden', 1);
      return result;
    });

    wrap('verificarRepaso', function (original, args) {
      const result = original.apply(this, args);
      const totalPlaced = document.querySelectorAll('#cConc .colocado, #cDisp .colocado, #cDens .colocado, #cMega .colocado').length;
      if (totalPlaced === 4) ok('p4_repaso', 1);
      else err('p4_repaso', 1);
      return result;
    });
  }

  function setupNormalVisualVerbal() {
    wrap('checkForm', function (original, args) {
      const number = Number(args[0]);
      const result = original.apply(this, args);
      const map = { 1: 'p1_form', 2: 'p2_form', 3: 'p3_form' };
      const key = map[number];
      const fb = document.getElementById('fb-f' + number);
      if (key && fb) {
        if (fb.classList.contains('ok')) ok(key, 1);
        else err(key, 1);
      }
      return result;
    });

    wrap('checkTextFill', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-tf');
      if (fb.classList.contains('ok')) ok('p2_text', 1);
      else err('p2_text', 1);
      return result;
    });

    document.addEventListener('click', function (event) {
      const q1Btn = event.target.closest('#q1-opts .q-opt');
      if (q1Btn && !q1Btn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#q1-opts .q-opt'));
        const chosen = buttons.indexOf(q1Btn);
        const current = q1data[q1idx];
        if (current && chosen === current.a) ok('p1_quiz', 1);
        else err('p1_quiz', 1);
      }

      const culturaBtn = event.target.closest('#cultura-opciones .q-opt');
      if (culturaBtn && !culturaBtn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#cultura-opciones .q-opt'));
        const chosen = buttons.indexOf(culturaBtn);
        const current = culturas[Math.max(0, cultIdx - 1)];
        if (current && chosen === current.a) ok('p3_cultura', 1);
        else err('p3_cultura', 1);
      }

      const repBtn = event.target.closest('#rep-opts .q-opt');
      if (repBtn && !repBtn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#rep-opts .q-opt'));
        const chosen = buttons.indexOf(repBtn);
        const current = repasoQ[repIdx];
        if (current && chosen === current.a) ok('p4_repaso', 1);
        else err('p4_repaso', 1);
      }
    }, true);
  }

  function setupNormalVisualNoVerbal() {
    wrap('checkFlags', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-flags');
      if (fb.classList.contains('ok')) ok('p1_flags', 1);
      else err('p1_flags', 1);
      return result;
    });

    wrap('answerSym', function (original, args) {
      const current = symData[symIdx];
      const result = original.apply(this, args);
      if (current && args[0] === current.a) ok('p1_symbols', 1);
      else err('p1_symbols', 1);
      return result;
    });

    wrap('checkCampo', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-campo');
      if (fb.classList.contains('ok')) ok('p2_campo', 1);
      else err('p2_campo', 1);
      return result;
    });

    wrap('answerPQ', function (original, args) {
      const current = pqData[pqIdx];
      const result = original.apply(this, args);
      if (current && args[0] === current.ans) ok('p2_pq', 1);
      else err('p2_pq', 1);
      return result;
    });

    wrap('culturalMatch', function (original, args) {
      const el = args[0];
      const side = args[1];
      const before = cultMatchPairs.size;
      const hadSelected = !!cultMatchSel;
      const previousId = hadSelected && cultMatchSel ? cultMatchSel.dataset.id : null;
      const previousSide = cultMatchSide;
      const result = original.apply(this, args);
      if (cultMatchPairs.size > before) ok('p3_match', cultMatchPairs.size - before);
      else if (hadSelected && previousSide !== side && previousId && el && previousId !== el.dataset.id) err('p3_match', 1);
      return result;
    });

    wrap('answerCQ', function (original, args) {
      const current = cqData[cqIdx];
      const result = original.apply(this, args);
      if (current && args[0] === current.a) ok('p3_cq', 1);
      else err('p3_cq', 1);
      return result;
    });

    document.addEventListener('click', function (event) {
      const repBtn = event.target.closest('#repaso-opts .q-opt');
      if (!repBtn || repBtn.disabled) return;
      const buttons = Array.from(document.querySelectorAll('#repaso-opts .q-opt'));
      const chosen = buttons.indexOf(repBtn);
      const current = repasoQ[repIdx];
      if (current && chosen === current.a) ok('p4_repaso', 1);
      else err('p4_repaso', 1);
    }, true);
  }

  function setupNormalAuditivo() {
    wrap('checkCloze', function (original, args) {
      const number = Number(args[0]);
      const result = original.apply(this, args);
      const map = { 1: 'p1_cloze', 2: 'p2_cloze', 3: 'p3_cloze' };
      const key = map[number];
      const fb = document.getElementById('fb-c' + number);
      if (key && fb) {
        if (fb.classList.contains('ok')) ok(key, 1);
        else err(key, 1);
      }
      return result;
    });

    wrap('answerRitmo', function (original, args) {
      const current = ritmoItems[ritmoIdx];
      const result = original.apply(this, args);
      if (current && args[0] === current.ans) ok('p2_ritmo', 1);
      else err('p2_ritmo', 1);
      return result;
    });

    document.addEventListener('click', function (event) {
      const q1Btn = event.target.closest('#q1-opts .q-opt');
      if (q1Btn && !q1Btn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#q1-opts .q-opt'));
        const chosen = buttons.indexOf(q1Btn);
        const current = q1data[q1idx];
        if (current && chosen === current.a) ok('p1_quiz', 1);
        else err('p1_quiz', 1);
      }

      const culturaBtn = event.target.closest('#cultura-opciones .q-opt');
      if (culturaBtn && !culturaBtn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#cultura-opciones .q-opt'));
        const chosen = buttons.indexOf(culturaBtn);
        const current = culturas[Math.max(0, cultIdx - 1)];
        if (current && chosen === current.a) ok('p3_cultura', 1);
        else err('p3_cultura', 1);
      }

      const repBtn = event.target.closest('#rep-opts .q-opt');
      if (repBtn && !repBtn.disabled) {
        const buttons = Array.from(document.querySelectorAll('#rep-opts .q-opt'));
        const chosen = buttons.indexOf(repBtn);
        const current = repasoQ[repIdx];
        if (current && chosen === current.a) ok('p4_repaso', 1);
        else err('p4_repaso', 1);
      }
    }, true);
  }

  function setupNormalKinestesico() {
    wrap('checkDrag1', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-d1');
      if (fb.classList.contains('ok')) ok('p1_drag', 1);
      else err('p1_drag', 1);
      return result;
    });

    wrap('checkSort', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-sort');
      if (fb.classList.contains('ok')) ok('p1_sort', 1);
      else err('p1_sort', 1);
      return result;
    });

    wrap('matchClick', function (original, args) {
      const el = args[0];
      const side = args[1];
      const before = matchedPairs.size;
      const hadSelected = !!matchSelected;
      const previousId = hadSelected && matchSelected ? matchSelected.dataset.id : null;
      const previousSide = matchContext;
      const result = original.apply(this, args);
      if (matchedPairs.size > before) ok('p2_match', matchedPairs.size - before);
      else if (hadSelected && previousSide !== side && previousId && el && previousId !== el.dataset.id) err('p2_match', 1);
      return result;
    });

    wrap('addCity', function (original, args) {
      const id = args[0];
      const val = Number(args[2]);
      const duplicate = !!cityAdded[id];
      const result = original.apply(this, args);
      if (duplicate) err('p2_city', 1);
      else if (val > 0) ok('p2_city', 1);
      else err('p2_city', 1);
      return result;
    });

    wrap('checkCulturasDrag', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-cult');
      if (fb.classList.contains('ok')) ok('p3_culturas', 1);
      else err('p3_culturas', 1);
      return result;
    });

    wrap('checkActitudes', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-act');
      if (fb.classList.contains('ok')) ok('p3_actitudes', 1);
      else err('p3_actitudes', 1);
      return result;
    });

    wrap('matchClickRep', function (original, args) {
      const el = args[0];
      const side = args[1];
      const before = repMatchPairs.size;
      const hadSelected = !!repMatchSelected;
      const previousId = hadSelected && repMatchSelected ? repMatchSelected.dataset.id : null;
      const previousSide = repMatchContext;
      const result = original.apply(this, args);
      if (repMatchPairs.size > before) ok('p4_match', repMatchPairs.size - before);
      else if (hadSelected && previousSide !== side && previousId && el && previousId !== el.dataset.id) err('p4_match', 1);
      return result;
    });

    wrap('checkSortFinal', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fb-sort-final');
      if (fb.classList.contains('ok')) ok('p4_sort', 1);
      else err('p4_sort', 1);
      return result;
    });

    document.addEventListener('click', function (event) {
      const repBtn = event.target.closest('#repaso-opts .q-opt');
      if (!repBtn || repBtn.disabled) return;
      const buttons = Array.from(document.querySelectorAll('#repaso-opts .q-opt'));
      const chosen = buttons.indexOf(repBtn);
      const current = repasoQ[repIdx];
      if (current && chosen === current.a) ok('p4_repaso', 1);
      else err('p4_repaso', 1);
    }, true);
  }

  ready(function () {
    session.start();
    bindNavigation();
    config.setup();
    bindQuizLinks();
    syncQuizButton();
  });
})();
