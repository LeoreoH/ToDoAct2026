(function () {
  const HELPER_KEY = '__bayesQuizFeedbackLoaded';
  if (window[HELPER_KEY]) return;
  window[HELPER_KEY] = true;

  const MESSAGE_IDS = ['resultMessage', 'resultadoMensaje', 'resMensaje', 'resText', 'resM'];
  const STYLE_ID = 'bayes-quiz-feedback-style';
  const CARD_ID = 'bayes-quiz-feedback-card';
  const IMAGE_BASE = '/recursos/mascotas';
  const RETRY_IDS = ['btnRetry', 'btnReintentar', 'btnReinTodo', 'btnReiniciarTodo'];

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .bayes-quiz-feedback {
        margin-top: 14px;
        border-radius: 18px;
        padding: 16px 18px;
        border: 2px solid #e2e8f0;
        background: #ffffff;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
        color: #1f2937;
      }
      .bayes-quiz-feedback[data-tone="avance"] {
        border-color: #86efac;
        background: linear-gradient(135deg, #f0fdf4, #ffffff);
      }
      .bayes-quiz-feedback[data-tone="mantener"] {
        border-color: #bfdbfe;
        background: linear-gradient(135deg, #eff6ff, #ffffff);
      }
      .bayes-quiz-feedback[data-tone="repaso"] {
        border-color: #fcd34d;
        background: linear-gradient(135deg, #fff7d6, #ffffff);
      }
      .bayes-quiz-feedback[data-tone="apoyo"] {
        border-color: #fca5a5;
        background: linear-gradient(135deg, #fff1f2, #ffffff);
      }
      .bayes-quiz-feedback-top {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .bayes-quiz-feedback-img {
        width: 98px;
        max-width: 28vw;
        height: auto;
        object-fit: contain;
        flex-shrink: 0;
        filter: drop-shadow(0 8px 14px rgba(15, 23, 42, 0.12));
      }
      .bayes-quiz-feedback-copy {
        flex: 1;
        min-width: 0;
      }
      .bayes-quiz-feedback-title {
        font-size: 1rem;
        font-weight: 900;
        margin: 0 0 4px;
        color: #111827;
      }
      .bayes-quiz-feedback-text {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
        color: #374151;
      }
      .bayes-quiz-feedback-note {
        display: none;
      }
      .bayes-quiz-mascot {
        margin-top: 14px;
        display: flex;
        justify-content: center;
      }
      .bayes-quiz-mascot-frame {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 28px;
        background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98));
        border: 2px solid rgba(226,232,240,0.95);
        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.10);
        overflow: hidden;
      }
      .bayes-quiz-mascot-img {
        width: min(320px, 82vw);
        height: auto;
        object-fit: contain;
        display: block;
        border-radius: 20px;
        filter: drop-shadow(0 10px 22px rgba(15, 23, 42, 0.14));
      }
      @media (max-width: 640px) {
        .bayes-quiz-feedback-top {
          flex-direction: column;
          align-items: flex-start;
        }
        .bayes-quiz-feedback-img {
          width: 82px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function inferArea() {
    const path = window.location.pathname.toLowerCase();
    return path.includes('/matematicas/') ? 'matematicas' : 'geografia';
  }

  function getMascotImage(area) {
    return area === 'matematicas'
      ? `${IMAGE_BASE}/mascota-mate-felicitacion.png`
      : `${IMAGE_BASE}/mascota-geo-felicitacion.png`;
  }

  function getRecommendationCopy(recommendation, area) {
    switch (recommendation) {
      case 'avance':
        return {
          tone: 'avance',
          title: '',
          text: '',
          note: '',
          showImage: true
        };
      case 'mantener':
        return {
          tone: 'mantener',
          title: 'Vas muy bien',
          text: 'Sigue asi. Entendiste bien el tema y puedes continuar con este mismo ritmo.',
          note: '',
          showImage: false
        };
      case 'repaso':
        return {
          tone: 'repaso',
          title: 'Vamos a recordar un poquito',
          text: 'Antes de seguir, conviene repasar las ideas mas importantes para que el siguiente intento te salga mejor.',
          note: '',
          showImage: false
        };
      case 'apoyo':
        return {
          tone: 'apoyo',
          title: 'No pasa nada, vamos otra vez',
          text: 'Vuelve a hacer este nivel con calma. La proxima vez, lee con mucha atencion y sigue cada paso despacito. Tu puedes.',
          note: '',
          showImage: false
        };
      default:
        return null;
    }
  }

  function findMessageElement() {
    for (const id of MESSAGE_IDS) {
      const element = document.getElementById(id);
      if (element) return element;
    }
    return null;
  }

  function buildCard(copy, area) {
    if (copy.showImage && !copy.title && !copy.text) {
      const mascotWrap = document.createElement('div');
      mascotWrap.id = CARD_ID;
      mascotWrap.className = 'bayes-quiz-mascot';

      const frame = document.createElement('div');
      frame.className = 'bayes-quiz-mascot-frame';

      const img = document.createElement('img');
      img.className = 'bayes-quiz-mascot-img';
      img.src = getMascotImage(area);
      img.alt = 'Mascota felicitando';
      img.onerror = function () {
        mascotWrap.remove();
      };

      frame.appendChild(img);
      mascotWrap.appendChild(frame);
      return mascotWrap;
    }

    const card = document.createElement('div');
    card.id = CARD_ID;
    card.className = 'bayes-quiz-feedback';
    card.dataset.tone = copy.tone;

    const top = document.createElement('div');
    top.className = 'bayes-quiz-feedback-top';

    if (copy.showImage) {
      const img = document.createElement('img');
      img.className = 'bayes-quiz-feedback-img';
      img.src = getMascotImage(area);
      img.alt = 'Mascota felicitando';
      img.onerror = function () {
        img.remove();
      };
      top.appendChild(img);
    }

    const copyWrap = document.createElement('div');
    copyWrap.className = 'bayes-quiz-feedback-copy';

    const title = document.createElement('p');
    title.className = 'bayes-quiz-feedback-title';
    title.textContent = copy.title;

    const text = document.createElement('p');
    text.className = 'bayes-quiz-feedback-text';
    text.textContent = copy.text;

    copyWrap.appendChild(title);
    copyWrap.appendChild(text);
    top.appendChild(copyWrap);
    card.appendChild(top);
    return card;
  }

  function renderRecommendation(recommendation) {
    if (!recommendation || !recommendation.recomendacion) return;

    const messageEl = findMessageElement();
    if (!messageEl) return;

    injectStyles();

    const copy = getRecommendationCopy(recommendation.recomendacion, inferArea());
    if (!copy) return;

    const current = document.getElementById(CARD_ID);
    if (current) current.remove();

    const card = buildCard(copy, inferArea());
    messageEl.insertAdjacentElement('afterend', card);
  }

  function applyRetryPolicy(recommendation) {
    if (!recommendation || recommendation.recomendacion !== 'apoyo') return;

    RETRY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    document.querySelectorAll('button[onclick*="reiniciarQuiz"], button[onclick*="reintentarQuiz"], button[onclick*="restartAll"], button[onclick*="reiniciarTodo"]').forEach((btn) => {
      btn.style.display = 'none';
    });
  }

  function renderWithRetry(recommendation, attempts) {
    const tries = Number.isFinite(attempts) ? attempts : 0;
    if (findMessageElement()) {
      renderRecommendation(recommendation);
      applyRetryPolicy(recommendation);
      return;
    }
    if (tries >= 12) return;
    setTimeout(() => renderWithRetry(recommendation, tries + 1), 180);
  }

  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  if (!nativeFetch) return;

  window.fetch = async function (...args) {
    const response = await nativeFetch(...args);

    try {
      const target = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      if (!target.includes('/api/progreso/nivel')) {
        return response;
      }

      const data = await response.clone().json().catch(() => null);
      if (!data || !data.recomendacion_bayes) {
        return response;
      }

      window.__ultimoBayesQuiz = data.recomendacion_bayes;
      renderWithRetry(data.recomendacion_bayes, 0);
    } catch (_) {}

    return response;
  };
})();
