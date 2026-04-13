(function () {
  const path = (window.location.pathname || '').toLowerCase();
  if (!path.includes('/componentes-naturales/contenido/')) return;
  if (!window.createReforzamientoTracker || !window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/componentes-naturales\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const fileKey = nivel + '/' + estilo;

  const SETUPS = {
    'facil/visual_verbal': setupEasyVisualVerbal,
    'facil/visual_no_verbal': setupEasyVisualNoVerbal,
    'facil/auditivo': setupEasyAuditivo,
    'facil/kinestesico': setupEasyKinestesico,
    'normal/visual_verbal': setupWaterTextGame,
    'normal/kinestesico': setupWaterTextGame,
    'dificil/visual_verbal': setupWaterTextGame,
    'normal/visual_no_verbal': setupWaterVisualNoVerbal,
    'normal/auditivo': setupWaterAudioGame,
    'dificil/auditivo': setupWaterAudioGame,
    'dificil/visual_no_verbal': setupRegionsVisualNoVerbal,
    'dificil/kinestesico': setupRegionsKinestesico
  };

  const setup = SETUPS[fileKey];
  if (typeof setup !== 'function') return;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function countVisible(selector, root) {
    return Array.from((root || document).querySelectorAll(selector)).filter(isVisible).length;
  }

  function countTrue(list) {
    return Array.isArray(list) ? list.filter(Boolean).length : 0;
  }

  function pageKey(page) {
    return 'pagina' + page + '_actividad';
  }

  function pageFromNode(node, fallback) {
    const page = node && node.closest ? node.closest('.pagina[id^="pagina"]') : null;
    const value = page ? parseInt(page.id.replace('pagina', ''), 10) : Number(fallback || 0);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  function activePage() {
    return pageFromNode(document.querySelector('.pagina.activa[id^="pagina"]'), 1);
  }

  function buildApartados() {
    const total = document.querySelectorAll('.pagina[id^="pagina"]').length || 1;
    const apartados = {};
    for (let page = 1; page <= total; page += 1) {
      apartados[pageKey(page)] = {
        pagina: page,
        apartadoClave: pageKey(page),
        tipoActividad: 'reforzamiento'
      };
    }
    return { apartados, total };
  }

  const built = buildApartados();
  const tracker = window.createReforzamientoTracker({
    trackTime: false,
    contenidoId: 2,
    nivel,
    estilo,
    detalleBase: { bloque: 'componentes_naturales' },
    apartados: built.apartados
  });

  const session = window.createReforzamientoSessionTracker({
    contenidoId: 2,
    nivel,
    estilo,
    detalleBase: { bloque: 'componentes_naturales' }
  });

  function ok(page, count) {
    tracker.addCorrect(pageKey(page), count || 1);
  }

  function err(page, count) {
    tracker.addError(pageKey(page), count || 1);
  }

  function done(page) {
    tracker.complete(pageKey(page));
  }

  function observeSuccess(id, page, addCorrectCount) {
    const el = document.getElementById(id);
    if (!el) return;

    const check = function () {
      if (!isVisible(el)) return;
      if (addCorrectCount) ok(page, addCorrectCount);
      done(page);
    };

    const observer = new MutationObserver(check);
    observer.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    check();
  }

  function observeDisplay(id, page) {
    observeSuccess(id, page, 0);
  }

  function wrap(name, fn) {
    const original = window[name];
    if (typeof original !== 'function') return;

    window[name] = function () {
      const args = Array.from(arguments);
      return fn.call(this, original, args);
    };
  }

  function syncQuizButton() {
    const total = built.total;
    const current = activePage();
    document.querySelectorAll('.btn-quiz, .boton-quiz').forEach((button) => {
      button.style.display = current === total ? 'block' : 'none';
    });
    tracker.markPageVisibleByNumber(current);
  }

  function bindUiRefresh() {
    wrap('actualizarUI', function (original, args) {
      const result = original.apply(this, args);
      setTimeout(syncQuizButton, 0);
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
    document.querySelectorAll('.pagina[id^="pagina"]').forEach((page) => {
      observer.observe(page, { attributes: true, attributeFilter: ['class', 'style'] });
    });
  }

  function setupEasyVisualVerbal() {
    let flashSeen = 0;

    wrap('ahPulsar', function (original, args) {
      const beforeErrors = ahErrores;
      const beforeSolved = countTrue(ahProgOk);
      const result = original.apply(this, args);
      const afterErrors = ahErrores;
      const afterSolved = countTrue(ahProgOk);
      if (afterErrors > beforeErrors) err(1, afterErrors - beforeErrors);
      if (afterSolved > beforeSolved) ok(1, afterSolved - beforeSolved);
      if (afterSolved === AH_PALABRAS.length) done(1);
      return result;
    });

    wrap('verificar4f', function (original, args) {
      const beforeIndex = retoIdx;
      const goal = RETOS4F[retoIdx] ? RETOS4F[retoIdx].palabra : '';
      const guess = Array.isArray(r4fRespuesta) ? r4fRespuesta.join('') : '';
      const result = original.apply(this, args);
      if (guess) {
        if (guess === goal && retoIdx > beforeIndex) ok(2, retoIdx - beforeIndex);
        if (guess !== goal) err(2, 1);
      }
      if (retoIdx >= RETOS4F.length) done(2);
      return result;
    });

    wrap('intentarCtx', function (original, args) {
      const input = document.getElementById('ctxInput');
      const value = input ? input.value.trim() : '';
      const pct = value ? getPct(value) : null;
      const result = original.apply(this, args);
      if (!value) return result;
      if (pct === 100) {
        ok(3, 1);
        done(3);
      } else {
        err(3, 1);
      }
      return result;
    });

    wrap('elegirDingbat', function (original, args) {
      const option = args[0];
      const current = DINGBATS[dIdx];
      const beforeSolved = countTrue(dResueltos);
      const result = original.apply(this, args);
      if (current) {
        if (option === current.correcta) ok(4, 1);
        else err(4, 1);
      }
      if (countTrue(dResueltos) > beforeSolved && countTrue(dResueltos) === DINGBATS.length) done(4);
      return result;
    });

    wrap('renderFlash', function (original, args) {
      const result = original.apply(this, args);
      const seen = countTrue(fVistos);
      if (seen > flashSeen) {
        ok(5, seen - flashSeen);
        flashSeen = seen;
      }
      if (seen === FLASHCARDS.length) done(5);
      return result;
    });
  }

  function setupEasyVisualNoVerbal() {
    let seenFlip = 0;
    let checklist = 0;

    wrap('elegirP1', function (original, args) {
      const correct = args[1] === true;
      const before = p1i;
      const result = original.apply(this, args);
      if (correct && p1i > before) ok(1, 1);
      if (!correct) err(1, 1);
      if (p1i >= P1Q.length) done(1);
      return result;
    });

    wrap('saltarA', function (original, args) {
      const correct = args[1] === true;
      const before = p2i;
      const result = original.apply(this, args);
      if (correct && p2i > before) ok(2, 1);
      if (!correct) err(2, 1);
      if (p2i >= P2Q.length || isVisible(document.getElementById('p2Orilla'))) done(2);
      return result;
    });

    const flipObserver = new MutationObserver(function () {
      const current = countVisible('.evin-dot.visto', document.getElementById('p3Dots'));
      if (current > seenFlip) {
        ok(3, current - seenFlip);
        seenFlip = current;
      }
    });

    const p3Dots = document.getElementById('p3Dots');
    if (p3Dots) {
      flipObserver.observe(p3Dots, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] });
    }
    observeSuccess('p3FbOk', 3, 0);

    wrap('clasificarEn4', function (original, args) {
      const zone = args[0];
      const selected = p4sel;
      const result = original.apply(this, args);
      if (!zone || !selected) return result;
      if (selected.dataset.cat === zone.dataset.cat) ok(4, 1);
      else err(4, 1);
      if (p4ok === P4I.length) done(4);
      return result;
    });

    const checkWrap = document.getElementById('checkWrap');
    if (checkWrap) {
      checkWrap.addEventListener('click', function () {
        setTimeout(function () {
          if (chkOk > checklist) {
            ok(5, chkOk - checklist);
          }
          checklist = chkOk;
        }, 0);
      }, true);
    }
    observeSuccess('fbCheck', 5, 0);
  }

  function setupEasyAuditivo() {
    wrap('verificarJuego1', function (original, args) {
      const beforeTurn = turnoActual;
      const beforeScore = puntajeJ1;
      const result = original.apply(this, args);
      if (puntajeJ1 > beforeScore || turnoActual > beforeTurn) ok(1, Math.max(1, puntajeJ1 - beforeScore));
      else if (document.getElementById('feedbackJuego1') && isVisible(document.getElementById('feedbackJuego1'))) err(1, 1);
      if (turnoActual >= relievesOrden.length || document.getElementById('btnVerificar1').disabled) done(1);
      return result;
    });

    wrap('intentarConectar3', function (original, args) {
      const ready = audioSeleccionado3 && fotoSeleccionada3;
      const beforeScore = puntajeJ3;
      const result = original.apply(this, args);
      if (!ready) return result;
      if (puntajeJ3 > beforeScore) ok(3, puntajeJ3 - beforeScore);
      else err(3, 1);
      const total = document.querySelectorAll('#pagina3 .unir-item-audio').length;
      if (puntajeJ3 === total && total > 0) done(3);
      return result;
    });
  }

  function setupEasyKinestesico() {
    let page4Pairs = 0;

    wrap('verificarFotos', function (original, args) {
      const guess = Array.isArray(respuesta) ? respuesta.join('') : '';
      const result = original.apply(this, args);
      if (!guess) return result;
      if (guess === PALABRA) {
        ok(1, 1);
        done(1);
      } else {
        err(1, 1);
      }
      return result;
    });

    wrap('resolverMovimiento2', function (original, args) {
      const before = ok2;
      const result = original.apply(this, args);
      if (ok2 > before) ok(2, ok2 - before);
      else if (isVisible(document.getElementById('errPag2'))) err(2, 1);
      if (ok2 === TOTAL2) done(2);
      return result;
    });
    observeSuccess('fbPag2', 2, 0);

    wrap('colocarEnSlot3', function (original, args) {
      const slot = args[0];
      const piece = piezaSel3;
      const result = original.apply(this, args);
      if (!slot || !piece) return result;
      if (slot.dataset.slot === piece.dataset.id) ok(3, 1);
      else err(3, 1);
      if (piezasOk3 === TOTAL3) done(3);
      return result;
    });

    const page4 = document.getElementById('pagina4');
    if (page4) {
      const observer = new MutationObserver(function () {
        const pairs = document.querySelectorAll('#pagina4 .pieza-par.emparejada').length / 2;
        if (pairs > page4Pairs) {
          ok(4, pairs - page4Pairs);
          page4Pairs = pairs;
        }
        if (countVisible('#pagina4 .pieza-par.flash-err') > 0) err(4, 1);
      });
      observer.observe(page4, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] });
    }
    observeSuccess('fbPag4', 4, 0);

    wrap('verificarSeq', function (original, args) {
      const result = original.apply(this, args);
      if (isVisible(document.getElementById('fbPag5'))) {
        ok(5, 1);
        done(5);
      } else if (isVisible(document.getElementById('errPag5'))) {
        err(5, 1);
      }
      return result;
    });
  }

  function setupWaterTextGame() {
    wrap('celdaSopa', function (original, args) {
      const before = sopaState1 && sopaState1.encontradas ? sopaState1.encontradas.size : 0;
      const result = original.apply(this, args);
      const after = sopaState1 && sopaState1.encontradas ? sopaState1.encontradas.size : 0;
      if (after > before) ok(1, after - before);
      if (sopaData1 && after === sopaData1.palabras.length) done(1);
      return result;
    });

    wrap('respAdiv', function (original, args) {
      const button = args[0];
      const correctId = args[2];
      const page = pageFromNode(button, activePage());
      const result = original.apply(this, args);
      if (!button) return result;
      if (button.dataset.id === correctId) {
        ok(page, 1);
        done(page);
      } else {
        err(page, 1);
      }
      return result;
    });

    wrap('verificarTextoRoto', function (original, args) {
      const feedbackId = args[0];
      const feedback = document.getElementById(feedbackId);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (feedback.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('verificarTextoRoto2', function (original, args) {
      const feedbackId = args[0];
      const feedback = document.getElementById(feedbackId);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (feedback.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('verificarCrucigrama', function (original, args) {
      const containerId = args[0];
      const retroId = args[1];
      const retro = document.getElementById(retroId);
      const page = pageFromNode(document.getElementById(containerId) || retro, activePage());
      const result = original.apply(this, args);
      if (!retro) return result;
      if (retro.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (retro.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('respRuleta', function (original, args) {
      const button = args[0];
      const answer = args[1];
      const correct = args[2];
      const page = pageFromNode(button, activePage());
      const result = original.apply(this, args);
      if (answer === correct) {
        ok(page, 1);
        done(page);
      } else {
        err(page, 1);
      }
      return result;
    });

    wrap('presionarTecla', function (original, args) {
      const beforeIndex = ahIdx;
      const beforeLives = ahVidas;
      const button = args[1];
      const page = pageFromNode(button, activePage());
      const result = original.apply(this, args);
      if (ahVidas < beforeLives) err(page, beforeLives - ahVidas);
      if (ahIdx > beforeIndex) ok(page, ahIdx - beforeIndex);
      if (ahIdx >= ahPalabras.length) done(page);
      return result;
    });
  }

  function setupWaterVisualNoVerbal() {
    wrap('respTarj', function (original, args) {
      const element = args[0];
      const correctId = args[2];
      const page = pageFromNode(element, activePage());
      const result = original.apply(this, args);
      if (element && element.dataset.id === correctId) {
        ok(page, 1);
        done(page);
      } else {
        err(page, 1);
      }
      return result;
    });

    wrap('respPie', function (original, args) {
      const touched = args[0];
      const correct = args[1];
      const feedback = document.getElementById(args[2]);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (touched === correct) {
        ok(page, 1);
        done(page);
      } else {
        err(page, 1);
      }
      return result;
    });

    wrap('verificarOrdV', function (original, args) {
      const feedback = document.getElementById(args[2]);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (feedback.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('selMatch', function (original, args) {
      const group = args[1];
      const leftBefore = document.querySelectorAll('#mc_izq_' + group + ' .match-item.matched').length;
      const readyBefore = !!(matchSel[group + '_izq'] && matchSel[group + '_der']);
      const page = pageFromNode(document.getElementById('mc_izq_' + group), activePage());
      const result = original.apply(this, args);
      const leftAfter = document.querySelectorAll('#mc_izq_' + group + ' .match-item.matched').length;
      if (leftAfter > leftBefore) {
        ok(page, leftAfter - leftBefore);
      } else if (readyBefore) {
        err(page, 1);
      }
      const total = document.querySelectorAll('#mc_izq_' + group + ' .match-item').length;
      if (total > 0 && leftAfter === total) done(page);
      return result;
    });
  }

  function setupWaterAudioGame() {
    wrap('verFrases', function (original, args) {
      const feedback = document.getElementById(args[1]);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (feedback.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('verSlider', function (original, args) {
      const feedback = document.getElementById('fbSlider');
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(2, 1);
        done(2);
      } else if (feedback.classList.contains('mal')) {
        err(2, 1);
      }
      return result;
    });

    wrap('verOrden', function (original, args) {
      const feedback = document.getElementById(args[2]);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        done(page);
      } else if (feedback.classList.contains('mal')) {
        err(page, 1);
      }
      return result;
    });

    wrap('tentarMatch', function (original, args) {
      const gid = args[0];
      const readyBefore = !!(matchState['izq' + gid] && matchState['der' + gid]);
      const before = document.querySelectorAll('#mi' + gid + ' .mi.ok').length;
      const page = pageFromNode(document.getElementById('mi' + gid), activePage());
      const result = original.apply(this, args);
      const after = document.querySelectorAll('#mi' + gid + ' .mi.ok').length;
      if (after > before) ok(page, after - before);
      else if (readyBefore) err(page, 1);
      const total = document.querySelectorAll('#mi' + gid + ' .mi').length;
      if (total > 0 && after === total) done(page);
      return result;
    });

    wrap('respVF', function (original, args) {
      const button = args[0];
      const expected = args[1];
      const answer = args[2];
      const page = pageFromNode(button, activePage());
      const result = original.apply(this, args);
      if (expected === answer) ok(page, 1);
      else err(page, 1);
      return result;
    });

    wrap('respQR4', function (original, args) {
      const answer = args[1];
      const correct = args[2];
      const result = original.apply(this, args);
      if (answer === correct) ok(4, 1);
      else err(4, 1);
      if (typeof ptsQR4 !== 'undefined' && ptsQR4 === qrData4.length) done(4);
      return result;
    });

    wrap('respSM', function (original, args) {
      const button = args[0];
      const answer = args[1];
      const correct = args[2];
      const cid = args[3];
      const container = document.getElementById(cid);
      const page = pageFromNode(container, activePage());
      const result = original.apply(this, args);
      if (answer === correct) ok(page, 1);
      else err(page, 1);
      if (typeof smScore !== 'undefined' && smScore[cid] === smData[cid].length) done(page);
      return result;
    });
  }

  function setupRegionsVisualNoVerbal() {
    let memPairs = 0;
    let memHadTwo = false;

    wrap('difSelec', function (original, args) {
      const isReal = args[1] === true;
      const before = difPunt;
      const result = original.apply(this, args);
      if (isReal && difPunt > before) ok(1, difPunt - before);
      if (!isReal) err(1, 1);
      const total = DIF_RONDAS[difRonda].difs.filter(function (item) { return item.real; }).length;
      if (difPunt === total && difRonda >= DIF_RONDAS.length - 1 && isVisible(document.getElementById('difFbOk'))) done(1);
      return result;
    });

    const memBoard = document.getElementById('memTablero');
    if (memBoard) {
      const observer = new MutationObserver(function () {
        const found = document.querySelectorAll('#memTablero .mem-carta.encontrada').length / 2;
        const flipped = document.querySelectorAll('#memTablero .mem-carta.volteada').length;
        if (found > memPairs) {
          ok(2, found - memPairs);
          memPairs = found;
          memHadTwo = false;
        } else if (memHadTwo && flipped === 0) {
          err(2, 1);
          memHadTwo = false;
        }
        if (flipped >= 2) memHadTwo = true;
      });
      observer.observe(memBoard, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] });
    }
    observeSuccess('memFbOk', 2, 0);

    wrap('labMover', function (original, args) {
      const beforeReached = labTotalLL;
      const current = labPosP[labActive] ? { c: labPosP[labActive].c, r: labPosP[labActive].r } : null;
      const result = original.apply(this, args);
      if (labTotalLL > beforeReached) ok(3, labTotalLL - beforeReached);
      else if (current && labPosP[labActive] && current.c === labPosP[labActive].c && current.r === labPosP[labActive].r) err(3, 1);
      if (labTotalLL === LAB_DATA[labActual].personas.length && isVisible(document.getElementById('labFbOk'))) done(3);
      return result;
    });

    wrap('ranaResponder', function (original, args) {
      const idx = args[0];
      const question = args[2];
      const before = ranaPos;
      const result = original.apply(this, args);
      if (idx === question.correcta && ranaPos > before) ok(4, ranaPos - before);
      else if (idx !== question.correcta) err(4, 1);
      if (typeof ranaQ !== 'undefined' && ranaQ >= RANA_PREGS.length - 1 && isVisible(document.getElementById('ranaBtnSig'))) {
        observeDisplay('ranaFinal', 4);
      }
      return result;
    });
    observeDisplay('ranaFinal', 4);
  }

  function setupRegionsKinestesico() {
    wrap('simonResponder', function (original, args) {
      const idx = args[0];
      const question = args[2];
      const before = simonCorrectas;
      const result = original.apply(this, args);
      if (idx === question.correcta && simonCorrectas > before) ok(1, simonCorrectas - before);
      else if (idx !== question.correcta) err(1, 1);
      return result;
    });

    wrap('simonTimeout', function (original, args) {
      const result = original.apply(this, args);
      err(1, 1);
      return result;
    });
    observeDisplay('simonResultado', 1);

    wrap('rompeColocar', function (original, args) {
      const cellIndex = args[0];
      const selected = rompePiezaSel;
      const before = rompeColocadas;
      const result = original.apply(this, args);
      if (selected === null) return result;
      if (selected === cellIndex && rompeColocadas > before) ok(2, rompeColocadas - before);
      else if (selected !== cellIndex) err(2, 1);
      return result;
    });

    wrap('rompeMostrarComp', function (original, args) {
      const result = original.apply(this, args);
      if (rompeCompletados.every(Boolean)) done(2);
      return result;
    });

    wrap('clasifColocar', function (original, args) {
      const groupId = args[0];
      const before = clasifCorrectos;
      let expected = null;
      if (clasifSel !== null) {
        const selected = document.querySelector('.elem-clasif[data-idx="' + clasifSel + '"]');
        expected = selected ? selected.dataset.grupo : null;
      }
      const result = original.apply(this, args);
      if (clasifCorrectos > before) ok(3, clasifCorrectos - before);
      else if (expected && expected !== groupId) err(3, 1);
      if (clasifCorrectos === CLASIF_ELEMS.length) done(3);
      return result;
    });

    wrap('fotosVerificar', function (original, args) {
      const round = fotosRondaActual;
      const goal = FOTOS_RONDAS[round] ? FOTOS_RONDAS[round].palabra : '';
      const guess = Array.isArray(fotosRespuesta) ? fotosRespuesta.join('') : '';
      const result = original.apply(this, args);
      if (!guess) return result;
      if (guess === goal) ok(4, 1);
      else err(4, 1);
      return result;
    });
    observeDisplay('fotosFinalpanel', 4);
  }

  ready(function () {
    session.start();
    session.attachQuizLinks('.btn-quiz, .boton-quiz');
    bindUiRefresh();
    setup();
    syncQuizButton();
  });
})();
