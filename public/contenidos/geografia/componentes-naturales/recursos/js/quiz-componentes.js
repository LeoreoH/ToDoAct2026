(function () {
  const config = window.COMPONENTES_QUIZ_CONFIG;

  if (!config) {
    console.error('Falta la configuración del quiz.');
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
  let preguntasActivas = [];

  function $(id) {
    return document.getElementById(id);
  }

  function reproducirSonido(nombre) {
    const sonido = sonidos[nombre];
    if (!sonido || !sonido.src) return;
    sonido.currentTime = 0;
    sonido.play().catch(() => {});
  }

  function barajarArray(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function prepararPreguntas(preguntasBase) {
    return preguntasBase.map((pregunta) => {
      const opciones = pregunta.options.map((texto, idx) => ({
        texto,
        esCorrecta: idx === pregunta.correct
      }));
      const opcionesBarajadas = barajarArray(opciones);
      return {
        ...pregunta,
        options: opcionesBarajadas.map((opcion) => opcion.texto),
        correct: opcionesBarajadas.findIndex((opcion) => opcion.esCorrecta)
      };
    });
  }

  async function obtenerEstiloUsuario() {
    try {
      const respuesta = await fetch('/api/usuario/estilo', { credentials: 'include' });
      const data = await respuesta.json();
      estiloUsuario = data.estilo || 'visual_verbal';
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
    preguntasActivas = prepararPreguntas(config.questions);
    respuestasUsuario = new Array(preguntasActivas.length).fill(null);
    respuestasCorrectas = new Array(preguntasActivas.length).fill(false);
    fechaInicio = new Date();
    progresoGuardado = false;
    if ($('resultFill')) $('resultFill').style.width = '0%';
    if ($('btnGoNext')) $('btnGoNext').style.display = 'none';
    if ($('btnRetry')) $('btnRetry').style.display = 'none';
    for (let i = 1; i <= preguntasActivas.length; i++) {
      const star = $(`star${i}`);
      if (star) star.classList.remove('on');
    }
  }

  function actualizarTimer() {
    if (!fechaInicio) return;
    const segundosTotales = Math.floor((Date.now() - fechaInicio.getTime()) / 1000);
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    $('timerDisplay').innerText =
      `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
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
    $('nextLabel').innerHTML = `<i class="${config.next.icon}"></i> ${config.next.label}`;
    $('infoQuestions').innerHTML = '<i class="fas fa-question-circle"></i> 5 preguntas';
    $('infoPass').innerHTML = `<i class="fas fa-trophy"></i> ${config.minToPass}/5 para avanzar`;
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

    preguntasActivas.forEach((_, idx) => {
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

    $('questionCount').innerText = `${preguntaActual + 1}/${preguntasActivas.length}`;
  }

  function renderPregunta() {
    const pregunta = preguntasActivas[preguntaActual];
    const respondida = respuestasUsuario[preguntaActual] !== null;
    const acerto = respondida ? respuestasCorrectas[preguntaActual] : false;

    let opcionesHtml = '';
    pregunta.options.forEach((option, idx) => {
      let className = 'option-btn';
      if (respondida) {
        if (idx === pregunta.correct) className += ' correct';
        if (idx === respuestasUsuario[preguntaActual] && idx !== pregunta.correct) className += ' incorrect';
      }

      opcionesHtml += `
        <button class="${className}" onclick="ComponentesQuiz.select(${idx})" ${respondida ? 'disabled' : ''}>
          <strong>${String.fromCharCode(65 + idx)}.</strong> ${option}
        </button>
      `;
    });

    $('questionContainer').innerHTML = `
      <article class="question-card">
        <div class="question-number">PREGUNTA ${preguntaActual + 1} DE ${preguntasActivas.length}</div>
        <div class="question-text">${pregunta.text}</div>
        <div class="question-context"><i class="fas fa-circle-info"></i> ${pregunta.context}</div>
        <div class="options">${opcionesHtml}</div>
        <div class="feedback ${respondida ? 'visible' : ''} ${acerto ? 'ok' : 'err'}">
          ${respondida ? (acerto ? '✅ ' : '❌ ') + pregunta.explanation : ''}
        </div>
      </article>
    `;

    renderProgreso();
    actualizarBotones();
  }

  function actualizarBotones() {
    $('btnPrev').disabled = preguntaActual === 0;

    if (preguntaActual === preguntasActivas.length - 1) {
      $('btnNext').style.display = 'none';
      $('btnSubmit').style.display = 'inline-flex';
    } else {
      $('btnNext').style.display = 'inline-flex';
      $('btnSubmit').style.display = 'none';
    }
  }

  function construirResumen() {
    return;
    const contenedor = $('summaryList');
    contenedor.innerHTML = '';

    preguntasActivas.forEach((question, idx) => {
      const ok = respuestasCorrectas[idx];
      const userAnswer = question.options[respuestasUsuario[idx]];
      const correctAnswer = question.options[question.correct];
      const item = document.createElement('div');
      item.className = `summary-item ${ok ? 'ok' : 'err'}`;
      item.innerHTML = `
        <div class="summary-icon">${ok ? '✅' : '❌'}</div>
        <div>
          <div class="summary-question">${question.text}</div>
          <div class="summary-answer">
            Tu respuesta: <strong>${userAnswer}</strong><br>
            ${ok ? 'Respuesta validada correctamente.' : `Respuesta esperada: <strong>${correctAnswer}</strong>`}
          </div>
        </div>
      `;
      contenedor.appendChild(item);
    });
  }

  function animarEstrellas(aciertos) {
    for (let i = 1; i <= preguntasActivas.length; i++) {
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

  async function guardarProgreso(aciertos, tiempoSegundos, aprobado) {
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
          puntaje: Math.round((aciertos / preguntasActivas.length) * 100),
          aprobado,
          aciertos,
          total_preguntas: preguntasActivas.length,
          tiempo_segundos: tiempoSegundos,
          fecha_inicio: fechaInicio.toISOString(),
          errores: Math.max(preguntasActivas.length - aciertos, 0),
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
    const tiempoSegundos = Math.max(Math.round((Date.now() - fechaInicio.getTime()) / 1000), 0);
    const aprobado = aciertos >= config.minToPass;
    const porcentaje = Math.round((aciertos / preguntasActivas.length) * 100);

    mostrarPantalla('screenResult');
    animarEstrellas(aciertos);

    $('resultEmoji').innerText = aprobado ? '🏆' : '📘';
    $('resultTitle').innerText = aprobado ? 'Nivel superado' : 'Sigue practicando';
    $('resultScore').innerText = `${aciertos}/${preguntasActivas.length}`;
    $('resultTime').innerText = `Tiempo: ${tiempoSegundos} segundos`;
    $('resultMessage').innerText = aprobado
      ? config.result.successMessage.replace('{pct}', porcentaje)
      : config.result.failMessage.replace('{pct}', porcentaje).replace('{min}', config.minToPass);
    $('resultFill').style.width = `${porcentaje}%`;
    $('btnGoNext').style.display = aprobado ? 'inline-flex' : 'none';
    $('btnRetry').style.display = aprobado ? 'none' : 'inline-flex';

    await guardarProgreso(aciertos, tiempoSegundos, aprobado);
  }

  async function irSiguienteNivel() {
    reproducirSonido('click');
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
    respuestasCorrectas[preguntaActual] = idx === preguntasActivas[preguntaActual].correct;
    reproducirSonido(respuestasCorrectas[preguntaActual] ? 'correcto' : 'incorrecto');
    renderPregunta();
  }

  function cambiarPregunta(direccion) {
    reproducirSonido('click');
    const siguiente = preguntaActual + direccion;
    if (siguiente < 0 || siguiente >= preguntasActivas.length) return;
    preguntaActual = siguiente;
    renderPregunta();
  }

  window.ComponentesQuiz = {
    start: empezarQuiz,
    retry: reintentarQuiz,
    select: seleccionarRespuesta,
    prev: () => cambiarPregunta(-1),
    next: () => cambiarPregunta(1),
    submit: enviarQuiz,
    goBlock: volverAlBloque,
    goNext: irSiguienteNivel
  };

  preguntasActivas = prepararPreguntas(config.questions);
  renderEstatico();
  obtenerEstiloUsuario();
})();
