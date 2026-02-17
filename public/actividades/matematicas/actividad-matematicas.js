const ID_ACTIVIDAD_MATES = 3;

const niveles = {
    1: { 
        nombre: "Principiante", 
        operaciones: ['+', '-'], 
        maxNum: 10, 
        ejercicios: 8,
        permitirNegativos: false,
        descripcion: "Sumas y restas simples",
        puntosBase: 100
    },
    2: { 
        nombre: "Intermedio", 
        operaciones: ['+', '-', '*'], 
        maxNum: 15, 
        ejercicios: 10,
        descripcion: "Operaciones combinadas",
        multiplicacionMax: 5,
        permitirNegativos: true,
        puntosBase: 150
    },
    3: { 
        nombre: "Avanzado", 
        operaciones: ['+', '-', '*', '/'], 
        maxNum: 20, 
        ejercicios: 12,
        descripcion: "Operaciones con divisiones",
        multiplicacionMax: 10,
        divisionSinDecimales: false,
        permitirNegativos: true,
        puntosBase: 200
    }
};

let tiempoInicio;
let inicioActividad;
let inicioEjercicio;
let tiempoFinalizacion;
let erroresCometidos = 0;
let nivelActual = 1;
let puntuacionTotal = 0;
let problemasResueltos = 0;
let nivelesDesbloqueados = [1];

const sonidoAcierto = new Audio("../../recursos/sonidos/acierto.mp3");
const sonidoFallo = new Audio("../../recursos/sonidos/fallo.mp3");
const sonidoVictoria = new Audio("../../recursos/sonidos/victoria.mp3");

function actualizarBotonesNiveles() {
    const lvl1 = document.getElementById("nivel-facil");
    const lvl2 = document.getElementById("nivel-medio");
    const lvl3 = document.getElementById("nivel-dificil");

    lvl1.disabled = false;
    lvl1.innerHTML = `<span>${niveles[1].nombre}</span>
                      <span class="descripcion-nivel">${niveles[1].ejercicios} ejercicios</span>`;

    if (nivelesDesbloqueados.includes(2)) {
        lvl2.disabled = false;
        lvl2.innerHTML = `<span>${niveles[2].nombre}</span>
                        <span class="descripcion-nivel">${niveles[2].ejercicios} ejercicios</span>`;
    } else {
        lvl2.disabled = true;
        lvl2.innerHTML = `<span>${niveles[2].nombre} (Bloqueado)</span>
                        <span class="descripcion-nivel">${niveles[2].ejercicios} ejercicios</span>
                        <span class="requisito">Requiere completar nivel Fácil al 100%</span>`;
    }

    if (nivelesDesbloqueados.includes(3)) {
        lvl3.disabled = false;
        lvl3.innerHTML = `<span>${niveles[3].nombre}</span>
                        <span class="descripcion-nivel">${niveles[3].ejercicios} ejercicios</span>`;
    } else {
        lvl3.disabled = true;
        lvl3.innerHTML = `<span>${niveles[3].nombre} (Bloqueado)</span>
                        <span class="descripcion-nivel">${niveles[3].ejercicios} ejercicios</span>
                        <span class="requisito">Requiere completar nivel Medio al 100%</span>`;
    }
}

async function cargarNivelesDesbloqueados () {
  try {
    const url = `/niveles-desbloqueados?id_actividad=${ID_ACTIVIDAD_MATES}`;
    const r   = await fetch(url, { credentials:'include' });
    const { niveles } = r.ok ? await r.json() : { niveles:[1] };
    nivelesDesbloqueados = Array.isArray(niveles) ? niveles.map(Number) : [1];
  } catch { nivelesDesbloqueados = [1]; }
  actualizarBotonesNiveles();
}

async function desbloquearNiveles () {
  let n = null;
  if (nivelActual === 1 && !nivelesDesbloqueados.includes(2)) n = 2;
  if (nivelActual === 2 && !nivelesDesbloqueados.includes(3)) n = 3;
  if (n) await desbloquearNivel(n);
  await cargarNivelesDesbloqueados();
}

