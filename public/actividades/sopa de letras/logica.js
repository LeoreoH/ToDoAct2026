const categorias = {
  animales: ["GATO", "PERRO", "CAPIBARA", "OVEJA", "LEON", "TIGRE", "ELEFANTE", "JIRAFA", "MONO", "SERPIENTE", "TORTUGA", "PAJARO"],
  frutas: ["MANZANA", "NARANJA", "SANDIA", "MANGO", "DURAZNO", "PERA", "UVA", "FRESA", "CEREZA", "PAPAYA", "PIÑA", "PLATANO"],
  paises: ["MEXICO", "ARGENTINA", "BRASIL", "CANADA", "ESPAÑA", "FRANCIA", "ITALIA", "JAPON", "CHINA", "RUSIA", "ALEMANIA", "AUSTRALIA"],
  deportes: ["FUTBOL", "BASQUETBOL", "TENIS", "NATACION", "CICLISMO", "VOLEIBOL", "ATLETISMO", "BOXEO", "GOLF", "KARATE", "JUDO", "ESGRIMA"],
  profesiones: ["MEDICO", "INGENIERO", "PROFESOR", "ARQUITECTO", "ENFERMERO", "ABOGADO", "CHEF", "POLICIA", "BOMBERO", "PERIODISTA", "ARTISTA", "CIENTIFICO"],
  instrumentos: ["GUITARRA", "PIANO", "VIOLIN", "TROMPETA", "FLAUTA", "BAJO", "BATERIA", "SAXOFON", "ARPA", "ACORDEON", "TAMBOR", "CLARINETE"],
  transportes: ["AUTOMOVIL", "MOTOCICLETA", "BICICLETA", "AVION", "BARCO", "TREN", "CAMION", "SUBMARINO", "HELICOPTERO", "TRICICLO", "PATINETA", "MONOPATIN"],
  verduras: ["ZANAHORIA", "LECHUGA", "TOMATE", "PEPINO", "CEBOLLA", "PAPA", "BROCOLI", "COLIFLOR", "ESPINACA", "CALABAZA", "BERENJENA", "CHILE"],
  tecnologia: ["CELULAR", "COMPUTADORA", "TABLET", "TELEVISION", "AURICULARES", "ALTAVOZ", "RATON", "TECLADO", "IMPRESORA", "DRON", "ROBOT", "CAMARA"],
  espacio: ["SOL", "TIERRA", "MARTE", "JUPITER", "SATURNO", "LUNA", "COMETA", "ESTRELLA", "GALAXIA", "NEBULOSA", "COHETE", "SATELITE"],
  emociones: ["FELIZ", "TRISTE", "ENOJADO", "SORPRENDIDO", "MIEDO", "AMOR", "RISA", "LLANTO", "CALMA", "CONFUNDIDO", "ABURRIDO", "EMOCIONADO"],
  medios: ["TELEVISION", "RADIO", "PERIODICO", "INTERNET", "REVISTA", "PODCAST", "LIBRO", "CINE", "REDES", "BLOG", "YOUTUBE", "SPOTIFY"],
  herramientas: ["MARTILLO", "DESTORNILLADOR", "LLAVE", "SIERRA", "TALADRO", "PINZAS", "ALICATE", "CINTA", "PALA", "CEPILLO", "CUCHILLO", "HACHA"],
  clima: ["SOL", "LLUVIA", "NUBE", "NIEVE", "TORMENTA", "VIENTO", "ARCOIRIS", "HURACAN", "NIEBLA", "GRANIZO", "CALOR", "FRIO"]
};

const categoriasOrden = [
  "animales",
  "frutas",
  "paises",
  "deportes",
  "profesiones",
  "instrumentos",
  "transportes",
  "verduras",
  "tecnologia",
  "espacio",
  "emociones",
  "medios",
  "herramientas",
  "clima"
];

const ID_ACTIVIDAD_SOPA = 5;
let categoriaActual = "frutas";
let nivelActual = null;
let nivelesDesbloqueados = [1];

