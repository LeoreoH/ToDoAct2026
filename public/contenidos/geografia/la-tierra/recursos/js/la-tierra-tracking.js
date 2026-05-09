(function () {
  const path = (window.location.pathname || '').toLowerCase();
  if (!path.includes('/la-tierra/contenido/')) return;
  if (path.endsWith('/quiz.html')) return;
  if (!window.createReforzamientoTracker || !window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/la-tierra\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const contenidoId = 1;
  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `la_tierra_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotGeo = '/recursos/mascotas/mascota-geo-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        {
          icon: '🌍',
          title: 'Nuestro planeta',
          text: 'La Tierra es nuestro hogar en el espacio. Su forma se parece a una esfera, aunque en los polos se ve un poco achatada.'
        },
        {
          icon: '🗺️',
          title: 'Lineas imaginarias',
          text: 'Las lineas imaginarias sirven para ubicar lugares. Los paralelos rodean la Tierra y los meridianos ayudan a orientarnos de norte a sur.'
        },
        {
          icon: '🧭',
          title: 'Puntos cardinales',
          text: 'Los puntos cardinales nos ayudan a saber hacia donde mirar o caminar. El Sol es una pista natural para reconocer el Este y el Oeste.'
        },
        {
          icon: '🌡️',
          title: 'Zonas termicas',
          text: 'La Tierra no recibe el calor del Sol de la misma manera en todas partes. Por eso existen zonas con climas mas calidos, templados o frios.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌍',
          prompt: 'Elige la idea que mejor resume lo aprendido sobre la Tierra.',
          options: [
            'La Tierra es plana y no cambia de forma.',
            'La Tierra se parece a una esfera y en los polos se ve un poco achatada.',
            'La Tierra tiene forma de cubo.'
          ],
          correct: 'La Tierra se parece a una esfera y en los polos se ve un poco achatada.',
          hint: 'Recuerda la explicacion y la imagen del planeta.'
        },
        {
          icon: '🗺️',
          prompt: 'Cual frase describe mejor a las lineas imaginarias?',
          options: [
            'Sirven para ubicar lugares y orientarnos en el planeta.',
            'Solo sirven para decorar los mapas.',
            'Solo existen en los paisajes frios.'
          ],
          correct: 'Sirven para ubicar lugares y orientarnos en el planeta.',
          hint: 'Piensa en para que usamos paralelos y meridianos.'
        },
        {
          icon: '🧭',
          prompt: 'Que nos ayudan a hacer los puntos cardinales?',
          options: [
            'Contar estrellas por la noche.',
            'Saber hacia donde estamos mirando o caminando.',
            'Medir la temperatura del aire.'
          ],
          correct: 'Saber hacia donde estamos mirando o caminando.',
          hint: 'Recuerda la rosa de los vientos y la posicion del Sol.'
        },
        {
          icon: '🌡️',
          prompt: 'Por que existen zonas termicas diferentes en la Tierra?',
          options: [
            'Porque todas las partes del planeta reciben el calor del Sol de la misma forma.',
            'Porque el Sol calienta de manera diferente distintas partes del planeta.',
            'Porque las montañas mueven el planeta.'
          ],
          correct: 'Porque el Sol calienta de manera diferente distintas partes del planeta.',
          hint: 'Piensa en por que hay lugares mas calidos y otros mas frios.'
        }
      ]
    },
    normal: {
      repasoCards: [
        {
          icon: '🔄',
          title: 'Rotacion',
          text: 'La rotacion es el giro de la Tierra sobre su propio eje. Gracias a ese movimiento tenemos dia y noche.'
        },
        {
          icon: '☀️',
          title: 'Traslacion',
          text: 'La traslacion es el viaje de la Tierra alrededor del Sol. Dura un año y explica por que existen los años bisiestos.'
        },
        {
          icon: '🌦️',
          title: 'Estaciones del año',
          text: 'Las estaciones aparecen porque la Tierra esta inclinada y recibe la luz solar con distinta intensidad durante el año.'
        },
        {
          icon: '🗺️',
          title: 'Elementos del mapa',
          text: 'Los mapas tienen titulo, rosa de los vientos, escala, simbolos y leyenda para ayudarnos a entender la informacion.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🔄',
          prompt: 'Que explica mejor el movimiento de rotacion?',
          options: [
            'Es el giro de la Tierra sobre su eje y produce el dia y la noche.',
            'Es el viaje de la Tierra alrededor del Sol y produce los años bisiestos.',
            'Es el movimiento de las nubes sobre la superficie.'
          ],
          correct: 'Es el giro de la Tierra sobre su eje y produce el dia y la noche.',
          hint: 'Piensa en el movimiento que hace la Tierra como si fuera un trompo.'
        },
        {
          icon: '☀️',
          prompt: 'Que idea resume mejor la traslacion?',
          options: [
            'La Tierra se queda quieta frente al Sol.',
            'La Tierra viaja alrededor del Sol siguiendo una orbita.',
            'La Luna gira alrededor de la Tierra.'
          ],
          correct: 'La Tierra viaja alrededor del Sol siguiendo una orbita.',
          hint: 'Recuerda el camino que sigue la Tierra durante el año.'
        },
        {
          icon: '🌦️',
          prompt: 'Por que se forman las estaciones del año?',
          options: [
            'Porque la Tierra esta inclinada y la luz del Sol llega diferente durante el año.',
            'Porque el Sol cambia de tamaño cada mes.',
            'Porque los mapas cambian de color.'
          ],
          correct: 'Porque la Tierra esta inclinada y la luz del Sol llega diferente durante el año.',
          hint: 'Piensa en la inclinacion del eje terrestre.'
        },
        {
          icon: '🗺️',
          prompt: 'Para que sirven los elementos del mapa?',
          options: [
            'Para decorar el mapa sin explicar nada.',
            'Para leerlo, orientarnos y entender mejor la informacion.',
            'Para cambiar el clima de un lugar.'
          ],
          correct: 'Para leerlo, orientarnos y entender mejor la informacion.',
          hint: 'Recuerda para que usamos la escala, la rosa y la leyenda.'
        }
      ]
    },
    dificil: {
      repasoCards: [
        {
          icon: '📍',
          title: 'Coordenadas geograficas',
          text: 'Las coordenadas geograficas permiten ubicar puntos exactos en la Tierra combinando latitud y longitud.'
        },
        {
          icon: '↔️',
          title: 'Latitud y paralelos',
          text: 'La latitud se relaciona con los paralelos y mide la distancia de un lugar respecto al Ecuador, hacia el norte o hacia el sur.'
        },
        {
          icon: '↕️',
          title: 'Longitud y meridianos',
          text: 'La longitud se relaciona con los meridianos y ayuda a ubicar lugares al este o al oeste del meridiano de Greenwich.'
        },
        {
          icon: '🗺️',
          title: 'Proyecciones cartograficas',
          text: 'Las proyecciones intentan pasar la forma esferica de la Tierra a un mapa plano, pero siempre provocan alguna distorsion.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '📍',
          prompt: 'Para que sirven las coordenadas geograficas?',
          options: [
            'Para ubicar con precision un lugar en la superficie terrestre.',
            'Solo para decorar mapas escolares.',
            'Para medir la temperatura del aire.'
          ],
          correct: 'Para ubicar con precision un lugar en la superficie terrestre.',
          hint: 'Piensa en para que usamos latitud y longitud juntas.'
        },
        {
          icon: '↔️',
          prompt: 'Que idea describe mejor a la latitud?',
          options: [
            'Mide la distancia respecto al Ecuador usando paralelos.',
            'Cuenta los continentes de un mapa.',
            'Sirve para cambiar las estaciones del año.'
          ],
          correct: 'Mide la distancia respecto al Ecuador usando paralelos.',
          hint: 'Recuerda que la latitud se relaciona con lineas horizontales.'
        },
        {
          icon: '↕️',
          prompt: 'Que idea describe mejor a la longitud?',
          options: [
            'Ubica lugares al este o al oeste de Greenwich usando meridianos.',
            'Explica por que llueve en verano.',
            'Mide la altura de las montañas.'
          ],
          correct: 'Ubica lugares al este o al oeste de Greenwich usando meridianos.',
          hint: 'Piensa en el meridiano principal y en los husos horarios.'
        },
        {
          icon: '🗺️',
          prompt: 'Por que los mapas usan proyecciones cartograficas?',
          options: [
            'Porque hay que representar una Tierra esferica en una superficie plana.',
            'Porque la Tierra es cuadrada.',
            'Porque todos los mapas son iguales entre si.'
          ],
          correct: 'Porque hay que representar una Tierra esferica en una superficie plana.',
          hint: 'Recuerda que al pasar del globo al mapa aparecen distorsiones.'
        }
      ]
    }
  };
  const activeLevelContent = levelContentMap[nivel] || levelContentMap.facil;
  const repasoCards = activeLevelContent.repasoCards;
  const apoyoQuestions = activeLevelContent.apoyoQuestions;

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

  function totalPages() {
    return pages().length || 1;
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

  function pageFromNode(node) {
    if (!node || !node.closest) return null;
    const page = node.closest('.pagina[id^="pagina"], .page');
    if (!page) return null;
    if (page.id && /^pagina\d+$/.test(page.id)) {
      return Number(page.id.replace('pagina', '')) || null;
    }
    const idx = pages().indexOf(page);
    return idx >= 0 ? idx + 1 : null;
  }

  function inferPage(args) {
    for (const arg of args) {
      if (Number.isFinite(arg) && arg > 0 && arg <= totalPages()) {
        return Number(arg);
      }
      if (arg && typeof arg === 'object') {
        const fromNode = pageFromNode(arg);
        if (fromNode) return fromNode;
      }
    }
    return activePageNumber();
  }

  function firstBoolean(args) {
    for (const arg of args) {
      if (typeof arg === 'boolean') return arg;
    }
    return null;
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

  function readJsonFromSessionStorage(key) {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeJsonToSessionStorage(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function removeFromSessionStorage(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function getCurrentSessionUuid() {
    const stored = readJsonFromSessionStorage(sessionStorageKey);
    return stored && typeof stored.sessionUuid === 'string' ? stored.sessionUuid : '';
  }

  function createEmptyBayesState(sessionUuid) {
    return {
      sessionUuid: sessionUuid || '',
      loading: false,
      recommendation: '',
      confidence: null,
      sessionClosed: false,
      repasoDone: false,
      apoyoDone: false,
      apoyoIndex: 0,
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

  function readBayesState() {
    const stored = readJsonFromSessionStorage(bayesStateStorageKey);
    if (!stored || typeof stored !== 'object') return null;

    const currentSessionUuid = getCurrentSessionUuid();
    if (
      stored.sessionUuid &&
      currentSessionUuid &&
      stored.sessionUuid !== currentSessionUuid
    ) {
      removeFromSessionStorage(bayesStateStorageKey);
      return null;
    }

    return {
      sessionUuid:
        typeof stored.sessionUuid === 'string' ? stored.sessionUuid : currentSessionUuid,
      loading: stored.loading === true,
      recommendation:
        typeof stored.recommendation === 'string' ? stored.recommendation : '',
      confidence:
        Number.isFinite(Number(stored.confidence)) ? Number(stored.confidence) : null,
      sessionClosed: stored.sessionClosed === true,
      repasoDone: stored.repasoDone === true,
      apoyoDone: stored.apoyoDone === true,
      apoyoIndex:
        Number.isFinite(Number(stored.apoyoIndex)) && Number(stored.apoyoIndex) > 0
          ? Math.min(Number(stored.apoyoIndex), apoyoQuestions.length)
          : 0,
      fallback: stored.fallback === true
    };
  }

  function ensureBayesStyles() {
    if (document.getElementById('laTierraBayesStyles')) return;

    const style = document.createElement('style');
    style.id = 'laTierraBayesStyles';
    style.textContent = [
      '.lt-bayes-panel{display:none;max-width:960px;margin:18px auto 0;padding:22px 22px 24px;border-radius:26px;background:#ffffff;border:3px solid #1976d2;box-shadow:0 8px 0 #0d47a1;color:#01579b;}',
      '.lt-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.lt-bayes-title{font-family:"Fredoka One",cursive;font-size:1.65rem;color:#01579b;margin:0 0 8px;text-align:center;}',
      '.lt-bayes-text{font-size:1.05rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#01579b;}',
      '.lt-bayes-helper{margin:8px 0 0;text-align:center;color:#4a6c92;font-weight:700;font-size:.98rem;}',
      '.lt-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.lt-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #bbdefb;border-top-color:#1976d2;animation:ltBayesSpin 0.9s linear infinite;}',
      '@keyframes ltBayesSpin{to{transform:rotate(360deg);}}',
      '.lt-bayes-mascot-wrap{background:#f4f9ff;border:3px solid #c9def6;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(13,71,161,.16);}',
      '.lt-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(13,71,161,.16);}',
      '.lt-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.lt-bayes-card{background:#e3f2fd;border:2px solid #90caf9;border-radius:20px;padding:16px;text-align:left;}',
      '.lt-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.lt-bayes-card-title{font-weight:900;color:#01579b;font-size:1rem;margin-bottom:6px;}',
      '.lt-bayes-card-text{font-size:.96rem;line-height:1.45;color:#0b4880;margin:0;}',
      '.lt-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#ffd600;color:#01579b;font-weight:900;font-size:1rem;border:3px solid #1976d2;box-shadow:0 5px 0 #b26a00;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;background-clip:padding-box;}',
      '.lt-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #b26a00;}',
      '.lt-bayes-action-wrap{text-align:center;}',
      '.lt-bayes-practice{margin-top:14px;background:#eaf5ff;border:2px solid #bbdefb;border-radius:22px;padding:18px 16px;}',
      '.lt-bayes-progress{text-align:center;font-weight:900;color:#1976d2;margin-bottom:12px;}',
      '.lt-bayes-question{font-size:1.15rem;font-weight:900;color:#01579b;text-align:center;margin:0 0 14px;}',
      '.lt-bayes-options{display:grid;gap:10px;}',
      '.lt-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #90caf9;background:#ffffff;color:#01579b;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.lt-bayes-option:hover{transform:translateY(-1px);background:#f7fbff;}',
      '.lt-bayes-option.ok{background:#dff5e3;border-color:#4caf50;color:#145a20;}',
      '.lt-bayes-option.err{background:#ffebee;border-color:#ef5350;color:#8b1e1e;}',
      '.lt-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#1565c0;}',
      '.lt-bayes-feedback.err{color:#b71c1c;}',
      '.lt-bayes-ready{margin-top:14px;background:#e8f5e9;border:2px solid #66bb6a;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#1b5e20;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureBayesPanel() {
    ensureBayesStyles();

    let panel = document.getElementById('laTierraBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'laTierraBayesPanel';
    panel.className = 'lt-bayes-panel';

    const quizButton = document.querySelector('.btn-quiz, .boton-quiz, .quiz-btn-footer, a[href*="quiz.html"]');
    if (quizButton && quizButton.parentNode) {
      quizButton.parentNode.insertBefore(panel, quizButton);
    } else {
      document.body.appendChild(panel);
    }

    return panel;
  }

  let bayesState = createEmptyBayesState('');
  let bayesRequestPromise = null;

  function refreshBayesStateForCurrentSession() {
    const currentSessionUuid = getCurrentSessionUuid();
    if (!currentSessionUuid) return;

    if (bayesState.sessionUuid && bayesState.sessionUuid !== currentSessionUuid) {
      bayesState = createEmptyBayesState(currentSessionUuid);
      removeFromSessionStorage(bayesStateStorageKey);
      return;
    }

    if (!bayesState.sessionUuid) {
      bayesState.sessionUuid = currentSessionUuid;
    }
  }

  function persistBayesState() {
    if (!bayesState.sessionUuid && !bayesState.recommendation && !bayesState.loading) {
      removeFromSessionStorage(bayesStateStorageKey);
      return;
    }

    writeJsonToSessionStorage(bayesStateStorageKey, {
      sessionUuid: bayesState.sessionUuid,
      loading: bayesState.loading,
      recommendation: bayesState.recommendation,
      confidence: bayesState.confidence,
      sessionClosed: bayesState.sessionClosed,
      repasoDone: bayesState.repasoDone,
      apoyoDone: bayesState.apoyoDone,
      apoyoIndex: bayesState.apoyoIndex,
      fallback: bayesState.fallback
    });
  }

  function isQuizUnlockedByBayes() {
    return computeQuizUnlocked(bayesState);
  }

  function updateBayesState(patch) {
    refreshBayesStateForCurrentSession();
    bayesState = {
      ...bayesState,
      ...patch
    };
    if (!bayesState.sessionUuid) {
      bayesState.sessionUuid = getCurrentSessionUuid();
    }
    persistBayesState();
    renderBayesPanel();
    syncQuizLinks();
  }

  function scrollBayesPanelIntoView() {
    const panel = document.getElementById('laTierraBayesPanel');
    if (!panel || panel.style.display === 'none') return;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function lockedQuizMessage() {
    if (bayesState.loading) {
      return 'Espera un momento. Estamos preparando tu siguiente paso.';
    }
    if (bayesState.recommendation === 'repaso' && !bayesState.repasoDone) {
      return 'Antes del quiz, mira las tarjetas de repaso y pulsa "Ya repase".';
    }
    if (bayesState.recommendation === 'apoyo' && !bayesState.apoyoDone) {
      return 'Antes del quiz, completa la practica extra con calma.';
    }
    return 'Completa correctamente todas las actividades antes de ir al quiz.';
  }

  function renderBayesPanel() {
    const panel = ensureBayesPanel();
    const current = activePageNumber();
    const onFinalPage = current === totalPages();
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
      panel.innerHTML = [
        '<div class="lt-bayes-loader">',
        '<div class="lt-bayes-spinner" aria-hidden="true"></div>',
        '<h3 class="lt-bayes-title">Estamos revisando tu avance</h3>',
        '<p class="lt-bayes-text">Espera tantito. Ya casi te decimos como seguir.</p>',
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = [
        '<div class="lt-bayes-mascot-wrap">',
        `<img src="${mascotGeo}" alt="Capibara felicitando" class="lt-bayes-mascot">`,
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = [
        '<h3 class="lt-bayes-title">Vas muy bien</h3>',
        '<p class="lt-bayes-text">Sigue asi. Entendiste bien el tema y ya puedes ir con confianza al quiz.</p>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return [
          '<article class="lt-bayes-card">',
          `<span class="lt-bayes-card-icon">${card.icon}</span>`,
          `<div class="lt-bayes-card-title">${card.title}</div>`,
          `<p class="lt-bayes-card-text">${card.text}</p>`,
          '</article>'
        ].join('');
      }).join('');

      panel.innerHTML = [
        '<h3 class="lt-bayes-title">Tarjetas para recordar</h3>',
        '<p class="lt-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p>',
        `<div class="lt-bayes-card-grid">${cards}</div>`,
        bayesState.repasoDone
          ? '<div class="lt-bayes-ready">Listo. Ya puedes ir al quiz.</div>'
          : '<div class="lt-bayes-action-wrap"><button type="button" class="lt-bayes-action" id="ltBayesRepasoBtn">Listo, ya lo recorde</button></div>'
      ].join('');

      const repasoBtn = document.getElementById('ltBayesRepasoBtn');
      if (repasoBtn) {
        repasoBtn.addEventListener('click', function () {
          updateBayesState({ repasoDone: true });
        });
      }
      return;
    }

    if (bayesState.recommendation === 'apoyo') {
      panel.dataset.kind = 'apoyo';

      if (bayesState.apoyoDone) {
        panel.innerHTML = [
          '<h3 class="lt-bayes-title">Practica extra terminada</h3>',
          '<p class="lt-bayes-text">Terminaste la practica extra. Ahora si ya puedes ir al quiz.</p>',
          '<div class="lt-bayes-ready">Sigue con confianza y lee cada pregunta con mucha atencion.</div>'
        ].join('');
        return;
      }

      const currentQuestion =
        apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const options = shuffle(currentQuestion.options);
      const optionsMarkup = options.map(function (option) {
        return `<button type="button" class="lt-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = [
        '<h3 class="lt-bayes-title">Practica extra antes del quiz</h3>',
        '<p class="lt-bayes-text">Vamos a recordar las ideas principales con preguntas mas generales y tranquilas.</p>',
        '<div class="lt-bayes-practice">',
        `<div class="lt-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div>`,
        `<p class="lt-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p>`,
        `<div class="lt-bayes-options">${optionsMarkup}</div>`,
        '<div class="lt-bayes-feedback" id="ltBayesApoyoFeedback" aria-live="polite"></div>',
        '</div>'
      ].join('');

      const feedback = document.getElementById('ltBayesApoyoFeedback');
      panel.querySelectorAll('.lt-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-value') || '';
          if (selected === currentQuestion.correct) {
            button.classList.add('ok');
            feedback.className = 'lt-bayes-feedback';
            feedback.textContent =
              bayesState.apoyoIndex + 1 >= apoyoQuestions.length
                ? 'Excelente. Ya terminaste esta practica.'
                : 'Muy bien. Vamos con la siguiente.';

            const nextIndex = bayesState.apoyoIndex + 1;
            window.setTimeout(function () {
              if (nextIndex >= apoyoQuestions.length) {
                updateBayesState({
                  apoyoDone: true,
                  apoyoIndex: apoyoQuestions.length
                });
              } else {
                updateBayesState({ apoyoIndex: nextIndex });
              }
            }, 420);
            return;
          }

          button.classList.add('err');
          feedback.className = 'lt-bayes-feedback err';
          feedback.textContent = currentQuestion.hint;
          window.setTimeout(function () {
            button.classList.remove('err');
          }, 650);
        });
      });
      return;
    }

    panel.style.display = 'none';
    panel.removeAttribute('data-kind');
    panel.innerHTML = '';
  }

  const solvedPages = new Set();
  const savingSuccessPages = new Set();
  let gateHintTimer = null;

  const apartados = {};
  for (let page = 1; page <= totalPages(); page += 1) {
    apartados['pagina' + page + '_actividad'] = {
      pagina: page,
      apartadoClave: 'pagina' + page + '_actividad',
      tipoActividad: 'reforzamiento'
    };
  }

  const tracker = window.createReforzamientoTracker({
    trackTime: false,
    contenidoId: contenidoId,
    nivel: nivel,
    estilo: estilo,
    detalleBase: { bloque: 'la_tierra' },
    apartados: apartados
  });

  const session = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel: nivel,
    estilo: estilo,
    detalleBase: { bloque: 'la_tierra' }
  });

  async function resolveLevelBayesFlow() {
    refreshBayesStateForCurrentSession();

    if (bayesState.recommendation || bayesState.loading) {
      return bayesState;
    }

    if (!allPagesSolved() || activePageNumber() !== totalPages()) {
      return bayesState;
    }

    if (bayesRequestPromise) {
      return bayesRequestPromise;
    }

    bayesRequestPromise = (async function () {
      updateBayesState({ loading: true });
      await finalizeAll(false);

      const response = await session.complete({ eventoCierre: 'nivel' });
      const recommendation = response?.recomendacion_bayes?.recomendacion || '';
      const confidence = response?.recomendacion_bayes?.confianza ?? null;

      if (recommendation) {
        updateBayesState({
          loading: false,
          recommendation: recommendation,
          confidence: confidence,
          sessionClosed: true,
          fallback: false
        });
      } else {
        updateBayesState({
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

  function keyForPage(page) {
    return 'pagina' + page + '_actividad';
  }

  function markVisible(page) {
    tracker.markPageVisibleByNumber(page, { estilo: estilo });
  }

  function addError(page, detail) {
    tracker.addError(keyForPage(page), 1, detail || {});
  }

  async function addSuccess(page, detail) {
    const key = keyForPage(page);
    const state = tracker.getState(key);
    solvedPages.add(Number(page));
    if (state && state.saved) return;
    if (savingSuccessPages.has(key)) return;
    savingSuccessPages.add(key);
    tracker.addCorrect(key, 1, detail || {});
    try {
      await tracker.complete(key, { detalle: detail || {} });
    } finally {
      savingSuccessPages.delete(key);
    }
  }

  function reportExternalError(page, detail) {
    const pageNumber = Number(page);
    if (!Number.isFinite(pageNumber) || pageNumber < 1 || pageNumber > totalPages()) {
      return;
    }
    addError(pageNumber, detail || {});
    window.setTimeout(function () {
      syncQuizLinks();
      syncNavigationGates();
    }, 0);
  }

  function reportExternalErrorFromFeedback(feedbackId, detail) {
    const match = String(feedbackId || '').match(/(\d+)/);
    if (!match) return;
    reportExternalError(Number(match[1]), {
      feedbackId: feedbackId,
      ...(detail || {})
    });
  }

  window.laTierraTrackerHooks = {
    addErrorByPage: reportExternalError,
    addErrorFromFeedback: reportExternalErrorFromFeedback,
    currentPage: activePageNumber,
    estilo: estilo,
    nivel: nivel
  };

  async function finalizePage(page, force) {
    const key = keyForPage(page);
    const state = tracker.getState(key);
    if (!state || state.saved) return;
    if (!force && state.aciertos <= 0 && state.errores <= 0) return;
    await tracker.complete(key, { detalle: { pagina: page, estilo: estilo } });
  }

  async function finalizeAll(force) {
    for (let page = 1; page <= totalPages(); page += 1) {
      await finalizePage(page, force);
    }
  }

  function pageElement(page) {
    const list = pages();
    return list[Number(page) - 1] || document.getElementById('pagina' + page) || null;
  }

  function elementLooksVisible(element) {
    if (!element) return false;
    if (element.classList.contains('err') || element.classList.contains('incorrecto')) return false;
    if (
      element.classList.contains('visible') ||
      element.classList.contains('ok') ||
      element.classList.contains('correcto')
    ) {
      return true;
    }

    const style = window.getComputedStyle ? window.getComputedStyle(element) : null;
    return !!(
      element.textContent &&
      element.textContent.trim() &&
      (!style || (style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) !== 0))
    );
  }

  function mainCompletionFeedback(page) {
    const pageNode = pageElement(page);
    if (!pageNode) return null;
    return pageNode.querySelector('#feedbackPagina' + page);
  }

  function feedbackSolved(page) {
    const pageNode = pageElement(page);
    if (!pageNode) return false;
    const mainFeedback = mainCompletionFeedback(page);
    if (mainFeedback) return elementLooksVisible(mainFeedback);

    const feedback = pageNode.querySelector('#fb' + page + ', #ok' + page);
    return elementLooksVisible(feedback);
  }

  function respondidasSolved(page) {
    try {
      return !!(window.respondidas && window.respondidas[page]);
    } catch (_) {
      return false;
    }
  }

  function miniPreguntaSolved(page) {
    const pageNode = pageElement(page);
    if (!pageNode) return false;
    if (pageNode.querySelector('.mini-pregunta.resuelta, .mini-pregunta[data-resuelta="true"]')) {
      return true;
    }
    return !!pageNode.querySelector('.btn-mini.correcto');
  }

  function isPageSolved(page) {
    const pageNumber = Number(page);
    const requiredMainFeedback = mainCompletionFeedback(pageNumber);
    if (requiredMainFeedback) return feedbackSolved(pageNumber);
    return (
      solvedPages.has(pageNumber) ||
      respondidasSolved(pageNumber) ||
      feedbackSolved(pageNumber) ||
      miniPreguntaSolved(pageNumber)
    );
  }

  function allPagesSolved() {
    for (let page = 1; page <= totalPages(); page += 1) {
      if (!isPageSolved(page)) return false;
    }
    return true;
  }

  function rememberSolvedPagesFromDom() {
    for (let page = 1; page <= totalPages(); page += 1) {
      if (isPageSolved(page)) {
        solvedPages.add(page);
        addSuccess(page, { pagina: page, estilo: estilo, resultado: 'completado' });
      }
    }
  }

  function ensureGateHint() {
    let hint = document.getElementById('laTierraGateHint');
    if (hint) return hint;

    hint = document.createElement('div');
    hint.id = 'laTierraGateHint';
    hint.setAttribute('role', 'status');
    hint.style.display = 'none';
    hint.style.margin = '12px auto 0';
    hint.style.maxWidth = '760px';
    hint.style.padding = '12px 18px';
    hint.style.borderRadius = '18px';
    hint.style.background = '#fff3e0';
    hint.style.border = '3px solid #ffd600';
    hint.style.color = '#01579b';
    hint.style.fontWeight = '800';
    hint.style.textAlign = 'center';
    hint.style.boxShadow = '0 4px 0 rgba(13, 71, 161, 0.18)';

    const nav = document.querySelector('.navegador') || document.querySelector('.navegador-quiz');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(hint, nav.nextSibling);
    } else {
      document.body.appendChild(hint);
    }
    return hint;
  }

  function showGateHint(message) {
    const hint = ensureGateHint();
    hint.textContent = message || 'Completa correctamente la actividad de esta pagina para avanzar.';
    hint.style.display = 'block';
    clearTimeout(gateHintTimer);
    gateHintTimer = setTimeout(function () {
      hint.style.display = 'none';
    }, 2600);
  }

  function hideGateHint() {
    const hint = document.getElementById('laTierraGateHint');
    if (hint) hint.style.display = 'none';
  }

  function navigationTarget(name, args, before) {
    const numeric = args.find(function (arg) {
      return Number.isFinite(arg);
    });
    if (!Number.isFinite(numeric)) return null;
    if (name === 'goToPage') return numeric;
    return before + numeric;
  }

  function syncNavigationGates() {
    rememberSolvedPagesFromDom();
    const current = activePageNumber();
    const total = totalPages();
    const currentSolved = isPageSolved(current);
    const next = document.getElementById('btnSiguiente');

    if (next) {
      const locked = current < total && !currentSolved;
      next.disabled = current === total || locked;
      next.setAttribute('aria-disabled', String(next.disabled));
      next.classList.toggle('bloqueado', locked);
      next.title = locked ? 'Completa correctamente la actividad de esta pagina para avanzar.' : '';
    }

    if (currentSolved) hideGateHint();
  }

  function syncQuizLinks() {
    refreshBayesStateForCurrentSession();
    rememberSolvedPagesFromDom();

    const current = activePageNumber();
    const total = totalPages();
    const pagesSolved = allPagesSolved();
    const showQuizButton = current === total && pagesSolved;
    const quizUnlocked = showQuizButton && isQuizUnlockedByBayes();

    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, a[href*="quiz.html"]').forEach(function (button) {
      if (
        button.classList.contains('btn-quiz') ||
        button.classList.contains('boton-quiz') ||
        button.classList.contains('quiz-btn-footer')
      ) {
        button.style.display = showQuizButton
          ? (button.classList.contains('quiz-btn-footer') ? 'inline-flex' : 'block')
          : 'none';
      }
      button.classList.toggle('bloqueado', !quizUnlocked);
      button.setAttribute('aria-disabled', String(!quizUnlocked));
      button.style.opacity = quizUnlocked ? '1' : '0.68';
      button.style.filter = quizUnlocked ? 'none' : 'grayscale(0.08)';
      button.title = !quizUnlocked ? lockedQuizMessage() : '';
    });

    renderBayesPanel();
    markVisible(current);

    if (showQuizButton && !bayesState.recommendation && !bayesState.loading) {
      window.setTimeout(function () {
        resolveLevelBayesFlow();
      }, 0);
    }
  }

  function bindNavigation() {
    ['cambiarPagina', 'cambiarPag', 'goToPage'].forEach(function (name) {
      wrap(name, async function (original, args) {
        const before = activePageNumber();
        const target = navigationTarget(name, args, before);
        if (target && target > before && !isPageSolved(before)) {
          syncNavigationGates();
          showGateHint('Completa correctamente la actividad de esta pagina para avanzar.');
          return false;
        }
        const result = original.apply(this, args);
        const after = activePageNumber();
        if (before !== after) {
          await finalizePage(before, false);
        }
        setTimeout(function () {
          syncQuizLinks();
          syncNavigationGates();
        }, 0);
        return result;
      });
    });

    ['actualizarUI', 'syncUI'].forEach(function (name) {
      wrap(name, function (original, args) {
        const result = original.apply(this, args);
        setTimeout(function () {
          syncQuizLinks();
          syncNavigationGates();
        }, 0);
        return result;
      });
    });

    const observer = new MutationObserver(function () {
      syncQuizLinks();
      syncNavigationGates();
    });

    pages().forEach(function (page) {
      observer.observe(page, { attributes: true, attributeFilter: ['class', 'style'], subtree: true });
    });
  }

  function bindBooleanResponders() {
    [
      'responderMini',
      'responder',
      'responderParte',
      'responderAnio',
      'responderHemi',
      'responderElemento',
      'responderParalelo',
      'responderReloj',
      'responderProyeccion',
      'responder1',
      'responder2',
      'responder3',
      'responder4'
    ].forEach(function (name) {
      wrap(name, function (original, args) {
        const page = inferPage(args);
        const boolResult = firstBoolean(args);
        const result = original.apply(this, args);
        if (boolResult === true) {
          if (!mainCompletionFeedback(page)) {
            addSuccess(page, { funcion: name, resultado: 'correcto' });
          }
        } else if (boolResult === false) {
          addError(page, { funcion: name, resultado: 'incorrecto' });
        }
        setTimeout(function () {
          syncQuizLinks();
          syncNavigationGates();
        }, 0);
        return result;
      });
    });

    ['checkCompletado', 'verificarActividad', 'verificar', 'comprobar'].forEach(function (name) {
      wrap(name, async function (original, args) {
        const page = activePageNumber();
        const result = original.apply(this, args);
        const key = keyForPage(page);
        const state = tracker.getState(key);
        if (result !== false && state && !state.saved) {
          await addSuccess(page, { funcion: name, resultado: 'completado' });
        }
        setTimeout(function () {
          syncQuizLinks();
          syncNavigationGates();
        }, 0);
        return result;
      });
    });
  }

  function bindQuizLinks() {
    session.start();
    bayesState = readBayesState() || createEmptyBayesState(getCurrentSessionUuid());

    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, a[href*="quiz.html"]').forEach(function (link) {
      if (link.dataset.reforzamientoSesionBound === 'true') return;
      const href = link.getAttribute('href');
      if (!href) return;

      link.dataset.reforzamientoSesionBound = 'true';
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        if (!allPagesSolved()) {
          syncNavigationGates();
          showGateHint('Completa correctamente todas las actividades antes de ir al quiz.');
          return;
        }

        if (!bayesState.recommendation && !bayesState.loading) {
          await resolveLevelBayesFlow();
        }

        if (!isQuizUnlockedByBayes()) {
          syncQuizLinks();
          showGateHint(lockedQuizMessage());
          scrollBayesPanelIntoView();
          return;
        }

        await finalizeAll(false);

        if (!bayesState.sessionClosed) {
          const response = await session.complete({ eventoCierre: 'quiz' });
          updateBayesState({
            sessionClosed: response?.success === true
          });
        }

        window.location.href = href;
      });
    });
  }

  ready(function () {
    bindNavigation();
    bindBooleanResponders();
    bindQuizLinks();
    syncQuizLinks();
    syncNavigationGates();
  });
})();