async function desbloquearNivel (niv) {
  await fetch('/desbloquear-nivel', {
    method:'POST',
    credentials:'include',
    headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      id_actividad: ID_ACTIVIDAD_MATES,
      nivel       : Number(niv)
    })
  });
}

function generarProblema() {
    const nivel = niveles[nivelActual];
    
    let num1, num2, problema, respuestaCorrecta, operacion;
    const maxIntentos = 100;
    let intentos = 0;

    do {
        intentos++;
        if (intentos > maxIntentos) {
            console.warn('Demasiados intentos para generar problema, usando valor por defecto');
            num1 = 2;
            num2 = 2;
            operacion = '+';
            respuestaCorrecta = 4;
            break;
        }

        const operaciones = nivel.operaciones;
        operacion = operaciones[Math.floor(Math.random() * operaciones.length)];

        if (operacion === '/') {
            num2 = Math.floor(Math.random() * 10) + 1;
            if (nivel.divisionSinDecimales) {
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            } else {
                num1 = Math.floor(Math.random() * Math.min(nivel.maxNum * 5, 200)) + 1;
            }
            respuestaCorrecta = parseFloat((num1 / num2).toFixed(2));
        } 
        else if (operacion === '*') {
            num1 = Math.floor(Math.random() * nivel.maxNum) + 1;
            num2 = Math.floor(Math.random() * nivel.multiplicacionMax) + 1;
            respuestaCorrecta = num1 * num2;
        } 
        else if (operacion === '-') {
            num1 = Math.floor(Math.random() * nivel.maxNum) + 1;
            if (nivel.permitirNegativos) {
                num2 = Math.floor(Math.random() * nivel.maxNum) + 1;
                if (Math.random() < 0.5) {
                    [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
                }
            } else {
                num2 = Math.floor(Math.random() * num1) + 1;
            }
            respuestaCorrecta = num1 - num2;
        } 
        else {
            num1 = Math.floor(Math.random() * nivel.maxNum) + 1;
            num2 = Math.floor(Math.random() * nivel.maxNum) + 1;
            respuestaCorrecta = num1 + num2;
        }
    } while (isNaN(respuestaCorrecta));

    switch(operacion) {
        case '+': problema = `${num1} + ${num2}`; break;
        case '-': problema = `${num1} - ${num2}`; break;
        case '*': problema = `${num1} × ${num2}`; break;
        case '/': problema = `${num1} ÷ ${num2}`; break;
    }

    const distractores = generarDistractores(respuestaCorrecta, operacion, num1, num2);
    const opciones = mezclarOpciones([respuestaCorrecta, ...distractores]);

    return { problema, respuestaCorrecta, opciones };
}

function generarDistractores(respuesta, operacion, num1, num2) {
    const distractores = new Set();
    const nivel = niveles[nivelActual];
    let intentos = 0;
    const maxIntentos = 50;

    while (distractores.size < 3 && intentos < maxIntentos) {
        intentos++;
        let distractor;
        const tipoError = Math.floor(Math.random() * 3);

        if (operacion === '/') {
            switch (tipoError) {
                case 0:
                    distractor = num1 * num2;
                    break;
                case 1:
                    distractor = parseFloat((respuesta * (Math.random() < 0.5 ? 0.5 : 2)).toFixed(2));
                    break;
                case 2:
                    distractor = parseFloat((respuesta + (Math.random() < 0.5 ? 1 : -1) *
                                    (Math.random() < 0.5 ? 1 : num2)).toFixed(2));
                    break;
            }
        }
        else if (operacion === '*') {
            switch (tipoError) {
                case 0:
                    distractor = num1 + num2;
                    break;
                case 1:
                    distractor = (num1 * num2) + (Math.random() < 0.5 ? num1 : num2);
                    break;
                case 2:
                    distractor = Math.abs(num1 * num2 - (Math.random() < 0.5 ? num1 : num2));
                    break;
            }
        }
        else if (operacion === '-') {
            switch (tipoError) {
                case 0:
                    distractor = num1 + num2;
                    break;
                case 1:
                    distractor = respuesta + (Math.random() < 0.5 ? num1 % num2 : num2 % num1 || 1);
                    break;
                case 2:
                    distractor = Math.abs(respuesta - (Math.random() < 0.5 ? num1 : num2));
                    break;
            }
        }
        else {
            switch (tipoError) {
                case 0:
                    distractor = Math.abs(num1 - num2);
                    break;
                case 1:
                    distractor = respuesta + (Math.random() < 0.5 ? num1 : num2);
                    break;
                case 2:
                    distractor = Math.floor(respuesta / (Math.random() < 0.5 ? num1 : num2)) || respuesta + 1;
                    break;
            }
        }

        if (typeof distractor === 'number' &&
            !isNaN(distractor) &&
            distractor !== respuesta &&
            (nivel.permitirNegativos || distractor >= 0)
        ) {
            distractores.add(parseFloat(distractor.toFixed(2)));
        }
    }

    if (distractores.size < 3) {
        console.warn('No se pudieron generar suficientes distractores válidos. Usando valores de relleno.');
        while (distractores.size < 3) {
            distractores.add(parseFloat((respuesta + Math.random() * 10).toFixed(2)));
        }
    }

    return Array.from(distractores);
}


function mezclarOpciones(opciones) {
    for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    return opciones;
}

function mostrarProblema() {
    inicioEjercicio = Date.now();
    const { problema, respuestaCorrecta, opciones } = generarProblema();

    document.getElementById('problema-matematico').textContent = problema;
    document.getElementById('resultado').textContent = '';
    document.getElementById('nivel-actual').textContent = `Nivel: ${niveles[nivelActual].nombre}`;
    
    document.getElementById('ejercicios-resueltos').textContent = 
        `${problemasResueltos}/${niveles[nivelActual].ejercicios}`;

    localStorage.setItem('respuestaCorrecta', respuestaCorrecta);

    const contenedorRespuestas = document.getElementById('contenedor-respuestas');
    contenedorRespuestas.innerHTML = '';

    opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'boton-accion';
        boton.textContent = opcion;
        boton.onclick = () => verificarRespuesta(opcion);
        contenedorRespuestas.appendChild(boton);
    });
    console.log('Problema mostrado:', problema);
}