const niveles = {
  1: { nombre: "Fácil", gridSize: 8, tiempoLimite: 80, palabrasMostradas: 5 },
  2: { nombre: "Medio", gridSize: 10, tiempoLimite: 110, palabrasMostradas: 8 },
  3: { nombre: "Difícil", gridSize: 12, tiempoLimite: 140, palabrasMostradas: 12 },
};

const tablero = document.getElementById("tablero");
const lista_palabras = document.getElementById("palabras");
const timeDisplay = document.getElementById("tiempo");
const palabrasEncontradasDisplay = document.getElementById("palabras-encontradas");
const totalPalabrasDisplay = document.getElementById("total-palabras");

let grid = [];
let selectedCells = [];
let palabrasEncontradas = 0;
let timeElapsed = 0;
let tiempo;
let erroresCometidos = 0;

const coloresPalabras = [
  "rgba(255, 182, 193, 0.5)",
  "rgba(144, 238, 144, 0.5)",
  "rgba(173, 216, 230, 0.5)",
  "rgba(255, 215, 0, 0.5)",
  "rgba(255, 127, 80, 0.5)",
  "rgba(138, 43, 226, 0.5)",
  "rgba(32, 178, 170, 0.5)",
  "rgba(220, 20, 60, 0.5)",
  "rgba(0, 206, 209, 0.5)",
  "rgba(255, 105, 180, 0.5)",
];
let colorIndex = 0;

const sonidoAcierto = new Audio("../../recursos/sonidos/acierto.mp3");
const sonidoFallo = new Audio("../../recursos/sonidos/fallo.mp3");
const sonidoVictoria = new Audio("../../recursos/sonidos/victoria.mp3");
const sonidoTiempoAgotado = new Audio("../../recursos/sonidos/tiempo-agotado.mp3");

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function puedeColocarPalabraSegura(row, col, palabra, rowStep, colStep, grid, gridSize) {
  let tieneCruces = false;
  for (let i = 0; i < palabra.length; i++) {
    const r = row + i * rowStep;
    const c = col + i * colStep;
    if (r >= gridSize || c >= gridSize) return false;
    if (grid[r][c] !== "") {
      if (grid[r][c] !== palabra[i]) return false;
      tieneCruces = true;
      if (rowStep === 0) {
        if ((grid[r - 1]?.[c] === "" || grid[r - 1]?.[c] === undefined) &&
          (grid[r + 1]?.[c] === "" || grid[r + 1]?.[c] === undefined)) {
          return false;
        }
      } else {
        if ((grid[r]?.[c - 1] === "" || grid[r]?.[c - 1] === undefined) &&
          (grid[r]?.[c + 1] === "" || grid[r]?.[c + 1] === undefined)) {
          return false;
        }
      }
    }
  }
  if (!tieneCruces) {
    for (let i = 0; i < palabra.length; i++) {
      const r = row + i * rowStep;
      const c = col + i * colStep;
      if (grid[r][c] !== "") return false;
    }
  }
  return true;
}

function colocarPalabra(row, col, palabra, rowStep, colStep) {
  for (let i = 0; i < palabra.length; i++) {
    grid[row + i * rowStep][col + i * colStep] = palabra[i];
  }
}

