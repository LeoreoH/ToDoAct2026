let aventuraSeleccionada = null;
let objetosSeleccionados = [];
let puntos = 100;
let tiempoInicio = null;
let tiempoFinal = null;
let desafiosCompletados = 0;
let preguntasMostradas = [];
let erroresCometidos = 0;
let retroalimentacionErrores = [];

const UMBRAL_DESBLOQUEO = 140;

const sonidoSeleccion = new Audio("../../recursos/sonidos/girar.mp3");
const sonidoAcierto = new Audio("../../recursos/sonidos/acierto.mp3");
const sonidoFallo = new Audio("../../recursos/sonidos/fallo.mp3");
const sonidoVictoria = new Audio("../../recursos/sonidos/victoria.mp3");

const rutasDisponibles = [
    {
        id: 1,
        nombre: "🌳 Bosque Encantado",
        lore: `Una neblina azul cubre los viejos robles y el viento hace sonar campanillas que nadie ve. Dicen que, si sigues ese tintineo, encontrarás un arroyo con huellas de media luna en el barro.\n\nDetrás del arroyo brilla un claro lleno de luciérnagas azules. Dos senderos esperan: uno huele a setas rojas con puntos blancos y el otro cruje con hojas secas. ¿Te atreves a entrar al Bosque Encantado?`,
        nivel: 1,
        maxObjetos: 5,
        descripcion: "Un bosque lleno de misterios y criaturas mágicas.",
        color: "#27ae60",

        objetos: [
            { nombre: "mapa", icono: "🗺️", esencial: true, descripcion: "Ubicarse entre los árboles" },
            { nombre: "brujula", icono: "🧭", esencial: true, descripcion: "Saber siempre dónde está el norte" },
            { nombre: "linterna", icono: "🔦", esencial: true, descripcion: "Iluminar senderos oscuros" },
            { nombre: "botiquin", icono: "🩹", esencial: true, descripcion: "Curar raspones y picaduras" },
            { nombre: "agua", icono: "💧", esencial: false, descripcion: "Hidratarse (puedes rellenar en arroyos)" },
            { nombre: "comida", icono: "🍎", esencial: true, descripcion: "Provisiones extra" },
            { nombre: "red", icono: "🕸️", esencial: false, descripcion: "Atrapar insectos o crear refugio" },
            { nombre: "cuerda", icono: "🧶", esencial: false, descripcion: "Escalar o asegurar" },
            { nombre: "silbato", icono: "📣", esencial: false, descripcion: "Pedir ayuda si te pierdes" },
            { nombre: "gafas", icono: "🕶️", esencial: false, descripcion: "Proteger los ojos del polvo" }
        ],
        preguntas: [
            {
                pregunta: "El cielo se oscurece de golpe y oyes un aullido lejano. ¿Qué haces para seguir sin asustar a las criaturas nocturnas?",
                opciones: ["Enciendes tu linterna y avanzas despacio", "Cantas a todo pulmón tu canción favorita", "Haces palmas y corres"],
                correcta: 0,
                correctaTxt: "¡Bien! Una luz suave y pasos tranquilos no alteran el bosque.",
                incorrectaTxt: "Inténtalo de nuevo: piensa en lo que haría un explorador prudente."
            },
            {
                pregunta: "Ves huellas en forma de media luna marcadas en el barro. ¿De quién son?",
                opciones: ["De un ciervo curioso", "De un dragón bebé", "De tu profe de matemáticas"],
                correcta: 0,
                correctaTxt: "Exacto: los ciervos dejan huellas con dos medias lunas.",
                incorrectaTxt: "Hmm… observa bien las pistas que dejan los animales del bosque."
            },
            {
                pregunta: "Tengo raíces invisibles, coro verde en primavera y en otoño visto de fuego. ¿Quién soy?",
                opciones: ["Árbol", "Musgo", "Seta"],
                correcta: 0,
                correctaTxt: "¡Correcto! Era un árbol.",
                incorrectaTxt: "Pista: cambia de color en otoño."
            },
            {
                pregunta: "Musgo → Hoja seca → ¿? → Semilla → Tronco caído. Elige el elemento que falta.",
                opciones: ["Flor", "Raíz", "Seta", "Llama"],
                correcta: 2,
                correctaTxt: "¡Bien! Las setas aparecen tras la descomposición de la hoja.",
                incorrectaTxt: "Piensa en algo que crece sobre materia en descomposición."
            },
            {
                pregunta: "Escuchas un arroyo pero no lo ves entre los árboles. ¿Cómo lo encuentras?",
                opciones: ["Sigues el sonido del agua", "Escalas el árbol más alto", "Le preguntas a una ardilla"],
                correcta: 0,
                correctaTxt: "Usar el oído es la forma más rápida de llegar al agua.",
                incorrectaTxt: "Escucha con atención: a veces tus sentidos son el mejor mapa."
            }
        ]
    },
    {
        id: 2,
        nombre: "🏙️ Ciudad Perdida",
        nivel: 2,
        maxObjetos: 6,
        descripcion: "Explora ruinas cubiertas de enredaderas y resuelve enigmas urbanos.",
        color: "#3498db",
        lore: `Las avenidas están vacías, pero las fachadas de cristal siguen brillando entre lianas y grafitis antiguos. Cada paso hace eco entre ventanas rotas, y las palomas alzan el vuelo como si guardaran un secreto.\n Cuenta la leyenda que en el corazón de la Ciudad Perdida hay una biblioteca subterránea: sus estanterías forman un laberinto y, en el centro, una fuente de cristal azul revela la salida solo a quienes comprendan los mensajes ocultos en sus muros.`,

        objetos: [
            { nombre: "linterna", icono: "🔦", esencial: true, descripcion: "Iluminar pasillos oscuros" },
            { nombre: "mapa", icono: "🗺️", esencial: true, descripcion: "Trazar rutas entre edificios derruidos" },
            { nombre: "botiquín", icono: "🩹", esencial: true, descripcion: "Curar cortes y raspones" },
            { nombre: "llave maestra", icono: "🔑", esencial: true, descripcion: "Abrir cerraduras antiguas sin dañarlas" },
            { nombre: "cuaderno", icono: "📓", esencial: true, descripcion: "Anotar símbolos y pistas" },
            { nombre: "lupa", icono: "🔍", esencial: true, descripcion: "Examinar inscripciones pequeñas" },
            { nombre: "teléfono", icono: "📱", esencial: false, descripcion: "Tomar fotos si hay señal" },
            { nombre: "cuerda", icono: "🧶", esencial: false, descripcion: "Descender por huecos o pozos" },
            { nombre: "cómics", icono: "📚", esencial: false, descripcion: "Leer en los descansos" },
            { nombre: "mancuernas", icono: "🏋️", esencial: false, descripcion: "Ejercitar los brazos… si te sobra energía" }
        ],

        preguntas: [
            {
                pregunta: "Llegas a una avenida llena de lianas. Para avanzar sin tropezar, ¿qué enciendes primero?",
                opciones: ["Linterna", "Teléfono", "Cuerda"],
                correcta: 0,
                correctaTxt: "¡Bien! Iluminas los escombros escondidos.",
                incorrectaTxt: "Sin luz podrías caer en un hueco."
            },
            {
                pregunta: "Tengo números en mi cara, pero no cuento historias. Mis manos giran sin cansarse. ¿Quién soy?",
                opciones: ["Un reloj de la estación", "Una calculadora vieja", "Un mapa doblado"],
                correcta: 0,
                correctaTxt: "Exacto: el gran reloj aún marca el tiempo.",
                incorrectaTxt: "Pista: sus agujas no escriben, solo giran."
            },
            {
                pregunta: "Te topas con una puerta silenciosa y cerrada. ¿Cómo la abres sin hacer ruido?",
                opciones: ["Llave maestra", "Mancuernas", "Patear la puerta"],
                correcta: 0,
                correctaTxt: "La llave encaja sin romper nada.",
                incorrectaTxt: "Forzarla puede alertar a cualquiera."
            },
            {
                pregunta: "SECUENCIA: ▲  ▲  ◼︎  ?  ▲  ◼︎  \n\n¿Qué figura falta?",
                opciones: ["▲", "◼︎", "●", "★"],
                correcta: 0,
                correctaTxt: "¡Bien visto! El patrón repite dos triángulos antes de cada cuadrado.",
                incorrectaTxt: "Observa cómo se agrupan las figuras."
            },
            {
                pregunta: "Encuentras un plano empolvado que puede guiarte a la biblioteca secreta. ¿Con qué lo comparas para asegurarte?",
                opciones: ["Tu mapa", "Teléfono", "Botiquín"],
                correcta: 0,
                correctaTxt: "El mapa confirma que las líneas llevan al centro.",
                incorrectaTxt: "Sin referencia podrías perderte."
            },
            {
                pregunta: "En el mural ves un dibujo de una fuente de cristal azul. Según la leyenda, ¿qué ocurre allí?",
                opciones: [
                    "Muestra la salida a quienes entienden los símbolos",
                    "Sale un dragón mecánico",
                    "Se inicia una lluvia de cómics"
                ],
                correcta: 0,
                correctaTxt: "¡Correcto! Solo los que descifran los mensajes encuentran la salida.",
                incorrectaTxt: "Recuerda lo que decían las historias sobre la fuente."
            }
        ]
    },
    {
        id: 3,
        nombre: "⛰️ Montaña Misteriosa",
        nivel: 3,
        maxObjetos: 7,
        color: "#e74c3c",
        descripcion: "Escala riscos empinados, recorre cuevas y descubre los secretos de la cima.",
        lore: `El sendero serpentea entre pinos y rocas rojas. A cada paso sientes el crujido de la grava y una brisa fría que huele a nieve lejana. En lo alto, las nubes parecen tocar los picos como gorros de algodón.\n\nDicen los montañeses que, dentro de la cumbre hueca, un viejo campanario de hielo suena cuando alguien resuelve los acertijos de la montaña. Quien escucha su eco puede encontrar el paso secreto hacia el valle escondido.`,

        objetos: [
            { nombre: "brújula", icono: "🧭", esencial: true, descripcion: "Orientarte cuando todo se ve igual" },
            { nombre: "cuerda", icono: "🧶", esencial: true, descripcion: "Asegurarte en paredes empinadas" },
            { nombre: "casco", icono: "⛑️", esencial: true, descripcion: "Protegerte de rocas que caen" },
            { nombre: "botas", icono: "🥾", esencial: true, descripcion: "Pisar firme en grava suelta" },
            { nombre: "cantimplora", icono: "💧", esencial: true, descripcion: "Mantener la hidratación" },
            { nombre: "comida", icono: "🍎", esencial: true, descripcion: "Energía para la travesía" },
            { nombre: "linterna", icono: "🔦", esencial: true, descripcion: "Ver dentro de cuevas oscuras" },
            { nombre: "barra energética", icono: "🍫", esencial: false, descripcion: "Un dulce extra de emergencia" },
            { nombre: "reproductor de música", icono: "🎵", esencial: false, descripcion: "Ambientar el campamento" },
            { nombre: "juegos de mesa", icono: "🎲", esencial: false, descripcion: "Diversión en la tienda" },
            { nombre: "asador portátil", icono: "🍖", esencial: false, descripcion: "Para una parrillada en la cima" }
        ],

        preguntas: [
            {
                pregunta: "Un túnel se vuelve completamente oscuro. ¿Cómo avanzas sin tropezar?",
                opciones: [
                    "Prendes tu linterna y caminas despacio",
                    "Corres con los brazos abiertos",
                    "Cierras los ojos y saltas",
                    "Cantas esperando ver mejor"
                ],
                correcta: 0,
                correctaTxt: "La luz revela el suelo y te mantiene seguro.",
                incorrectaTxt: "Usa algo que te permita ver en la oscuridad."
            },
            {
                pregunta: "Tengo cama pero nunca duermo, tengo boca pero no como. En la montaña, canto sin voz. ¿Qué soy?",
                opciones: ["Un río de deshielo", "Un oso pardo", "Un abrigo", "Un reloj"],
                correcta: 0,
                correctaTxt: "¡Exacto! El río tiene «cama» y «boca» y su corriente suena como canto.",
                incorrectaTxt: "Pista: corre desde lo alto hacia el valle y lleva agua."
            },
            {
                pregunta: "El eco devuelve tu voz tres veces. Para saber la profundidad de la cueva decides…",
                opciones: [
                    "Lanzar una piedra y contar hasta oírla caer",
                    "Gritar más fuerte",
                    "Agitar el mapa como abanico",
                    "Tomar una selfie a oscuras"
                ],
                correcta: 0,
                correctaTxt: "El sonido al caer te da una pista de la altura.",
                incorrectaTxt: "Busca un método que mida con el oído, no con la vista."
            },
            {
                pregunta: "SECUENCIA: ↗  ↗  ↘  ↘  ↗  ↗  ?\n\n¿Qué flecha completa el patrón?",
                opciones: ["↘", "↗", "←", "↙"],
                correcta: 0,
                correctaTxt: "¡Buen ojo! Se repiten dos hacia arriba-derecha y dos hacia abajo-derecha.",
                incorrectaTxt: "Observa cuántas veces se repite cada dirección."
            },
            {
                pregunta: "Comienza a llover fuerte en la cima. ¿Qué parte del equipo evita que resbales?",
                opciones: [
                    "Botas con suela rugosa",
                    "Gafas polarizadas",
                    "Guantes de lana",
                    "Casco reluciente"
                ],
                correcta: 0,
                correctaTxt: "Las botas adhieren tus pasos al terreno mojado.",
                incorrectaTxt: "Piensa qué va directamente bajo tus pies."
            },
            {
                pregunta: "Subes 200 m, bajas 150 m y vuelves a subir 100 m.\n\n¿Cuál es tu ganancia de altura total?",
                opciones: ["150 m", "250 m", "50 m", "100 m"],
                correcta: 0,
                correctaTxt: "200 − 150 + 100 = 150 m de ascenso neto.",
                incorrectaTxt: "Resta lo que bajaste y suma lo que subiste otra vez."
            },
            {
                pregunta: "La aguja de tu brújula se vuelve loca cerca de rocas metálicas. ¿Cómo recuperas el rumbo?",
                opciones: [
                    "Te alejas unos metros de la roca para consultarla otra vez",
                    "La golpeas hasta que marque norte",
                    "La agitas sobre tu cabeza como hélice",
                    "La entierras para que «descanse»"
                ],
                correcta: 0,
                correctaTxt: "Al alejarte del metal desaparece la interferencia magnética.",
                incorrectaTxt: "La brújula funciona, solo necesita estar lejos del objeto que la perturba."
            }
        ]
    },
    {
        id: 4,
        nombre: "🏝️ Isla Desierta",
        nivel: 4,
        descripcion: "Sobrevive, explora y encuentra la forma de pedir rescate en una isla remota.",
        maxObjetos: 7,
        color: "#f39c12",
        lore: `Despiertas en la orilla con la ropa salpicada de sal. El sol se alza sobre un mar turquesa y las palmeras hacen sonar sus hojas como si aplaudieran tu llegada. Tu cantimplora está vacía y, en la arena, un viejo mapa señala con una ❌ el interior de la isla.\n\nDicen los pescadores que, cuando el viento sur sopla, puede verse un globo gigante de colores ondeando sobre los cocoteros: señal de que un náufrago ha logrado pedir ayuda. Para alcanzar ese momento primero deberás encontrar agua dulce, levantar refugio y descifrar los acertijos que la isla esconde.`,

        objetos: [
            { nombre: "mapa", icono: "🗺️", esencial: true, descripcion: "Ubicar fuentes de agua y zonas altas" },
            { nombre: "cantimplora", icono: "💧", esencial: true, descripcion: "Almacenar agua potable" },
            { nombre: "botiquín", icono: "🩹", esencial: true, descripcion: "Curar cortes y raspones" },
            { nombre: "cuchillo", icono: "🔪", esencial: true, descripcion: "Abrir cocos y cortar cuerda" },
            { nombre: "fósforos", icono: "🔥", esencial: true, descripcion: "Encender una fogata rápidamente" },
            { nombre: "red de pesca", icono: "🕸️", esencial: true, descripcion: "Conseguir alimento o cubrir refugio" },
            { nombre: "silbato", icono: "📣", esencial: true, descripcion: "Enviar señales de auxilio" },
            { nombre: "hamaca", icono: "🛏️", esencial: false, descripcion: "Dormir elevado y fresco" },
            { nombre: "cámara acuática", icono: "📷", esencial: false, descripcion: "Fotografiar la fauna marina" },
            { nombre: "globo gigante", icono: "🎈", esencial: false, descripcion: "Marca aérea visible a kilómetros" }
        ],

        preguntas: [
            {
                pregunta: "Necesitas agua potable segura. ¿Qué haces primero?",
                opciones: [
                    "Recolectar lluvia con la cantimplora",
                    "Beber directamente del mar",
                    "Esperar a tener mucha sed",
                    "Buscar refrescos enterrados"
                ],
                correcta: 0,
                correctaTxt: "¡Bien! El agua de lluvia no necesita desalinización.",
                incorrectaTxt: "Piensa en la fuente más fácil de agua dulce."
            },
            {
                pregunta: "¿Dónde montas tu refugio para evitar la marea alta?",
                opciones: [
                    "Sobre la línea más alta de la playa",
                    "Justo al borde del agua",
                    "Dentro de una cueva inundable",
                    "En la copa de una palmera"
                ],
                correcta: 0,
                correctaTxt: "Así el mar no lo arrastra durante la noche.",
                incorrectaTxt: "Observa cuánto sube y baja el océano cada día."
            },
            {
                pregunta: "Te cortas con coral mientras nadas. ¿Qué haces?",
                opciones: [
                    "Limpiar y vendar con el botiquín",
                    "Enjuagar con agua salada y olvidar",
                    "Cubrir con arena húmeda",
                    "Ignorar hasta volver al campamento"
                ],
                correcta: 0,
                correctaTxt: "Desinfectar y cubrir evita infecciones.",
                incorrectaTxt: "Las heridas en zona tropical se infectan rápido."
            },
            {
                pregunta: "Prendes tu fogata. ¿Cuál es el mejor combustible de arranque?",
                opciones: [
                    "Yesca seca y pequeñas ramitas",
                    "Plástico arrastrado por el mar",
                    "Algas húmedas recién recogidas",
                    "Troncos grandes y mojados"
                ],
                correcta: 0,
                correctaTxt: "La yesca se enciende rápido y calienta los troncos.",
                incorrectaTxt: "Busca algo que arda fácil y mantenga la llama."
            },
            {
                pregunta: "En la arena quedan huellas: 👣 🦀 👣 ❔  ¿Qué sigue para completar el patrón?",
                opciones: ["👣", "🦀", "🐢", "🐚"],
                correcta: 1,
                correctaTxt: "¡Exacto! El cangrejo se repite cada dos pasos.",
                incorrectaTxt: "Observa bien el orden de las huellas."
            },
            {
                pregunta: "Bajo un cocotero encuentras cocos marcados 2, 4, 8, ❔. ¿Cuál será el siguiente número?",
                opciones: ["10", "12", "16", "18"],
                correcta: 2,
                correctaTxt: "La serie duplica cada número: 8 × 2 = 16.",
                incorrectaTxt: "Fíjate en cómo crece la secuencia."
            },
            {
                pregunta: "Tu mapa muestra flechas ↗ ↗ ↘ ↘ ← ← ❔  para llegar al centro de la isla. ¿Qué símbolo falta?",
                opciones: ["→", "↔", "↑", "↓"],
                correcta: 0,
                correctaTxt: "La última flecha derecha cierra el patrón simétrico.",
                incorrectaTxt: "Piensa en completar el camino igual que empezó."
            }
        ]
    }
];

