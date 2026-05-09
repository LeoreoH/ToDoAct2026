(function () {
  const path = (window.location.pathname || '').toLowerCase();
  if (!path.includes('/componentes-naturales/contenido/')) return;
  if (!window.createReforzamientoTracker || !window.createReforzamientoSessionTracker) return;

  const match = path.match(/\/componentes-naturales\/contenido\/([^/]+)\/([^/]+)\.html$/);
  if (!match) return;

  const nivel = match[1];
  const estilo = match[2];
  const fileKey = nivel + '/' + estilo;
  const COMPLETION_GATES = new Set([
    'facil/visual_verbal',
    'facil/visual_no_verbal',
    'facil/auditivo',
    'facil/kinestesico',
    'normal/visual_verbal',
    'normal/visual_no_verbal',
    'normal/auditivo',
    'normal/kinestesico',
    'dificil/visual_verbal',
    'dificil/visual_no_verbal',
    'dificil/auditivo',
    'dificil/kinestesico'
  ]);
  const completionGateEnabled = COMPLETION_GATES.has(fileKey);
  const solvedPages = new Set();
  const completionReconcilers = [];
  let gateHintTimer = null;

  const SETUPS = {
    'facil/visual_verbal': setupEasyVisualVerbal,
    'facil/visual_no_verbal': setupEasyVisualNoVerbal,
    'facil/auditivo': setupEasyAuditivo,
    'facil/kinestesico': setupEasyKinestesico,
    'normal/visual_verbal': setupWaterTextGame,
    'normal/kinestesico': setupWaterTextGame,
    'dificil/visual_verbal': setupRegionsVisualVerbal,
    'normal/visual_no_verbal': setupWaterVisualNoVerbal,
    'normal/auditivo': setupWaterAudioGame,
    'dificil/auditivo': setupWaterAudioGame,
    'dificil/visual_no_verbal': setupRegionsVisualNoVerbal,
    'dificil/kinestesico': setupRegionsKinestesico
  };

  const contenidoId = 2;
  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `componentes_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotGeo = '/recursos/mascotas/mascota-geo-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        {
          icon: '🏔️',
          title: 'Relieve y suelo',
          text: 'El relieve forma montañas, valles, llanuras y mesetas. Son partes del suelo que cambian la forma de la superficie.'
        },
        {
          icon: '🌍',
          title: 'Corteza terrestre',
          text: 'La corteza es la capa sólida donde vivimos. No está entera: está dividida en grandes piezas llamadas placas tectónicas.'
        },
        {
          icon: '↔️',
          title: 'Movimiento de placas',
          text: 'Las placas pueden separarse, chocar o deslizarse. Cuando se mueven, cambian el relieve y pueden provocar fenómenos naturales.'
        },
        {
          icon: '📡',
          title: 'Sismos y temblores',
          text: 'Los sismos ocurren cuando se libera energía dentro de la Tierra. Esa vibración hace que el suelo se mueva.'
        },
        {
          icon: '🌋',
          title: 'Volcanes',
          text: 'Un volcán es una abertura por donde pueden salir magma, gases y ceniza desde el interior de la Tierra.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🏔️',
          prompt: '¿Qué idea describe mejor al relieve?',
          options: [
            'Es la forma que tiene la superficie de la Tierra.',
            'Es solo el nombre de los volcanes.',
            'Es el color del suelo.'
          ],
          correct: 'Es la forma que tiene la superficie de la Tierra.',
          hint: 'Piensa en montañas, valles y llanuras.'
        },
        {
          icon: '🌍',
          prompt: '¿Qué son las placas tectónicas?',
          options: [
            'Capas de nubes que cubren el cielo.',
            'Grandes piezas de la corteza terrestre.',
            'Ríos subterráneos muy calientes.'
          ],
          correct: 'Grandes piezas de la corteza terrestre.',
          hint: 'Recuerda la corteza quebradiza.'
        },
        {
          icon: '📡',
          prompt: '¿Qué puede pasar cuando las placas se mueven?',
          options: [
            'Puede temblar el suelo.',
            'La Tierra deja de girar.',
            'Desaparece el agua de los mares.'
          ],
          correct: 'Puede temblar el suelo.',
          hint: 'Relaciona placas, sismos y temblores.'
        },
        {
          icon: '🌋',
          prompt: '¿Qué sale de un volcán durante una erupción?',
          options: [
            'Solo lluvia.',
            'Magma, gases y ceniza.',
            'Nieve y hielo.'
          ],
          correct: 'Magma, gases y ceniza.',
          hint: 'Recuerda lo que ocurre dentro de la Tierra.'
        }
      ]
    },
    normal: {
      repasoCards: [
        {
          icon: '🌧️',
          title: 'Clima y agua',
          text: 'El clima influye en la cantidad de agua disponible. La lluvia, la evaporación y la temperatura cambian cómo se mueve el agua en la naturaleza.'
        },
        {
          icon: '🏞️',
          title: 'Relieve y agua',
          text: 'El relieve guía el recorrido del agua. Las montañas, llanuras y valles hacen que el agua cambie de dirección y velocidad.'
        },
        {
          icon: '🏗️',
          title: 'Obras humanas y agua',
          text: 'Las personas construyen obras como presas, canales o acueductos para almacenar, conducir o aprovechar el agua.'
        },
        {
          icon: '🌊',
          title: 'Recursos hídricos',
          text: 'La mayor parte del agua del planeta es salada. Solo una parte pequeña es dulce y mucha de ella está congelada o bajo tierra.'
        },
        {
          icon: '🗺️',
          title: 'Ríos y lagos',
          text: 'Un río corre y sigue un cauce. Un lago es una acumulación de agua rodeada por tierra.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌧️',
          prompt: '¿Qué idea relaciona mejor al clima con el agua?',
          options: [
            'El clima influye en la lluvia y en la cantidad de agua disponible.',
            'El clima solo cambia el color del cielo.',
            'El clima no tiene relación con el agua.'
          ],
          correct: 'El clima influye en la lluvia y en la cantidad de agua disponible.',
          hint: 'Piensa en lluvia, calor y evaporación.'
        },
        {
          icon: '🏞️',
          prompt: '¿Qué hace el relieve con el agua cuando cae o corre?',
          options: [
            'La guía por distintos caminos de la superficie.',
            'La convierte siempre en hielo.',
            'La hace desaparecer.'
          ],
          correct: 'La guía por distintos caminos de la superficie.',
          hint: 'Recuerda montañas, valles y llanuras.'
        },
        {
          icon: '🏗️',
          prompt: '¿Para qué sirve una obra humana relacionada con el agua, como una presa o un canal?',
          options: [
            'Para guardar o conducir el agua.',
            'Para producir volcanes.',
            'Para cambiar el clima del planeta.'
          ],
          correct: 'Para guardar o conducir el agua.',
          hint: 'Relaciona obra humana con uso del agua.'
        },
        {
          icon: '🌊',
          prompt: '¿Cuál afirmación es correcta sobre el agua del planeta?',
          options: [
            'La mayor parte es salada y solo una pequeña parte es dulce.',
            'Toda el agua del planeta es dulce.',
            'La mayor parte del agua está en los ríos.'
          ],
          correct: 'La mayor parte es salada y solo una pequeña parte es dulce.',
          hint: 'Piensa en mares y océanos.'
        },
        {
          icon: '🗺️',
          prompt: '¿Qué diferencia principal hay entre un río y un lago?',
          options: [
            'El río corre por un cauce y el lago queda rodeado por tierra.',
            'El lago corre y el río siempre está quieto.',
            'No hay diferencia entre los dos.'
          ],
          correct: 'El río corre por un cauce y el lago queda rodeado por tierra.',
          hint: 'Uno se mueve y el otro se acumula.'
        }
      ]
    }
  };
  const levelStyleContentMap = {
    'dificil/visual_verbal': {
      repasoCards: [
        {
          icon: '🌿',
          title: 'Regiones tropicales',
          text: 'La selva tropical es muy húmeda y con vegetación abundante. La sabana también es cálida, pero tiene menos árboles y más pastizales.'
        },
        {
          icon: '❄️',
          title: 'Regiones frías',
          text: 'La tundra es muy fría y casi no tiene árboles. La taiga o bosque boreal también es fría, pero sí presenta grandes bosques de coníferas.'
        },
        {
          icon: '🏜️',
          title: 'Regiones secas',
          text: 'El desierto tiene muy poca lluvia y vegetación escasa. La pradera o estepa tiene más pastos y condiciones menos extremas.'
        },
        {
          icon: '🧭',
          title: 'Características naturales',
          text: 'Para reconocer una región natural conviene observar clima, temperatura, vegetación, animales y cantidad de lluvia.'
        },
        {
          icon: '🌎',
          title: 'Comparar regiones',
          text: 'Al comparar regiones naturales, no basta una sola pista. Hay que mirar varias características al mismo tiempo.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌿',
          prompt: '¿Qué distingue mejor a una selva tropical?',
          options: [
            'Mucha humedad y vegetación abundante.',
            'Hielo casi todo el año.',
            'Arena y casi nada de lluvia.'
          ],
          correct: 'Mucha humedad y vegetación abundante.',
          hint: 'Piensa en calor, lluvia y muchos árboles.'
        },
        {
          icon: '❄️',
          prompt: '¿Qué idea ayuda a diferenciar tundra y taiga?',
          options: [
            'La taiga tiene bosques y la tundra casi no tiene árboles.',
            'La tundra tiene selvas muy húmedas.',
            'Las dos son desiertos cálidos.'
          ],
          correct: 'La taiga tiene bosques y la tundra casi no tiene árboles.',
          hint: 'Una de ellas tiene coníferas; la otra casi no.'
        },
        {
          icon: '🏜️',
          prompt: '¿Qué característica es más común en un desierto?',
          options: [
            'Muy poca lluvia.',
            'Lluvias abundantes todo el año.',
            'Grandes bosques congelados.'
          ],
          correct: 'Muy poca lluvia.',
          hint: 'Piensa en sequedad y escasez de agua.'
        },
        {
          icon: '🧭',
          prompt: 'Si quieres reconocer una región natural, ¿qué conviene observar?',
          options: [
            'Clima, vegetación y animales.',
            'Solo el color del cielo.',
            'Únicamente el nombre del lugar.'
          ],
          correct: 'Clima, vegetación y animales.',
          hint: 'No basta una sola pista.'
        }
      ]
    },
    'dificil/visual_no_verbal': {
      repasoCards: [
        {
          icon: '🌿',
          title: 'Regiones tropicales',
          text: 'La selva tropical es muy húmeda y con vegetación abundante. La sabana también es cálida, pero tiene menos árboles y más pastizales.'
        },
        {
          icon: '❄️',
          title: 'Regiones frías',
          text: 'La tundra es muy fría y casi no tiene árboles. La taiga o bosque boreal también es fría, pero sí presenta grandes bosques de coníferas.'
        },
        {
          icon: '🏜️',
          title: 'Regiones secas',
          text: 'El desierto tiene muy poca lluvia y vegetación escasa. La pradera o estepa tiene más pastos y condiciones menos extremas.'
        },
        {
          icon: '🧭',
          title: 'Características naturales',
          text: 'Para reconocer una región natural conviene observar clima, temperatura, vegetación, animales y cantidad de lluvia.'
        },
        {
          icon: '🌎',
          title: 'Comparar regiones',
          text: 'Al comparar regiones naturales, no basta una sola pista. Hay que mirar varias características al mismo tiempo.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌿',
          prompt: '¿Qué distingue mejor a una selva tropical?',
          options: [
            'Mucha humedad y vegetación abundante.',
            'Hielo casi todo el año.',
            'Arena y casi nada de lluvia.'
          ],
          correct: 'Mucha humedad y vegetación abundante.',
          hint: 'Piensa en calor, lluvia y muchos árboles.'
        },
        {
          icon: '❄️',
          prompt: '¿Qué idea ayuda a diferenciar tundra y taiga?',
          options: [
            'La taiga tiene bosques y la tundra casi no tiene árboles.',
            'La tundra tiene selvas muy húmedas.',
            'Las dos son desiertos cálidos.'
          ],
          correct: 'La taiga tiene bosques y la tundra casi no tiene árboles.',
          hint: 'Una de ellas tiene coníferas; la otra casi no.'
        },
        {
          icon: '🏜️',
          prompt: '¿Qué característica es más común en un desierto?',
          options: [
            'Muy poca lluvia.',
            'Lluvias abundantes todo el año.',
            'Grandes bosques congelados.'
          ],
          correct: 'Muy poca lluvia.',
          hint: 'Piensa en sequedad y escasez de agua.'
        },
        {
          icon: '🧭',
          prompt: 'Si quieres reconocer una región natural, ¿qué conviene observar?',
          options: [
            'Clima, vegetación y animales.',
            'Solo el color del cielo.',
            'Únicamente el nombre del lugar.'
          ],
          correct: 'Clima, vegetación y animales.',
          hint: 'No basta una sola pista.'
        }
      ]
    },
    'dificil/kinestesico': {
      repasoCards: [
        {
          icon: '🌿',
          title: 'Regiones tropicales',
          text: 'La selva tropical es muy húmeda y con vegetación abundante. La sabana también es cálida, pero tiene menos árboles y más pastizales.'
        },
        {
          icon: '❄️',
          title: 'Regiones frías',
          text: 'La tundra es muy fría y casi no tiene árboles. La taiga o bosque boreal también es fría, pero sí presenta grandes bosques de coníferas.'
        },
        {
          icon: '🏜️',
          title: 'Regiones secas',
          text: 'El desierto tiene muy poca lluvia y vegetación escasa. La pradera o estepa tiene más pastos y condiciones menos extremas.'
        },
        {
          icon: '🧭',
          title: 'Características naturales',
          text: 'Para reconocer una región natural conviene observar clima, temperatura, vegetación, animales y cantidad de lluvia.'
        },
        {
          icon: '🌎',
          title: 'Comparar regiones',
          text: 'Al comparar regiones naturales, no basta una sola pista. Hay que mirar varias características al mismo tiempo.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌿',
          prompt: '¿Qué distingue mejor a una selva tropical?',
          options: [
            'Mucha humedad y vegetación abundante.',
            'Hielo casi todo el año.',
            'Arena y casi nada de lluvia.'
          ],
          correct: 'Mucha humedad y vegetación abundante.',
          hint: 'Piensa en calor, lluvia y muchos árboles.'
        },
        {
          icon: '❄️',
          prompt: '¿Qué idea ayuda a diferenciar tundra y taiga?',
          options: [
            'La taiga tiene bosques y la tundra casi no tiene árboles.',
            'La tundra tiene selvas muy húmedas.',
            'Las dos son desiertos cálidos.'
          ],
          correct: 'La taiga tiene bosques y la tundra casi no tiene árboles.',
          hint: 'Una de ellas tiene coníferas; la otra casi no.'
        },
        {
          icon: '🏜️',
          prompt: '¿Qué característica es más común en un desierto?',
          options: [
            'Muy poca lluvia.',
            'Lluvias abundantes todo el año.',
            'Grandes bosques congelados.'
          ],
          correct: 'Muy poca lluvia.',
          hint: 'Piensa en sequedad y escasez de agua.'
        },
        {
          icon: '🧭',
          prompt: 'Si quieres reconocer una región natural, ¿qué conviene observar?',
          options: [
            'Clima, vegetación y animales.',
            'Solo el color del cielo.',
            'Únicamente el nombre del lugar.'
          ],
          correct: 'Clima, vegetación y animales.',
          hint: 'No basta una sola pista.'
        }
      ]
    },
    'dificil/auditivo': {
      repasoCards: [
        {
          icon: '♻️',
          title: 'Ciclo del agua',
          text: 'El agua cambia de estado y de lugar en un ciclo continuo: se evapora, se condensa, cae como precipitación y vuelve a reunirse.'
        },
        {
          icon: '🌍',
          title: 'Distribución del agua',
          text: 'La mayor parte del agua del planeta es salada. El agua dulce es escasa y gran parte se encuentra congelada o bajo tierra.'
        },
        {
          icon: '🗺️',
          title: 'Cuencas hidrográficas',
          text: 'Una cuenca reúne las aguas que escurren hacia un mismo río, lago o mar. Conecta montañas, ríos y desembocaduras.'
        },
        {
          icon: '⚠️',
          title: 'Impacto humano',
          text: 'La contaminación, el desperdicio y algunas actividades humanas dañan el agua y afectan a los seres vivos que dependen de ella.'
        },
        {
          icon: '💧',
          title: 'Conservación del agua',
          text: 'Cuidar el agua implica usarla con responsabilidad, evitar contaminarla y proteger las fuentes naturales.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '♻️',
          prompt: '¿Qué idea resume mejor al ciclo del agua?',
          options: [
            'El agua cambia de lugar y de estado una y otra vez.',
            'El agua aparece solo cuando llueve.',
            'El agua del planeta nunca se mueve.'
          ],
          correct: 'El agua cambia de lugar y de estado una y otra vez.',
          hint: 'Piensa en evaporación, condensación y lluvia.'
        },
        {
          icon: '🌍',
          prompt: '¿Qué pasa con la mayor parte del agua del planeta?',
          options: [
            'Es salada.',
            'Está en los ríos.',
            'Es dulce y fácil de usar.'
          ],
          correct: 'Es salada.',
          hint: 'Recuerda mares y océanos.'
        },
        {
          icon: '🗺️',
          prompt: '¿Qué reúne una cuenca hidrográfica?',
          options: [
            'Aguas que van hacia un mismo cauce o salida.',
            'Solo animales del bosque.',
            'Volcanes y sismos.'
          ],
          correct: 'Aguas que van hacia un mismo cauce o salida.',
          hint: 'Piensa en ríos y escurrimientos conectados.'
        },
        {
          icon: '💧',
          prompt: '¿Cuál es una acción de conservación del agua?',
          options: [
            'Usarla con cuidado y no contaminarla.',
            'Tirarla aunque no se necesite.',
            'Ensuciar ríos y lagos.'
          ],
          correct: 'Usarla con cuidado y no contaminarla.',
          hint: 'Conservar es proteger y aprovechar mejor.'
        }
      ]
    }
  };
  const activeLevelContent = levelStyleContentMap[fileKey] || levelContentMap[nivel] || null;
  const repasoCards = activeLevelContent ? activeLevelContent.repasoCards : [];
  const apoyoQuestions = activeLevelContent ? activeLevelContent.apoyoQuestions : [];

  const setup = SETUPS[fileKey];
  if (typeof setup !== 'function') return;
  const PAGE_SELECTOR = '.pagina[id^="pagina"], .pag[id^="pagina"]';

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
    const page = node && node.closest ? node.closest(PAGE_SELECTOR) : null;
    const value = page ? parseInt(page.id.replace('pagina', ''), 10) : Number(fallback || 0);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  function activePage() {
    return pageFromNode(document.querySelector('.pagina.activa[id^="pagina"], .pag.activa[id^="pagina"]'), 1);
  }

  function buildApartados() {
    const total = document.querySelectorAll(PAGE_SELECTOR).length || 1;
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
    contenidoId: contenidoId,
    nivel,
    estilo,
    detalleBase: { bloque: 'componentes_naturales' },
    apartados: built.apartados
  });

  const session = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel,
    estilo,
    detalleBase: { bloque: 'componentes_naturales' }
  });

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
    if (!activeLevelContent || !state || !state.recommendation) return true;
    if (state.recommendation === 'avance' || state.recommendation === 'mantener') return true;
    if (state.recommendation === 'repaso') return state.repasoDone === true;
    if (state.recommendation === 'apoyo') return state.apoyoDone === true;
    return false;
  }

  function readBayesState() {
    if (!activeLevelContent) return null;
    const stored = readJsonFromSessionStorage(bayesStateStorageKey);
    if (!stored || typeof stored !== 'object') return null;

    const currentSessionUuid = getCurrentSessionUuid();
    if (stored.sessionUuid && currentSessionUuid && stored.sessionUuid !== currentSessionUuid) {
      removeFromSessionStorage(bayesStateStorageKey);
      return null;
    }

    return {
      sessionUuid: typeof stored.sessionUuid === 'string' ? stored.sessionUuid : currentSessionUuid,
      loading: stored.loading === true,
      recommendation: typeof stored.recommendation === 'string' ? stored.recommendation : '',
      confidence: Number.isFinite(Number(stored.confidence)) ? Number(stored.confidence) : null,
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
    if (!activeLevelContent) return;
    if (document.getElementById('componentesBayesStyles')) return;

    const style = document.createElement('style');
    style.id = 'componentesBayesStyles';
    style.textContent = [
      '.cmp-bayes-panel{display:none;max-width:960px;margin:18px auto 0;padding:22px 22px 24px;border-radius:26px;background:#ffffff;border:3px solid #2e7d32;box-shadow:0 8px 0 #1b5e20;color:#1b5e20;}',
      '.cmp-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.cmp-bayes-title{font-family:inherit;font-size:1.65rem;color:#1b5e20;margin:0 0 8px;text-align:center;font-weight:900;}',
      '.cmp-bayes-text{font-size:1.05rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:#1b5e20;}',
      '.cmp-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.cmp-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #c8e6c9;border-top-color:#2e7d32;animation:cmpBayesSpin 0.9s linear infinite;}',
      '@keyframes cmpBayesSpin{to{transform:rotate(360deg);}}',
      '.cmp-bayes-mascot-wrap{background:#f7fff7;border:3px solid #cde9d0;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(27,94,32,.14);}',
      '.cmp-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(27,94,32,.12);}',
      '.cmp-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.cmp-bayes-card{background:#f1f8e9;border:2px solid #a5d6a7;border-radius:20px;padding:16px;text-align:left;}',
      '.cmp-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.cmp-bayes-card-title{font-weight:900;color:#1b5e20;font-size:1rem;margin-bottom:6px;}',
      '.cmp-bayes-card-text{font-size:.96rem;line-height:1.45;color:#24582c;margin:0;}',
      '.cmp-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#ffea00;color:#1b5e20;font-weight:900;font-size:1rem;border:3px solid #2e7d32;box-shadow:0 5px 0 #1b5e20;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;background-clip:padding-box;}',
      '.cmp-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #1b5e20;}',
      '.cmp-bayes-action-wrap{text-align:center;}',
      '.cmp-bayes-practice{margin-top:14px;background:#f5fbf0;border:2px solid #c5e1a5;border-radius:22px;padding:18px 16px;}',
      '.cmp-bayes-progress{text-align:center;font-weight:900;color:#2e7d32;margin-bottom:12px;}',
      '.cmp-bayes-question{font-size:1.15rem;font-weight:900;color:#1b5e20;text-align:center;margin:0 0 14px;}',
      '.cmp-bayes-options{display:grid;gap:10px;}',
      '.cmp-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #aed581;background:#ffffff;color:#1b5e20;font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.cmp-bayes-option:hover{transform:translateY(-1px);background:#fbfff8;}',
      '.cmp-bayes-option.ok{background:#dff5e3;border-color:#4caf50;color:#145a20;}',
      '.cmp-bayes-option.err{background:#ffebee;border-color:#ef5350;color:#8b1e1e;}',
      '.cmp-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:#2e7d32;}',
      '.cmp-bayes-feedback.err{color:#b71c1c;}',
      '.cmp-bayes-ready{margin-top:14px;background:#e8f5e9;border:2px solid #66bb6a;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:#1b5e20;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureBayesPanel() {
    if (!activeLevelContent) return null;
    ensureBayesStyles();

    let panel = document.getElementById('componentesBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'componentesBayesPanel';
    panel.className = 'cmp-bayes-panel';

    const quizButton = document.querySelector('.btn-quiz, .boton-quiz, a[href*="quiz.html"]');
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
    if (!activeLevelContent) return;
    const currentSessionUuid = getCurrentSessionUuid();
    if (!currentSessionUuid) return;
    if (bayesState.sessionUuid && bayesState.sessionUuid !== currentSessionUuid) {
      bayesState = createEmptyBayesState(currentSessionUuid);
      removeFromSessionStorage(bayesStateStorageKey);
      return;
    }
    if (!bayesState.sessionUuid) bayesState.sessionUuid = currentSessionUuid;
  }

  function persistBayesState() {
    if (!activeLevelContent) return;
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
    if (!activeLevelContent) return;
    refreshBayesStateForCurrentSession();
    bayesState = { ...bayesState, ...patch };
    if (!bayesState.sessionUuid) bayesState.sessionUuid = getCurrentSessionUuid();
    persistBayesState();
    renderBayesPanel();
    syncQuizButton();
  }

  function ok(page, count) {
    tracker.addCorrect(pageKey(page), count || 1);
  }

  function err(page, count) {
    tracker.addError(pageKey(page), count || 1);
  }

  function markDone(page) {
    const pageNumber = Number(page);
    if (solvedPages.has(pageNumber)) return;
    solvedPages.add(pageNumber);
    tracker.complete(pageKey(pageNumber));
  }

  function done(page) {
    markDone(page);
    syncQuizButton();
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

  function reconcileCompletionState() {
    completionReconcilers.forEach((reconcile) => {
      try { reconcile(); }
      catch (error) { console.warn('No se pudo sincronizar el progreso:', error); }
    });
  }

  function ensureQuizBlockedStyle() {
    if (document.getElementById('componentesQuizBlockedStyle')) return;

    const style = document.createElement('style');
    style.id = 'componentesQuizBlockedStyle';
    style.textContent = [
      '.btn-quiz.bloqueado,.boton-quiz.bloqueado{',
      'opacity:.68;',
      'filter:grayscale(.22);',
      'cursor:not-allowed;',
      'transform:none!important;',
      'box-shadow:0 5px 0 rgba(27,94,32,.45)!important;',
      '}',
      '.btn-quiz.bloqueado:hover,.boton-quiz.bloqueado:hover{',
      'transform:none!important;',
      'background:#ffea00;',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function syncQuizButton() {
    const total = built.total;
    const current = normalizeActivePage(activePage());
    reconcileCompletionState();
    const allComplete = allPagesComplete();
    const bayesLocked = !!activeLevelContent && allComplete && !isQuizUnlockedByBayes();
    const locked = (completionGateEnabled && !allComplete) || bayesLocked;
    const showButton = current === total;
    if (completionGateEnabled) ensureQuizBlockedStyle();
    document.querySelectorAll('.btn-quiz, .boton-quiz').forEach((button) => {
      button.style.display = showButton ? 'block' : 'none';
      button.classList.toggle('bloqueado', locked);
      button.setAttribute('aria-disabled', String(locked));
      button.title = locked ? lockedQuizMessage() : '';
    });
    tracker.markPageVisibleByNumber(current);
    syncCompletionGates();
    renderBayesPanel();
    if (showButton && allComplete && activeLevelContent && !bayesState.recommendation && !bayesState.loading) {
      window.setTimeout(function () {
        resolveLevelBayesFlow();
      }, 0);
    }
  }

  function isPageComplete(page) {
    const pageNumber = Number(page);
    if (solvedPages.has(pageNumber)) return true;
    const state = tracker.getState(pageKey(pageNumber));
    return !!(state && state.saved);
  }

  function allPagesComplete() {
    for (let page = 1; page <= built.total; page += 1) {
      if (!isPageComplete(page)) return false;
    }
    return true;
  }

  function lockedQuizMessage() {
    if (!activeLevelContent) {
      return 'Completa correctamente todas las actividades antes de ir al quiz.';
    }
    if (bayesState.loading) {
      return 'Espera un momento. Estamos preparando tu siguiente paso.';
    }
    if (bayesState.recommendation === 'repaso' && !bayesState.repasoDone) {
      return 'Antes del quiz, mira las tarjetas de repaso y pulsa "Listo, ya lo recorde".';
    }
    if (bayesState.recommendation === 'apoyo' && !bayesState.apoyoDone) {
      return 'Antes del quiz, completa la practica extra con calma.';
    }
    return 'Completa correctamente todas las actividades antes de ir al quiz.';
  }

  function renderBayesPanel() {
    if (!activeLevelContent) return;
    const panel = ensureBayesPanel();
    const current = normalizeActivePage(activePage());
    const onFinalPage = current === built.total;
    const solved = allPagesComplete();

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
        '<div class="cmp-bayes-loader">',
        '<div class="cmp-bayes-spinner" aria-hidden="true"></div>',
        '<h3 class="cmp-bayes-title">Estamos revisando tu avance</h3>',
        '<p class="cmp-bayes-text">Espera tantito. Ya casi te decimos como seguir.</p>',
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = [
        '<div class="cmp-bayes-mascot-wrap">',
        `<img src="${mascotGeo}" alt="Capibara felicitando" class="cmp-bayes-mascot">`,
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = [
        '<h3 class="cmp-bayes-title">Vas muy bien</h3>',
        '<p class="cmp-bayes-text">Sigue asi. Entendiste bien el tema y ya puedes ir con confianza al quiz.</p>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return [
          '<article class="cmp-bayes-card">',
          `<span class="cmp-bayes-card-icon">${card.icon}</span>`,
          `<div class="cmp-bayes-card-title">${card.title}</div>`,
          `<p class="cmp-bayes-card-text">${card.text}</p>`,
          '</article>'
        ].join('');
      }).join('');

      panel.innerHTML = [
        '<h3 class="cmp-bayes-title">Tarjetas para recordar</h3>',
        '<p class="cmp-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p>',
        `<div class="cmp-bayes-card-grid">${cards}</div>`,
        bayesState.repasoDone
          ? '<div class="cmp-bayes-ready">Listo. Ya puedes ir al quiz.</div>'
          : '<div class="cmp-bayes-action-wrap"><button type="button" class="cmp-bayes-action" id="componentesBayesRepasoBtn">Listo, ya lo recorde</button></div>'
      ].join('');

      const repasoBtn = document.getElementById('componentesBayesRepasoBtn');
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
          '<h3 class="cmp-bayes-title">Practica extra terminada</h3>',
          '<p class="cmp-bayes-text">Terminaste la practica extra. Ahora si ya puedes ir al quiz.</p>',
          '<div class="cmp-bayes-ready">Sigue con confianza y lee cada pregunta con mucha atencion.</div>'
        ].join('');
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = currentQuestion.options.map(function (option) {
        return `<button type="button" class="cmp-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = [
        '<h3 class="cmp-bayes-title">Practica extra antes del quiz</h3>',
        '<p class="cmp-bayes-text">Vamos a recordar las ideas principales con preguntas mas generales y tranquilas.</p>',
        '<div class="cmp-bayes-practice">',
        `<div class="cmp-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div>`,
        `<p class="cmp-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p>`,
        `<div class="cmp-bayes-options">${optionsMarkup}</div>`,
        '<div class="cmp-bayes-feedback" id="componentesBayesApoyoFeedback" aria-live="polite"></div>',
        '</div>'
      ].join('');

      const feedback = document.getElementById('componentesBayesApoyoFeedback');
      panel.querySelectorAll('.cmp-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const value = button.getAttribute('data-value');
          const correct = value === currentQuestion.correct;

          if (correct) {
            button.classList.add('ok');
            feedback.className = 'cmp-bayes-feedback';
            feedback.textContent =
              bayesState.apoyoIndex + 1 >= apoyoQuestions.length
                ? 'Muy bien. Terminaste la practica extra.'
                : 'Muy bien. Vamos con la siguiente.';
            const nextIndex = bayesState.apoyoIndex + 1;
            window.setTimeout(function () {
              if (nextIndex >= apoyoQuestions.length) {
                updateBayesState({ apoyoDone: true, apoyoIndex: apoyoQuestions.length });
              } else {
                updateBayesState({ apoyoIndex: nextIndex });
              }
            }, 650);
            return;
          }

          button.classList.add('err');
          feedback.className = 'cmp-bayes-feedback err';
          feedback.textContent = currentQuestion.hint || 'Vamos otra vez con calma.';
        });
      });
      return;
    }

    panel.style.display = 'none';
    panel.removeAttribute('data-kind');
    panel.innerHTML = '';
  }

  async function resolveLevelBayesFlow() {
    if (!activeLevelContent) return bayesState;
    refreshBayesStateForCurrentSession();

    if (bayesState.recommendation || bayesState.loading) return bayesState;
    if (!allPagesComplete() || normalizeActivePage(activePage()) !== built.total) return bayesState;
    if (bayesRequestPromise) return bayesRequestPromise;

    bayesRequestPromise = (async function () {
      updateBayesState({ loading: true });
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

  function nextButtons() {
    return Array.from(document.querySelectorAll('#btnSig, #btnSiguiente'));
  }

  function ensureGateHint() {
    let hint = document.getElementById('componentesGateHint');
    if (hint) return hint;

    hint = document.createElement('div');
    hint.id = 'componentesGateHint';
    hint.setAttribute('role', 'status');
    hint.style.display = 'none';
    hint.style.margin = '12px auto 0';
    hint.style.maxWidth = '760px';
    hint.style.padding = '12px 18px';
    hint.style.borderRadius = '18px';
    hint.style.background = '#fffde7';
    hint.style.border = '3px solid #ffea00';
    hint.style.color = '#1b5e20';
    hint.style.fontWeight = '800';
    hint.style.textAlign = 'center';
    hint.style.boxShadow = '0 4px 0 rgba(27, 94, 32, 0.18)';

    const nav = document.querySelector('.nav, .nav-bar, .navegador, .navegador-quiz');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(hint, nav.nextSibling);
    } else {
      document.body.appendChild(hint);
    }
    return hint;
  }

  function showGateHint(message) {
    if (!completionGateEnabled) return;
    const hint = ensureGateHint();
    hint.textContent = message || 'Completa correctamente la actividad de esta página para avanzar.';
    hint.style.display = 'block';
    clearTimeout(gateHintTimer);
    gateHintTimer = setTimeout(function () {
      hint.style.display = 'none';
    }, 2600);
  }

  function hideGateHint() {
    const hint = document.getElementById('componentesGateHint');
    if (hint) hint.style.display = 'none';
  }

  function syncCompletionGates() {
    if (!completionGateEnabled) return;

    const current = activePage();
    const currentComplete = isPageComplete(current);
    nextButtons().forEach((button) => {
      const locked = current < built.total && !currentComplete;
      button.disabled = current === built.total || locked;
      button.setAttribute('aria-disabled', String(button.disabled));
      button.classList.toggle('bloqueado', locked);
      button.title = locked ? 'Completa correctamente la actividad de esta página para avanzar.' : '';
    });

    if (currentComplete) hideGateHint();
  }

  function bindQuizCompletionGuard() {
    document.querySelectorAll('.btn-quiz, .boton-quiz').forEach((link) => {
      if (link.dataset.componentesGateBound === 'true') return;
      link.dataset.componentesGateBound = 'true';
      link.addEventListener('click', async function (event) {
        reconcileCompletionState();
        const href = link.getAttribute('href');
        if (!href) return;

        event.preventDefault();

        if (!allPagesComplete()) {
          syncCompletionGates();
          showGateHint('Completa correctamente todas las actividades antes de ir al quiz.');
          return;
        }

        if (activeLevelContent && !bayesState.recommendation && !bayesState.loading) {
          await resolveLevelBayesFlow();
        }

        if (activeLevelContent && !isQuizUnlockedByBayes()) {
          syncQuizButton();
          showGateHint(lockedQuizMessage());
          const panel = document.getElementById('componentesBayesPanel');
          if (panel && panel.style.display !== 'none') {
            panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (activeLevelContent && !bayesState.sessionClosed) {
          const response = await session.complete({ eventoCierre: 'quiz' });
          updateBayesState({ sessionClosed: response?.success === true });
        }

        window.location.href = href;
      }, true);
    });
  }

  function normalizeActivePage(pageNumber) {
    const pages = Array.from(document.querySelectorAll(PAGE_SELECTOR));
    if (!pages.length) return 1;

    let safePage = Number(pageNumber);
    if (!Number.isFinite(safePage) || safePage < 1) safePage = 1;
    if (safePage > pages.length) safePage = pages.length;

    const target = document.getElementById('pagina' + safePage) || pages[0];
    pages.forEach((page) => {
      page.classList.toggle('activa', page === target);
    });

    const normalized = parseInt(String(target.id || '').replace('pagina', ''), 10);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : 1;
  }

  function bindNavigationGuards() {
    let lastNavAt = 0;
    const NAV_LOCK_MS = 220;

    ['cambiarPag', 'cambiar', 'cambiarPagina'].forEach(function (name) {
      wrap(name, function (original, args) {
        const rawDelta = Number(args[0]);
        if (!Number.isFinite(rawDelta) || rawDelta === 0) {
          return original.apply(this, args);
        }

        const now = Date.now();
        if (now - lastNavAt < NAV_LOCK_MS) {
          return false;
        }

        const current = normalizeActivePage(activePage());
        const target = Math.max(1, Math.min(built.total, current + rawDelta));
        if (completionGateEnabled && target > current && !isPageComplete(current)) {
          syncCompletionGates();
          showGateHint('Completa correctamente la actividad de esta página para avanzar.');
          return false;
        }

        if (target === current) {
          syncQuizButton();
          return false;
        }

        lastNavAt = now;
        const result = original.apply(this, args);
        setTimeout(function () {
          normalizeActivePage(target);
          syncQuizButton();
        }, 0);
        return result;
      });
    });
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
    document.querySelectorAll(PAGE_SELECTOR).forEach((page) => {
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
      const goal = RETOS4F[retoIdx] ? RETOS4F[retoIdx].palabra : '';
      const guess = Array.isArray(r4fRespuesta) ? r4fRespuesta.join('') : '';
      const result = original.apply(this, args);
      if (guess) {
        if (guess === goal) {
          ok(2, 1);
          setTimeout(function () {
            if (retoIdx >= RETOS4F.length || isVisible(document.getElementById('fbPag2'))) {
              done(2);
            }
          }, 1100);
        } else {
          err(2, 1);
        }
      }
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

    completionReconcilers.push(function () {
      if (typeof P1Q !== 'undefined' && typeof p1i !== 'undefined' && p1i >= P1Q.length) {
        markDone(1);
      }
      if (
        typeof P2Q !== 'undefined' &&
        typeof p2i !== 'undefined' &&
        (p2i >= P2Q.length || isVisible(document.getElementById('p2Orilla')))
      ) {
        markDone(2);
      }

      const p3DotsNode = document.getElementById('p3Dots');
      const p3Total = typeof P3C !== 'undefined' ? P3C.length : countVisible('.evin-dot', p3DotsNode);
      const p3Seen = p3DotsNode ? p3DotsNode.querySelectorAll('.evin-dot.visto').length : 0;
      if (p3Total > 0 && p3Seen >= p3Total) {
        markDone(3);
      }

      if (
        (typeof P4I !== 'undefined' && typeof p4ok !== 'undefined' && p4ok >= P4I.length) ||
        isVisible(document.getElementById('p4FbOk'))
      ) {
        markDone(4);
      }

      if (
        (typeof CHECKS !== 'undefined' && typeof chkOk !== 'undefined' && chkOk >= CHECKS.length) ||
        isVisible(document.getElementById('fbCheck'))
      ) {
        markDone(5);
      }
    });

    wrap('elegirP1', function (original, args) {
      const correct = args[1] === true;
      const before = p1i;
      const result = original.apply(this, args);
      if (!correct) err(1, 1);
      if (correct) {
        setTimeout(function () {
          if (p1i > before) ok(1, p1i - before);
          if (p1i >= P1Q.length) done(1);
        }, 950);
      }
      return result;
    });

    wrap('saltarA', function (original, args) {
      const correct = args[1] === true;
      const before = p2i;
      const result = original.apply(this, args);
      if (!correct) err(2, 1);
      if (correct) {
        setTimeout(function () {
          if (p2i > before) ok(2, p2i - before);
          if (p2i >= P2Q.length || isVisible(document.getElementById('p2Orilla'))) done(2);
        }, 850);
      }
      return result;
    });

    function checkFlipDone() {
      const dots = document.getElementById('p3Dots');
      const total = typeof P3C !== 'undefined' ? P3C.length : countVisible('.evin-dot', dots);
      const current = dots ? dots.querySelectorAll('.evin-dot.visto').length : 0;
      if (current > seenFlip) {
        ok(3, current - seenFlip);
        seenFlip = current;
      }
      if (total > 0 && current >= total) done(3);
    }

    const flipObserver = new MutationObserver(checkFlipDone);

    const p3Dots = document.getElementById('p3Dots');
    if (p3Dots) {
      flipObserver.observe(p3Dots, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] });
    }
    const p3Grid = document.getElementById('p3Grid');
    if (p3Grid) {
      p3Grid.addEventListener('click', function () {
        setTimeout(checkFlipDone, 0);
      }, true);
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
          if (typeof CHECKS !== 'undefined' && chkOk >= CHECKS.length) {
            done(5);
          } else {
            syncQuizButton();
          }
        }, 0);
      }, true);
    }
    observeSuccess('fbCheck', 5, 0);
  }

  function setupEasyAuditivo() {
    done(2);
    done(4);
    done(5);

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
    let ahSolvedWords = 0;
    const pageRequirements = {
      1: ['sopa:sopa1', 'adiv:adiv_opc1'],
      2: ['texto:retro_tr', 'cruc:cruc2'],
      3: ['ruleta', 'adiv:adiv_opc3'],
      4: ['ahorcado', 'cruc:cruc4'],
      5: ['adiv:adiv_opc5', 'texto:retro_tr_rl']
    };
    const completedSteps = {};

    function getSteps(page) {
      if (!completedSteps[page]) completedSteps[page] = new Set();
      return completedSteps[page];
    }

    function completeStep(page, key, refresh) {
      const pageNumber = Number(page);
      const required = pageRequirements[pageNumber];
      if (!completionGateEnabled || !required) {
        done(pageNumber);
        return;
      }

      getSteps(pageNumber).add(key);
      if (required.every((step) => getSteps(pageNumber).has(step))) {
        markDone(pageNumber);
      }
      if (refresh) syncQuizButton();
    }

    function resetAdivGroup(groupId, retroId) {
      const retro = document.getElementById(retroId);
      document.querySelectorAll('#' + groupId + ' .adiv-opc').forEach((button) => {
        button.disabled = false;
        button.classList.remove('correcta-a', 'incorrecta-a');
      });
      if (retro) {
        retro.className = 'retro';
        retro.style.display = 'none';
        retro.innerHTML = '';
      }
    }

    function feedbackOk(id) {
      const el = document.getElementById(id);
      return !!(el && el.classList.contains('ok'));
    }

    completionReconcilers.push(function () {
      if (
        typeof sopaData1 !== 'undefined' &&
        typeof sopaState1 !== 'undefined' &&
        sopaData1 &&
        sopaState1 &&
        sopaState1.encontradas &&
        sopaState1.encontradas.size === sopaData1.palabras.length
      ) {
        completeStep(1, 'sopa:sopa1', false);
      }
      if (feedbackOk('retro_adiv1')) completeStep(1, 'adiv:adiv_opc1', false);
      if (feedbackOk('retro_tr')) completeStep(2, 'texto:retro_tr', false);
      if (feedbackOk('retro_cruc2')) completeStep(2, 'cruc:cruc2', false);
      if (feedbackOk('retro_rul')) completeStep(3, 'ruleta', false);
      if (feedbackOk('retro_adiv3')) completeStep(3, 'adiv:adiv_opc3', false);
      if (typeof ahPalabras !== 'undefined' && ahSolvedWords >= ahPalabras.length) completeStep(4, 'ahorcado', false);
      if (feedbackOk('retro_cruc4')) completeStep(4, 'cruc:cruc4', false);
      if (feedbackOk('retro_adiv5')) completeStep(5, 'adiv:adiv_opc5', false);
      if (feedbackOk('retro_tr_rl')) completeStep(5, 'texto:retro_tr_rl', false);
    });

    wrap('celdaSopa', function (original, args) {
      const before = sopaState1 && sopaState1.encontradas ? sopaState1.encontradas.size : 0;
      const result = original.apply(this, args);
      const after = sopaState1 && sopaState1.encontradas ? sopaState1.encontradas.size : 0;
      if (after > before) ok(1, after - before);
      if (sopaData1 && after === sopaData1.palabras.length) completeStep(1, 'sopa:sopa1', true);
      return result;
    });

    wrap('evaluarTrayectoriaSopa', function (original, args) {
      const data = args[0];
      const state = args[1];
      const before = state && state.encontradas ? state.encontradas.size : 0;
      const result = original.apply(this, args);
      const after = state && state.encontradas ? state.encontradas.size : 0;
      if (after > before) ok(1, after - before);
      if (data && data.palabras && after === data.palabras.length) completeStep(1, 'sopa:sopa1', true);
      return result;
    });

    wrap('respAdiv', function (original, args) {
      const button = args[0];
      const groupId = args[1];
      const correctId = args[2];
      const retroId = args[3];
      const page = pageFromNode(button, activePage());
      const result = original.apply(this, args);
      if (!button) return result;
      if (button.dataset.id === correctId) {
        ok(page, 1);
        completeStep(page, 'adiv:' + groupId, true);
      } else {
        err(page, 1);
        if (completionGateEnabled) {
          setTimeout(function () {
            resetAdivGroup(groupId, retroId);
          }, 1200);
        }
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
        completeStep(page, 'texto:' + feedbackId, true);
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
        completeStep(page, 'texto:' + feedbackId, true);
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
        completeStep(page, 'cruc:' + containerId, true);
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
        completeStep(page, 'ruleta', true);
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
      const lostLife = ahVidas < beforeLives;
      if (lostLife) err(page, beforeLives - ahVidas);
      if (completionGateEnabled && lostLife && ahVidas === 0 && ahIdx > beforeIndex) {
        ahIdx = beforeIndex;
        const retryButton = document.getElementById('btn_sig_pal');
        if (retryButton) {
          retryButton.innerText = 'Intentar de nuevo';
          retryButton.onclick = function () {
            document.getElementById('retro_ah').style.display = 'none';
            cargarPalabraAh();
          };
        }
      }
      if (ahIdx > beforeIndex) {
        if (!lostLife) {
          ahSolvedWords += ahIdx - beforeIndex;
          ok(page, ahIdx - beforeIndex);
        } else if (!completionGateEnabled) {
          ok(page, ahIdx - beforeIndex);
        }
      }
      if (completionGateEnabled) {
        if (ahSolvedWords >= ahPalabras.length) completeStep(page, 'ahorcado', true);
      } else if (ahIdx >= ahPalabras.length) {
        done(page);
      }
      return result;
    });
  }

  function setupWaterVisualNoVerbal() {
    const pageRequirements = {
      1: ['tarj:c1', 'tarj:c2'],
      2: ['ord:r1', 'match:r2'],
      3: ['tarj:oh1', 'match:oh2'],
      4: ['pie:retro_pie', 'tarj:rh2'],
      5: ['tarj:rl1', 'match:rl2']
    };
    const completedSteps = {};

    function getSteps(page) {
      if (!completedSteps[page]) completedSteps[page] = new Set();
      return completedSteps[page];
    }

    function completeStep(page, key, refresh) {
      const pageNumber = Number(page);
      const required = pageRequirements[pageNumber];
      if (!required || !key) return;

      getSteps(pageNumber).add(key);
      if (required.every((step) => getSteps(pageNumber).has(step))) {
        markDone(pageNumber);
      }
      if (refresh) syncQuizButton();
    }

    function feedbackOk(id) {
      const el = document.getElementById(id);
      return !!(el && el.classList.contains('ok'));
    }

    function matchComplete(group) {
      const leftItems = Array.from(document.querySelectorAll('#mc_izq_' + group + ' .match-item'));
      return leftItems.length > 0 && leftItems.every((item) => item.classList.contains('matched'));
    }

    function resetTarjetas(group) {
      document.querySelectorAll('#tg_' + group + ' .tarj').forEach((item) => {
        item.classList.remove('disabled', 'correcta-t', 'incorrecta-t');
        item.style.pointerEvents = '';
      });
    }

    function resetPie() {
      document.querySelectorAll('svg.pie path').forEach((path) => {
        path.style.pointerEvents = '';
        path.style.opacity = '';
        path.style.filter = '';
      });
    }

    completionReconcilers.push(function () {
      if (feedbackOk('retro_c1')) completeStep(1, 'tarj:c1', false);
      if (feedbackOk('retro_c2')) completeStep(1, 'tarj:c2', false);
      if (feedbackOk('retro_r1')) completeStep(2, 'ord:r1', false);
      if (matchComplete('r2')) completeStep(2, 'match:r2', false);
      if (feedbackOk('retro_oh1')) completeStep(3, 'tarj:oh1', false);
      if (matchComplete('oh2')) completeStep(3, 'match:oh2', false);
      if (feedbackOk('retro_pie')) completeStep(4, 'pie:retro_pie', false);
      if (feedbackOk('retro_rh2')) completeStep(4, 'tarj:rh2', false);
      if (feedbackOk('retro_rl1')) completeStep(5, 'tarj:rl1', false);
      if (matchComplete('rl2')) completeStep(5, 'match:rl2', false);
    });

    wrap('respTarj', function (original, args) {
      const element = args[0];
      const group = args[1];
      const correctId = args[2];
      const page = pageFromNode(element, activePage());
      const result = original.apply(this, args);
      if (element && element.dataset.id === correctId) {
        ok(page, 1);
        completeStep(page, 'tarj:' + group, true);
      } else {
        err(page, 1);
        setTimeout(function () {
          resetTarjetas(group);
        }, 1200);
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
        completeStep(page, 'pie:' + args[2], true);
      } else {
        err(page, 1);
        setTimeout(resetPie, 1400);
      }
      return result;
    });

    wrap('verificarOrdV', function (original, args) {
      const group = args[0];
      const feedback = document.getElementById(args[2]);
      const page = pageFromNode(feedback, activePage());
      const result = original.apply(this, args);
      if (!feedback) return result;
      if (feedback.classList.contains('ok')) {
        ok(page, 1);
        completeStep(page, 'ord:' + group, true);
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
      if (total > 0 && leftAfter === total) completeStep(page, 'match:' + group, true);
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

    function checkMemDone() {
      if (
        typeof memTablero !== 'undefined' &&
        typeof MEM_TABLEROS !== 'undefined' &&
        memTablero >= MEM_TABLEROS.length - 1 &&
        isVisible(document.getElementById('memFbOk'))
      ) {
        done(2);
      }
    }

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

    wrap('memBuild', function (original, args) {
      const result = original.apply(this, args);
      memPairs = 0;
      memHadTwo = false;
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
    const memFeedback = document.getElementById('memFbOk');
    if (memFeedback) {
      const observer = new MutationObserver(checkMemDone);
      observer.observe(memFeedback, { attributes: true, attributeFilter: ['class', 'style'] });
      checkMemDone();
    }

    wrap('labMover', function (original, args) {
      const beforeReached = labTotalLL;
      const current = labPosP[labActive] ? { c: labPosP[labActive].c, r: labPosP[labActive].r } : null;
      const result = original.apply(this, args);
      if (labTotalLL > beforeReached) ok(3, labTotalLL - beforeReached);
      else if (current && labPosP[labActive] && current.c === labPosP[labActive].c && current.r === labPosP[labActive].r) err(3, 1);
      if (
        labTotalLL === LAB_DATA[labActual].personas.length &&
        labActual >= LAB_DATA.length - 1 &&
        isVisible(document.getElementById('labFbOk'))
      ) {
        done(3);
      }
      return result;
    });

    wrap('ranaResponder', function (original, args) {
      const idx = args[0];
      const question = args[2];
      const before = ranaPos;
      const result = original.apply(this, args);
      if (idx === question.correcta && ranaPos > before) ok(4, ranaPos - before);
      else if (idx !== question.correcta) err(4, 1);
      return result;
    });

    wrap('ranaFinalMostrar', function (original, args) {
      const result = original.apply(this, args);
      const correct = Array.isArray(ranaResps) ? ranaResps.filter(Boolean).length : 0;
      if (typeof RANA_PREGS !== 'undefined' && correct === RANA_PREGS.length) {
        done(4);
      }
      return result;
    });
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
    const simonResult = document.getElementById('simonResultado');
    if (simonResult) {
      const checkSimonDone = function () {
        if (!isVisible(simonResult)) return;
        if (typeof simonPreguntas !== 'undefined' && simonCorrectas === simonPreguntas.length) {
          done(1);
        }
      };
      const observer = new MutationObserver(checkSimonDone);
      observer.observe(simonResult, { attributes: true, attributeFilter: ['class', 'style'] });
      checkSimonDone();
    }

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

  function setupRegionsVisualVerbal() {
    setupRegionsKinestesico();
  }

  ready(function () {
    session.start();
    bayesState = readBayesState() || createEmptyBayesState(getCurrentSessionUuid());
    bindQuizCompletionGuard();
    bindNavigationGuards();
    bindUiRefresh();
    setup();
    normalizeActivePage(activePage());
    syncQuizButton();
    syncCompletionGates();
  });
})();