function generarSopa() {
  tablero.innerHTML = "";
  lista_palabras.innerHTML = "";
  palabrasEncontradas = 0;
  palabrasEncontradasDisplay.textContent = "0";

  const config = niveles[nivelActual];
  let palabrasCategoria = [...categorias[categoriaActual]];
  if (nivelActual === 1) {
    palabrasCategoria = palabrasCategoria.filter(p => p.length <= config.gridSize);
  }
  mezclarArray(palabrasCategoria);
  palabrasCategoria = palabrasCategoria.slice(0, config.palabrasMostradas);
  totalPalabrasDisplay.textContent = palabrasCategoria.length;

  grid = Array(config.gridSize).fill().map(() => Array(config.gridSize).fill(""));
  for (const palabra of palabrasCategoria) {
    const colocado = (() => {
      const direcciones = mezclarArray([
        { rowStep: 0, colStep: 1 },
        { rowStep: 1, colStep: 0 }
      ]);
      for (const dir of direcciones) {
        const maxRow = dir.rowStep === 0 ? config.gridSize : config.gridSize - palabra.length;
        const maxCol = dir.colStep === 0 ? config.gridSize : config.gridSize - palabra.length;
        for (let intento = 0; intento < 50; intento++) {
          const row = Math.floor(Math.random() * maxRow);
          const col = Math.floor(Math.random() * maxCol);
          if (puedeColocarPalabraSegura(row, col, palabra, dir.rowStep, dir.colStep, grid, config.gridSize)) {
            colocarPalabra(row, col, palabra, dir.rowStep, dir.colStep);
            return true;
          }
        }
      }
      return false;
    })();
    if (!colocado) return generarSopa();
    const li = document.createElement("li");
    li.textContent = palabra;
    li.id = `palabra-${palabra}`;
    lista_palabras.appendChild(li);
  }

  for (let i = 0; i < config.gridSize; i++) {
    for (let j = 0; j < config.gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      const cell = document.createElement("div");
      cell.textContent = grid[i][j];
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("mousedown", seleccionarInicio);
      cell.addEventListener("mouseenter", seleccionarLetra);
      cell.addEventListener("mouseup", verificarPalabra);
      cell.addEventListener("touchstart", handleTouchStart, { passive: false });
      cell.addEventListener("touchmove", handleTouchMove, { passive: false });
      cell.addEventListener("touchend", handleTouchEnd);
      tablero.appendChild(cell);
    }
  }
  tablero.style.setProperty("--grid-size", config.gridSize);
}

let isSelecting = false, isTouchSelecting = false, touchStartCell = null;

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (cell?.classList.contains("cell")) {
    isTouchSelecting = true;
    touchStartCell = cell;
    selectedCells = [];
    seleccionarCelda(cell);
  }
}
function handleTouchMove(e) {
  e.preventDefault();
  if (!isTouchSelecting) return;
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (cell?.classList.contains("cell") && cell !== selectedCells.at(-1)) {
    seleccionarCelda(cell);
  }
}
function handleTouchEnd(e) {
  if (isTouchSelecting) {
    isTouchSelecting = false;
    const touch = e.changedTouches[0];
    const endElem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (endElem && tablero.contains(endElem)) verificarPalabra();
    else limpiarSeleccionForzada();
  }
}

function seleccionarInicio(e) {
  isSelecting = true;
  selectedCells = [];
  seleccionarCelda(e.target);
  tablero.addEventListener("mouseleave", limpiarSeleccionForzada);
}
function seleccionarLetra(e) {
  if (!isSelecting) return;
  seleccionarCelda(e.target);
}
function limpiarSeleccionForzada() {
  if (isSelecting) {
    isSelecting = false;
    selectedCells.forEach(c => c.classList.remove("selected"));
    selectedCells = [];
    tablero.removeEventListener("mouseleave", limpiarSeleccionForzada);
  }
}
function seleccionarCelda(cell) {
  if (cell === selectedCells.at(-1)) {
    cell.classList.remove("selected");
    selectedCells.pop();
    return;
  }

  if (selectedCells.length) {
    const last = selectedCells.at(-1);
    const lr = +last.dataset.row, lc = +last.dataset.col;
    const cr = +cell.dataset.row, cc = +cell.dataset.col;
    if (selectedCells.length === 1) {
      if (cr !== lr && cc !== lc) return;
    } else {
      const fr = +selectedCells[0].dataset.row, fc = +selectedCells[0].dataset.col;
      if (!((fr === cr) || (fc === cc))) return;
    }
    const dr = Math.abs(cr - lr), dc = Math.abs(cc - lc);
    if (dr > 1 || dc > 1 || (dr === 1 && dc === 1)) return;
  }
  cell.classList.add("selected");
  selectedCells.push(cell);
}