const etapas = document.querySelectorAll('.etapa');
const etapaPlot = document.getElementById('etapaPlot');
const textoPlot = document.getElementById('textoPlot');
const btnContinuarPlot = document.getElementById('btnContinuarPlot');
const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const etapa3 = document.getElementById('etapa3');
const etapa4 = document.getElementById('etapa4');
const etapa5 = document.getElementById('etapa5');
const resumenAventura = document.getElementById('resumenAventura');
const botonComenzar = document.getElementById('comenzar');
const botonSiguienteEtapa3 = document.getElementById('siguienteEtapa3');
const botonReiniciar = document.getElementById('reiniciar');
const maleta = document.getElementById('maleta');
const preguntaElemento = document.getElementById('pregunta');
const opcionesDesafio = document.getElementById('opcionesDesafio');
const opcionesRutas = document.getElementById('opcionesRutas');
const contadorObjetos = document.getElementById('contador');
const numeroDesafio = document.getElementById('numeroDesafio');
const progresoDesafios = document.getElementById('progresoDesafios');
const retroalimentacionElemento = document.getElementById('retroalimentacion');
const medallaElemento = document.getElementById('medalla');

function mostrarEtapa(etapa) {
    etapas.forEach(e => e.classList.remove('activa'));
    etapa.classList.add('activa');

    if (etapa === etapa3) {
        cargarObjetos();
    }
    else if (etapa === etapa5) {
        mostrarResumen();
    }
}

