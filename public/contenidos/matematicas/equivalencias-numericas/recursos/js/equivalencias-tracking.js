(function () {
  const path = String(window.location.pathname || '').toLowerCase();
  if (!path.includes('/equivalencias-numericas/contenido/')) return;
  if (path.endsWith('/quiz.html')) return;
  if (!window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/equivalencias-numericas\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const contenidoId = 6;
  const totalPaginasMap = { facil: 6, normal: 6, dificil: 8 };
  const totalPaginas = totalPaginasMap[nivel];
  if (!totalPaginas) return;

  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `equivalencias_numericas_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotMate = '/recursos/mascotas/mascota-mate-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        { icon: '&#x1F7E6;', title: 'Unidad completa', text: 'El número 1 representa la unidad completa. Todo el entero debe estar lleno para valer 1.0.' },
        { icon: '&#x1F4CF;', title: 'Décimos', text: 'Cuando una unidad se divide en 10 partes iguales, cada parte vale un décimo: 0.1.' },
        { icon: '&#x1F522;', title: 'Centésimos', text: 'Cuando la unidad se divide en 100 partes iguales, cada parte vale un centésimo: 0.01.' },
        { icon: '&#x2696;&#xFE0F;', title: 'Comparar decimales', text: 'Para comparar decimales, observa primero las unidades y después los décimos o centésimos.' },
        { icon: '&#x1F4CD;', title: 'Recta y modelos', text: 'En la recta numérica, el decimal mayor queda más a la derecha. Los modelos también ayudan a ver qué cantidad representa cada número.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F7E6;', prompt: 'Si una figura está completamente coloreada, ¿qué número representa?', options: ['1.0', '0.1', '0.01'], correct: '1.0', hint: 'La unidad completa vale uno entero.' },
        { icon: '&#x1F4CF;', prompt: 'Si una barra se divide en 10 partes iguales, ¿cuánto vale una parte?', options: ['0.1', '1.0', '0.01'], correct: '0.1', hint: 'Una de diez partes iguales es un décimo.' },
        { icon: '&#x1F522;', prompt: '¿Qué representa mejor a un centésimo?', options: ['0.01', '0.1', '1.0'], correct: '0.01', hint: 'Un centésimo es una de cien partes iguales.' },
        { icon: '&#x2696;&#xFE0F;', prompt: '¿Cuál decimal es mayor?', options: ['0.8', '0.5', 'Son iguales.'], correct: '0.8', hint: 'El decimal con más décimos es mayor.' },
        { icon: '&#x1F4CD;', prompt: 'En la recta numérica, ¿dónde queda el decimal mayor?', options: ['Más a la derecha.', 'Más a la izquierda.', 'En cualquier lugar.'], correct: 'Más a la derecha.', hint: 'En la recta, avanzar a la derecha significa aumentar.' }
      ]
    },
    normal: {
      repasoCards: [
        { icon: '&#x1F4AF;', title: 'Porcentaje de cien', text: 'Si piensas en una cuadrícula de 100 partes, cada porcentaje indica cuántas de esas cien partes están tomadas.' },
        { icon: '&#x1F501;', title: 'Decimal y porcentaje', text: 'Un decimal y un porcentaje pueden decir lo mismo. Por ejemplo, 0.25 es igual a 25%.' },
        { icon: '&#x1F9E9;', title: 'Grupos equivalentes', text: 'Distintas representaciones pueden valer lo mismo si muestran la misma cantidad de la unidad.' },
        { icon: '&#x2696;&#xFE0F;', title: 'Comparar porcentajes', text: 'El porcentaje mayor representa una cantidad mayor. Ayuda pensar cuál está más cerca de 100%.' },
        { icon: '&#x1F522;', title: 'Escalas y barras', text: 'En barras de veinte, cada parte tiene un valor fijo. Contar cuántas partes hay te ayuda a pasar a porcentaje o decimal.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F4AF;', prompt: 'Si una cuadrícula tiene 100 cuadritos y 40 están coloreados, ¿qué porcentaje representa?', options: ['40%', '4%', '0.4%'], correct: '40%', hint: 'De cien partes, cuarenta tomadas equivalen a cuarenta por ciento.' },
        { icon: '&#x1F501;', prompt: '¿Qué porcentaje corresponde a 0.6?', options: ['60%', '6%', '0.06%'], correct: '60%', hint: 'Seis décimos equivalen a sesenta de cada cien.' },
        { icon: '&#x1F9E9;', prompt: 'Si dos dibujos muestran la misma cantidad coloreada, ¿qué puede pasar?', options: ['Que sean equivalentes.', 'Que uno siempre sea mayor.', 'Que no se puedan comparar.'], correct: 'Que sean equivalentes.', hint: 'Dos representaciones distintas pueden valer lo mismo.' },
        { icon: '&#x2696;&#xFE0F;', prompt: '¿Cuál porcentaje es mayor?', options: ['75%', '45%', 'Son iguales.'], correct: '75%', hint: 'Piensa cuál está más cerca del 100%.' },
        { icon: '&#x1F522;', prompt: 'Si una barra de veinte tiene 10 partes tomadas, ¿qué representa?', options: ['La mitad.', 'Un cuarto.', 'Casi todo el entero.'], correct: 'La mitad.', hint: 'Diez de veinte partes es justo la mitad.' }
      ]
    },
    dificil: {
      repasoCards: [
        { icon: '&#x1F355;', title: 'Fracción, decimal y porcentaje', text: 'Una misma cantidad puede escribirse como fracción, decimal o porcentaje. Lo importante es reconocer que representan lo mismo.' },
        { icon: '&#x1F4AF;', title: 'Placas de cien', text: 'Las placas de cien ayudan a ver centésimos y porcentajes. Cada cuadrito vale una de cien partes.' },
        { icon: '&#x1F501;', title: 'Conversiones', text: 'Para convertir, puedes pensar cuánto vale la parte del entero y luego expresar esa misma cantidad en otra forma.' },
        { icon: '&#x1F4CD;', title: 'Recta y comparación', text: 'En la recta numérica, las cantidades equivalentes quedan en el mismo lugar y la mayor siempre queda más a la derecha.' },
        { icon: '&#x1F39F;&#xFE0F;', title: 'Descuentos y orden', text: 'Un descuento mayor representa una parte mayor del total. También conviene ordenar cantidades observando cuál es menor, cuál es mayor y cuáles son equivalentes.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F355;', prompt: '¿Qué pasa con 1/2, 0.5 y 50%?', options: ['Representan la misma cantidad.', 'Siempre son cantidades distintas.', 'Solo dos de ellas son equivalentes.'], correct: 'Representan la misma cantidad.', hint: 'Son tres formas diferentes de escribir la mitad.' },
        { icon: '&#x1F4AF;', prompt: 'En una placa de cien, ¿cuántos cuadritos representan 25%?', options: ['25 cuadritos.', '2 cuadritos.', '250 cuadritos.'], correct: '25 cuadritos.', hint: 'Veinticinco por ciento significa 25 de cada 100.' },
        { icon: '&#x1F501;', prompt: '¿A qué porcentaje equivale 0.75?', options: ['75%', '7.5%', '0.75%'], correct: '75%', hint: 'Setenta y cinco centésimos equivalen a setenta y cinco por ciento.' },
        { icon: '&#x1F4CD;', prompt: 'Si dos cantidades son equivalentes, ¿qué ocurre en la recta numérica?', options: ['Quedan en el mismo lugar.', 'Una siempre queda más arriba.', 'Nunca se pueden ubicar.'], correct: 'Quedan en el mismo lugar.', hint: 'Cantidades iguales comparten la misma posición.' },
        { icon: '&#x1F39F;&#xFE0F;', prompt: '¿Qué descuento es mayor?', options: ['40%', '25%', 'Son iguales.'], correct: '40%', hint: 'El porcentaje más grande representa una parte mayor del total.' }
      ]
    }
  };

  const activeLevelContent = levelContentMap[nivel];
  if (!activeLevelContent) return;
  const repasoCards = activeLevelContent.repasoCards;
  const apoyoQuestions = activeLevelContent.apoyoQuestions;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  function readJson(key) {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function removeJson(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function shuffle(list) {
    const copy = Array.isArray(list) ? list.slice() : [];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function activePageNumber() {
    const pages = Array.from(document.querySelectorAll('.pagina'));
    const active = pages.find(function (page) {
      return page.classList.contains('activa') || page.classList.contains('active');
    });
    if (!active) return 1;
    if (active.id && /^pagina\d+$/.test(active.id)) {
      return Number(active.id.replace('pagina', '')) || 1;
    }
    const index = pages.indexOf(active);
    return index >= 0 ? index + 1 : 1;
  }

  function allPagesSolved() {
    for (let page = 1; page <= totalPaginas; page += 1) {
      if (!(bayesState.solvedPages && bayesState.solvedPages[page])) return false;
    }
    return true;
  }

  function wrap(name, handler) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function () {
      const args = Array.from(arguments);
      return handler.call(this, original, args);
    };
  }

  function ensureStyles() {
    if (document.getElementById('equivalenciasBayesStyles')) return;
    const style = document.createElement('style');
    style.id = 'equivalenciasBayesStyles';
    style.textContent = [
      '.eq-bayes-panel{display:none;max-width:980px;margin:18px auto 0;padding:22px 22px 24px;border-radius:28px;background:#ffffff;border:3px solid #a855f7;box-shadow:0 8px 0 #d8b4fe;color:#6b21a8;}',
      '.eq-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.eq-bayes-title{font-size:1.65rem;color:#7e22ce;margin:0 0 8px;text-align:center;font-weight:900;}',
      '.eq-bayes-text{font-size:1.04rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#6b21a8;}',
      '.eq-bayes-mascot-wrap{background:#faf5ff;border:3px solid #d8b4fe;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(126,34,206,.12);}',
      '.eq-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(107,33,168,.14);}',
      '.eq-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.eq-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #e9d5ff;border-top-color:#a855f7;animation:eqBayesSpin .9s linear infinite;}',
      '@keyframes eqBayesSpin{to{transform:rotate(360deg);}}',
      '.eq-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.eq-bayes-card{background:#faf5ff;border:2px solid #d8b4fe;border-radius:20px;padding:16px;text-align:left;}',
      '.eq-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.eq-bayes-card-title{font-weight:900;color:#7e22ce;font-size:1rem;margin-bottom:6px;}',
      '.eq-bayes-card-text{font-size:.96rem;line-height:1.45;color:#6b21a8;margin:0;}',
      '.eq-bayes-action-wrap{text-align:center;}',
      '.eq-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#f3e8ff;color:#6b21a8;font-weight:900;font-size:1rem;border:3px solid #a855f7;box-shadow:0 5px 0 #d8b4fe;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}',
      '.eq-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #d8b4fe;}',
      '.eq-bayes-practice{margin-top:14px;background:#faf5ff;border:2px solid #d8b4fe;border-radius:22px;padding:18px 16px;}',
      '.eq-bayes-progress{text-align:center;font-weight:900;color:#9333ea;margin-bottom:12px;}',
      '.eq-bayes-question{font-size:1.15rem;font-weight:900;color:#6b21a8;text-align:center;margin:0 0 14px;}',
      '.eq-bayes-options{display:grid;gap:10px;}',
      '.eq-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #d8b4fe;background:#ffffff;color:#6b21a8;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.eq-bayes-option:hover{transform:translateY(-1px);background:#fcfaff;}',
      '.eq-bayes-option.ok{background:#22c55e;border-color:#166534;color:#ffffff;box-shadow:0 6px 0 rgba(22,101,52,.28);transform:translateY(-1px);}',
      '.eq-bayes-option.err{background:#ef4444;border-color:#991b1b;color:#ffffff;box-shadow:0 6px 0 rgba(153,27,27,.22);transform:translateY(-1px);}',
      '.eq-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#7e22ce;}',
      '.eq-bayes-feedback.err{color:#b91c1c;}',
      '.eq-bayes-ready{margin-top:14px;background:#ecfccb;border:2px solid #84cc16;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#3f6212;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensurePanel() {
    ensureStyles();
    let panel = document.getElementById('equivalenciasBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'equivalenciasBayesPanel';
    panel.className = 'eq-bayes-panel';

    const quizButton = document.getElementById('btnMiniQuiz') || document.querySelector('.boton-quiz');
    if (quizButton && quizButton.parentNode) {
      quizButton.parentNode.insertBefore(panel, quizButton);
    } else {
      document.body.appendChild(panel);
    }
    return panel;
  }

  function readSessionUuid() {
    const meta = window.getStoredReforzamientoSessionMeta
      ? window.getStoredReforzamientoSessionMeta(contenidoId, nivel, estilo, sessionStorageKey)
      : null;
    return meta && typeof meta.sessionUuid === 'string' ? meta.sessionUuid : '';
  }

  function createEmptyState(sessionUuid) {
    return { sessionUuid: sessionUuid || '', loading: false, recommendation: '', confidence: null, repasoDone: false, apoyoDone: false, apoyoIndex: 0, sessionClosed: false, fallback: false, solvedPages: {} };
  }

  function computeQuizUnlocked(state) {
    if (!state || !state.recommendation) return false;
    if (state.recommendation === 'avance' || state.recommendation === 'mantener') return true;
    if (state.recommendation === 'repaso') return state.repasoDone === true;
    if (state.recommendation === 'apoyo') return state.apoyoDone === true;
    return false;
  }

  function readState() {
    const stored = readJson(bayesStateStorageKey);
    if (!stored || typeof stored !== 'object') return null;
    const currentSessionUuid = readSessionUuid();
    if (stored.sessionUuid && currentSessionUuid && stored.sessionUuid !== currentSessionUuid) {
      removeJson(bayesStateStorageKey);
      return null;
    }
    return {
      sessionUuid: typeof stored.sessionUuid === 'string' ? stored.sessionUuid : currentSessionUuid,
      loading: stored.loading === true,
      recommendation: typeof stored.recommendation === 'string' ? stored.recommendation : '',
      confidence: Number.isFinite(Number(stored.confidence)) ? Number(stored.confidence) : null,
      repasoDone: stored.repasoDone === true,
      apoyoDone: stored.apoyoDone === true,
      apoyoIndex: Number.isFinite(Number(stored.apoyoIndex)) ? Math.max(0, Math.min(Number(stored.apoyoIndex), apoyoQuestions.length)) : 0,
      sessionClosed: stored.sessionClosed === true,
      fallback: stored.fallback === true,
      solvedPages: stored.solvedPages && typeof stored.solvedPages === 'object' ? stored.solvedPages : {}
    };
  }

  const sessionTracker = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel: nivel,
    estilo: estilo,
    storageKey: sessionStorageKey,
    detalleBase: { bloque: 'equivalencias_numericas', archivo: `${estilo}_${nivel}_bayes` }
  });

  let bayesState = readState() || createEmptyState(readSessionUuid());
  let bayesRequestPromise = null;

  function persistState() {
    if (!bayesState.sessionUuid && !bayesState.recommendation && !bayesState.loading) {
      removeJson(bayesStateStorageKey);
      return;
    }
    writeJson(bayesStateStorageKey, {
      sessionUuid: bayesState.sessionUuid,
      loading: bayesState.loading,
      recommendation: bayesState.recommendation,
      confidence: bayesState.confidence,
      repasoDone: bayesState.repasoDone,
      apoyoDone: bayesState.apoyoDone,
      apoyoIndex: bayesState.apoyoIndex,
      sessionClosed: bayesState.sessionClosed,
      fallback: bayesState.fallback,
      solvedPages: bayesState.solvedPages
    });
  }

  function updateState(patch) {
    const currentSessionUuid = readSessionUuid();
    if (bayesState.sessionUuid && currentSessionUuid && bayesState.sessionUuid !== currentSessionUuid) {
      bayesState = createEmptyState(currentSessionUuid);
    }
    bayesState = { ...bayesState, ...patch };
    if (!bayesState.sessionUuid) bayesState.sessionUuid = currentSessionUuid;
    persistState();
    renderPanel();
    syncQuizButton();
  }

  function markSolvedPage(page) {
    const pageNumber = Number(page);
    if (!Number.isFinite(pageNumber) || pageNumber < 1) return;
    if (bayesState.solvedPages && bayesState.solvedPages[pageNumber]) return;
    updateState({
      solvedPages: {
        ...(bayesState.solvedPages || {}),
        [pageNumber]: true
      }
    });
  }

  function scrollPanelIntoView() {
    const panel = document.getElementById('equivalenciasBayesPanel');
    if (!panel || panel.style.display === 'none') return;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderPanel() {
    const panel = ensurePanel();
    const onFinalPage = activePageNumber() === totalPaginas;
    const solved = allPagesSolved();

    if (!onFinalPage || !solved) {
      panel.style.display = 'none';
      panel.removeAttribute('data-kind');
      panel.innerHTML = '';
      return;
    }

    panel.style.display = 'block';

    if (bayesState.loading) {
      panel.dataset.kind = 'loading';
      panel.innerHTML = '<div class="eq-bayes-loader"><div class="eq-bayes-spinner" aria-hidden="true"></div><h3 class="eq-bayes-title">Estamos revisando tu avance</h3><p class="eq-bayes-text">Espera tantito. Ya casi te decimos cómo seguir.</p></div>';
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = `<div class="eq-bayes-mascot-wrap"><img src="${mascotMate}" alt="Capibara felicitando" class="eq-bayes-mascot"></div>`;
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = '<h3 class="eq-bayes-title">Vas muy bien</h3><p class="eq-bayes-text">Entendiste bien este nivel y ya puedes seguir con confianza al quiz.</p>';
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return `<article class="eq-bayes-card"><span class="eq-bayes-card-icon">${card.icon}</span><div class="eq-bayes-card-title">${card.title}</div><p class="eq-bayes-card-text">${card.text}</p></article>`;
      }).join('');

      panel.innerHTML = '<h3 class="eq-bayes-title">Tarjetas para recordar</h3><p class="eq-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p><div class="eq-bayes-card-grid">' + cards + '</div>' + (bayesState.repasoDone ? '<div class="eq-bayes-ready">Listo. Ya puedes ir al quiz.</div>' : '<div class="eq-bayes-action-wrap"><button type="button" class="eq-bayes-action" id="eqBayesRepasoBtn">Listo, ya lo recordé</button></div>');

      const repasoBtn = document.getElementById('eqBayesRepasoBtn');
      if (repasoBtn) {
        repasoBtn.addEventListener('click', function () {
          updateState({ repasoDone: true });
        });
      }
      return;
    }

    if (bayesState.recommendation === 'apoyo') {
      panel.dataset.kind = 'apoyo';

      if (bayesState.apoyoDone) {
        panel.innerHTML = '<h3 class="eq-bayes-title">Práctica extra terminada</h3><p class="eq-bayes-text">Terminaste la práctica extra. Ahora sí ya puedes ir al quiz.</p><div class="eq-bayes-ready">Sigue con calma y lee cada pregunta con mucha atención.</div>';
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = shuffle(currentQuestion.options).map(function (option) {
        return `<button type="button" class="eq-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = `<h3 class="eq-bayes-title">Práctica extra antes del quiz</h3><p class="eq-bayes-text">Vamos paso a paso. Primero haremos una práctica corta para recordar lo más importante.</p><div class="eq-bayes-practice"><div class="eq-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div><p class="eq-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p><div class="eq-bayes-options">${optionsMarkup}</div><div class="eq-bayes-feedback" id="eqBayesApoyoFeedback" aria-live="polite"></div></div>`;

      const feedback = document.getElementById('eqBayesApoyoFeedback');
      panel.querySelectorAll('.eq-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-value') || '';
          const allButtons = Array.from(panel.querySelectorAll('.eq-bayes-option'));
          if (selected === currentQuestion.correct) {
            allButtons.forEach(function (item) { item.disabled = true; });
            button.classList.add('ok');
            feedback.className = 'eq-bayes-feedback';
            feedback.textContent = bayesState.apoyoIndex + 1 >= apoyoQuestions.length ? 'Muy bien. Ya terminaste esta práctica.' : 'Correcto. Ahora vamos con la siguiente.';

            const nextIndex = bayesState.apoyoIndex + 1;
            window.setTimeout(function () {
              if (nextIndex >= apoyoQuestions.length) {
                updateState({ apoyoDone: true, apoyoIndex: apoyoQuestions.length });
              } else {
                updateState({ apoyoIndex: nextIndex });
              }
            }, 1250);
            return;
          }

          button.disabled = true;
          button.classList.add('err');
          feedback.className = 'eq-bayes-feedback err';
          feedback.textContent = `Incorrecto. ${currentQuestion.hint}`;
          window.setTimeout(function () {
            button.classList.remove('err');
            button.disabled = false;
          }, 1250);
        });
      });
      return;
    }

    panel.style.display = 'none';
    panel.removeAttribute('data-kind');
    panel.innerHTML = '';
  }

  function syncQuizButton() {
    const quizButton = document.getElementById('btnMiniQuiz') || document.querySelector('.boton-quiz');
    if (!quizButton) return;

    const showQuiz = activePageNumber() === totalPaginas && allPagesSolved();
    const unlocked = showQuiz && computeQuizUnlocked(bayesState);

    quizButton.style.display = showQuiz ? 'flex' : 'none';
    if (showQuiz) {
      quizButton.style.marginLeft = 'auto';
      quizButton.style.marginRight = 'auto';
    }
    quizButton.classList.toggle('bloqueado', !unlocked);
    quizButton.setAttribute('aria-disabled', String(!unlocked));
    quizButton.style.opacity = unlocked ? '1' : '0.68';
    quizButton.style.filter = unlocked ? 'none' : 'grayscale(0.08)';
  }

  async function resolveBayesFlow() {
    if (bayesState.recommendation || bayesState.loading) return bayesState;
    if (!(activePageNumber() === totalPaginas && allPagesSolved())) return bayesState;
    if (bayesRequestPromise) return bayesRequestPromise;

    bayesRequestPromise = (async function () {
      updateState({ loading: true });
      const response = await sessionTracker.complete({ eventoCierre: 'nivel' });
      const recommendation = response && response.recomendacion_bayes ? response.recomendacion_bayes.recomendacion || '' : '';
      const confidence = response && response.recomendacion_bayes ? response.recomendacion_bayes.confianza ?? null : null;

      if (recommendation) {
        updateState({ loading: false, recommendation: recommendation, confidence: confidence, sessionClosed: true, fallback: false });
      } else {
        updateState({ loading: false, recommendation: 'mantener', confidence: null, sessionClosed: response && response.success === true, fallback: true });
      }
      return bayesState;
    })();

    try {
      return await bayesRequestPromise;
    } finally {
      bayesRequestPromise = null;
    }
  }

  function scheduleSync() {
    window.setTimeout(function () {
      syncQuizButton();
      renderPanel();
      if (activePageNumber() === totalPaginas && allPagesSolved() && !bayesState.recommendation && !bayesState.loading) {
        resolveBayesFlow();
      }
    }, 0);
  }

  function bindNavigation() {
    wrap('completarPagina', function (original, args) {
      const page = args[0];
      const result = original.apply(this, args);
      Promise.resolve(result).finally(function () {
        markSolvedPage(page);
        scheduleSync();
      });
      return result;
    });

    ['cambiarPagina', 'actualizarNav', 'actualizarNavegacion', 'actualizarEstadoQuiz', 'actualizarBotonQuiz'].forEach(function (name) {
      wrap(name, function (original, args) {
        const result = original.apply(this, args);
        scheduleSync();
        return result;
      });
    });

    const observer = new MutationObserver(function (mutations) {
      const hasExternalMutation = mutations.some(function (mutation) {
        const target = mutation && mutation.target;
        return !(target && target.closest && target.closest('#equivalenciasBayesPanel'));
      });
      if (!hasExternalMutation) return;
      scheduleSync();
    });

    document.querySelectorAll('.pagina').forEach(function (page) {
      observer.observe(page, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: true
      });
    });
  }

  function bindQuizButton() {
    const quizButton = document.getElementById('btnMiniQuiz') || document.querySelector('.boton-quiz');
    if (!quizButton || quizButton.dataset.equivalenciasBayesBound === 'true') return;

    quizButton.dataset.equivalenciasBayesBound = 'true';
    quizButton.addEventListener('click', async function (event) {
      const href = quizButton.getAttribute('href');
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!allPagesSolved()) {
        scrollPanelIntoView();
        return;
      }

      if (!bayesState.recommendation && !bayesState.loading) {
        await resolveBayesFlow();
      }

      if (!computeQuizUnlocked(bayesState)) {
        renderPanel();
        scrollPanelIntoView();
        return;
      }

      if (href) {
        window.location.href = href;
      }
    });
  }

  ready(function () {
    sessionTracker.start();
    bayesState = readState() || createEmptyState(readSessionUuid());
    bindNavigation();
    bindQuizButton();
    syncQuizButton();
    renderPanel();
    if (activePageNumber() === totalPaginas && allPagesSolved() && !bayesState.recommendation && !bayesState.loading) {
      resolveBayesFlow();
    }
  });
})();
