(function () {
  const config = window.POBLACION_QUIZ_CONFIG;

  if (!config) {
    console.error('Falta la configuracion del quiz de Poblacion Mundial.');
    return;
  }

  const sonidos = {
    correcto: new Audio('/contenidos/geografia/recursos/sonidos/ding.mp3'),
    incorrecto: new Audio('/contenidos/geografia/recursos/sonidos/error.mp3'),
    click: new Audio('/contenidos/geografia/recursos/sonidos/click.mp3'),
    completar: new Audio('/contenidos/geografia/recursos/sonidos/tada.mp3')
  };

  Object.values(sonidos).forEach((sonido) => {
    if (!sonido.src) return;
    sonido.volume = 0.15;
    sonido.load();
  });

  let preguntaActual = 0;
  let respuestasUsuario = [];
  let respuestasCorrectas = [];
  let fechaInicio = null;
  let timerInterval = null;
  let estiloUsuario = null;
  let progresoGuardado = false;
  let navegacionBloqueadaHasta = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function normalizarEstilo(estilo) {
    const base = String(estilo || 'visual_verbal')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '_');

    const mapa = {
      visual: 'visual_verbal',
      visual_verbal: 'visual_verbal',
      visualnoverbal: 'visual_no_verbal',
      visual_no_verbal: 'visual_no_verbal',
      visual_noverbales: 'visual_no_verbal',
      visual_no_verbales: 'visual_no_verbal',
      auditivo: 'auditivo',
      kinestesico: 'kinestesico',
      kinestesica: 'kinestesico'
    };

    return mapa[base] || 'visual_verbal';
  }

  function reproducirSonido(nombre) {
    const sonido = sonidos[nombre];
    if (!sonido || !sonido.src) return;
    sonido.currentTime = 0;
    sonido.play().catch(() => {});
  }

  async function obtenerEstiloUsuario() {
    try {
      const respuesta = await fetch('/api/usuario/estilo', { credentials: 'include' });
      const data = await respuesta.json();
      estiloUsuario = normalizarEstilo(data.estilo || 'visual_verbal');
    } catch (error) {
      console.error('Error al obtener estilo:', error);
      estiloUsuario = 'visual_verbal';
    }
  }

  function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('active');
    });
    $(idPantalla).classList.add('active');
  }

  function reiniciarEstado() {
    preguntaActual = 0;
    respuestasUsuario = new Array(config.questions.length).fill(null);
    respuestasCorrectas = new Array(config.questions.length).fill(false);
    fechaInicio = new Date();
    progresoGuardado = false;
    navegacionBloqueadaHasta = 0;
    if ($('resultFill')) $('resultFill').style.width = '0%';
    if ($('btnGoNext')) $('btnGoNext').style.display = 'none';
    if ($('btnRetry')) $('btnRetry').style.display = 'none';
    for (let i = 1; i <= config.questions.length; i += 1) {
      const star = $(`star${i}`);
      if (star) star.classList.remove('on');
    }
  }

  function actualizarTimer() {
    if (!fechaInicio) return;
    const segundosTotales = Math.floor((Date.now() - fechaInicio.getTime()) / 1000);
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    $('timerDisplay').innerText = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  function iniciarTimer() {
    if (timerInterval) clearInterval(timerInterval);
    actualizarTimer();
    timerInterval = setInterval(actualizarTimer, 1000);
  }

  function detenerTimer() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function renderEstatico() {
    document.title = config.pageTitle;
    $('quizTitle').innerText = config.headerTitle;
    $('quizSubtitle').innerText = config.headerSubtitle;
    $('quizLevel').innerHTML = `<i class="${config.levelIcon}"></i> ${config.levelLabel}`;
    $('startIcon').innerText = config.startIcon;
    $('startTitle').innerText = config.startTitle;
    $('startDescription').innerText = config.startDescription;
    if (config.next && $('nextLabel')) {
      $('nextLabel').innerHTML = `<i class="${config.next.icon}"></i> ${config.next.label}`;
    }
    $('infoQuestions').innerHTML = '<i class="fas fa-question-circle"></i> 5 preguntas';
    const passLabel = config.passLabel || 'para avanzar';
    $('infoPass').innerHTML = `<i class="fas fa-trophy"></i> ${config.minToPass}/5 ${passLabel}`;
    $('infoPoints').innerHTML = '<i class="fas fa-star"></i> 20 puntos por acierto';

    const topicsList = $('topicsList');
    topicsList.innerHTML = '';
    config.topics.forEach((topic) => {
      const li = document.createElement('li');
      li.innerText = topic;
      topicsList.appendChild(li);
    });
  }

  function renderProgreso() {
    const contenedor = $('progressRow');
    contenedor.innerHTML = '';

    config.questions.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.innerText = idx + 1;

      if (respuestasUsuario[idx] !== null) {
        dot.classList.add(respuestasCorrectas[idx] ? 'ok' : 'err');
      }

      if (idx === preguntaActual) {
        dot.classList.add('active');
      }

      contenedor.appendChild(dot);
    });

    $('questionCount').innerText = `${preguntaActual + 1}/${config.questions.length}`;
  }

  function renderPregunta() {
    const pregunta = config.questions[preguntaActual];
    const respondida = respuestasUsuario[preguntaActual] !== null;
    const acerto = respondida ? respuestasCorrectas[preguntaActual] : false;
    let mediaHtml = '';

    let opcionesHtml = '';
    pregunta.options.forEach((option, idx) => {
      let className = 'option-btn';
      if (respondida) {
        if (idx === pregunta.correct) className += ' correct';
        if (idx === respuestasUsuario[preguntaActual] && idx !== pregunta.correct) className += ' incorrect';
      }

      opcionesHtml += `
        <button class="${className}" onclick="PoblacionQuiz.select(${idx})" ${respondida ? 'disabled' : ''}>
          <strong>${String.fromCharCode(65 + idx)}.</strong> ${option}
        </button>
      `;
    });

    if (pregunta.imageSrc) {
      mediaHtml = `
        <figure class="question-media">
          <img src="${pregunta.imageSrc}" alt="${pregunta.imageAlt || ''}">
          ${pregunta.imageCaption ? `<figcaption class="question-caption">${pregunta.imageCaption}</figcaption>` : ''}
        </figure>
      `;
    }

    $('questionContainer').innerHTML = `
      <article class="question-card">
        <div class="question-number">PREGUNTA ${preguntaActual + 1} DE ${config.questions.length}</div>
        <div class="question-text">${pregunta.text}</div>
        <div class="question-context"><i class="fas fa-circle-info"></i> ${pregunta.context}</div>
        ${mediaHtml}
        <div class="options">${opcionesHtml}</div>
        <div class="feedback ${respondida ? 'visible' : ''} ${acerto ? 'ok' : 'err'}">
          ${respondida ? ((acerto ? 'Correcto: ' : 'Incorrecto: ') + pregunta.explanation) : ''}
        </div>
      </article>
    `;

    renderProgreso();
    actualizarBotones();
  }

  function actualizarBotones() {
    $('btnPrev').disabled = preguntaActual === 0;
    const respondida = respuestasUsuario[preguntaActual] !== null;

    if (preguntaActual === config.questions.length - 1) {
      $('btnNext').style.display = 'none';
      $('btnSubmit').style.display = 'inline-flex';
      $('btnSubmit').disabled = !respondida;
    } else {
      $('btnNext').style.display = 'inline-flex';
      $('btnSubmit').style.display = 'none';
      $('btnNext').disabled = !respondida;
    }
  }

  function animarEstrellas(aciertos) {
    for (let i = 1; i <= config.questions.length; i += 1) {
      const star = $(`star${i}`);
      star.classList.remove('on');
      if (i <= aciertos) {
        setTimeout(() => star.classList.add('on'), i * 180);
      }
    }
  }

  function obtenerSessionUuidActual() {
    try {
      const key = `reforzamiento_sesion_${config.contentId}_${config.level}_${estiloUsuario}`;
      const raw = window.sessionStorage.getItem(key);
      if (!raw) return null;
      const meta = JSON.parse(raw);
      return typeof meta.sessionUuid === 'string' ? meta.sessionUuid : null;
    } catch (error) {
      return null;
    }
  }

  async function guardarProgreso(aciertos, tiempoSegundos, aprobado, fechaFin) {
    if (progresoGuardado) return;
    progresoGuardado = true;

    try {
      if (!estiloUsuario) {
        await obtenerEstiloUsuario();
      }

      await fetch('/api/progreso/nivel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contenido_id: config.contentId,
          nivel_completado: config.level,
          puntaje: Math.round((aciertos / config.questions.length) * 100),
          aprobado,
          aciertos,
          total_preguntas: config.questions.length,
          tiempo_segundos: tiempoSegundos,
          fecha_inicio: fechaInicio.toISOString(),
          fecha_fin: fechaFin.toISOString(),
          errores: Math.max(config.questions.length - aciertos, 0),
          session_uuid: obtenerSessionUuidActual()
        })
      });
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  }

  async function enviarQuiz() {
    const sinResponder = respuestasUsuario.filter((answer) => answer === null).length;
    if (sinResponder > 0) {
      alert(`Te faltan ${sinResponder} preguntas por responder.`);
      return;
    }

    detenerTimer();
    reproducirSonido('completar');

    const aciertos = respuestasCorrectas.filter(Boolean).length;
    const fechaFin = new Date();
    const tiempoSegundos = Math.max(Math.round((fechaFin.getTime() - fechaInicio.getTime()) / 1000), 0);
    const aprobado = aciertos >= config.minToPass;
    const porcentaje = Math.round((aciertos / config.questions.length) * 100);

    mostrarPantalla('screenResult');
    animarEstrellas(aciertos);

    $('resultEmoji').innerText = aprobado ? '🏆' : '📘';
    $('resultTitle').innerText = aprobado ? 'Nivel superado' : 'Sigue practicando';
    $('resultScore').innerText = `${aciertos}/${config.questions.length}`;
    $('resultTime').innerText = `Tiempo: ${tiempoSegundos} segundos`;
    $('resultMessage').innerText = aprobado
      ? config.result.successMessage.replace('{pct}', porcentaje)
      : config.result.failMessage.replace('{pct}', porcentaje).replace('{min}', config.minToPass);
    $('resultFill').style.width = `${porcentaje}%`;
    $('btnGoNext').style.display = aprobado && config.next ? 'inline-flex' : 'none';
    $('btnRetry').style.display = aprobado ? 'none' : 'inline-flex';

    await guardarProgreso(aciertos, tiempoSegundos, aprobado, fechaFin);
  }

  async function irSiguienteNivel() {
    reproducirSonido('click');
    if (!config.next) {
      volverAlBloque();
      return;
    }
    if (config.next.type === 'style') {
      if (!estiloUsuario) {
        await obtenerEstiloUsuario();
      }
      window.location.href = `${config.next.basePath}${estiloUsuario}.html`;
      return;
    }
    window.location.href = config.next.url;
  }

  function volverAlBloque() {
    reproducirSonido('click');
    window.location.href = config.blockMenu;
  }

  function empezarQuiz() {
    reproducirSonido('click');
    reiniciarEstado();
    mostrarPantalla('screenQuiz');
    iniciarTimer();
    renderPregunta();
  }

  function reintentarQuiz() {
    reproducirSonido('click');
    empezarQuiz();
  }

  function seleccionarRespuesta(idx) {
    if (respuestasUsuario[preguntaActual] !== null) return;
    reproducirSonido('click');
    respuestasUsuario[preguntaActual] = idx;
    respuestasCorrectas[preguntaActual] = idx === config.questions[preguntaActual].correct;
    reproducirSonido(respuestasCorrectas[preguntaActual] ? 'correcto' : 'incorrecto');
    renderPregunta();
  }

  function cambiarPregunta(direccion) {
    const ahora = Date.now();
    if (ahora < navegacionBloqueadaHasta) return;
    if (direccion > 0 && respuestasUsuario[preguntaActual] === null) return;
    reproducirSonido('click');
    const siguiente = preguntaActual + direccion;
    if (siguiente < 0 || siguiente >= config.questions.length) return;
    navegacionBloqueadaHasta = ahora + 260;
    preguntaActual = siguiente;
    renderPregunta();
  }

  window.PoblacionQuiz = {
    start: empezarQuiz,
    retry: reintentarQuiz,
    select: seleccionarRespuesta,
    prev: () => cambiarPregunta(-1),
    next: () => cambiarPregunta(1),
    submit: enviarQuiz,
    goBlock: volverAlBloque,
    goNext: irSiguienteNivel
  };

  renderEstatico();
  obtenerEstiloUsuario();
})();