async function verificarRespuesta(respuestaUsuario) {
    const rawRespuesta = localStorage.getItem('respuestaCorrecta');
    if (!rawRespuesta || isNaN(parseFloat(rawRespuesta))) {
        console.error('Respuesta correcta no encontrada o inválida');
        return;
    }

    if (!inicioEjercicio) {
        console.error('inicioEjercicio no definido');
        return;
    }

    const respuestaCorrecta = parseFloat(rawRespuesta);
    const tiempoEjercicio  = Math.floor((Date.now() - inicioEjercicio) / 1000);

    const nivel = niveles[nivelActual];
    const puntosPorTiempo = Math.max(10, 50 - (tiempoEjercicio * 5));
    const puntuacion = nivel.puntosBase + puntosPorTiempo;

    const botones = document.querySelectorAll('#contenedor-respuestas button');
    botones.forEach(btn => {
        const valor = parseFloat(btn.textContent);
        btn.disabled = true;
        if (valor === respuestaCorrecta) {
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = 'white';
        } else if (valor === parseFloat(respuestaUsuario)) {
            btn.style.backgroundColor = '#f44336';
            btn.style.color = 'white';
        }
    });

    const resultadoEl = document.getElementById('resultado');
    if (parseFloat(respuestaUsuario) === respuestaCorrecta) {
        sonidoAcierto.play().catch(e => console.warn('Error al reproducir sonido acierto:', e));
        puntuacionTotal += puntuacion;
        problemasResueltos++;
        resultadoEl.textContent = `¡Correcto! +${puntuacion} puntos`;
        resultadoEl.style.color = 'green';
        document.getElementById('puntuacion-total').textContent = puntuacionTotal;
    } else {
        sonidoFallo.play().catch(e => console.warn('Error al reproducir sonido fallo:', e));
        erroresCometidos++;
        resultadoEl.textContent = `Incorrecto. La respuesta correcta era ${respuestaCorrecta}`;
        resultadoEl.style.color = 'red';
    }

    document.getElementById('ejercicios-resueltos').textContent = 
        `${problemasResueltos}/${niveles[nivelActual].ejercicios}`;

    if (problemasResueltos >= niveles[nivelActual].ejercicios) {
        if (erroresCometidos === 0) {
            await desbloquearNiveles();
            actualizarBotonesNiveles();
        }
        setTimeout(finalizarActividad, 2000);
    } else {
        setTimeout(() => {
            resultadoEl.textContent = '';
            mostrarProblema();
        }, 1000);
        console.log('Preparando siguiente problema...');
    }
}

