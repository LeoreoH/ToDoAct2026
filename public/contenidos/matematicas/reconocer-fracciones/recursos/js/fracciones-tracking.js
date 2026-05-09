(function () {
  const path = String(window.location.pathname || '').toLowerCase();
  if (!path.includes('/reconocer-fracciones/contenido/')) return;
  if (path.endsWith('/quiz.html')) return;
  if (!window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/reconocer-fracciones\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const contenidoId = 4;
  const totalPaginasMap = { facil: 7, normal: 8, dificil: 8 };
  const totalPaginas = totalPaginasMap[nivel];
  if (!totalPaginas) return;

  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `reconocer_fracciones_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotMate = '/recursos/mascotas/mascota-mate-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        { icon: '&#x1F36B;', title: 'Unidad completa', text: 'Una fracción siempre parte de una unidad completa. Primero conviene mirar el entero antes de contar partes.' },
        { icon: '&#x2702;&#xFE0F;', title: 'Partes iguales', text: 'Para formar una fracción, la unidad debe dividirse en partes del mismo tamaño. Si las partes son diferentes, no representa bien la fracción.' },
        { icon: '&#x1F9EE;', title: 'Numerador y denominador', text: 'El numerador dice cuántas partes tomas. El denominador dice en cuántas partes iguales se dividió la unidad.' },
        { icon: '&#x1F522;', title: 'Cuartos', text: 'Si una unidad se divide en 4 partes iguales, cada parte vale un cuarto: 1/4.' },
        { icon: '&#x1F4CF;', title: 'Orden y recta numérica', text: 'En la recta, 1/4 va antes que 2/4 y 2/4 va antes que 3/4. Avanzar a la derecha significa una cantidad mayor.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F36B;', prompt: 'Antes de pensar en una fracción, ¿qué conviene mirar primero?', options: ['La unidad completa.', 'Solo el color del dibujo.', 'Solo una parte suelta.'], correct: 'La unidad completa.', hint: 'Primero hay que saber cuál es el entero.' },
        { icon: '&#x2702;&#xFE0F;', prompt: 'Para que una fracción esté bien representada, ¿cómo deben ser las partes?', options: ['Iguales.', 'De distintos tamaños.', 'Unas largas y otras cortas.'], correct: 'Iguales.', hint: 'Todas las partes deben medir lo mismo.' },
        { icon: '&#x1F9EE;', prompt: '¿Qué te dice el numerador?', options: ['Cuántas partes tomas.', 'Cuántas unidades completas hay.', 'De qué color es la figura.'], correct: 'Cuántas partes tomas.', hint: 'Piensa en la cantidad que eliges.' },
        { icon: '&#x1F522;', prompt: 'Si una unidad se divide en 4 partes iguales, ¿cuánto vale una parte?', options: ['1/4', '4/1', '2/4'], correct: '1/4', hint: 'Una sola parte de cuatro se escribe un cuarto.' },
        { icon: '&#x1F4CF;', prompt: 'En la recta numérica, ¿cuál va más a la derecha?', options: ['3/4', '1/4', 'Las dos quedan en el mismo lugar.'], correct: '3/4', hint: 'Más a la derecha significa una cantidad mayor.' }
      ]
    },
    normal: {
      repasoCards: [
        { icon: '&#x1F4CA;', title: 'Mismo denominador', text: 'Si dos fracciones tienen el mismo denominador, la mayor es la que tiene el numerador más grande.' },
        { icon: '&#x1F9E9;', title: 'Mismo numerador', text: 'Si dos fracciones tienen el mismo numerador, es mayor la que divide la unidad en menos partes. Sus partes son más grandes.' },
        { icon: '&#x1F4CF;', title: 'Recta numérica', text: 'En la recta numérica, la fracción que queda más a la derecha representa una cantidad mayor.' },
        { icon: '&#x1F522;', title: 'Numerador y denominador', text: 'El numerador indica cuántas partes se toman y el denominador indica en cuántas partes iguales se divide la unidad.' },
        { icon: '&#x21C4;', title: 'Orden y comparación', text: 'Para ordenar o comparar fracciones, primero observa si comparten numerador o denominador y después usa los signos <, > o =.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F4CA;', prompt: 'Si comparas 3/6 y 5/6, ¿cuál es mayor?', options: ['5/6', '3/6', 'Son iguales.'], correct: '5/6', hint: 'Tienen el mismo denominador, así que manda el numerador.' },
        { icon: '&#x1F9E9;', prompt: 'Si comparas 2/3 y 2/5, ¿cuál es mayor?', options: ['2/3', '2/5', 'Son iguales.'], correct: '2/3', hint: 'Con el mismo numerador, la fracción con partes más grandes es mayor.' },
        { icon: '&#x1F4CF;', prompt: 'En la recta numérica, ¿qué significa que una fracción esté más a la derecha?', options: ['Que representa una cantidad mayor.', 'Que vale menos.', 'Que no se puede comparar.'], correct: 'Que representa una cantidad mayor.', hint: 'Moverse a la derecha en la recta significa aumentar.' },
        { icon: '&#x1F522;', prompt: '¿Qué te dice el denominador de una fracción?', options: ['En cuántas partes iguales se divide la unidad.', 'Cuántas partes se tomaron.', 'Cuál fracción va primero.'], correct: 'En cuántas partes iguales se divide la unidad.', hint: 'Piensa en el total de partes iguales del entero.' },
        { icon: '&#x21C4;', prompt: 'Si dos fracciones valen lo mismo, ¿qué signo debes usar?', options: ['=', '>', '<'], correct: '=', hint: 'Ese signo se usa cuando dos cantidades son iguales.' }
      ]
    },
    dificil: {
      repasoCards: [
        { icon: '&#x1F517;', title: 'Fracciones equivalentes', text: 'Dos fracciones pueden escribirse distinto y aun así representar la misma cantidad, como 1/2 y 2/4.' },
        { icon: '&#x1F4CF;', title: 'Recta numérica', text: 'En la recta, la fracción que queda más a la derecha es mayor. La posición ayuda a comparar y ordenar.' },
        { icon: '&#x1F3AF;', title: 'Cerca de la mitad o del entero', text: 'Una fracción puede estar más cerca de la mitad o más cerca del entero. Observar cuántas partes faltan ayuda mucho.' },
        { icon: '&#x1F522;', title: 'Ordenar fracciones', text: 'Para ordenar fracciones conviene comparar sus tamaños, buscar equivalencias o apoyarse en la recta numérica.' },
        { icon: '&#x1F58C;&#xFE0F;', title: 'Modelo correcto', text: 'Un buen modelo debe tener partes iguales y mostrar exactamente las partes tomadas que indica la fracción.' }
      ],
      apoyoQuestions: [
        { icon: '&#x1F517;', prompt: '¿Qué pasa con 1/2 y 2/4?', options: ['Representan la misma cantidad.', '1/2 siempre es mayor.', '2/4 siempre es mayor.'], correct: 'Representan la misma cantidad.', hint: 'Son dos formas distintas de mostrar la misma parte del entero.' },
        { icon: '&#x1F4CF;', prompt: 'Si una fracción queda más a la derecha en la recta numérica, ¿qué significa?', options: ['Que es mayor.', 'Que es menor.', 'Que vale lo mismo.'], correct: 'Que es mayor.', hint: 'En la recta, avanzar a la derecha significa aumentar.' },
        { icon: '&#x1F3AF;', prompt: '¿Cuál está más cerca del entero 1?', options: ['7/8', '3/8', '1/8'], correct: '7/8', hint: 'Piensa cuál necesita menos para completar el entero.' },
        { icon: '&#x1F522;', prompt: 'Si quieres ordenar varias fracciones, ¿qué ayuda más?', options: ['Comparar sus tamaños o usar la recta.', 'Solo mirar el color del dibujo.', 'Escoger al azar la más bonita.'], correct: 'Comparar sus tamaños o usar la recta.', hint: 'Ordenar se vuelve más fácil cuando comparas cantidades reales.' },
        { icon: '&#x1F58C;&#xFE0F;', prompt: 'Para comprobar que un dibujo representa 3/4, ¿qué debes revisar?', options: ['Que tenga 4 partes iguales y 3 tomadas.', 'Que tenga cualquier número de partes.', 'Que se vea grande.'], correct: 'Que tenga 4 partes iguales y 3 tomadas.', hint: 'Primero revisa el total de partes y luego cuántas están tomadas.' }
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
    if (document.getElementById('fraccionesBayesStyles')) return;
    const style = document.createElement('style');
    style.id = 'fraccionesBayesStyles';
    style.textContent = [
      '.frac-bayes-panel{display:none;max-width:980px;margin:18px auto 0;padding:22px 22px 24px;border-radius:28px;background:#ffffff;border:3px solid #a855f7;box-shadow:0 8px 0 #d8b4fe;color:#6b21a8;}',
      '.frac-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.frac-bayes-title{font-size:1.65rem;color:#7e22ce;margin:0 0 8px;text-align:center;font-weight:900;}',
      '.frac-bayes-text{font-size:1.04rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#6b21a8;}',
      '.frac-bayes-mascot-wrap{background:#faf5ff;border:3px solid #d8b4fe;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(126,34,206,.12);}',
      '.frac-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(107,33,168,.14);}',
      '.frac-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.frac-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #e9d5ff;border-top-color:#a855f7;animation:fracBayesSpin .9s linear infinite;}',
      '@keyframes fracBayesSpin{to{transform:rotate(360deg);}}',
      '.frac-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.frac-bayes-card{background:#faf5ff;border:2px solid #d8b4fe;border-radius:20px;padding:16px;text-align:left;}',
      '.frac-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.frac-bayes-card-title{font-weight:900;color:#7e22ce;font-size:1rem;margin-bottom:6px;}',
      '.frac-bayes-card-text{font-size:.96rem;line-height:1.45;color:#6b21a8;margin:0;}',
      '.frac-bayes-action-wrap{text-align:center;}',
      '.frac-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#f3e8ff;color:#6b21a8;font-weight:900;font-size:1rem;border:3px solid #a855f7;box-shadow:0 5px 0 #d8b4fe;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}',
      '.frac-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #d8b4fe;}',
      '.frac-bayes-practice{margin-top:14px;background:#faf5ff;border:2px solid #d8b4fe;border-radius:22px;padding:18px 16px;}',
      '.frac-bayes-progress{text-align:center;font-weight:900;color:#9333ea;margin-bottom:12px;}',
      '.frac-bayes-question{font-size:1.15rem;font-weight:900;color:#6b21a8;text-align:center;margin:0 0 14px;}',
      '.frac-bayes-options{display:grid;gap:10px;}',
      '.frac-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #d8b4fe;background:#ffffff;color:#6b21a8;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.frac-bayes-option:hover{transform:translateY(-1px);background:#fcfaff;}',
      '.frac-bayes-option.ok{background:#22c55e;border-color:#166534;color:#ffffff;box-shadow:0 6px 0 rgba(22,101,52,.28);transform:translateY(-1px);}',
      '.frac-bayes-option.err{background:#ef4444;border-color:#991b1b;color:#ffffff;box-shadow:0 6px 0 rgba(153,27,27,.22);transform:translateY(-1px);}',
      '.frac-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#7e22ce;}',
      '.frac-bayes-feedback.err{color:#b91c1c;}',
      '.frac-bayes-ready{margin-top:14px;background:#ecfccb;border:2px solid #84cc16;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#3f6212;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensurePanel() {
    ensureStyles();
    let panel = document.getElementById('fraccionesBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'fraccionesBayesPanel';
    panel.className = 'frac-bayes-panel';

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
    detalleBase: { bloque: 'reconocer_fracciones', archivo: `${estilo}_${nivel}_bayes` }
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
    const panel = document.getElementById('fraccionesBayesPanel');
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
      panel.innerHTML = '<div class="frac-bayes-loader"><div class="frac-bayes-spinner" aria-hidden="true"></div><h3 class="frac-bayes-title">Estamos revisando tu avance</h3><p class="frac-bayes-text">Espera tantito. Ya casi te decimos cómo seguir.</p></div>';
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = `<div class="frac-bayes-mascot-wrap"><img src="${mascotMate}" alt="Capibara felicitando" class="frac-bayes-mascot"></div>`;
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = '<h3 class="frac-bayes-title">Vas muy bien</h3><p class="frac-bayes-text">Entendiste bien este nivel y ya puedes seguir con confianza al quiz.</p>';
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return `<article class="frac-bayes-card"><span class="frac-bayes-card-icon">${card.icon}</span><div class="frac-bayes-card-title">${card.title}</div><p class="frac-bayes-card-text">${card.text}</p></article>`;
      }).join('');

      panel.innerHTML = '<h3 class="frac-bayes-title">Tarjetas para recordar</h3><p class="frac-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p><div class="frac-bayes-card-grid">' + cards + '</div>' + (bayesState.repasoDone ? '<div class="frac-bayes-ready">Listo. Ya puedes ir al quiz.</div>' : '<div class="frac-bayes-action-wrap"><button type="button" class="frac-bayes-action" id="fracBayesRepasoBtn">Listo, ya lo recordé</button></div>');

      const repasoBtn = document.getElementById('fracBayesRepasoBtn');
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
        panel.innerHTML = '<h3 class="frac-bayes-title">Práctica extra terminada</h3><p class="frac-bayes-text">Terminaste la práctica extra. Ahora sí ya puedes ir al quiz.</p><div class="frac-bayes-ready">Sigue con calma y lee cada pregunta con mucha atención.</div>';
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = shuffle(currentQuestion.options).map(function (option) {
        return `<button type="button" class="frac-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = `<h3 class="frac-bayes-title">Práctica extra antes del quiz</h3><p class="frac-bayes-text">Vamos paso a paso. Primero haremos una práctica corta para recordar lo más importante.</p><div class="frac-bayes-practice"><div class="frac-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div><p class="frac-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p><div class="frac-bayes-options">${optionsMarkup}</div><div class="frac-bayes-feedback" id="fracBayesApoyoFeedback" aria-live="polite"></div></div>`;

      const feedback = document.getElementById('fracBayesApoyoFeedback');
      panel.querySelectorAll('.frac-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-value') || '';
          const allButtons = Array.from(panel.querySelectorAll('.frac-bayes-option'));
          if (selected === currentQuestion.correct) {
            allButtons.forEach(function (item) { item.disabled = true; });
            button.classList.add('ok');
            feedback.className = 'frac-bayes-feedback';
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
          feedback.className = 'frac-bayes-feedback err';
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

    quizButton.style.display = showQuiz ? 'inline-block' : 'none';
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

    ['cambiarPagina', 'actualizarNav', 'actualizarNavegacion', 'actualizarEstadoQuiz'].forEach(function (name) {
      wrap(name, function (original, args) {
        const result = original.apply(this, args);
        scheduleSync();
        return result;
      });
    });

    const observer = new MutationObserver(function (mutations) {
      const hasExternalMutation = mutations.some(function (mutation) {
        const target = mutation && mutation.target;
        return !(target && target.closest && target.closest('#fraccionesBayesPanel'));
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
    if (!quizButton || quizButton.dataset.fraccionesBayesBound === 'true') return;

    quizButton.dataset.fraccionesBayesBound = 'true';
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
