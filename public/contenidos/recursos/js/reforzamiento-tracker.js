(function () {
  // Utilidades base para normalizar datos antes de guardar.
  function toSafeNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function cloneObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return { ...value };
  }

  function toISOStringOrNull(value) {
    return value instanceof Date && !Number.isNaN(value.getTime())
      ? value.toISOString()
      : null;
  }

  function getDefaultSessionStorageKey(contenidoId, nivel, estilo) {
    return `reforzamiento_sesion_${contenidoId}_${nivel}_${estilo}`;
  }

  function createSessionUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    const randomChunk = Math.random().toString(36).slice(2, 10);
    return `sesion-${Date.now().toString(36)}-${randomChunk}`;
  }

  function toDateOrNull(value) {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function normalizeStoredSessionMeta(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const sessionUuid =
      typeof value.sessionUuid === 'string' ? value.sessionUuid.trim() : '';
    const startedAt = toDateOrNull(value.startedAt);
    const completedAt = toDateOrNull(value.completedAt);

    if (!/^[A-Za-z0-9-]{8,64}$/.test(sessionUuid) || !startedAt) {
      return null;
    }

    return {
      sessionUuid,
      startedAt,
      completedAt
    };
  }

  function readStoredSessionMeta(storageKey) {
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      return normalizeStoredSessionMeta(JSON.parse(raw));
    } catch (_) {
      return null;
    }
  }

  function writeStoredSessionMeta(storageKey, meta) {
    const normalized = normalizeStoredSessionMeta(meta);
    if (!normalized) {
      return;
    }

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify({
        sessionUuid: normalized.sessionUuid,
        startedAt: toISOStringOrNull(normalized.startedAt),
        completedAt: toISOStringOrNull(normalized.completedAt)
      }));
    } catch (_) {}
  }

  function clearStoredSessionMeta(storageKey) {
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch (_) {}
  }

  function createFreshSessionMeta() {
    return {
      sessionUuid: createSessionUuid(),
      startedAt: new Date(),
      completedAt: null
    };
  }

  function getOrCreateActiveSessionMeta(storageKey) {
    const stored = readStoredSessionMeta(storageKey);
    if (stored && !stored.completedAt) {
      return stored;
    }

    const fresh = createFreshSessionMeta();
    writeStoredSessionMeta(storageKey, fresh);
    return fresh;
  }

  // Guarda el avance por apartado o pagina dentro del contenido.
  function createReforzamientoTracker(config) {
    const contenidoId = toSafeNumber(config?.contenidoId, 0);
    const nivel = config?.nivel || '';
    const estilo = config?.estilo || '';
    const endpoint = config?.endpoint || '/api/reforzamiento/guardar';
    const storageKey =
      config?.storageKey || getDefaultSessionStorageKey(contenidoId, nivel, estilo);
    const apartados = config?.apartados || {};
    const baseDetail = cloneObject(config?.detalleBase);
    const trackTime = config?.trackTime === true;
    const state = new Map();

    function getApartado(sectionKey) {
      const key = String(sectionKey);
      return apartados[sectionKey] || apartados[key] || {};
    }

    function getState(sectionKey) {
      const key = String(sectionKey);
      if (!state.has(key)) {
        state.set(key, {
          startedAt: null,
          lastInteractionAt: null,
          completedAt: null,
          aciertos: 0,
          errores: 0,
          detalle: {},
          saved: false,
          saving: false
        });
      }
      return state.get(key);
    }

    function ensureStarted(sectionKey) {
      const current = getState(sectionKey);
      if (trackTime && !current.startedAt) {
        current.startedAt = new Date();
      }
      return current;
    }

    function mergeDetail(sectionKey, detail) {
      if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
        return;
      }
      const current = getState(sectionKey);
      current.detalle = {
        ...current.detalle,
        ...detail
      };
    }

    function getElapsedSeconds(current) {
      const start = current.startedAt ? current.startedAt.getTime() : Date.now();
      const end = current.completedAt ? current.completedAt.getTime() : Date.now();
      return Math.max(0, Math.round((end - start) / 1000));
    }

    function markVisible(sectionKey, detail) {
      ensureStarted(sectionKey);
      mergeDetail(sectionKey, detail);
    }

    function markPageVisibleByNumber(pageNumber, detail) {
      Object.keys(apartados).forEach((sectionKey) => {
        const apartado = getApartado(sectionKey);
        if (toSafeNumber(apartado.pagina, 0) === toSafeNumber(pageNumber, 0)) {
          markVisible(sectionKey, detail);
        }
      });
    }

    function addError(sectionKey, count, detail) {
      const current = ensureStarted(sectionKey);
      if (current.saved) return;
      current.errores += Math.max(0, toSafeNumber(count, 1));
      current.lastInteractionAt = new Date();
      mergeDetail(sectionKey, detail);
    }

    function addCorrect(sectionKey, count, detail) {
      const current = ensureStarted(sectionKey);
      if (current.saved) return;
      current.aciertos += Math.max(0, toSafeNumber(count, 1));
      current.lastInteractionAt = new Date();
      mergeDetail(sectionKey, detail);
    }

    async function complete(sectionKey, options) {
      const current = ensureStarted(sectionKey);
      const apartado = getApartado(sectionKey);

      if (current.saved || current.saving) {
        return { success: true, skipped: true };
      }

      current.saving = true;

      if (trackTime) {
        current.completedAt = new Date();
        current.lastInteractionAt = current.completedAt;
      }

      if (options && options.aciertos !== undefined) {
        current.aciertos = Math.max(0, toSafeNumber(options.aciertos, current.aciertos));
      } else if (options && options.aciertosDelta !== undefined) {
        current.aciertos += Math.max(0, toSafeNumber(options.aciertosDelta, 0));
      }

      if (options && options.errores !== undefined) {
        current.errores = Math.max(0, toSafeNumber(options.errores, current.errores));
      } else if (options && options.erroresDelta !== undefined) {
        current.errores += Math.max(0, toSafeNumber(options.erroresDelta, 0));
      }

      mergeDetail(sectionKey, options?.detalle);

      const payload = {
        contenido_id: contenidoId,
        nivel,
        estilo,
        pagina: toSafeNumber(apartado.pagina, toSafeNumber(sectionKey, 0)),
        apartado_clave: apartado.apartadoClave || String(sectionKey),
        tipo_actividad: options?.tipoActividad || apartado.tipoActividad || 'reforzamiento',
        aciertos: current.aciertos,
        errores: current.errores,
        completado: true,
        session_uuid: getOrCreateActiveSessionMeta(storageKey).sessionUuid,
        detalle: {
          ...baseDetail,
          ...cloneObject(apartado.detalle),
          ...current.detalle
        }
      };

      if (trackTime) {
        payload.tiempo_segundos = getElapsedSeconds(current);
        payload.fecha_inicio = toISOStringOrNull(current.startedAt);
        payload.fecha_fin = toISOStringOrNull(current.completedAt);
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        current.saved = true;
        current.saving = false;
        return await response.json();
      } catch (error) {
        current.saving = false;
        console.error('No se pudo guardar el reforzamiento:', error);
        return { success: false, error: String(error) };
      }
    }

    return {
      markVisible,
      markPageVisibleByNumber,
      addError,
      addCorrect,
      complete,
      getState(sectionKey) {
        const current = getState(sectionKey);
        return {
          startedAt: current.startedAt,
          completedAt: current.completedAt,
          aciertos: current.aciertos,
          errores: current.errores,
          saved: current.saved
        };
      }
    };
  }

  // Guarda la sesion completa del recorrido antes de salir al quiz.
  function createReforzamientoSessionTracker(config) {
    const contenidoId = toSafeNumber(config?.contenidoId, 0);
    const nivel = config?.nivel || '';
    const estilo = config?.estilo || '';
    const endpoint = config?.endpoint || '/api/reforzamiento/sesion';
    const closeEvent = config?.eventoCierre || 'quiz';
    const storageKey =
      config?.storageKey || getDefaultSessionStorageKey(contenidoId, nivel, estilo);
    let sessionMeta = null;
    let saving = false;
    let saved = false;

    function ensureSessionMeta() {
      if (!sessionMeta) {
        sessionMeta = getOrCreateActiveSessionMeta(storageKey);
      }

      return sessionMeta;
    }

    function ensureStarted() {
      return ensureSessionMeta().startedAt;
    }

    function getElapsedSeconds(finishedAt) {
      const startedAt = ensureStarted();
      const end = finishedAt instanceof Date ? finishedAt : new Date();
      return Math.max(0, Math.round((end.getTime() - startedAt.getTime()) / 1000));
    }

    async function complete(options) {
      if (saved || saving) {
        return { success: true, skipped: true };
      }

      saving = true;
      const currentSessionMeta = ensureSessionMeta();
      const startedAt = ensureStarted();

      const finishedAt = new Date();
      const payload = {
        contenido_id: contenidoId,
        nivel,
        estilo,
        session_uuid: currentSessionMeta.sessionUuid,
        tiempo_segundos: getElapsedSeconds(finishedAt),
        fecha_inicio: toISOStringOrNull(startedAt),
        fecha_fin: toISOStringOrNull(finishedAt),
        evento_cierre: options?.eventoCierre || closeEvent
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(payload),
          keepalive: true
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        saved = true;
        saving = false;
        sessionMeta = {
          ...currentSessionMeta,
          completedAt: finishedAt
        };
        writeStoredSessionMeta(storageKey, sessionMeta);
        return await response.json();
      } catch (error) {
        saving = false;
        console.error('No se pudo guardar la sesion de reforzamiento:', error);
        return { success: false, error: String(error) };
      }
    }

    function attachQuizLinks(selector, optionsBuilder) {
      document.querySelectorAll(selector || '.btn-quiz').forEach((link) => {
        if (link.dataset.reforzamientoSesionBound === 'true') {
          return;
        }

        link.dataset.reforzamientoSesionBound = 'true';
        link.addEventListener('click', async (event) => {
          const href = link.getAttribute('href');
          if (!href) {
            return;
          }

          event.preventDefault();
          const builtOptions =
            typeof optionsBuilder === 'function'
              ? optionsBuilder(link) || {}
              : {};

          await complete(builtOptions);

          window.location.href = href;
        });
      });
    }

    return {
      start(detail) {
        ensureStarted(detail);
      },
      complete,
      attachQuizLinks,
      getState() {
        const current = sessionMeta || readStoredSessionMeta(storageKey);
        return {
          sessionUuid: current?.sessionUuid || null,
          startedAt: current?.startedAt || null,
          completedAt: current?.completedAt || null,
          saved,
          saving
        };
      }
    };
  }

  window.getStoredReforzamientoSessionMeta = function (contenidoId, nivel, estilo, storageKey) {
    const key = storageKey || getDefaultSessionStorageKey(contenidoId, nivel, estilo);
    return readStoredSessionMeta(key);
  };

  window.clearStoredReforzamientoSessionMeta = function (contenidoId, nivel, estilo, storageKey) {
    const key = storageKey || getDefaultSessionStorageKey(contenidoId, nivel, estilo);
    clearStoredSessionMeta(key);
  };

  window.createReforzamientoTracker = createReforzamientoTracker;
  window.createReforzamientoSessionTracker = createReforzamientoSessionTracker;
})();

