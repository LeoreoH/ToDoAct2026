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
        p1_distribucion: { pagina: 1, apartadoClave: 'pagina1_distribucion', tipoActividad: 'seleccion' },
        p2_conceptos: { pagina: 2, apartadoClave: 'pagina2_conceptos', tipoActividad: 'seleccion' },
        p3_retos: { pagina: 3, apartadoClave: 'pagina3_retos_urbanos', tipoActividad: 'clasificar' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_integrador', tipoActividad: 'integrador' }
      },
      setup: setupEasyVisualVerbal
    },
    'facil/visual_no_verbal': {
      apartados: {
        p1_distribucion: { pagina: 1, apartadoClave: 'pagina1_distribucion_visual', tipoActividad: 'seleccion' },
        p2_conceptos: { pagina: 2, apartadoClave: 'pagina2_conceptos_visual', tipoActividad: 'seleccion' },
        p3_retos: { pagina: 3, apartadoClave: 'pagina3_retos_visual', tipoActividad: 'seleccion' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_integrador_visual', tipoActividad: 'integrador' }
      },
      setup: setupEasyVisualNoVerbalRebuilt
    },
    'facil/auditivo': {
      apartados: {
        p1_audio: { pagina: 1, apartadoClave: 'pagina1_audio_imagenes', tipoActividad: 'audio_imagen' },
        p2_escucha: { pagina: 2, apartadoClave: 'pagina2_concentracion_dispersion', tipoActividad: 'audio_clasificacion' },
        p3_soluciones: { pagina: 3, apartadoClave: 'pagina3_retos_soluciones_audio', tipoActividad: 'audio_solucion' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_repaso_audio', tipoActividad: 'repaso_audio' }
      },
      setup: setupEasyAuditivoRebuilt
    },
    'facil/kinestesico': {
      apartados: {
        p1_drag: { pagina: 1, apartadoClave: 'pagina1_factores_poblacion', tipoActividad: 'arrastrar' },
        p2_mapa: { pagina: 2, apartadoClave: 'pagina2_maquetas_poblacion', tipoActividad: 'maqueta' },
        p3_orden: { pagina: 3, apartadoClave: 'pagina3_reparar_ciudad', tipoActividad: 'arrastrar' },
        p4_repaso: { pagina: 4, apartadoClave: 'pagina4_tablero_final', tipoActividad: 'repaso' }
      },
      setup: setupEasyKinestesico
    },
    'dificil/visual_verbal': {
      apartados: {
        p1_migracion: { pagina: 1, apartadoClave: 'pagina1_migracion_casos', tipoActividad: 'casos' },
        p2_retos: { pagina: 2, apartadoClave: 'pagina2_retos_soluciones', tipoActividad: 'casos' },
        p3_analisis: { pagina: 3, apartadoClave: 'pagina3_analisis_pistas', tipoActividad: 'casos' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_integrador_dificil', tipoActividad: 'integrador' }
      },
      setup: setupDifficultVisualVerbalRebuilt
    },
    'dificil/kinestesico': {
      apartados: {
        p1_caso: { pagina: 1, apartadoClave: 'pagina1_caso_migracion', tipoActividad: 'clasificar_arrastrar' },
        p2_ciudad: { pagina: 2, apartadoClave: 'pagina2_reparar_ciudad', tipoActividad: 'relacionar_arrastrar' },
        p3_laboratorio: { pagina: 3, apartadoClave: 'pagina3_laboratorio_datos', tipoActividad: 'clasificar_arrastrar' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_tablero_integrador', tipoActividad: 'integrador_arrastrar' }
      },
      setup: setupDifficultKinestesicoRebuilt
    },
    'dificil/visual_no_verbal': {
      apartados: {
        p1_signals: { pagina: 1, apartadoClave: 'pagina1_senales_migracion_visual', tipoActividad: 'seleccion' },
        p2_pairs: { pagina: 2, apartadoClave: 'pagina2_retos_relaciones_visual', tipoActividad: 'relacionar' },
        p3_panel: { pagina: 3, apartadoClave: 'pagina3_panel_analisis_visual', tipoActividad: 'panel' },
        p4_missions: { pagina: 4, apartadoClave: 'pagina4_misiones_finales_visual', tipoActividad: 'integrador' }
      },
      setup: setupDifficultVisualNoVerbalRebuilt
    },
    'dificil/auditivo': {
      apartados: {
        p1_migracion: { pagina: 1, apartadoClave: 'pagina1_migracion_casos_audio', tipoActividad: 'audio_caso' },
        p2_decisiones: { pagina: 2, apartadoClave: 'pagina2_decisiones_urbanas_audio', tipoActividad: 'audio_decision' },
        p3_datos: { pagina: 3, apartadoClave: 'pagina3_evidencias_poblacion_audio', tipoActividad: 'audio_datos' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_conclusiones_audio', tipoActividad: 'repaso_audio' }
      },
      setup: setupDifficultAuditivoRebuilt
    },
    'normal/visual_verbal': {
      apartados: {
        p1_crucigrama: { pagina: 1, apartadoClave: 'pagina1_crucigrama_urbano_rural', tipoActividad: 'crucigrama' },
        p2_migracion: { pagina: 2, apartadoClave: 'pagina2_casos_migracion', tipoActividad: 'casos' },
        p3_sopa: { pagina: 3, apartadoClave: 'pagina3_sopa_servicios', tipoActividad: 'sopa' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_integrador_normal', tipoActividad: 'integrador' }
      },
      setup: setupNormalVisualVerbalRebuilt
    },
    'normal/visual_no_verbal': {
      apartados: {
        p1_urban: { pagina: 1, apartadoClave: 'pagina1_urbano_rural_visual', tipoActividad: 'seleccion' },
        p2_migration: { pagina: 2, apartadoClave: 'pagina2_migracion_visual', tipoActividad: 'seleccion' },
        p3_services: { pagina: 3, apartadoClave: 'pagina3_servicios_visual', tipoActividad: 'seleccion' },
        p4_integrator: { pagina: 4, apartadoClave: 'pagina4_integrador_visual_normal', tipoActividad: 'integrador' }
      },
      setup: setupNormalVisualNoVerbalRebuilt
    },
    'normal/auditivo': {
      apartados: {
        p1_espacios: { pagina: 1, apartadoClave: 'pagina1_espacios_audio', tipoActividad: 'audio_clasificacion' },
        p2_migracion: { pagina: 2, apartadoClave: 'pagina2_ruta_migracion_audio', tipoActividad: 'audio_ruta' },
        p3_servicios: { pagina: 3, apartadoClave: 'pagina3_servicios_audio', tipoActividad: 'audio_solucion' },
        p4_integrador: { pagina: 4, apartadoClave: 'pagina4_integrador_audio', tipoActividad: 'repaso_audio' }
      },
      setup: setupNormalAuditivoRebuilt
    },
    'normal/kinestesico': {
      apartados: {
        p1_spaces: { pagina: 1, apartadoClave: 'pagina1_mapa_urbano_rural', tipoActividad: 'arrastrar' },
        p2_route: { pagina: 2, apartadoClave: 'pagina2_ruta_migracion', tipoActividad: 'ordenar_arrastrar' },
        p3_services: { pagina: 3, apartadoClave: 'pagina3_reparar_ciudad', tipoActividad: 'relacionar_arrastrar' },
        p4_mission: { pagina: 4, apartadoClave: 'pagina4_tablero_final', tipoActividad: 'integrador_arrastrar' }
      },
      setup: setupNormalKinestesicoRebuilt
    }
  };

  const config = CONFIGS[fileKey];
  if (!config) return;
  const contenidoId = 3;
  const sessionStorageKey = `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  const bayesStateStorageKey = `poblacion_bayes_${contenidoId}_${nivel}_${estilo}`;
  const mascotGeo = '/recursos/mascotas/mascota-geo-felicitacion.png';
  const levelContentMap = {
    facil: {
      repasoCards: [
        {
          icon: '🌍',
          title: 'Distribución de la población',
          text: 'La población no está repartida igual en todos los lugares. Hay países y regiones con muchísimos habitantes y otros con muy pocos.'
        },
        {
          icon: '🏙️',
          title: 'Concentración',
          text: 'La concentración ocurre cuando muchas personas viven juntas en un mismo espacio, como en grandes ciudades o zonas urbanas.'
        },
        {
          icon: '🌾',
          title: 'Dispersión',
          text: 'La dispersión sucede cuando pocas personas viven separadas entre sí, generalmente en zonas rurales o alejadas.'
        },
        {
          icon: '🚗',
          title: 'Problemas de la concentración',
          text: 'Cuando demasiadas personas viven en el mismo lugar pueden aparecer tráfico, contaminación, basura y falta de vivienda o servicios.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🌍',
          prompt: '¿Qué significa que la población se distribuye de manera desigual?',
          options: [
            'Que no vive la misma cantidad de personas en todos los lugares.',
            'Que todos los países tienen la misma población.',
            'Que nadie vive en las ciudades.'
          ],
          correct: 'Que no vive la misma cantidad de personas en todos los lugares.',
          hint: 'Piensa en países muy poblados y otros con menos habitantes.'
        },
        {
          icon: '🏙️',
          prompt: '¿Qué describe mejor a una zona con mucha concentración de población?',
          options: [
            'Muchas personas viviendo cerca unas de otras.',
            'Casas muy separadas en el campo.',
            'Un lugar sin habitantes.'
          ],
          correct: 'Muchas personas viviendo cerca unas de otras.',
          hint: 'Imagina una gran ciudad llena de gente.'
        },
        {
          icon: '🌾',
          prompt: '¿Qué pasa en una zona con población dispersa?',
          options: [
            'Las personas viven más separadas entre sí.',
            'Toda la gente vive en edificios altos.',
            'Hay más tráfico que en todas las ciudades.'
          ],
          correct: 'Las personas viven más separadas entre sí.',
          hint: 'Piensa en lugares rurales o alejados.'
        },
        {
          icon: '🚗',
          prompt: '¿Cuál puede ser un problema de la concentración de población?',
          options: [
            'Tráfico y contaminación.',
            'Más espacio vacío en todos lados.',
            'Que desaparezcan todos los caminos.'
          ],
          correct: 'Tráfico y contaminación.',
          hint: 'Recuerda lo que ocurre cuando vive demasiada gente en un mismo lugar.'
        }
      ]
    },
    normal: {
      repasoCards: [
        {
          icon: '🏙️',
          title: 'Ciudad y campo',
          text: 'Las ciudades suelen reunir más población y servicios. El campo suele tener menos viviendas juntas y más espacio abierto.'
        },
        {
          icon: '🧳',
          title: 'Migración interna',
          text: 'Sucede cuando una persona o familia cambia de lugar para vivir dentro del mismo país.'
        },
        {
          icon: '🌾➡️🏙️',
          title: 'Éxodo rural',
          text: 'Ocurre cuando muchas personas salen del campo y se trasladan a la ciudad para buscar mejores oportunidades.'
        },
        {
          icon: '🚰',
          title: 'Servicios que deben crecer',
          text: 'Si una ciudad recibe más población, también necesita más agua, escuelas, vivienda, salud y transporte.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🏙️',
          prompt: '¿Qué es más común en un espacio urbano?',
          options: [
            'Muchos edificios y servicios cercanos.',
            'Casas muy separadas en zonas agrícolas.',
            'Muy poca población y caminos aislados.'
          ],
          correct: 'Muchos edificios y servicios cercanos.',
          hint: 'Piensa en una ciudad con transporte, hospitales y escuelas.'
        },
        {
          icon: '🧳',
          prompt: '¿Qué significa migración interna?',
          options: [
            'Mudarse dentro del mismo país.',
            'Viajar por vacaciones unos días.',
            'Vivir siempre en el mismo lugar.'
          ],
          correct: 'Mudarse dentro del mismo país.',
          hint: 'No se sale del país, solo se cambia de estado o ciudad.'
        },
        {
          icon: '🌾➡️🏙️',
          prompt: '¿Qué describe mejor al éxodo rural?',
          options: [
            'Salir del campo para vivir en la ciudad.',
            'Vivir en una zona polar.',
            'Comparar habitantes por kilómetro cuadrado.'
          ],
          correct: 'Salir del campo para vivir en la ciudad.',
          hint: 'Recuerda el movimiento del campo hacia zonas urbanas.'
        },
        {
          icon: '🚰',
          prompt: 'Si una ciudad crece mucho, ¿qué debe crecer también?',
          options: [
            'Los servicios como agua, escuela y transporte.',
            'Solo el número de semáforos.',
            'Únicamente las tiendas de ropa.'
          ],
          correct: 'Los servicios como agua, escuela y transporte.',
          hint: 'La población necesita servicios para vivir mejor.'
        }
      ]
    },
    dificil: {
      repasoCards: [
        {
          icon: '🧳',
          title: 'Migración',
          text: 'Migrar es cambiar de lugar para vivir. Las personas pueden salir por factores de expulsión y llegar por factores de atracción.'
        },
        {
          icon: '🏙️',
          title: 'Retos urbanos',
          text: 'Cuando una ciudad crece muy rápido, pueden aparecer tráfico, contaminación, falta de vivienda y presión sobre los servicios.'
        },
        {
          icon: '🛠️',
          title: 'Mejoras urbanas',
          text: 'Las ciudades pueden mejorar con transporte, planeación, áreas verdes, servicios básicos y acciones que cuiden la calidad de vida.'
        },
        {
          icon: '📊',
          title: 'Análisis de población',
          text: 'Analizar población es interpretar datos, mapas y gráficas para entender concentración, dispersión, densidad y crecimiento.'
        },
        {
          icon: '🌎',
          title: 'Leer con varias pistas',
          text: 'Para comprender un problema de población no basta un solo dato. Conviene comparar lugares, cantidades, mapas y situaciones.'
        }
      ],
      apoyoQuestions: [
        {
          icon: '🧳',
          prompt: '¿Qué idea describe mejor a la migración?',
          options: [
            'Cambiar de lugar para vivir.',
            'Solo salir de paseo por un día.',
            'Vivir siempre en el mismo sitio.'
          ],
          correct: 'Cambiar de lugar para vivir.',
          hint: 'Piensa en moverse de un lugar a otro de manera permanente o larga.'
        },
        {
          icon: '🏙️',
          prompt: '¿Qué puede pasar cuando una ciudad crece demasiado rápido?',
          options: [
            'Pueden aparecer problemas como tráfico o contaminación.',
            'Desaparecen todas las personas.',
            'Ya no hace falta ningún servicio.'
          ],
          correct: 'Pueden aparecer problemas como tráfico o contaminación.',
          hint: 'Recuerda los retos urbanos.'
        },
        {
          icon: '🛠️',
          prompt: '¿Cuál es un ejemplo de mejora urbana?',
          options: [
            'Mejor transporte y más servicios básicos.',
            'Más basura en las calles.',
            'Menos agua para la población.'
          ],
          correct: 'Mejor transporte y más servicios básicos.',
          hint: 'Una mejora ayuda a vivir mejor en la ciudad.'
        },
        {
          icon: '📊',
          prompt: '¿Qué significa analizar la población?',
          options: [
            'Interpretar datos y compararlos.',
            'Mirar un número sin pensar en nada más.',
            'Aprender solo nombres de países.'
          ],
          correct: 'Interpretar datos y compararlos.',
          hint: 'Analizar es leer información con sentido.'
        }
      ]
    }
  };
  const activeLevelContent = levelContentMap[nivel] || null;
  const repasoCards = activeLevelContent ? activeLevelContent.repasoCards : [];
  const apoyoQuestions = activeLevelContent ? activeLevelContent.apoyoQuestions : [];

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
    return Array.from(document.querySelectorAll('.pagina[id^="pagina"], .pagina[id^="page-"], .page'));
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
    trackTime: true,
    contenidoId: contenidoId,
    nivel,
    estilo,
    detalleBase: { bloque: 'poblacion_mundial' },
    apartados: config.apartados
  });

  const session = window.createReforzamientoSessionTracker({
    contenidoId: contenidoId,
    nivel,
    estilo,
    detalleBase: { bloque: 'poblacion_mundial' }
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
    if (document.getElementById('poblacionBayesStyles')) return;

    const style = document.createElement('style');
    style.id = 'poblacionBayesStyles';
    style.textContent = [
      '.pob-bayes-panel{display:none;max-width:960px;margin:18px auto 0;padding:22px 22px 24px;border-radius:26px;background:#ffffff;border:3px solid var(--guindo,#7c3048);box-shadow:0 8px 0 rgba(124,48,72,.22);color:var(--guindo,#7c3048);}',
      '.pob-bayes-panel[data-kind="avance"]{padding:16px;background:transparent;border:none;box-shadow:none;}',
      '.pob-bayes-title{font-size:1.7rem;color:var(--guindo,#7c3048);margin:0 0 8px;text-align:center;font-weight:900;}',
      '.pob-bayes-text{font-size:1.05rem;line-height:1.55;margin:0;text-align:center;font-weight:700;color:var(--guindo,#7c3048);}',
      '.pob-bayes-loader{display:flex;flex-direction:column;align-items:center;gap:10px;}',
      '.pob-bayes-spinner{width:40px;height:40px;border-radius:50%;border:4px solid #f3d7de;border-top-color:var(--guindo,#7c3048);animation:pobBayesSpin .9s linear infinite;}',
      '@keyframes pobBayesSpin{to{transform:rotate(360deg);}}',
      '.pob-bayes-mascot-wrap{background:#fff7f9;border:3px solid #ead2d7;border-radius:28px;padding:16px;box-shadow:0 6px 0 rgba(124,48,72,.12);}',
      '.pob-bayes-mascot{display:block;width:min(100%,420px);margin:0 auto;border-radius:24px;box-shadow:0 10px 24px rgba(124,48,72,.12);}',
      '.pob-bayes-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:18px;}',
      '.pob-bayes-card{background:#fff8fa;border:2px solid #ead2d7;border-radius:20px;padding:16px;text-align:left;}',
      '.pob-bayes-card-icon{font-size:1.5rem;display:block;margin-bottom:8px;}',
      '.pob-bayes-card-title{font-weight:900;color:var(--guindo,#7c3048);font-size:1rem;margin-bottom:6px;}',
      '.pob-bayes-card-text{font-size:.96rem;line-height:1.45;color:#5a3643;margin:0;}',
      '.pob-bayes-action{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;padding:13px 28px;border:none;border-radius:999px;background:#ffea00;color:var(--guindo,#7c3048);font-weight:900;font-size:1rem;border:3px solid var(--guindo,#7c3048);box-shadow:0 5px 0 rgba(124,48,72,.35);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;background-clip:padding-box;}',
      '.pob-bayes-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 rgba(124,48,72,.35);}',
      '.pob-bayes-action-wrap{text-align:center;}',
      '.pob-bayes-practice{margin-top:14px;background:#fff8fa;border:2px solid #ead2d7;border-radius:22px;padding:18px 16px;}',
      '.pob-bayes-progress{text-align:center;font-weight:900;color:var(--guindo,#7c3048);margin-bottom:12px;}',
      '.pob-bayes-question{font-size:1.15rem;font-weight:900;color:var(--guindo,#7c3048);text-align:center;margin:0 0 14px;}',
      '.pob-bayes-options{display:grid;gap:10px;}',
      '.pob-bayes-option{width:100%;padding:13px 16px;border-radius:18px;border:2px solid #dfb8c3;background:#ffffff;color:var(--guindo,#7c3048);font-weight:800;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;}',
      '.pob-bayes-option:hover{transform:translateY(-1px);background:#fffdf4;}',
      '.pob-bayes-option.ok{background:#dff5e3;border-color:#4caf50;color:#145a20;}',
      '.pob-bayes-option.err{background:#ffebee;border-color:#ef5350;color:#8b1e1e;}',
      '.pob-bayes-feedback{min-height:26px;margin-top:12px;font-weight:800;text-align:center;color:var(--guindo,#7c3048);}',
      '.pob-bayes-feedback.err{color:#b71c1c;}',
      '.pob-bayes-ready{margin-top:14px;background:#fff8fa;border:2px solid #e0a9b8;border-radius:20px;padding:16px;text-align:center;font-weight:800;color:var(--guindo,#7c3048);}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureBayesPanel() {
    if (!activeLevelContent) return null;
    ensureBayesStyles();

    let panel = document.getElementById('poblacionBayesPanel');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'poblacionBayesPanel';
    panel.className = 'pob-bayes-panel';

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

  function resolveApartadoKey(pageNumber, subKey) {
    const keys = getKeysForPage(pageNumber);
    if (!keys.length) return null;
    const normalized = String(subKey || '').toLowerCase();
    if (!normalized) return keys.length === 1 ? keys[0] : null;

    return keys.find(function (key) {
      const apartado = config.apartados[key] || {};
      return key === normalized
        || key.endsWith('_' + normalized)
        || String(apartado.apartadoClave || '').toLowerCase().includes(normalized)
        || String(apartado.tipoActividad || '').toLowerCase() === normalized;
    }) || null;
  }

  function allPagesComplete() {
    return Object.keys(config.apartados).every(function (key) {
      const state = tracker.getState(key);
      return !!(state && state.saved);
    });
  }

  function lockedQuizMessage() {
    if (!activeLevelContent) {
      return 'Completa correctamente las actividades antes de ir al quiz.';
    }
    if (bayesState.loading) {
      return 'Espera un momento. Estamos revisando cómo continuar.';
    }
    if (bayesState.recommendation === 'repaso' && !bayesState.repasoDone) {
      return 'Antes del quiz, mira las tarjetas de repaso y pulsa "Listo, ya lo recordé".';
    }
    if (bayesState.recommendation === 'apoyo' && !bayesState.apoyoDone) {
      return 'Antes del quiz, completa la práctica extra con calma.';
    }
    return 'Completa correctamente las actividades antes de ir al quiz.';
  }

  function renderBayesPanel() {
    if (!activeLevelContent) return;
    const panel = ensureBayesPanel();
    const current = activePageNumber();
    const onFinalPage = current === totalPages();
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
        '<div class="pob-bayes-loader">',
        '<div class="pob-bayes-spinner" aria-hidden="true"></div>',
        '<h3 class="pob-bayes-title">Estamos revisando tu avance</h3>',
        '<p class="pob-bayes-text">Espera tantito. Ya casi te decimos cómo seguir.</p>',
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'avance') {
      panel.dataset.kind = 'avance';
      panel.innerHTML = [
        '<div class="pob-bayes-mascot-wrap">',
        `<img src="${mascotGeo}" alt="Capibara felicitando" class="pob-bayes-mascot">`,
        '</div>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'mantener') {
      panel.dataset.kind = 'mantener';
      panel.innerHTML = [
        '<h3 class="pob-bayes-title">Vas muy bien</h3>',
        '<p class="pob-bayes-text">Sigue así. Entendiste bien el tema y ya puedes ir con confianza al quiz.</p>'
      ].join('');
      return;
    }

    if (bayesState.recommendation === 'repaso') {
      panel.dataset.kind = 'repaso';
      const cards = repasoCards.map(function (card) {
        return [
          '<article class="pob-bayes-card">',
          `<span class="pob-bayes-card-icon">${card.icon}</span>`,
          `<div class="pob-bayes-card-title">${card.title}</div>`,
          `<p class="pob-bayes-card-text">${card.text}</p>`,
          '</article>'
        ].join('');
      }).join('');

      panel.innerHTML = [
        '<h3 class="pob-bayes-title">Tarjetas para recordar</h3>',
        '<p class="pob-bayes-text">Antes del quiz, mira estas ideas clave con calma.</p>',
        `<div class="pob-bayes-card-grid">${cards}</div>`,
        bayesState.repasoDone
          ? '<div class="pob-bayes-ready">Listo. Ya puedes ir al quiz.</div>'
          : '<div class="pob-bayes-action-wrap"><button type="button" class="pob-bayes-action" id="poblacionBayesRepasoBtn">Listo, ya lo recordé</button></div>'
      ].join('');

      const repasoBtn = document.getElementById('poblacionBayesRepasoBtn');
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
          '<h3 class="pob-bayes-title">Práctica extra terminada</h3>',
          '<p class="pob-bayes-text">Terminaste la práctica extra. Ahora sí ya puedes ir al quiz.</p>',
          '<div class="pob-bayes-ready">Sigue con confianza y lee cada pregunta con mucha atención.</div>'
        ].join('');
        return;
      }

      const currentQuestion = apoyoQuestions[Math.min(bayesState.apoyoIndex, apoyoQuestions.length - 1)];
      const optionsMarkup = currentQuestion.options.map(function (option) {
        return `<button type="button" class="pob-bayes-option" data-value="${option}">${option}</button>`;
      }).join('');

      panel.innerHTML = [
        '<h3 class="pob-bayes-title">Práctica extra antes del quiz</h3>',
        '<p class="pob-bayes-text">Vamos a recordar las ideas principales con preguntas más generales y tranquilas.</p>',
        '<div class="pob-bayes-practice">',
        `<div class="pob-bayes-progress">Pregunta ${Math.min(bayesState.apoyoIndex + 1, apoyoQuestions.length)} de ${apoyoQuestions.length}</div>`,
        `<p class="pob-bayes-question">${currentQuestion.icon} ${currentQuestion.prompt}</p>`,
        `<div class="pob-bayes-options">${optionsMarkup}</div>`,
        '<div class="pob-bayes-feedback" id="poblacionBayesApoyoFeedback" aria-live="polite"></div>',
        '</div>'
      ].join('');

      const feedback = document.getElementById('poblacionBayesApoyoFeedback');
      panel.querySelectorAll('.pob-bayes-option').forEach(function (button) {
        button.addEventListener('click', function () {
          const value = button.getAttribute('data-value');
          const correct = value === currentQuestion.correct;

          if (correct) {
            button.classList.add('ok');
            feedback.className = 'pob-bayes-feedback';
            feedback.textContent =
              bayesState.apoyoIndex + 1 >= apoyoQuestions.length
                ? 'Muy bien. Terminaste la práctica extra.'
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
          feedback.className = 'pob-bayes-feedback err';
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
    if (!allPagesComplete() || activePageNumber() !== totalPages()) return bayesState;
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

  function syncQuizButton() {
    const current = activePageNumber();
    const total = totalPages();
    const allComplete = allPagesComplete();
    const bayesLocked = !!activeLevelContent && allComplete && !isQuizUnlockedByBayes();
    const locked = !allComplete || bayesLocked;
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, .quiz-btn, a[href*="quiz.html"]').forEach(function (button) {
      const display = current === total
        ? (button.classList.contains('quiz-btn-footer') ? 'inline-flex' : 'block')
        : 'none';
      button.style.display = display;
      button.classList.toggle('bloqueado', locked);
      button.setAttribute('aria-disabled', String(locked));
      button.title = locked ? lockedQuizMessage() : '';
    });
    tracker.markPageVisibleByNumber(current);
    renderBayesPanel();
    if (current === total && allComplete && activeLevelContent && !bayesState.recommendation && !bayesState.loading) {
      window.setTimeout(function () {
        resolveLevelBayesFlow();
      }, 0);
    }
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
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, .quiz-btn, a[href*="quiz.html"]').forEach(function (link) {
      if (link.dataset.reforzamientoSesionBound === 'true') return;
      const href = link.getAttribute('href');
      if (!href) return;

      link.dataset.reforzamientoSesionBound = 'true';
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        await finalizeAll(false);

        if (!allPagesComplete()) {
          syncQuizButton();
          return;
        }

        if (activeLevelContent && !bayesState.recommendation && !bayesState.loading) {
          await resolveLevelBayesFlow();
        }

        if (activeLevelContent && !isQuizUnlockedByBayes()) {
          syncQuizButton();
          const panel = document.getElementById('poblacionBayesPanel');
          if (panel && panel.style.display !== 'none') {
            panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (activeLevelContent && !bayesState.sessionClosed) {
          const response = await session.complete({ eventoCierre: 'quiz' });
          updateBayesState({ sessionClosed: response?.success === true });
        } else if (!activeLevelContent) {
          await session.complete();
        }

        window.location.href = href;
      });
    });
  }

  function bindCompletionBridge() {
    const pendingFinalizeKeys = new Set();

    function finalizeCompletedActivity(args) {
      const pageNumber = Number(args[0]);
      const subKey = args[1];
      const apartadoKey = resolveApartadoKey(pageNumber, subKey);
      if (!apartadoKey || pendingFinalizeKeys.has(apartadoKey)) return;

      pendingFinalizeKeys.add(apartadoKey);
      Promise.resolve(finalizeKey(apartadoKey, true))
        .finally(function () {
          pendingFinalizeKeys.delete(apartadoKey);
          syncQuizButton();
        });
    }

    wrap('completarSubactividad', function (original, args) {
      const result = original.apply(this, args);
      finalizeCompletedActivity(args);
      return result;
    });

    wrap('completePage', function (original, args) {
      const result = original.apply(this, args);
      finalizeCompletedActivity(args);
      return result;
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
    wrap('answerDistribution', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = distributionSolved.has(index);
      const beforeSize = distributionSolved.size;
      const result = original.apply(this, args);
      const afterSize = distributionSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p1_distribucion', afterSize - beforeSize);
      else if (!beforeSolved && choice !== distributionAnswers[index]) err('p1_distribucion', 1);
      return result;
    });

    wrap('answerConcept', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = conceptSolved.has(index);
      const beforeSize = conceptSolved.size;
      const result = original.apply(this, args);
      const afterSize = conceptSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p2_conceptos', afterSize - beforeSize);
      else if (!beforeSolved && choice !== conceptAnswers[index]) err('p2_conceptos', 1);
      return result;
    });

    wrap('checkRetos', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbRetos');
      if (fb && fb.classList.contains('ok')) ok('p3_retos', 1);
      else if (fb && fb.classList.contains('fail')) err('p3_retos', 1);
      return result;
    });

    wrap('checkIntegrator', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbIntegrator');
      if (fb && fb.classList.contains('ok')) ok('p4_integrador', 1);
      else if (fb && fb.classList.contains('fail')) err('p4_integrador', 1);
      return result;
    });
  }

  function setupEasyVisualNoVerbalRebuilt() {
    wrap('answerDistribVisual', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = distributionSolved.has(index);
      const beforeSize = distributionSolved.size;
      const result = original.apply(this, args);
      const afterSize = distributionSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p1_distribucion', afterSize - beforeSize);
      else if (!beforeSolved && choice !== distributionAnswers[index]) err('p1_distribucion', 1);
      return result;
    });

    wrap('answerConceptVisual', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = conceptVisualSolved.has(index);
      const beforeSize = conceptVisualSolved.size;
      const result = original.apply(this, args);
      const afterSize = conceptVisualSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p2_conceptos', afterSize - beforeSize);
      else if (!beforeSolved && choice !== conceptVisualAnswers[index]) err('p2_conceptos', 1);
      return result;
    });

    wrap('checkRetosVisual', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbRetosVisual');
      if (fb && fb.classList.contains('ok')) ok('p3_retos', 1);
      else if (fb && fb.classList.contains('fail')) err('p3_retos', 1);
      return result;
    });

    wrap('answerIntegratorVisual', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = integratorSolved.has(index);
      const beforeSize = integratorSolved.size;
      const result = original.apply(this, args);
      const afterSize = integratorSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p4_integrador', afterSize - beforeSize);
      else if (!beforeSolved && choice !== integratorAnswers[index]) err('p4_integrador', 1);
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

  function setupEasyAuditivoRebuilt() {
    wrap('registrarIntentoAuditivoFacil', function (original, args) {
      const key = args[0];
      const success = args[1] === true;
      const result = original.apply(this, args);
      if (!config.apartados[key]) return result;
      if (success) ok(key, 1);
      else err(key, 1);
      return result;
    });
  }

  function setupEasyKinestesico() {
    if (typeof window.registrarIntentoDrag1 === 'function') {
      wrap('registrarIntentoDrag1', function (original, args) {
        const result = original.apply(this, args);
        if (args[0]) ok('p1_drag', 1);
        else err('p1_drag', 1);
        return result;
      });
    } else {
      wrap('verificarDrag1', function (original, args) {
        const result = original.apply(this, args);
        const totalPlaced = document.querySelectorAll('#cAlta .colocado, #cBaja .colocado').length;
        if (totalPlaced === 8) ok('p1_drag', 1);
        else err('p1_drag', 1);
        return result;
      });
    }

    if (typeof window.registrarIntentoMapa === 'function') {
      wrap('registrarIntentoMapa', function (original, args) {
        const result = original.apply(this, args);
        if (args[0]) ok('p2_mapa', 1);
        else err('p2_mapa', 1);
        return result;
      });
    } else {
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
    }

    if (typeof window.registrarIntentoOrden === 'function') {
      wrap('registrarIntentoOrden', function (original, args) {
        const result = original.apply(this, args);
        if (args[0]) ok('p3_orden', 1);
        else err('p3_orden', 1);
        return result;
      });
    } else {
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
    }

    if (typeof window.registrarIntentoRepaso === 'function') {
      wrap('registrarIntentoRepaso', function (original, args) {
        const result = original.apply(this, args);
        if (args[0]) ok('p4_repaso', 1);
        else err('p4_repaso', 1);
        return result;
      });
    } else {
      wrap('verificarRepaso', function (original, args) {
        const result = original.apply(this, args);
        const totalPlaced = document.querySelectorAll('#cConc .colocado, #cDisp .colocado, #cDens .colocado, #cMega .colocado').length;
        if (totalPlaced === 4) ok('p4_repaso', 1);
        else err('p4_repaso', 1);
        return result;
      });
    }
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

  function setupNormalVisualVerbalRebuilt() {
    wrap('checkCrossword1', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbCrossword1');
      if (fb && fb.classList.contains('ok')) ok('p1_crucigrama', 1);
      else if (fb && fb.classList.contains('fail')) err('p1_crucigrama', 1);
      return result;
    });

    wrap('answerMigrationCase', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = migrationSolved.has(index);
      const beforeSize = migrationSolved.size;
      const result = original.apply(this, args);
      const afterSize = migrationSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p2_migracion', afterSize - beforeSize);
      else if (!beforeSolved && choice !== migrationAnswers[index]) err('p2_migracion', 1);
      return result;
    });

    wrap('evaluateWordsearchSelection', function (original, args) {
      const beforeSize = wordsearchState.foundWords.size;
      const result = original.apply(this, args);
      const afterSize = wordsearchState.foundWords.size;
      if (afterSize > beforeSize) {
        ok('p3_sopa', afterSize - beforeSize);
      }
      return result;
    });

    wrap('checkFinal', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbFinal');
      if (fb && fb.classList.contains('ok')) ok('p4_integrador', 1);
      else if (fb && fb.classList.contains('fail')) err('p4_integrador', 1);
      return result;
    });
  }

  function setupDifficultVisualVerbalRebuilt() {
    wrap('checkCrossword1', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbCrossword1');
      if (fb && fb.classList.contains('ok')) ok('p1_migracion', 1);
      else if (fb && fb.classList.contains('fail')) err('p1_migracion', 1);
      return result;
    });

    wrap('evaluateDifficultWordsearchSelection', function (original, args) {
      const beforeSize = wordsearchState.foundWords.size;
      const result = original.apply(this, args);
      const afterSize = wordsearchState.foundWords.size;
      if (afterSize > beforeSize) ok('p2_retos', afterSize - beforeSize);
      return result;
    });

    wrap('checkAnalysisForm', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbAnalysisForm');
      if (fb && fb.classList.contains('ok')) ok('p3_analisis', 1);
      else if (fb && fb.classList.contains('fail')) err('p3_analisis', 1);
      return result;
    });

    wrap('checkFinal', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbFinal');
      if (fb && fb.classList.contains('ok')) ok('p4_integrador', 1);
      else if (fb && fb.classList.contains('fail')) err('p4_integrador', 1);
      return result;
    });
  }

  function setupNormalVisualNoVerbalRebuilt() {
    wrap('answerUrbanScene', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = urbanSolved.has(index);
      const beforeSize = urbanSolved.size;
      const result = original.apply(this, args);
      const afterSize = urbanSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p1_urban', afterSize - beforeSize);
      else if (!beforeSolved && choice !== urbanAnswers[index]) err('p1_urban', 1);
      return result;
    });

    wrap('answerMigrationVisual', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = migrationSolved.has(index);
      const beforeSize = migrationSolved.size;
      const result = original.apply(this, args);
      const afterSize = migrationSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p2_migration', afterSize - beforeSize);
      else if (!beforeSolved && choice !== migrationAnswers[index]) err('p2_migration', 1);
      return result;
    });

    wrap('checkServicesVisual', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbServices');
      if (fb && fb.classList.contains('ok')) ok('p3_services', 1);
      else if (fb && fb.classList.contains('fail')) err('p3_services', 1);
      return result;
    });

    wrap('answerIntegratorVisualNormal', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = integratorSolved.has(index);
      const beforeSize = integratorSolved.size;
      const result = original.apply(this, args);
      const afterSize = integratorSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p4_integrator', afterSize - beforeSize);
      else if (!beforeSolved && choice !== integratorAnswers[index]) err('p4_integrator', 1);
      return result;
    });
  }

  function setupDifficultVisualNoVerbalRebuilt() {
    wrap('answerRouteSignal', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = routeSignalSolved.has(index);
      const beforeSize = routeSignalSolved.size;
      const result = original.apply(this, args);
      const afterSize = routeSignalSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p1_signals', afterSize - beforeSize);
      else if (!beforeSolved && choice !== routeSignalAnswers[index]) err('p1_signals', 1);
      return result;
    });

    wrap('selectRetoPair', function (original, args) {
      const beforeSize = retoMatchPairs.size;
      const beforeSelected = selectedPair;
      const beforeSide = selectedPairSide;
      const chosenButton = args[0];
      const chosenSide = args[1];
      const chosenId = args[2];
      const previousId = beforeSelected ? beforeSelected.dataset.id : null;
      const result = original.apply(this, args);
      const afterSize = retoMatchPairs.size;

      if (afterSize > beforeSize) {
        ok('p2_pairs', afterSize - beforeSize);
      } else if (
        beforeSelected &&
        beforeSelected !== chosenButton &&
        beforeSide !== chosenSide &&
        previousId !== chosenId
      ) {
        err('p2_pairs', 1);
      }
      return result;
    });

    wrap('checkAnalysisPanel', function (original, args) {
      const result = original.apply(this, args);
      const fb = document.getElementById('fbAnalysisPanel');
      if (fb && fb.classList.contains('ok')) ok('p3_panel', 1);
      else if (fb && fb.classList.contains('fail')) err('p3_panel', 1);
      return result;
    });

    wrap('answerMission', function (original, args) {
      const index = Number(args[0]);
      const choice = args[1];
      const beforeSolved = missionSolved.has(index);
      const beforeSize = missionSolved.size;
      const result = original.apply(this, args);
      const afterSize = missionSolved.size;
      if (!beforeSolved && afterSize > beforeSize) ok('p4_missions', afterSize - beforeSize);
      else if (!beforeSolved && choice !== missionAnswers[index]) err('p4_missions', 1);
      return result;
    });
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

  function setupNormalAuditivoRebuilt() {
    wrap('registrarIntentoAuditivoNormal', function (original, args) {
      const key = args[0];
      const success = args[1] === true;
      const result = original.apply(this, args);
      if (!config.apartados[key]) return result;
      if (success) ok(key, 1);
      else err(key, 1);
      return result;
    });
  }

  function setupDifficultAuditivoRebuilt() {
    wrap('registrarIntentoAuditivoDificil', function (original, args) {
      const key = args[0];
      const success = args[1] === true;
      const result = original.apply(this, args);
      if (!config.apartados[key]) return result;
      if (success) ok(key, 1);
      else err(key, 1);
      return result;
    });
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

  function setupNormalKinestesicoRebuilt() {
    wrap('registrarIntentoNormalKin', function (original, args) {
      const key = args[0];
      const success = args[1] === true;
      const result = original.apply(this, args);
      if (!config.apartados[key]) return result;
      if (success) ok(key, 1);
      else err(key, 1);
      return result;
    });
  }

  function setupDifficultKinestesicoRebuilt() {
    wrap('registrarIntentoDificilKin', function (original, args) {
      const key = args[0];
      const success = args[1] === true;
      const result = original.apply(this, args);
      if (!config.apartados[key]) return result;
      if (success) ok(key, 1);
      else err(key, 1);
      return result;
    });
  }

  ready(function () {
    session.start();
    bayesState = readBayesState() || createEmptyBayesState(getCurrentSessionUuid());
    bindNavigation();
    bindCompletionBridge();
    config.setup();
    bindQuizLinks();
    syncQuizButton();
  });
})();