async function finalizarActividad() {
    sonidoVictoria.play().catch(e => console.warn('Error al reproducir sonido victoria:', e));
    const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);

    await guardarProgreso(puntuacionTotal, tiempoTotal, erroresCometidos);
    if (erroresCometidos === 0) await desbloquearNiveles();

    const modal = document.createElement('div');
    modal.className = 'modal-resumen';
    modal.innerHTML = `
        <div class="modal-contenido">
            <h2>¡Actividad Finalizada!</h2>
            <div class="resumen-puntuacion">
                <div class="puntuacion-detalle">
                    <span class="puntuacion-texto">Puntuación Total:</span>
                    <span class="puntuacion-numero">${puntuacionTotal}</span>
                </div>
                <div class="puntuacion-detalle">
                    <span class="puntuacion-texto">Tiempo Total:</span>
                    <span class="puntuacion-numero">${tiempoTotal} s</span>
                </div>
                <div class="puntuacion-detalle">
                    <span class="puntuacion-texto">Errores Cometidos:</span>
                    <span class="puntuacion-numero">${erroresCometidos}</span>
                </div>
                <div class="puntuacion-total">¡Buen trabajo!</div>
                <button class="boton-accion" onclick="volverANiveles()">Volver a Niveles</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function guardarProgreso (puntuacion, tiempo, errores) {
  try {
    await fetch('/guardar-progreso', {
      method:'POST',
      credentials:'include',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({
        id_actividad      : ID_ACTIVIDAD_MATES,
        dificultad        : nivelActual,
        puntuacion,
        tiempoFinalizacion: tiempo,
        erroresCometidos  : errores
      })
    });
  } catch (e) { console.error('Error al guardar progreso:', e); }
}

function volverAInicio() {
    window.location.href = "../../inicio.html";
}

document.addEventListener('DOMContentLoaded', () => {
    cargarNivelesDesbloqueados();
});

function volverANiveles() {
    const modal = document.querySelector('.modal-resumen');
    if (modal) {
        modal.remove();
    }
    
    document.getElementById('seleccion-nivel').style.display = 'block';
    document.getElementById('actividad-matematica').style.display = 'none';
    document.getElementById('actividad-matematica').innerHTML = `
        <div class="puntuacion-container">
            <div class="puntuacion-item">
                <div id="puntuacion-total" class="puntuacion-valor">0</div>
                <div class="puntuacion-etiqueta">Puntos</div>
            </div>
            <div class="puntuacion-item">
                <div id="ejercicios-resueltos" class="puntuacion-valor">0/0</div>
                <div class="puntuacion-etiqueta">Progreso</div>
            </div>
        </div>
        <p id="nivel-actual"></p>
        <p id="problema-matematico"></p>
        <div id="contenedor-respuestas"></div>
        <p id="resultado"></p>
    `;
    
    problemasResueltos = 0;
    puntuacionTotal = 0;
    erroresCometidos = 0;
}

function iniciarActividad(nivel) {
    nivelActual = nivel;
    tiempoInicio = Date.now();
    problemasResueltos = 0;
    puntuacionTotal = 0;
    erroresCometidos = 0;

    document.getElementById('seleccion-nivel').style.display = 'none';
    document.getElementById('actividad-matematica').style.display = 'block';

    mostrarProblema();
}

document.addEventListener('DOMContentLoaded', () => {
    cargarNivelesDesbloqueados().then(() => {

        actualizarBotonesNiveles();
    }).catch(error => {
        console.error('Error al cargar niveles:', error);

        actualizarBotonesNiveles();
    });
});