(function () {
  const sonidos = {
    pasarPagina: new Audio('/contenidos/geografia/recursos/sonidos/whoosh.mp3'),
    click: new Audio('/contenidos/geografia/recursos/sonidos/click.mp3'),
    completar: new Audio('/contenidos/geografia/recursos/sonidos/ding.mp3'),
    error: new Audio('/contenidos/geografia/recursos/sonidos/error.mp3')
  };

  const ultimoSonido = {
    pasarPagina: 0,
    click: 0,
    completar: 0,
    error: 0
  };

  Object.values(sonidos).forEach((sonido) => {
    if (!sonido || !sonido.src) return;
    sonido.volume = 0.15;
    sonido.preload = 'auto';
  });

  function reproducirSonidoComponentes(nombre) {
    const sonido = sonidos[nombre];
    if (!sonido || !sonido.src) return;

    const ahora = Date.now();
    if (ultimoSonido[nombre] && ahora - ultimoSonido[nombre] < 120) return;
    ultimoSonido[nombre] = ahora;

    try {
      sonido.currentTime = 0;
      const playPromise = sonido.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch (error) {
      // Ignora bloqueos de autoplay del navegador.
    }
  }

  function esVisible(elemento) {
    if (!elemento || elemento.nodeType !== 1) return false;
    const estilos = window.getComputedStyle(elemento);
    return estilos.display !== 'none' &&
      estilos.visibility !== 'hidden' &&
      elemento.getClientRects().length > 0;
  }

  function clasificarFeedback(texto) {
    if (!texto) return null;
    if (/❌|💔|incorrect|intenta|error|fallo|no es esa|sin vidas/i.test(texto)) {
      return 'error';
    }
    if (/✅|🎉|🏆|correct|perfect|excelente|bien hecho|\+\d+\s*puntos/i.test(texto)) {
      return 'completar';
    }
    return null;
  }

  function revisarFeedback(elemento) {
    if (!elemento || elemento.nodeType !== 1) return;
    if (!elemento.matches(selectorFeedback)) return;
    if (!esVisible(elemento)) return;

    const texto = (elemento.innerText || elemento.textContent || '').trim();
    if (!texto) return;

    const tipo = clasificarFeedback(texto);
    if (!tipo) return;

    if (elemento.dataset.feedbackSonido === texto) return;
    elemento.dataset.feedbackSonido = texto;
    reproducirSonidoComponentes(tipo);
  }

  const selectorClick = [
    'button:not(.btn-nav):not([disabled])',
    'a.btn-quiz',
    'a.boton-quiz',
    '.qr-btn',
    '.vf-btn',
    '.rul-opc',
    '.adiv-opc',
    '.tecla',
    '.tarj',
    '.match-item',
    '.mi',
    '.md',
    '.palabra',
    '.blank',
    '.ord-item',
    '.ord-bloque',
    '.ctx-entry',
    '.opc-rana',
    '.pieza',
    '.letra-btn',
    '.slot',
    '.casilla',
    '.opcion',
    '.tile',
    '.mem-card'
  ].join(',');

  document.addEventListener('click', (event) => {
    if (event.target.closest('audio')) return;
    const objetivo = event.target.closest(selectorClick);
    if (!objetivo) return;
    if (objetivo.dataset.noUiSound === 'true') return;
    reproducirSonidoComponentes('click');
  }, true);

  const selectorFeedback = [
    '.retro',
    '.fb',
    '.fb-ok',
    '.fb-err',
    '.pts-ganados',
    '[id^="fb"]',
    '[id^="retro"]',
    '[id^="pts"]'
  ].join(',');

  function revisarArbol(nodo) {
    if (!nodo || nodo.nodeType !== 1) return;
    if (nodo.matches(selectorFeedback)) {
      revisarFeedback(nodo);
    }
    nodo.querySelectorAll(selectorFeedback).forEach(revisarFeedback);
  }

  const observer = new MutationObserver((mutaciones) => {
    mutaciones.forEach((mutacion) => {
      if (mutacion.type === 'characterData') {
        const contenedor = mutacion.target.parentElement && mutacion.target.parentElement.closest(selectorFeedback);
        revisarFeedback(contenedor);
        return;
      }

      if (mutacion.type === 'attributes') {
        if (mutacion.target.matches && mutacion.target.matches(selectorFeedback)) {
          revisarFeedback(mutacion.target);
        }
        return;
      }

      mutacion.addedNodes.forEach(revisarArbol);
      revisarFeedback(mutacion.target);
    });
  });

  function iniciarObserver() {
    if (!document.body) return;

    document.querySelectorAll('.panel-final, .tarjeta-fin, .tarjeta-especial').forEach((elemento) => {
      elemento.remove();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    document.querySelectorAll(selectorFeedback).forEach(revisarFeedback);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarObserver, { once: true });
  } else {
    iniciarObserver();
  }

  window.reproducirSonidoComponentes = reproducirSonidoComponentes;
})();