function cargarObjetos() {
    const objetosContainer = document.getElementById('objetos');
    objetosContainer.innerHTML = '';
    maleta.innerHTML = '';
    objetosSeleccionados = [];
    actualizarContador();

    const rutaSeleccionada = rutasDisponibles.find(r => r.nombre === aventuraSeleccionada);
    if (!rutaSeleccionada) return;

    document.getElementById('rutaActual').textContent = rutaSeleccionada.nombre;
    const limite = rutaSeleccionada.maxObjetos || 6;

    [...rutaSeleccionada.objetos]
        .sort(() => Math.random() - 0.5)
        .forEach(obj => {
            const card = document.createElement('div');
            card.className = 'objeto';
            card.textContent = `${obj.icono} ${obj.nombre}`;
            card.setAttribute('data-objeto', obj.nombre);
            card.setAttribute('draggable', 'true');
            card.title = obj.descripcion;

            card.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', obj.nombre);
            });

            objetosContainer.appendChild(card);
        });

    objetosContainer.ondragover = e => e.preventDefault();
    objetosContainer.ondrop = e => {
        e.preventDefault();
        const nombre = e.dataTransfer.getData('text/plain');
        const idx = objetosSeleccionados.indexOf(nombre);
        if (idx > -1) {
            objetosSeleccionados.splice(idx, 1);
            const clone = maleta.querySelector(`.objeto-mochila[data-objeto="${nombre}"]`);
            if (clone) clone.remove();
            actualizarContador();
        }
    };

    maleta.ondragover = e => {
        e.preventDefault();
        maleta.style.borderColor = '#3498db';
    };
    maleta.ondragleave = () => (maleta.style.borderColor = '#bdc3c7');

    maleta.ondrop = e => {
        e.preventDefault();
        maleta.style.borderColor = '#bdc3c7';

        const nombre = e.dataTransfer.getData('text/plain');
        if (objetosSeleccionados.length >= limite) return;
        if (objetosSeleccionados.includes(nombre)) return;

        objetosSeleccionados.push(nombre);

        const original = objetosContainer.querySelector(`[data-objeto="${nombre}"]`);
        if (!original) return;

        const clone = original.cloneNode(true);
        clone.classList.add('objeto-mochila');
        clone.setAttribute('draggable', 'true');

        clone.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData('text/plain', nombre);
        });

        maleta.appendChild(clone);
        sonidoSeleccion.play();
        actualizarContador();
    };
}