function verificarPalabra() {
  if (!isSelecting && !isTouchSelecting) return;
  isSelecting = isTouchSelecting = false;
  tablero.removeEventListener("mouseleave", limpiarSeleccionForzada);

  if (!selectedCells.length) return;
  const palabra = selectedCells.map(c => c.textContent).join("");
  const elem = document.getElementById(`palabra-${palabra}`);

  if (elem) {
    const ya = elem.style.textDecoration === "line-through";
    if (!ya) {
      sonidoAcierto.play();
      const color = coloresPalabras[colorIndex++ % coloresPalabras.length];
      selectedCells.forEach(c => {
        c.classList.add("found");
        c.style.backgroundColor = color;
        c.style.borderColor = color;
        c.style.color = "#222";
      });
      elem.style.textDecoration = "line-through";
      elem.style.color = "#4CAF50";
      palabrasEncontradas++;
      palabrasEncontradasDisplay.textContent = palabrasEncontradas;
      if (palabrasEncontradas === +totalPalabrasDisplay.textContent) {
        sonidoVictoria.play();
        terminarJuego(true);
      }
    }
  } else if (selectedCells.length > 1) {
    sonidoFallo.play();
    selectedCells.forEach(c => {
      c.classList.add("no-match");
      setTimeout(() => c.classList.remove("no-match"), 500);
    });
    erroresCometidos++;
  }

  selectedCells.forEach(c => c.classList.remove("selected"));
  selectedCells = [];
}
document.addEventListener("mouseup", verificarPalabra);

function iniciarTemporizador() {
  timeElapsed = 0;
  timeDisplay.textContent = "0";
  clearInterval(tiempo);
  tiempo = setInterval(() => {
    timeElapsed++;
    timeDisplay.textContent = timeElapsed;
    if (timeElapsed >= niveles[nivelActual].tiempoLimite) {
      clearInterval(tiempo);
      sonidoTiempoAgotado.play();
      terminarJuego(false);
    }
  }, 1000);
}

async function terminarJuego(victoria) {
  clearInterval(tiempo);

  if (victoria) sonidoVictoria.play(); else sonidoTiempoAgotado.play();

  await guardarPuntuacion();
  if (victoria) await desbloquearNiveles();
  await cargarNivelesDesbloqueados();

  if (victoria) mostrarMensajeVictoria();
  else mostrarMensajeTiempoAgotado();
}

function mostrarMensajeVictoria() {
  const m = document.createElement("div");
  m.className = "mensaje-victoria";
  m.innerHTML = `
    <div>
      <h2>¡Felicidades!</h2>
      <p>Completaste el nivel ${niveles[nivelActual].nombre}</p>
      <p>Tiempo: ${timeElapsed} segundos</p>
      <p>Palabras encontradas: ${palabrasEncontradas}/${totalPalabrasDisplay.textContent}</p>
      <p>Errores: ${erroresCometidos}</p>
      <button id="cerrar-mensaje-victoria">Volver a niveles</button>
    </div>`;
  document.body.appendChild(m);
  document.getElementById("cerrar-mensaje-victoria").onclick = () => { m.remove(); volverANiveles(); };
}

function mostrarMensajeTiempoAgotado() {
  const m = document.createElement("div");
  m.className = "mensaje-tiempo-agotado";
  m.innerHTML = `
    <div>
      <h2>¡Tiempo agotado!</h2>
      <p>No completaste el nivel ${niveles[nivelActual].nombre} a tiempo</p>
      <p>Palabras encontradas: ${palabrasEncontradas}/${totalPalabrasDisplay.textContent}</p>
      <p>Tiempo transcurrido: ${timeElapsed} segundos</p>
      <button id="cerrar-mensaje-tiempo">Volver a niveles</button>
    </div>`;
  document.body.appendChild(m);
  document.getElementById("cerrar-mensaje-tiempo").onclick = () => { m.remove(); volverANiveles(); };
}

function volverANiveles() {
  clearInterval(tiempo);
  tiempo = null;
  nivelActual = null;
  document.getElementById("juego").style.display = "none";
  document.getElementById("niveles").style.display = "block";

  tablero.innerHTML = "";
  lista_palabras.innerHTML = "";
  selectedCells = [];
  timeElapsed = 0;
  timeDisplay.textContent = "0";
  palabrasEncontradas = 0;
  palabrasEncontradasDisplay.textContent = "0";
  totalPalabrasDisplay.textContent = "0";
  erroresCometidos = 0;
}

