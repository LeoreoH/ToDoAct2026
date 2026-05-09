(function () {
  const path = String(window.location.pathname || '').toLowerCase();
  if (!path.includes('/identificar-coordenadas/contenido/')) return;
  if (path.endsWith('/quiz.html')) return;
  if (!window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/identificar-coordenadas\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const contenidoId = 5;
  const totalPaginas = 5;
  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `identificar_coordenadas_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotMate = '/recursos/mascotas/mascota-mate-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        {
          icon: '&#x1F5FA;&#xFE0F;',
          title: 'Calles y avenidas',
          text: 'Para ubicar mejor un lugar en un plano, conviene mirar el cruce entre una calle y una avenida.'
        },
        {
          icon: '&#x1F522;',
          title: 'Cuadricula simple',
          text: 'En una coordenada simple primero se lee la letra o columna, y despues el numero o fila.'
        },
        {
          icon: '&#x1F9ED;',
          title: 'Direcciones',
          text: 'En el plano, subir suele indicar norte, bajar sur, derecha este e izquierda oeste.'
        },
        {
          icon: '&#x1F463;',
          title: 'Pasos y unidades',
          text: 'Si cada paso vale lo mismo, puedes multiplicar para saber cuantas unidades avanzas o dividir para averiguar los pasos.'
        },
        {
          icon: '&#x1F3AF;',
          title: 'Seguir una ruta',
          text: 'Para seguir una ruta, haz un movimiento a la vez y revisa siempre en que punto terminas.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '&#x1F5FA;&#xFE0F;',
          prompt: 'Si quieres ubicar mejor un lugar en el plano, que te ayuda mas?',
          options: [
            'Mirar una calle y una avenida al mismo tiempo.',
            'Mirar solo un color del plano.',
            'Mirar solo el dibujo del lugar.'
          ],
          correct: 'Mirar una calle y una avenida al mismo tiempo.',
          hint: 'Piensa en como se ubica mejor un cruce.'
        },
        {
          icon: '&#x1F522;',
          prompt: 'Como se lee una coordenada simple como C2?',
          options: [
            'Primero la letra y luego el numero.',
            'Primero el numero y luego la letra.',
            'Primero el color y luego la letra.'
          ],
          correct: 'Primero la letra y luego el numero.',
          hint: 'Recuerda el orden columna y despues fila.'
        },
        {
          icon: '&#x1F9ED;',
          prompt: 'Si en el plano te mueves hacia la derecha, hacia donde avanzas?',
          options: [
            'Hacia el este.',
            'Hacia el norte.',
            'Hacia el sur.'
          ],
          correct: 'Hacia el este.',
          hint: 'Relaciona la derecha con los puntos cardinales.'
        },
        {
          icon: '&#x1F463;',
          prompt: 'Si cada paso vale 2 unidades, cuantas unidades son 4 pasos?',
          options: [
            '6 unidades.',
            '8 unidades.',
            '10 unidades.'
          ],
          correct: '8 unidades.',
          hint: 'Multiplica 4 por 2.'
        },
        {
          icon: '&#x1F3AF;',
          prompt: 'Que conviene hacer para no perderte al seguir una ruta?',
          options: [
            'Ir paso por paso y revisar donde terminas.',
            'Moverte rapido sin revisar nada.',
            'Cambiar el orden de los movimientos.'
          ],
          correct: 'Ir paso por paso y revisar donde terminas.',
          hint: 'Lo importante es seguir el recorrido con calma.'
        }
      ]
    },
    normal: {
      repasoCards: [
        {
          icon: '&#x1F6E3;&#xFE0F;',
          title: 'Ruta de Sebastian',
          text: 'Cuando una ruta tiene varias pistas, conviene seguirlas una por una y revisar en que calle, avenida o punto termina cada movimiento.'
        },
        {
          icon: '&#x1F3DB;&#xFE0F;',
          title: 'Ciudad Universitaria',
          text: 'En un plano grande, combinar filas, columnas y referencias ayuda a ubicar edificios, entradas y recorridos con mas precision.'
        },
        {
          icon: '&#x1F687;',
          title: 'Red de Metro',
          text: 'En una red de transporte importa leer bien el orden de estaciones, los cambios de linea y la direccion del recorrido.'
        },
        {
          icon: '&#x1F916;',
          title: 'Robots',
          text: 'Para comparar recorridos de robots, hay que observar cuantos pasos dan, en que direccion avanzan y donde terminan.'
        },
        {
          icon: '&#x1F3AD;',
          title: 'Plano de teatro',
          text: 'En un plano de asientos, la fila, el lado y la posicion ayudan a encontrar un lugar exacto sin confundirse.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '&#x1F6E3;&#xFE0F;',
          prompt: 'Si una ruta tiene varias pistas, que te ayuda mas a no confundirte?',
          options: [
            'Seguir cada pista en orden y revisar donde acabas.',
            'Cambiar el orden de las pistas.',
            'Mirar solo el primer movimiento.'
          ],
          correct: 'Seguir cada pista en orden y revisar donde acabas.',
          hint: 'Piensa en seguir el recorrido paso a paso.'
        },
        {
          icon: '&#x1F3DB;&#xFE0F;',
          prompt: 'Que ayuda mas para ubicar un edificio en un plano grande?',
          options: [
            'Combinar filas, columnas y referencias.',
            'Mirar solo el dibujo mas bonito.',
            'Contar unicamente los colores.'
          ],
          correct: 'Combinar filas, columnas y referencias.',
          hint: 'En un plano grande, una sola pista casi nunca basta.'
        },
        {
          icon: '&#x1F687;',
          prompt: 'En una red de Metro, que conviene revisar con atencion?',
          options: [
            'El orden de estaciones y los cambios de linea.',
            'Solo el color del tren.',
            'Solo el nombre de la primera estacion.'
          ],
          correct: 'El orden de estaciones y los cambios de linea.',
          hint: 'Recuerda que una ruta puede necesitar transbordos.'
        },
        {
          icon: '&#x1F916;',
          prompt: 'Si comparas dos robots, que debes mirar?',
          options: [
            'Cuantos pasos dan, hacia donde van y donde terminan.',
            'Solo el tamaño del robot.',
            'Solo el primer paso que da.'
          ],
          correct: 'Cuantos pasos dan, hacia donde van y donde terminan.',
          hint: 'No basta con ver un solo detalle del recorrido.'
        },
        {
          icon: '&#x1F3AD;',
          prompt: 'Para encontrar un asiento en el teatro, que es lo mas util?',
          options: [
            'Revisar fila, lado y posicion del asiento.',
            'Mirar solo el color del escenario.',
            'Contar solo las butacas del frente.'
          ],
          correct: 'Revisar fila, lado y posicion del asiento.',
          hint: 'La ubicacion exacta necesita mas de una referencia.'
        }
      ]
    },
    dificil: {
      repasoCards: [
        {
          icon: '&#x1F6E3;&#xFE0F;',
          title: 'Ruta por la colonia',
          text: 'En rutas mas complejas conviene leer cada pista en orden y combinar referencias antes de decidir el punto final.'
        },
        {
          icon: '&#x1F687;',
          title: 'Metro complejo',
          text: 'En una red compleja hay que cuidar el orden de estaciones, los cambios de linea y la direccion de cada tramo.'
        },
        {
          icon: '&#x2708;&#xFE0F;',
          title: 'Batalla aerea',
          text: 'Cuando comparas posiciones en el plano, importa revisar en que coordenada esta cada objeto y como cambia su recorrido.'
        },
        {
          icon: '&#x1F3AD;',
          title: 'Teatro',
          text: 'En un plano detallado de asientos, varias referencias juntas ayudan a encontrar el lugar exacto sin perderte.'
        },
        {
          icon: '&#x1F3DB;&#xFE0F;',
          title: 'Ciudad Universitaria',
          text: 'Para resolver recorridos grandes, conviene separar la ruta en partes cortas y comprobar cada paso antes de continuar.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '&#x1F6E3;&#xFE0F;',
          prompt: 'Si una ruta tiene varias pistas, que te ayuda mas a ubicar el destino correcto?',
          options: [
            'Seguir las pistas en orden y combinar las referencias.',
            'Elegir la primera opcion que se vea cerca.',
            'Cambiar el orden de las pistas.'
          ],
          correct: 'Seguir las pistas en orden y combinar las referencias.',
          hint: 'En una ruta compleja, cada pista aporta una parte de la ubicacion.'
        },
        {
          icon: '&#x1F687;',
          prompt: 'En un mapa de Metro complejo, que es importante revisar?',
          options: [
            'El orden de estaciones y los cambios de linea.',
            'Solo el nombre de la primera estacion.',
            'Solo el color mas llamativo.'
          ],
          correct: 'El orden de estaciones y los cambios de linea.',
          hint: 'Piensa en como se construye una ruta completa.'
        },
        {
          icon: '&#x2708;&#xFE0F;',
          prompt: 'Si comparas posiciones en una cuadricula, que debes mirar?',
          options: [
            'La coordenada y el recorrido de cada objeto.',
            'Solo el dibujo del objeto.',
            'Solo el color del fondo.'
          ],
          correct: 'La coordenada y el recorrido de cada objeto.',
          hint: 'La posicion exacta depende de la referencia en la cuadricula.'
        },
        {
          icon: '&#x1F3AD;',
          prompt: 'Para encontrar un asiento en un teatro grande, que es lo mas util?',
          options: [
            'Usar varias referencias como fila, lado y posicion.',
            'Mirar solo el escenario.',
            'Contar butacas al azar.'
          ],
          correct: 'Usar varias referencias como fila, lado y posicion.',
          hint: 'Una sola pista no suele bastar en un plano detallado.'
        },
        {
          icon: '&#x1F3DB;&#xFE0F;',
          prompt: 'Que te ayuda mas al resolver un recorrido largo?',
          options: [
            'Separarlo en partes cortas y comprobar cada paso.',
            'Intentar adivinar el final desde el principio.',
            'Moverte sin revisar las coordenadas.'
          ],
          correct: 'Separarlo en partes cortas y comprobar cada paso.',
          hint: 'Ir tramo por tramo ayuda a no perderte.'
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

  function callPageSolver(page) {
    if (estilo === 'visual_verbal' && nivel === 'facil' && typeof window.paginaCompletaVisualVerbal === 'function') {
      return !!window.paginaCompletaVisualVerbal(page);
    }
    if (estilo === 'visual_verbal' && nivel === 'normal' && typeof window.paginaCompletaNormalVisualVerbal === 'function') {
      return !!window.paginaCompletaNormalVisualVerbal(page);
    }
    if (estilo === 'visual_verbal' && nivel === 'dificil' && typeof window.paginaCompletaDificilVisualVerbal === 'function') {
      return !!window.paginaCompletaDificilVisualVerbal(page);
    }
    if (estilo === 'visual_no_verbal' && nivel === 'facil' && typeof window.paginaCompletaVisualNoVerbal === 'function') {
      return !!window.paginaCompletaVisualNoVerbal(page);
    }
    if (estilo === 'visual_no_verbal' && nivel === 'normal' && typeof window.paginaCompletaNormalVisualNoVerbal === 'function') {
      return !!window.paginaCompletaNormalVisualNoVerbal(page);
    }
    if (estilo === 'visual_no_verbal' && nivel === 'dificil' && typeof window.paginaCompletaDificilVisualNoVerbal === 'function') {
      return !!window.paginaCompletaDificilVisualNoVerbal(page);
    }
    if (estilo === 'kinestesico' && nivel === 'facil' && typeof window.paginaCompletaKin === 'function') {
      return !!window.paginaCompletaKin(page);
    }
    if (estilo === 'kinestesico' && nivel === 'normal' && typeof window.paginaCompletaNormalKinestesico === 'function') {
      return !!window.paginaCompletaNormalKinestesico(page);
    }
    if (estilo === 'kinestesico' && nivel === 'dificil' && typeof window.paginaCompletaDificilKinestesico === 'function') {
      return !!window.paginaCompletaDificilKinestesico(page);
    }
    if (estilo === 'auditivo' && typeof window.paginaCompleta === 'function') {
      return !!window.paginaCompleta(page);
    }
    return false;
  }

  function allPagesSolved() {
    for (let page = 1; page <= totalPaginas; page += 1) {
      if (!callPageSolver(page)) return false;
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
    if (document.getElementById('coordenadasBayesStyles')) return;
    const style = document.createElement('style');
    style.id = 'coordenadasBayesStyles';
    style.textContent = [
      '.coord-bayes-panel{display:none;max-width:980px;margin:18px auto 0;padding:22px 22px 24px;border-radius:28px;background:#ffffff;border:3px solid #f97316;box-shadow:0 8px 0 #fdba74;color:#9a3412;}',
      '.coord-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.coord-bayes-title{font-family:"Fredoka One",cursive;font-size:1.65rem;color:#c2410c;margin:0 0 8px;text-align:center;}',
      '.coord-bayes-text{font-size:1.04rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#9a3412;}',
      '.coord-bayes-helper{margin:8px 0 0;text-align:center;color:#b45309;font-weight:700;font-size:.98rem;}',
      '.coord-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.coord-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #fed7aa;border-top-color:#f97316;animation:coordBayesSpin .9s linear infinite;}',
      '@keyframes coordBayesSpin{to{transform:rotate(360deg);}}',
      '.coord-bayes-mascot-wrap{background:#fff7e6;border:3px solid #fed7aa;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(194,65,12,.12);}',
      '.coord-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(154,52,18,.14);}',
      '.coord-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.coord-bayes-card{background:#fff7e6;border:2px solid #fdba74;border-radius:20px;padding:16px;text-align:left;}',
      '.coord-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.coord-bayes-card-title{font-weight:900;color:#c2410c;font-size:1rem;margin-bottom:6px;}',
      '.coord-bayes-card-text{font-size:.96rem;line-height:1.45;color:#9a3412;margin:0;}',
      '.coord-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#fde68a;color:#9a3412;font-weight:900;font-size:1rem;border:3px solid #f97316;box-shadow:0 5px 0 #fdba74;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}',
      '.coord-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #fdba74;}',
      '.coord-bayes-action-wrap{text-align:center;}',
      '.coord-bayes-practice{margin-top:14px;background:#fff7e6;border:2px solid #fdba74;border-radius:22px;padding:18px 16px;}',
      '.coord-bayes-progress{text-align:center;font-weight:900;color:#ea580c;margin-bottom:12px;}',
      '.coord-bayes-question{font-size:1.15rem;font-weight:900;color:#9a3412;text-align:center;margin:0 0 14px;}',
      '.coord-bayes-options{display:grid;gap:10px;}',
      '.coord-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #fdba74;background:#ffffff;color:#9a3412;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.coord-bayes-option:hover{transform:translateY(-1px);background:#fffaf0;}',
      '.coord-bayes-option.ok{background:#22c55e;border-color:#166534;color:#ffffff;box-shadow:0 6px 0 rgba(22,101,52,.28);transform:translateY(-1px);}',
      '.coord-bayes-option.err{background:#ef4444;border-color:#991b1b;color:#ffffff;box-shadow:0 6px 0 rgba(153,27,27,.22);transform:translateY(-1px);}',
      '.coord-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#c2410c;}',
      '.coord-bayes-feedback.err{color:#b91c1c;}',
      '.coord-bayes-ready{margin-top:14px;background:#ecfccb;border:2px solid #84cc16;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#3f6212;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensurePanel() {
    ensureStyles();
    let panel = document.getElementById('coordenadasBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'coordenadasBayesPanel';
    panel.className = 'coord-bayes-panel';

    const quizButton = document.getElementById('botonQuiz') || document.querySelector('.boton-quiz');
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

  const sessionTracker = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel: nivel,
    estilo: estilo,
    storageKey: sessionStorageKey,
    detalleBase: { bloque: 'identificar_coordenadas', archivo: `${estilo}_facil_bayes` }
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

  function currentHelpMessage() {
    if (bayesState.loading) return 'Espera un momento. Estamos revisando tu avance.';
    if (bayesState.recommendation === 'repaso' && !bayesState.repasoDone) {
      return 'Antes del quiz, mira las tarjetas y pulsa "Listo, ya lo recorde".';
    }
    if (bayesState.recommendation === 'apoyo' && !bayesState.apoyoDone) {
      return 'Antes del quiz, completa la practica extra con calma.';
    }
    if (bayesState.recommendation && computeQuizUnlocked(bayesState)) {
      return 'Ya puedes ir al quiz.';
    }
    return 'Completa los dos retos de esta pagina para activar el quiz.';
  }

  function updateHelpText() {
    const help = document.getElementById('textoAyudaQuiz');
    if (!help) return;
    const finalReady = activePageNumber() === totalPaginas && allPagesSolved();
    help.textContent = finalReady ? currentHelpMessage() : 'Completa los dos retos de esta pagina para activar el quiz.';
  }

  function scrollPanelIntoView() {
    const panel = document.getElementById('coordenadasBayesPanel');
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
      updateHelpText();
      return;
    }

    panel.style.display = 'block';

    if (bayesState.loading) {
      panel.dataset.kind = 'loading';
      panel.innerHTML = [
        '<div class="coord-bayes-loader">',
        '<div class="coord-bayes-spinner" aria-hidden="true"></div>',
        '<h3 class="coord-bayes-title">Estamos revisando tu avance</h3>',
        '<p class="coord-bayes-text">Espera tantito. Ya casi te decimos como seguir.</p>',
        '</div>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = [
        '<div class="coord-bayes-mascot-wrap">',
        `<img src="${mascotMate}" alt="Capibara felicitando" class="coord-bayes-mascot">`,
        '</div>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = [
        '<h3 class="coord-bayes-title">Vas muy bien</h3>',
        '<p class="coord-bayes-text">Entendiste bien este nivel y ya puedes seguir con confianza al quiz.</p>'
      ].join('');
      updateHelpText();
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return [
          '<article class="coord-bayes-card">',
          `<span class="coord-bayes-card-icon">${card.icon}</span>`,
          `<div class="coord-bayes-card-title">${card.title}</div>`,
          `<p class="coord-bayes-card-text">${card.text}</p>`,
          '</article>'
        ].join('');
      }).join('');

      panel.innerHTML = [
        '<h3 class="coord-bayes-title">Tarjetas para recordar</h3>',
        '<p class="coord-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p>',
        `<div class="coord-bayes-card-grid">${cards}</div>`,
        bayesState.repasoDone
          ? '<div class="coord-bayes-ready">Listo. Ya puedes ir al quiz.</div>'
          : '<div class="coord-bayes-action-wrap"><button type="button" class="coord-bayes-action" id="coordBayesRepasoBtn">Listo, ya lo recorde</button></div>'
      ].join('');

      const repasoBtn = document.getElementById('coordBayesRepasoBtn');
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
          '<h3 class="coord-bayes-title">Practica extra terminada</h3>',
          '<p class="coord-bayes-text">Terminaste la practica extra. Ahora si ya puedes ir al quiz.</p>',
          '<div class="coord-bayes-ready">Sigue con calma y lee cada pregunta con mucha atencion.</div>'
        ].join('');
        updateHelpText();
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = shuffle(currentQuestion.options).map(function (option) {
        return `<button type="button" class="coord-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = [
        '<h3 class="coord-bayes-title">Practica extra antes del quiz</h3>',
        '<p class="coord-bayes-text">Vamos paso a paso. Primero haremos una practica corta para recordar lo mas importante.</p>',
        '<div class="coord-bayes-practice">',
        `<div class="coord-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div>`,
        `<p class="coord-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p>`,
        `<div class="coord-bayes-options">${optionsMarkup}</div>`,
        '<div class="coord-bayes-feedback" id="coordBayesApoyoFeedback" aria-live="polite"></div>',
        '</div>'
      ].join('');

      const feedback = document.getElementById('coordBayesApoyoFeedback');
      panel.querySelectorAll('.coord-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const selected = button.getAttribute('data-value') || '';
          const allButtons = Array.from(panel.querySelectorAll('.coord-bayes-option'));
          if (selected === currentQuestion.correct) {
            allButtons.forEach(function (item) {
              item.disabled = true;
            });
            button.classList.add('ok');
            feedback.className = 'coord-bayes-feedback';
            feedback.textContent =
              bayesState.apoyoIndex + 1 >= apoyoQuestions.length
                ? 'Muy bien. Ya terminaste esta practica.'
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
          feedback.className = 'coord-bayes-feedback err';
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

    const showQuiz = activePageNumber() === totalPaginas && allPagesSolved();
    const unlocked = showQuiz && computeQuizUnlocked(bayesState);

    quizButton.style.display = showQuiz ? 'block' : 'none';
    quizButton.classList.toggle('bloqueado', !unlocked);
    quizButton.setAttribute('aria-disabled', String(!unlocked));
    quizButton.style.opacity = unlocked ? '1' : '0.68';
    quizButton.style.filter = unlocked ? 'none' : 'grayscale(0.08)';
    updateHelpText();
  }

  async function resolveBayesFlow() {
    if (bayesState.recommendation || bayesState.loading) return bayesState;
    if (!(activePageNumber() === totalPaginas && allPagesSolved())) return bayesState;
    if (bayesRequestPromise) return bayesRequestPromise;

    bayesRequestPromise = (async function () {
      updateState({ loading: true });
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
      if (activePageNumber() === totalPaginas && allPagesSolved() && !bayesState.recommendation && !bayesState.loading) {
        resolveBayesFlow();
      }
    }, 0);
  }

  function bindNavigation() {
    ['cambiarPagina', 'actualizarUI'].forEach(function (name) {
      wrap(name, function (original, args) {
        const result = original.apply(this, args);
        scheduleSync();
        return result;
      });
    });

    const observer = new MutationObserver(function (mutations) {
      const hasExternalMutation = mutations.some(function (mutation) {
        const target = mutation && mutation.target;
        return !(target && target.closest && target.closest('#coordenadasBayesPanel'));
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
    const quizButton = document.getElementById('botonQuiz') || document.querySelector('.boton-quiz');
    if (!quizButton || quizButton.dataset.coordenadasBayesBound === 'true') return;

    quizButton.dataset.coordenadasBayesBound = 'true';
    quizButton.addEventListener('click', async function (event) {
      const href = quizButton.getAttribute('href');
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!allPagesSolved()) {
        updateHelpText();
        scrollPanelIntoView();
        return;
      }

      if (!bayesState.recommendation && !bayesState.loading) {
        await resolveBayesFlow();
      }

      if (!computeQuizUnlocked(bayesState)) {
        updateHelpText();
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
