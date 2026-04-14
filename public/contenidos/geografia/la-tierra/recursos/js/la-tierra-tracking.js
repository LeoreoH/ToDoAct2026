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
    if (state && state.saved) return;
    tracker.addCorrect(key, 1, detail || {});
    await tracker.complete(key, { detalle: detail || {} });
  }

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

  function syncQuizLinks() {
    const current = activePageNumber();
    const total = totalPages();
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, a[href*="quiz.html"]').forEach(function (button) {
      if (button.classList.contains('btn-quiz') || button.classList.contains('boton-quiz') || button.classList.contains('quiz-btn-footer')) {
        button.style.display = current === total ? (button.classList.contains('quiz-btn-footer') ? 'inline-flex' : 'block') : 'none';
      }
    });
    markVisible(current);
  }

  function bindNavigation() {
    ['cambiarPagina', 'cambiarPag', 'goToPage'].forEach(function (name) {
      wrap(name, async function (original, args) {
        const before = activePageNumber();
        const result = original.apply(this, args);
        const after = activePageNumber();
        if (before !== after) {
          await finalizePage(before, false);
        }
        setTimeout(syncQuizLinks, 0);
        return result;
      });
    });

    ['actualizarUI', 'syncUI'].forEach(function (name) {
      wrap(name, function (original, args) {
        const result = original.apply(this, args);
        setTimeout(syncQuizLinks, 0);
        return result;
      });
    });

    const observer = new MutationObserver(function () {
      syncQuizLinks();
    });

    pages().forEach(function (page) {
      observer.observe(page, { attributes: true, attributeFilter: ['class', 'style'] });
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
          addSuccess(page, { funcion: name, resultado: 'correcto' });
        } else if (boolResult === false) {
          addError(page, { funcion: name, resultado: 'incorrecto' });
        }
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
        return result;
      });
    });
  }

  function bindQuizLinks() {
    session.start();
    document.querySelectorAll('.btn-quiz, .boton-quiz, .quiz-btn-footer, a[href*="quiz.html"]').forEach(function (link) {
      if (link.dataset.reforzamientoSesionBound === 'true') return;
      const href = link.getAttribute('href');
      if (!href) return;

      link.dataset.reforzamientoSesionBound = 'true';
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        await finalizeAll(false);
        await session.complete({ eventoCierre: 'quiz' });
        window.location.href = href;
      });
    });
  }

  ready(function () {
    bindNavigation();
    bindBooleanResponders();
    bindQuizLinks();
    syncQuizLinks();
  });
})();