function reiniciarJuego() {
  clearInterval(tiempo);
  tiempo = null;
  tablero.innerHTML = "";
  lista_palabras.innerHTML = "";
  selectedCells = [];
  timeElapsed = 0;
  timeDisplay.textContent = "0";
  palabrasEncontradas = 0;
  palabrasEncontradasDisplay.textContent = "0";
  totalPalabrasDisplay.textContent = "0";
  erroresCometidos = 0;
}

function seleccionarCategoria(categoria) {
  categoriaActual = categoria;
  document.getElementById("categorias").style.display = "none";
  document.getElementById("niveles").style.display = "block";
  cargarNivelesDesbloqueados();
}

function iniciarJuego(nivel) {
  nivelActual = nivel;
  document.getElementById("niveles").style.display = "none";
  document.getElementById("juego").style.display = "block";
  reiniciarJuego();
  generarSopa();
  iniciarTemporizador();
}

async function cargarNivelesDesbloqueados() {
  const url = `/niveles-desbloqueados?id_actividad=${ID_ACTIVIDAD_SOPA}`
    + `&categoria=${encodeURIComponent(categoriaActual)}`;
  try {
    const r = await fetch(url, { credentials: 'include' });
    const { niveles } = r.ok ? await r.json() : { niveles: [1] };
    nivelesDesbloqueados = Array.isArray(niveles) ? niveles.map(Number) : [1];
  } catch { nivelesDesbloqueados = [1]; }
  actualizarBotonesNiveles();
}

function actualizarBotonesNiveles() {
  const btns = {
    1: document.getElementById("nivel-facil"),
    2: document.getElementById("nivel-medio"),
    3: document.getElementById("nivel-dificil")
  };
  for (let n = 1; n <= 3; n++) {
    const btn = btns[n];
    const desblo = nivelesDesbloqueados.includes(n);
    btn.disabled = !desblo;
    btn.innerHTML = `
      <span>${niveles[n].nombre}${desblo ? "" : " (Bloqueado)"}</span>
      <span class="descripcion-nivel">${niveles[n].gridSize}x${niveles[n].gridSize} – ${niveles[n].palabrasMostradas} palabras</span>`;
  }
}

function volverAInicio() {
  window.location.href = "../../inicio.html";
}

function navegarAtras() {
  const mensajeVictoria = document.querySelector(".mensaje-victoria");
  const mensajeTiempo = document.querySelector(".mensaje-tiempo-agotado");

  if (mensajeVictoria) mensajeVictoria.remove();
  if (mensajeTiempo) mensajeTiempo.remove();

  clearInterval(tiempo);

  if (document.getElementById("juego").style.display === "block") {
    document.getElementById("juego").style.display = "none";
    document.getElementById("niveles").style.display = "block";
    reiniciarJuego();
  } else if (document.getElementById("niveles").style.display === "block") {
    document.getElementById("niveles").style.display = "none";
    document.getElementById("categorias").style.display = "block";
  } else {
    volverAInicio();
  }
}

async function desbloquearNivel(niv, cat = categoriaActual) {
  await fetch('/desbloquear-nivel', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_actividad: ID_ACTIVIDAD_SOPA,
      categoria: cat,
      nivel: Number(niv)
    })
  });
}

async function desbloquearNiveles() {
  if (nivelActual < 3) {
    const sig = nivelActual + 1;
    if (!nivelesDesbloqueados.includes(sig)) await desbloquearNivel(sig);
  } else {
    const idx = categoriasOrden.indexOf(categoriaActual);
    if (idx !== -1 && idx < categoriasOrden.length - 1)
      await desbloquearNivel(1, categoriasOrden[idx + 1]);
  }
  await cargarNivelesDesbloqueados();
}

async function guardarPuntuacion() {
  if (!localStorage.getItem('usuario')) return;
  await fetch('/guardar-progreso', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_actividad: ID_ACTIVIDAD_SOPA,
      categoria: categoriaActual,
      dificultad: nivelActual,
      puntuacion: palabrasEncontradas * 100,
      tiempoFinalizacion: timeElapsed,
      erroresCometidos: erroresCometidos
    })
  });
}

window.onload = () => {
  document.getElementById("juego").style.display = "none";
  document.getElementById("niveles").style.display = "none";
  document.getElementById("categorias").style.display = "block";
};
