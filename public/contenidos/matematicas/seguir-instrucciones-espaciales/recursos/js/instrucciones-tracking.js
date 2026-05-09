(function () {
  const path = String(window.location.pathname || '').toLowerCase();
  if (!path.includes('/seguir-instrucciones-espaciales/contenido/')) return;
  if (path.endsWith('/quiz.html')) return;
  if (!window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/seguir-instrucciones-espaciales\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const contenidoId = 7;
  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `seguir_instrucciones_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotMate = '/recursos/mascotas/mascota-mate-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        {
          icon: '&#x1F4CD;',
          title: 'Punto de inicio',
          text: 'Antes de moverte, ubica con cuidado donde empieza el personaje. Desde ahi se interpreta toda la ruta.'
        },
        {
          icon: '&#x1F522;',
          title: 'Orden de los pasos',
          text: 'Las instrucciones se siguen en el mismo orden en que aparecen. Cambiar el orden puede llevarte a otro lugar.'
        },
        {
          icon: '&#x2B06;&#xFE0F;',
          title: 'Direcciones',
          text: 'Subir, bajar, ir a la derecha o a la izquierda cambia la posicion en el mapa. Cada direccion importa.'
        },
        {
          icon: '&#x1F3E0;',
          title: 'Referencias del lugar',
          text: 'Si dos lugares se parecen, revisa detalles como color, tipo de edificio o la esquina donde estan.'
        },
        {
          icon: '&#x2705;',
          title: 'Comprobacion final',
          text: 'Al terminar, compara si el destino coincide con todas las pistas. No basta con acertar solo una.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '&#x1F4CD;',
          prompt: 'Que debes hacer primero antes de seguir una ruta en el mapa?',
          options: [
            'Ubicar el punto de inicio.',
            'Elegir cualquier edificio.',
            'Mirar solo el final.'
          ],
          correct: 'Ubicar el punto de inicio.',
          hint: 'Todo empieza por saber desde donde sale el personaje.'
        },
        {
          icon: '&#x2B06;&#xFE0F;',
          prompt: 'Si una instruccion dice "sube una cuadra", que debes hacer?',
          options: [
            'Moverte hacia arriba.',
            'Moverte hacia abajo.',
            'Moverte a la izquierda.'
          ],
          correct: 'Moverte hacia arriba.',
          hint: 'La palabra "sube" indica la direccion hacia arriba.'
        },
        {
          icon: '&#x1F3E0;',
          prompt: 'Si dos edificios se parecen, que te ayuda a elegir el correcto?',
          options: [
            'Revisar detalles como color o tipo de edificio.',
            'Escoger el primero que veas.',
            'Mirar solo el tamano del dibujo.'
          ],
          correct: 'Revisar detalles como color o tipo de edificio.',
          hint: 'Las pistas de detalle ayudan a distinguir lugares parecidos.'
        },
        {
          icon: '&#x1F522;',
          prompt: 'Que conviene hacer cuando la ruta tiene varios pasos?',
          options: [
            'Seguirlos en el mismo orden.',
            'Cambiar el orden si parece mas corto.',
            'Ignorar el paso del medio.'
          ],
          correct: 'Seguirlos en el mismo orden.',
          hint: 'El orden de las instrucciones cambia el destino.'
        }
      ]
    },
    normal: {
      repasoCards: [
        {
          icon: '&#x1F9ED;',
          title: 'Giros y orientacion',
          text: 'Cuando una instruccion dice gira a la derecha o a la izquierda, debes pensar desde la posicion del personaje, no desde tu lugar.'
        },
        {
          icon: '&#x1F522;',
          title: 'Secuencia completa',
          text: 'En una ruta mas larga, conviene seguir cada paso en orden y no saltarte ninguno, aunque parezca facil.'
        },
        {
          icon: '&#x1F463;',
          title: 'Conteo de cuadras',
          text: 'Si un paso pide avanzar dos o tres cuadras, cuenta con calma cada movimiento para no terminar antes ni despues.'
        },
        {
          icon: '&#x1F3A0;',
          title: 'Referencias del destino',
          text: 'Cuando hay varios lugares cercanos, usa las pistas del recorrido y del lugar final para distinguir el destino correcto.'
        },
        {
          icon: '&#x2705;',
          title: 'Revision final',
          text: 'Antes de elegir, revisa si el lugar al que llegaste coincide con todos los giros y avances de la ruta.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '&#x1F9ED;',
          prompt: 'Si el personaje gira a la derecha, desde donde debes pensar ese giro?',
          options: [
            'Desde la posicion del personaje.',
            'Desde donde estas viendo la pantalla.',
            'Desde cualquier esquina del mapa.'
          ],
          correct: 'Desde la posicion del personaje.',
          hint: 'El giro se interpreta desde como esta orientado el personaje.'
        },
        {
          icon: '&#x1F463;',
          prompt: 'Si una instruccion dice avanza dos cuadras, que conviene hacer?',
          options: [
            'Contar cada cuadra con calma.',
            'Moverte hasta donde parezca correcto.',
            'Avanzar una sola vez sin revisar.'
          ],
          correct: 'Contar cada cuadra con calma.',
          hint: 'Contar bien evita que te pases o te quedes corto.'
        },
        {
          icon: '&#x1F522;',
          prompt: 'Que pasa si cambias el orden de los pasos de una ruta?',
          options: [
            'Puedes terminar en otro lugar.',
            'No cambia nada.',
            'Solo cambia el color del camino.'
          ],
          correct: 'Puedes terminar en otro lugar.',
          hint: 'La secuencia de los pasos forma la ruta correcta.'
        },
        {
          icon: '&#x1F3A0;',
          prompt: 'Si hay varios lugares cercanos, que te ayuda a elegir bien el destino?',
          options: [
            'Revisar el recorrido completo y la pista final.',
            'Escoger el lugar mas grande.',
            'Elegir el primero que veas.'
          ],
          correct: 'Revisar el recorrido completo y la pista final.',
          hint: 'La ruta y la ultima referencia te ayudan a confirmar el destino.'
        }
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

  function wrap(name, handler) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function () {
      const args = Array.from(arguments);
      return handler.call(this, original, args);
    };
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

  function readSessionUuid() {
    const meta = window.getStoredReforzamientoSessionMeta
      ? window.getStoredReforzamientoSessionMeta(contenidoId, nivel, estilo, sessionStorageKey)
      : null;
    return meta && typeof meta.sessionUuid === 'string' ? meta.sessionUuid : '';
  }

  function resolveCurrentTracker() {
    if (estilo === 'visual_verbal') return window.trackerVisualVerbal || null;
    if (estilo === 'visual_no_verbal') return window.trackerVisualNoVerbal || null;
    if (estilo === 'auditivo') return window.trackerAuditivo || null;
    if (estilo === 'kinestesico') return window.trackerKinestesico || null;
    return null;
  }

  async function waitForTrackerSaved() {
    const tracker = resolveCurrentTracker();
    if (!tracker || typeof tracker.getState !== 'function') {
      await new Promise(function (resolve) { window.setTimeout(resolve, 160); });
      return;
    }

    const startedAt = Date.now();
    while (Date.now() - startedAt < 1800) {
      const state = tracker.getState('p1a');
      if (state) {
        const hasActivity = (Number(state.correct) || 0) > 0 || (Number(state.errors) || 0) > 0;
        if (state.saved === true || (hasActivity && state.saving !== true)) {
          return;
        }
      }
      await new Promise(function (resolve) { window.setTimeout(resolve, 90); });
    }
  }

  function createEmptyState(sessionUuid) {
    return {
      sessionUuid: sessionUuid || '',
      loading: false,
      recommendation: '',
      confidence: null,
      repasoDone: false,
      apoyoDone: false,
      apoyoIndex: 0,
      sessionClosed: false,
      fallback: false
    };
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
      fallback: stored.fallback === true
    };
  }

  function ensureStyles() {
    if (document.getElementById('instruccionesBayesStyles')) return;
    const style = document.createElement('style');
    style.id = 'instruccionesBayesStyles';
    style.textContent = [
      '.inst-bayes-panel{display:none;max-width:960px;margin:18px auto 0;padding:22px 22px 24px;border-radius:28px;background:#ffffff;border:3px solid #4f46e5;box-shadow:0 8px 0 #a5b4fc;color:#312e81;}',
      '.inst-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.inst-bayes-title{font-family:"Fredoka One",cursive;font-size:1.65rem;color:#312e81;margin:0 0 8px;text-align:center;}',
      '.inst-bayes-text{font-size:1.04rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#312e81;}',
      '.inst-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.inst-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #c7d2fe;border-top-color:#4f46e5;animation:instBayesSpin .9s linear infinite;}',
      '@keyframes instBayesSpin{to{transform:rotate(360deg);}}',
      '.inst-bayes-mascot-wrap{background:#f8faff;border:3px solid #c7d2fe;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(79,70,229,.12);}',
      '.inst-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(49,46,129,.14);}',
      '.inst-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.inst-bayes-card{background:#eef2ff;border:2px solid #c7d2fe;border-radius:20px;padding:16px;text-align:left;}',
      '.inst-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.inst-bayes-card-title{font-weight:900;color:#312e81;font-size:1rem;margin-bottom:6px;}',
      '.inst-bayes-card-text{font-size:.96rem;line-height:1.45;color:#3730a3;margin:0;}',
      '.inst-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#facc15;color:#312e81;font-weight:900;font-size:1rem;border:3px solid #4f46e5;box-shadow:0 5px 0 #a78bfa;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}',
      '.inst-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #a78bfa;}',
      '.inst-bayes-action-wrap{text-align:center;}',
      '.inst-bayes-practice{margin-top:14px;background:#eef2ff;border:2px solid #c7d2fe;border-radius:22px;padding:18px 16px;}',
      '.inst-bayes-progress{text-align:center;font-weight:900;color:#4338ca;margin-bottom:12px;}',
      '.inst-bayes-question{font-size:1.15rem;font-weight:900;color:#312e81;text-align:center;margin:0 0 14px;}',
      '.inst-bayes-options{display:grid;gap:10px;}',
      '.inst-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #a5b4fc;background:#ffffff;color:#312e81;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.inst-bayes-option:hover{transform:translateY(-1px);background:#fafbff;}',
      '.inst-bayes-option.ok{background:#22c55e;border-color:#166534;color:#ffffff;box-shadow:0 6px 0 rgba(22,101,52,.28);transform:translateY(-1px);}',
      '.inst-bayes-option.err{background:#ef4444;border-color:#991b1b;color:#ffffff;box-shadow:0 6px 0 rgba(153,27,27,.22);transform:translateY(-1px);}',
      '.inst-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#312e81;}',
      '.inst-bayes-feedback.err{color:#b91c1c;}',
      '.inst-bayes-ready{margin-top:14px;background:#ecfccb;border:2px solid #84cc16;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#3f6212;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensurePanel() {
    ensureStyles();
    let panel = document.getElementById('instruccionesBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'instruccionesBayesPanel';
    panel.className = 'inst-bayes-panel';

    const quizWrap = document.getElementById('btnQuizWrap');
    const quizButton = document.getElementById('botonQuiz') || document.querySelector('.boton-quiz');
    if (quizWrap && quizWrap.parentNode) {
      quizWrap.parentNode.insertBefore(panel, quizWrap);
    } else if (quizButton && quizButton.parentNode) {
      quizButton.parentNode.insertBefore(panel, quizButton);
    } else {
      document.body.appendChild(panel);
    }
    return panel;
  }

  const sessionTracker = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel: nivel,
    estilo: estilo,
    storageKey: sessionStorageKey,
    detalleBase: { bloque: 'seguir_instrucciones_espaciales', archivo: `${estilo}_${nivel}_bayes` }
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
      fallback: bayesState.fallback
    });
  }

  function updateState(patch) {
    const currentSessionUuid = readSessionUuid();
    if (bayesState.sessionUuid && currentSessionUuid && bayesState.sessionUuid !== currentSessionUuid) {
      bayesState = createEmptyState(currentSessionUuid);
    }
    bayesState = { ...bayesState, ...patch };
    if (!bayesState.sessionUuid) {
      bayesState.sessionUuid = currentSessionUuid;
    }
    persistState();
    renderPanel();
    syncQuizButton();
  }

  function isSolved() {
    return window.ejercicioCompletado === true;
  }

  function currentHelpMessage() {
    if (bayesState.loading) return 'Espera un momento. Estamos revisando tu avance.';
    if (bayesState.recommendation === 'repaso' && !bayesState.repasoDone) {
      return 'Antes del quiz, mira las tarjetas y pulsa "Listo, ya lo recorde".';
    }
    if (bayesState.recommendation === 'apoyo' && !bayesState.apoyoDone) {
      return 'Antes del quiz, responde estas preguntas cortas con calma.';
    }
    if (bayesState.recommendation && computeQuizUnlocked(bayesState)) {
      return 'Ya puedes entrar al quiz.';
    }
    return 'Completa este reto para activar el quiz.';
  }

  function updateHelpText() {
    const help = document.getElementById('textoAyudaQuiz');
    if (!help) return;
    help.textContent = isSolved() ? currentHelpMessage() : 'Completa este reto para activar el quiz.';
  }

  function renderPanel() {
    const panel = ensurePanel();

    if (!isSolved()) {
      panel.style.display = 'none';
      panel.removeAttribute('data-kind');
      panel.innerHTML = '';
      updateHelpText();
      return;
    }

    panel.style.display = 'block';

    if (bayesState.loading) {
      panel.dataset.kind = 'loading';
      panel.innerHTML = [
        '<div class="inst-bayes-loader">',
        '<div class="inst-bayes-spinner" aria-hidden="true"></div>',
        '<h3 class="inst-bayes-title">Estamos revisando tu avance</h3>',
        '<p class="inst-bayes-text">Espera tantito. Ya casi te decimos como seguir.</p>',
        '</div>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = [
        '<div class="inst-bayes-mascot-wrap">',
        `<img src="${mascotMate}" alt="Capibara felicitando" class="inst-bayes-mascot">`,
        '</div>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = [
        '<h3 class="inst-bayes-title">Vas muy bien</h3>',
        '<p class="inst-bayes-text">Seguiste bastante bien las instrucciones. Ya puedes ir con confianza al quiz.</p>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return [
          '<article class="inst-bayes-card">',
          `<span class="inst-bayes-card-icon">${card.icon}</span>`,
          `<div class="inst-bayes-card-title">${card.title}</div>`,
          `<p class="inst-bayes-card-text">${card.text}</p>`,
          '</article>'
        ].join('');
      }).join('');

      panel.innerHTML = [
        '<h3 class="inst-bayes-title">Tarjetas para recordar</h3>',
        '<p class="inst-bayes-text">Antes del quiz, revisa estas ideas para seguir instrucciones con mas seguridad.</p>',
        `<div class="inst-bayes-card-grid">${cards}</div>`,
        bayesState.repasoDone
          ? '<div class="inst-bayes-ready">Listo. Ya puedes ir al quiz.</div>'
          : '<div class="inst-bayes-action-wrap"><button type="button" class="inst-bayes-action" id="instBayesRepasoBtn">Listo, ya lo recorde</button></div>'
      ].join('');

      const repasoBtn = document.getElementById('instBayesRepasoBtn');
      if (repasoBtn) {
        repasoBtn.addEventListener('click', function () {
          updateState({ repasoDone: true });
        });
      }
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'apoyo') {
      panel.dataset.kind = 'apoyo';

      if (bayesState.apoyoDone) {
        panel.innerHTML = [
          '<h3 class="inst-bayes-title">Preguntas terminadas</h3>',
          '<p class="inst-bayes-text">Ya repasaste las ideas mas importantes. Ahora si puedes ir al quiz.</p>',
          '<div class="inst-bayes-ready">Lee cada pregunta con calma y sigue las instrucciones paso a paso.</div>'
        ].join('');
        updateHelpText();
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = shuffle(currentQuestion.options).map(function (option) {
        return `<button type="button" class="inst-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = [
        '<h3 class="inst-bayes-title">Vamos a recordarlo paso a paso</h3>',
        '<p class="inst-bayes-text">Primero responde estas preguntas sencillas sobre como seguir instrucciones en el mapa.</p>',
        '<div class="inst-bayes-practice">',
        `<div class="inst-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div>`,
        `<p class="inst-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p>`,
        `<div class="inst-bayes-options">${optionsMarkup}</div>`,
        '<div class="inst-bayes-feedback" id="instBayesApoyoFeedback" aria-live="polite"></div>',
        '</div>'
      ].join('');

      const feedback = document.getElementById('instBayesApoyoFeedback');
      panel.querySelectorAll('.inst-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-value') || '';
          const allButtons = Array.from(panel.querySelectorAll('.inst-bayes-option'));
          if (selected === currentQuestion.correct) {
            allButtons.forEach(function (item) {
              item.disabled = true;
            });
            button.classList.add('ok');
            feedback.className = 'inst-bayes-feedback';
            feedback.textContent =
              bayesState.apoyoIndex + 1 >= apoyoQuestions.length
                ? 'Muy bien. Ya terminaste estas preguntas.'
                : 'Correcto. Ahora vamos con la siguiente.';

            const nextIndex = bayesState.apoyoIndex + 1;
            window.setTimeout(function () {
              if (nextIndex >= apoyoQuestions.length) {
                updateState({
                  apoyoDone: true,
                  apoyoIndex: apoyoQuestions.length
                });
              } else {
                updateState({ apoyoIndex: nextIndex });
              }
            }, 1250);
            return;
          }

          button.disabled = true;
          button.classList.add('err');
          feedback.className = 'inst-bayes-feedback err';
          feedback.textContent = `Incorrecto. ${currentQuestion.hint}`;
          window.setTimeout(function () {
            button.classList.remove('err');
            button.disabled = false;
          }, 1250);
        });
      });
      updateHelpText();
      return;
    }

    panel.style.display = 'none';
    panel.removeAttribute('data-kind');
    panel.innerHTML = '';
    updateHelpText();
  }

  function syncQuizButton() {
    const quizButton = document.getElementById('botonQuiz') || document.querySelector('.boton-quiz');
    if (!quizButton) return;

    const unlocked = isSolved() && computeQuizUnlocked(bayesState);
    quizButton.classList.toggle('bloqueado', !unlocked);
    quizButton.setAttribute('aria-disabled', String(!unlocked));
    quizButton.style.opacity = unlocked ? '1' : '0.68';
    quizButton.style.filter = unlocked ? 'none' : 'grayscale(0.08)';
    updateHelpText();
  }

  async function resolveBayesFlow() {
    if (bayesState.recommendation || bayesState.loading) return bayesState;
    if (!isSolved()) return bayesState;
    if (bayesRequestPromise) return bayesRequestPromise;

    bayesRequestPromise = (async function () {
      updateState({ loading: true });
      await waitForTrackerSaved();
      const response = await sessionTracker.complete({ eventoCierre: 'nivel' });
      const recommendation = response?.recomendacion_bayes?.recomendacion || '';
      const confidence = response?.recomendacion_bayes?.confianza ?? null;

      if (recommendation) {
        updateState({
          loading: false,
          recommendation: recommendation,
          confidence: confidence,
          sessionClosed: true,
          fallback: false
        });
      } else {
        updateState({
          loading: false,
          recommendation: 'mantener',
          confidence: null,
          sessionClosed: response?.success === true,
          fallback: true
        });
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
      if (isSolved() && !bayesState.recommendation && !bayesState.loading) {
        resolveBayesFlow();
      }
    }, 0);
  }

  function bindUpdate() {
    wrap('actualizarBotonQuiz', function (original, args) {
      const result = original.apply(this, args);
      scheduleSync();
      return result;
    });
  }

  function bindQuizButton() {
    const quizButton = document.getElementById('botonQuiz') || document.querySelector('.boton-quiz');
    if (!quizButton || quizButton.dataset.instruccionesBayesBound === 'true') return;

    quizButton.dataset.instruccionesBayesBound = 'true';
    quizButton.addEventListener('click', async function (event) {
      const href = quizButton.getAttribute('href');
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!isSolved()) {
        updateHelpText();
        return;
      }

      if (!bayesState.recommendation && !bayesState.loading) {
        await resolveBayesFlow();
      }

      if (!computeQuizUnlocked(bayesState)) {
        updateHelpText();
        renderPanel();
        const panel = document.getElementById('instruccionesBayesPanel');
        if (panel && panel.style.display !== 'none') {
          panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
    bindUpdate();
    bindQuizButton();
    syncQuizButton();
    renderPanel();
    if (isSolved() && !bayesState.recommendation && !bayesState.loading) {
      resolveBayesFlow();
    }
  });
})();