function actualizarContador() {
    const lim = rutasDisponibles.find(r => r.nombre === aventuraSeleccionada)?.maxObjetos || 6;
    contadorObjetos.textContent = `${objetosSeleccionados.length}/${lim}`;
}

function iniciarTemporizador() {
    tiempoInicio = new Date();
}

function calcularTiempo() {
    tiempoFinal = new Date();
    const segundos = Math.floor((tiempoFinal - tiempoInicio) / 1000);
    return segundos;
}

function mostrarResumen() {
    sonidoVictoria.play();
    const tiempoTranscurrido = calcularTiempo();
    const rutaSel = rutasDisponibles.find(r => r.nombre === aventuraSeleccionada);
    const esenciales = rutaSel.objetos.filter(o => o.esencial).map(o => o.nombre);
    const faltantes = esenciales.filter(n => !objetosSeleccionados.includes(n));
    const totPreg = (rutaSel.preguntas ?? preguntas).length;
    const errPreg = retroalimentacionErrores.length;
    const errTot = faltantes.length + errPreg;

    let txt, col;
    if (errTot === 0) { txt = "🏆 Oro – ¡Perfecto!"; col = "#FFD700"; }
    else if (errTot <= 2) { txt = "🥈 Plata – Muy bien"; col = "#C0C0C0"; }
    else if (errTot <= 4) { txt = "🥉 Bronce – Sigue practicando"; col = "#CD7F32"; }
    else { txt = "🎖️ Participación"; col = "#7f8c8d"; }

    const puntuacionFinal = puntos;
    const nivelSig = rutaSel.nivel + 1;
    const maxNivel = rutasDisponibles.reduce((m, r) => Math.max(m, r.nivel), 0);
    if (puntuacionFinal >= UMBRAL_DESBLOQUEO && nivelSig <= maxNivel) {
        desbloquearNivelSiguiente(nivelSig);
    }

    const mensajeFinal = puntuacionFinal >= UMBRAL_DESBLOQUEO
        ? "¡Has desbloqueado la siguiente ruta! 🎉"
        : `Necesitabas ${UMBRAL_DESBLOQUEO} pts — obtuviste ${puntuacionFinal}. ¡Sigue intentando!`;

    resumenAventura.innerHTML = `
    <div class="medalla-container" style="--color:${col}">
      <span>${txt}</span>
    </div>
    <ul class="stats">
      <li>⏱️ <strong>Tiempo:</strong> ${formatearTiempo(tiempoTranscurrido)}</li>
      <li>❓ <strong>Preguntas correctas:</strong> ${totPreg - errPreg}/${totPreg}</li>
      <li>🎒 <strong>Objetos esenciales:</strong> ${esenciales.length - faltantes.length}/${esenciales.length}</li>
      <li>⚠️ <strong>Errores totales:</strong> ${errTot}</li>
      <li>⭐ <strong>Puntuación:</strong> ${puntuacionFinal}</li>
    </ul>
    <p class="mensaje-resumen ${puntuacionFinal >= UMBRAL_DESBLOQUEO ? 'exito' : 'animo'}">
      ${mensajeFinal}
    </p>
  `;

    guardarProgreso({
        idActividad: 1,
        categoria: null,
        nivel: rutaSel.nivel,
        puntuacion: puntuacionFinal,
        tiempo: tiempoTranscurrido,
        errores: errTot
    });

    const btnReiniciar = document.getElementById('reiniciar');
    btnReiniciar.style.display = 'inline-block';
    btnReiniciar.onclick = reiniciarAventura;
}

