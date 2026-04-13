(function () {
  if (window.__useLocalQuizSounds) return;

  const VOLUME = 0.4;
  const audios = {
    click: new Audio('/contenidos/geografia/recursos/sonidos/click.mp3'),
    ok: new Audio('/contenidos/geografia/recursos/sonidos/ding.mp3'),
    error: new Audio('/contenidos/geografia/recursos/sonidos/error.mp3'),
    whoosh: new Audio('/contenidos/geografia/recursos/sonidos/whoosh.mp3')
  };

  Object.values(audios).forEach(function (audio) {
    audio.volume = VOLUME;
    audio.preload = 'auto';
  });

  let unlocked = false;
  let lastPlayedAt = 0;
  let lastInteractionAt = 0;
  let suppressFeedbackUntil = 0;

  const GOOD_CLASS = /\b(correct|correcta|correcto|ok|success|acierto)\b/;
  const BAD_CLASS = /\b(incorrect|incorrecta|incorrecto|fail|error|wrong)\b/;
  const GOOD_TEXT = /(correcto|correcta|excelente|muy bien|bien hecho|perfecto|bravo|lo lograste|orden perfecto|todas correctas|clasificacion perfecta|completaste|encontraste)/i;
  const BAD_TEXT = /(incorrecto|incorrecta|intenta|revisa|sigue intentando|fallaste|no coincide|no corresponde|aun no|todavia no|faltan|respuesta correcta|respuesta esta en verde|esa opcion no cumple|ese orden no forma)/i;

  const NAV_SELECTORS = [
    '.btn-nav',
    '.nav-prev-btn',
    '.nav-next-btn',
    '.page-dot',
    '.punto',
    '#btnPrev',
    '#btnNext',
    '.boton-quiz'
  ].join(',');

  const ACTION_SELECTORS = [
    '.option-btn',
    '.btn-mini',
    '.btn-verificar',
    '.btn-accion',
    '.btn-quiz',
    '.btn',
    '.col-item',
    '.palabra-chip',
    '.dingbat-op',
    '.interseccion-btn',
    '.estacion-clickeable',
    '.estacion-sel',
    '.ruta-cu-opcion',
    '.asiento',
    '.ah-tecla',
    '.letra-b',
    '.ficha-est',
    '.kin-chip',
    '.slot-foto',
    '.pieza-foto',
    '.pista-btn',
    '.opcion-num',
    '.mini-pregunta button'
  ].join(',');

  const FEEDBACK_SELECTORS = [
    '.feedback',
    '.fb-ok',
    '.fb-err',
    '.mini-feedback',
    '.feedback-k',
    '.kin-feedback',
    '[id^="feedback"]',
    '[id^="fb"]'
  ].join(',');

  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    Object.values(audios).forEach(function (audio) {
      try {
        audio.muted = true;
        const result = audio.play();
        if (result && typeof result.then === 'function') {
          result.then(function () {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
          }).catch(function () {
            audio.muted = false;
          });
        } else {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        }
      } catch (_) {
        audio.muted = false;
      }
    });
  }

  function play(name) {
    const now = Date.now();
    if (now - lastPlayedAt < 120) return;
    const audio = audios[name];
    if (!audio) return;
    lastPlayedAt = now;
    try {
      audio.currentTime = 0;
      const result = audio.play();
      if (result && typeof result.catch === 'function') result.catch(function () {});
    } catch (_) {}
  }

  function isVisible(node) {
    if (!(node instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function normalizeText(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function classifyFeedback(node) {
    if (!isVisible(node)) return null;
    const classText = (node.className || '').toString();
    const text = normalizeText(node.textContent || '');
    if (!text) return null;
    if (BAD_CLASS.test(classText) || BAD_TEXT.test(text)) return 'error';
    if (GOOD_CLASS.test(classText) || GOOD_TEXT.test(text)) return 'ok';
    return null;
  }

  function observeFeedback(node) {
    const observer = new MutationObserver(function () {
      const now = Date.now();
      if (now - lastInteractionAt > 1000) return;
      if (now < suppressFeedbackUntil) return;
      const kind = classifyFeedback(node);
      if (kind) play(kind);
    });
    observer.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  function wireFeedbackObservers() {
    document.querySelectorAll(FEEDBACK_SELECTORS).forEach(observeFeedback);
  }

  function wrapFunction(name, wrapperFactory) {
    const original = window[name];
    if (typeof original !== 'function' || original.__geoSoundWrapped) return;
    const wrapped = wrapperFactory(original);
    wrapped.__geoSoundWrapped = true;
    window[name] = wrapped;
  }

  function wrapKnownFunctions() {
    ['cambiarPagina', 'cambiarPag', 'changePage', 'goToPage', 'anteriorPregunta', 'siguientePregunta'].forEach(function (name) {
      wrapFunction(name, function (original) {
        return function () {
          play('whoosh');
          suppressFeedbackUntil = Date.now() + 220;
          return original.apply(this, arguments);
        };
      });
    });

    wrapFunction('mostrarFeedback', function (original) {
      return function () {
        const tipo = arguments[1];
        if (typeof tipo === 'string') {
          if (/ok|success|correct/i.test(tipo)) play('ok');
          else if (/error|incorrect|fail/i.test(tipo)) play('error');
          suppressFeedbackUntil = Date.now() + 220;
        }
        return original.apply(this, arguments);
      };
    });

    wrapFunction('seleccionarRespuesta', function (original) {
      return function () {
        const idx = window.preguntaActual;
        const result = original.apply(this, arguments);
        if (Array.isArray(window.respuestasCorrectas) && typeof idx === 'number') {
          const ok = !!window.respuestasCorrectas[idx];
          play(ok ? 'ok' : 'error');
          suppressFeedbackUntil = Date.now() + 220;
        }
        return result;
      };
    });

    wrapFunction('responderMini', function (original) {
      return function () {
        const ok = !!arguments[1];
        const result = original.apply(this, arguments);
        play(ok ? 'ok' : 'error');
        suppressFeedbackUntil = Date.now() + 220;
        return result;
      };
    });
  }

  function nearestMatch(target, selectors) {
    return target instanceof Element ? target.closest(selectors) : null;
  }

  function bindInteractions() {
    ['pointerdown', 'keydown'].forEach(function (eventName) {
      document.addEventListener(eventName, unlockAudio, { capture: true, passive: true });
    });

    document.addEventListener('click', function (event) {
      lastInteractionAt = Date.now();

      const navMatch = nearestMatch(event.target, NAV_SELECTORS);
      if (navMatch) {
        if (navMatch.matches('.boton-quiz')) {
          play('whoosh');
          suppressFeedbackUntil = Date.now() + 220;
        }
        return;
      }

      if (nearestMatch(event.target, ACTION_SELECTORS)) {
        play('click');
      }
    }, true);

    ['change', 'drop', 'dragend'].forEach(function (eventName) {
      document.addEventListener(eventName, function () {
        lastInteractionAt = Date.now();
      }, true);
    });
  }

  function init() {
    bindInteractions();
    wrapKnownFunctions();
    wireFeedbackObservers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