async function desbloquearNivelSiguiente(nivel) {
    try {
        const r = await fetch('/desbloquear-nivel', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_actividad: 1,
                categoria: null,
                nivel: nivel
            })
        });

        const data = await r.json();
        console.log('desbloquear‑nivel:', data);
    } catch (e) {
        console.error('desbloquear‑nivel error:', e);
    }
}

function formatearTiempo(segundos) {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins > 0 ? mins + 'm ' : ''}${secs}s`;
}

function generarDesafio() {
    const rutaSel = rutasDisponibles.find(r => r.nombre === aventuraSeleccionada);
    const listaPreg = rutaSel.preguntas;
    const totalPreg = listaPreg.length;

    const disponibles = listaPreg.filter(p => !preguntasMostradas.includes(p.pregunta));

    if (disponibles.length === 0) {
        preguntasMostradas = [];
        return generarDesafio();
    }

    const p = disponibles[Math.floor(Math.random() * disponibles.length)];
    preguntasMostradas.push(p.pregunta);

    numeroDesafio.textContent = `${desafiosCompletados + 1} de ${totalPreg}`;
    progresoDesafios.style.width = `${(desafiosCompletados / totalPreg) * 100}%`;

    preguntaElemento.textContent = p.pregunta;
    opcionesDesafio.innerHTML = '';

    const indices = p.opciones.map((_, i) => i).sort(() => Math.random() - 0.5);

    indices.forEach(idx => {
        const btn = document.createElement('button');
        btn.textContent = p.opciones[idx];

        btn.onclick = () => {

            opcionesDesafio.querySelectorAll('button').forEach(b => b.disabled = true);

            opcionesDesafio.querySelectorAll('.retro-msg').forEach(el => el.remove());

            const retro = document.createElement('div');
            retro.className = 'retro-msg ' + (idx === p.correcta ? 'correcta' : 'incorrecta');
            retro.textContent = idx === p.correcta ? p.correctaTxt : p.incorrectaTxt;
            btn.insertAdjacentElement('afterend', retro);

            if (idx === p.correcta) {
                sonidoAcierto.play();
                puntos += 20;
            } else {
                sonidoFallo.play();
                puntos -= 10;
                retroalimentacionErrores.push(p.incorrectaTxt);
            }

            desafiosCompletados++;
            const pausa = 3500;
            setTimeout(() => {
                if (desafiosCompletados >= totalPreg) {
                    mostrarEtapa(etapa5);
                } else {
                    generarDesafio();
                }
            }, pausa);
        };

        opcionesDesafio.appendChild(btn);
    });
}

function reiniciarAventura() {
    aventuraSeleccionada = null;
    objetosSeleccionados = [];
    maleta.innerHTML = '';
    resumenAventura.innerHTML = '';
    puntos = 100;
    desafiosCompletados = 0;
    preguntasMostradas = [];
    erroresCometidos = 0;
    retroalimentacionErrores = [];
    progresoDesafios.style.width = '0%';
    medallaElemento.style.backgroundImage = 'none';
    mostrarEtapa(etapa1);
    cargarRutas();
}

botonComenzar.addEventListener('click', () => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        alert("Debes iniciar sesión para comenzar la aventura.");
        window.location.href = "index.html";
        return;
    }
    mostrarEtapa(etapa2);
    iniciarTemporizador();
})

botonSiguienteEtapa3.addEventListener('click', () => {
    if (objetosSeleccionados.length > 0) {
        generarDesafio();
        mostrarEtapa(etapa4);
    }
    else {
        alert("¡Debes seleccionar al menos un objeto para continuar!");
        sonidoFallo.play();
    }
});

botonReiniciar.addEventListener('click', reiniciarAventura);

async function cargarRutas() {
    const nivelesDesbloqueados = await obtenerNivelesDesbloqueados();

    opcionesRutas.innerHTML = '';

    rutasDisponibles.forEach(ruta => {
        const rutaDesbloqueada = nivelesDesbloqueados.includes(ruta.nivel);

        const contenedorRuta = document.createElement('div');
        contenedorRuta.className = rutaDesbloqueada
            ? 'ruta-container'
            : 'ruta-container ruta-bloqueada';
        contenedorRuta.style.borderLeft = `5px solid ${ruta.color}`;

        const boton = document.createElement('button');
        boton.textContent = ruta.nombre;
        boton.disabled = !rutaDesbloqueada;

        const descripcion = document.createElement('p');
        descripcion.className = 'descripcion-ruta';
        descripcion.textContent = ruta.descripcion;

        if (rutaDesbloqueada) {
            boton.addEventListener('click', () => {
                aventuraSeleccionada = ruta.nombre;

                const lore = ruta.lore || "¡Prepárate para una gran aventura!";
                textoPlot.textContent = lore;

                mostrarEtapa(etapaPlot);
            });
        }

        contenedorRuta.append(boton, descripcion);
        opcionesRutas.appendChild(contenedorRuta);
    });
}

btnContinuarPlot.addEventListener('click', () => {
    mostrarEtapa(etapa3);
});

function volverAInicio() {
    window.location.href = "../../inicio.html";
}

async function obtenerNivelesDesbloqueados() {
    const idActividad = 1;
    const categoria = null;

    try {
        const url = `/niveles-desbloqueados?id_actividad=${idActividad}` +
            `&categoria=${encodeURIComponent(categoria ?? '')}`;

        const r = await fetch(url, { credentials: 'include' });
        if (!r.ok) throw new Error('Error');

        const { niveles } = await r.json();
        return niveles;
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function guardarProgreso({ idActividad, categoria = null, nivel, puntuacion, tiempo, errores }) {
    await fetch('/guardar-progreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            id_actividad: idActividad,
            categoria,
            dificultad: nivel,
            puntuacion,
            tiempoFinalizacion: tiempo,
            erroresCometidos: errores
        })
    });
}


cargarRutas();