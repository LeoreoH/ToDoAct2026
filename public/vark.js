const VARK_QUESTIONS = [
    {
        id: 1,
        prompt: 'Vas a preparar una comida rica para tu familia. &iquest;Qu&eacute; har&iacute;as?',
        options: {
            a: 'Les preguntar&iacute;a a familiares qu&eacute; me recomiendan.',
            b: 'Ver&iacute;a im&aacute;genes o fotos de recetas para inspirarme.',
            c: 'Buscar&iacute;a una receta escrita que s&eacute; que me podr&iacute;a funcionar.',
            d: 'Har&iacute;a algo que ya s&eacute; preparar sin seguir instrucciones.'
        }
    },
    {
        id: 2,
        prompt: 'Est&aacute;s en un restaurante. &iquest;C&oacute;mo eliges tu comida?',
        options: {
            a: 'Escucho al mesero o pido recomendaciones.',
            b: 'Veo lo que otros est&aacute;n comiendo o miro las im&aacute;genes del men&uacute;.',
            c: 'Leo las descripciones del men&uacute;.',
            d: 'Pido algo que ya he probado antes.'
        }
    },
    {
        id: 3,
        prompt: '&iquest;Qu&eacute; te har&iacute;a querer comprar un libro de fantas&iacute;a?',
        options: {
            a: 'Que un amigo me lo recomiende.',
            b: 'Que tenga historias interesantes o ejemplos reales.',
            c: 'Leer un poco del libro.',
            d: 'Que la portada sea bonita o llamativa.'
        }
    },
    {
        id: 4,
        prompt: 'Terminaste un examen y quieres saber c&oacute;mo te fue. &iquest;C&oacute;mo prefieres verlo?',
        options: {
            a: 'Leyendo los resultados escritos.',
            b: 'Viendo ejemplos de lo que hiciste.',
            c: 'Con gr&aacute;ficas o dibujos de tus resultados.',
            d: 'Que alguien te lo explique hablando contigo.'
        }
    },
    {
        id: 5,
        prompt: 'Te duele la rodilla. &iquest;C&oacute;mo prefieres que el doctor te explique?',
        options: {
            a: 'Con un modelo o maqueta.',
            b: 'D&aacute;ndote algo para leer.',
            c: 'Explic&aacute;ndotelo con palabras.',
            d: 'Mostr&aacute;ndote un dibujo o diagrama.'
        }
    },
    {
        id: 6,
        prompt: 'Vas a comprar un juego. &iquest;Qu&eacute; te ayuda a decidir?',
        options: {
            a: 'Probarlo t&uacute; mismo.',
            b: 'Que se vea bonito o moderno.',
            c: 'Leer sus caracter&iacute;sticas.',
            d: 'Que el vendedor te explique.'
        }
    },
    {
        id: 7,
        prompt: 'No sabes c&oacute;mo se escribe una palabra. &iquest;Qu&eacute; haces?',
        options: {
            a: 'Pruebo escribir la palabra varias veces hasta que me suene correcta.',
            b: 'Pienso c&oacute;mo suena.',
            c: 'La busco en el diccionario.',
            d: 'Imagino c&oacute;mo se ve la palabra.'
        }
    },
    {
        id: 8,
        prompt: 'Te gustan las p&aacute;ginas de internet que tienen:',
        options: {
            a: 'Textos claros y explicaciones.',
            b: 'Dise&ntilde;os bonitos e im&aacute;genes.',
            c: 'Cosas interactivas para hacer clic.',
            d: 'M&uacute;sica o audios para escuchar.'
        }
    },
    {
        id: 9,
        prompt: 'Est&aacute;s organizando un viaje con tu familia. &iquest;C&oacute;mo les explicas el plan?',
        options: {
            a: 'Les muestro un mapa o im&aacute;genes.',
            b: 'Les cuento los lugares importantes.',
            c: 'Les doy el plan por escrito.',
            d: 'Hago un recorrido o ensayo del plan con ellos.'
        }
    },
    {
        id: 10,
        prompt: 'Est&aacute;s aprendiendo a usar una c&aacute;mara. &iquest;Qu&eacute; prefieres?',
        options: {
            a: 'Poder hacer preguntas.',
            b: 'Ver dibujos o partes de la c&aacute;mara.',
            c: 'Ver ejemplos de fotos buenas y malas.',
            d: 'Leer instrucciones claras paso a paso.'
        }
    },
    {
        id: 11,
        prompt: 'Quieres aprender un juego o programa nuevo. &iquest;Qu&eacute; haces?',
        options: {
            a: 'Pregunto a alguien que sepa.',
            b: 'Leo las instrucciones.',
            c: 'Sigo dibujos o esquemas.',
            d: 'Lo pruebo yo mismo.'
        }
    },
    {
        id: 12,
        prompt: 'Ayudas a alguien a llegar a su sal&oacute;n. &iquest;Qu&eacute; haces?',
        options: {
            a: 'Voy con la persona.',
            b: 'Escribo las instrucciones.',
            c: 'Le explico c&oacute;mo llegar.',
            d: 'Le hago un dibujo o mapa.'
        }
    },
    {
        id: 13,
        prompt: 'Piensa en algo nuevo que aprendiste. &iquest;C&oacute;mo aprendiste mejor?',
        options: {
            a: 'Viendo c&oacute;mo se hac&iacute;a.',
            b: 'Leyendo instrucciones.',
            c: 'Escuchando a alguien explicarlo.',
            d: 'Viendo dibujos o im&aacute;genes.'
        }
    },
    {
        id: 14,
        prompt: 'Prefieres un maestro que:',
        options: {
            a: 'Haga actividades o demostraciones.',
            b: 'Use libros o lecturas.',
            c: 'Use dibujos o gr&aacute;ficos.',
            d: 'Explique hablando y haga preguntas.'
        }
    },
    {
        id: 15,
        prompt: 'Unos amigos nuevos quieren conocer parques. &iquest;C&oacute;mo les ayudas?',
        options: {
            a: 'Los llevas al lugar.',
            b: 'Les das un folleto o libro.',
            c: 'Les explicas con palabras.',
            d: 'Les muestras fotos o im&aacute;genes.'
        }
    },
    {
        id: 16,
        prompt: 'Tienes que dar una exposici&oacute;n. &iquest;Qu&eacute; haces?',
        options: {
            a: 'Escribo todo y lo leo varias veces.',
            b: 'Uso ejemplos e historias.',
            c: 'Uso palabras clave y practico.',
            d: 'Hago dibujos o esquemas para explicar.'
        }
    }
];

const VARK_SCORING = {
    1: { a: 'A', b: 'V', c: 'R', d: 'K' },
    2: { a: 'A', b: 'V', c: 'R', d: 'K' },
    3: { a: 'A', b: 'K', c: 'R', d: 'V' },
    4: { a: 'R', b: 'K', c: 'V', d: 'A' },
    5: { a: 'K', b: 'R', c: 'A', d: 'V' },
    6: { a: 'K', b: 'V', c: 'R', d: 'A' },
    7: { a: 'K', b: 'A', c: 'R', d: 'V' },
    8: { a: 'R', b: 'V', c: 'K', d: 'A' },
    9: { a: 'V', b: 'A', c: 'R', d: 'K' },
    10: { a: 'A', b: 'V', c: 'K', d: 'R' },
    11: { a: 'A', b: 'R', c: 'V', d: 'K' },
    12: { a: 'K', b: 'R', c: 'A', d: 'V' },
    13: { a: 'K', b: 'R', c: 'A', d: 'V' },
    14: { a: 'K', b: 'R', c: 'V', d: 'A' },
    15: { a: 'K', b: 'R', c: 'A', d: 'V' },
    16: { a: 'R', b: 'K', c: 'A', d: 'V' }
};

const VARK_STYLE_META = {
    V: {
        label: 'Visual no verbal',
        platform: 'visual_no_verbal',
        description: 'Te gusta aprender con imagenes, dibujos, mapas y apoyos visuales.'
    },
    A: {
        label: 'Auditivo',
        platform: 'auditivo',
        description: 'Te gusta aprender escuchando, conversando y haciendo preguntas.'
    },
    R: {
        label: 'Visual verbal',
        platform: 'visual_verbal',
        description: 'Te gusta aprender leyendo, escribiendo y usando palabras clave.'
    },
    K: {
        label: 'Kinestesico',
        platform: 'kinestesico',
        description: 'Te gusta aprender practicando, probando y haciendo actividades.'
    }
};

const varkState = {
    started: false,
    currentIndex: 0,
    answers: {}
};

const submissionState = {
    saving: false,
    savedSignature: '',
    savedPayload: null,
    error: ''
};

function getAnsweredCount() {
    return Object.keys(varkState.answers).length;
}

function getCurrentQuestion() {
    return VARK_QUESTIONS[varkState.currentIndex];
}

function computeScores() {
    const totals = { V: 0, A: 0, R: 0, K: 0 };

    VARK_QUESTIONS.forEach((question) => {
        const answerKey = varkState.answers[question.id];
        if (!answerKey) {
            return;
        }

        const styleCode = VARK_SCORING[question.id][answerKey];
        if (styleCode && totals[styleCode] !== undefined) {
            totals[styleCode] += 1;
        }
    });

    return totals;
}

function classifyScores(totals) {
    const ranking = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const [topCode, topValue] = ranking[0];
    const [, secondValue] = ranking[1];
    const topCount = ranking.filter((entry) => entry[1] === topValue).length;

    if (topValue < 7) {
        return {
            valid: false,
            reason: 'puntaje_bajo',
            title: 'Todavia no salio un estilo claro',
            description: 'Tus respuestas quedaron muy repartidas. No pasa nada, despues podremos revisarlas otra vez con calma.'
        };
    }

    if (topCount > 1) {
        return {
            valid: false,
            reason: 'empate',
            title: 'Todavia no salio un estilo claro',
            description: 'Tus respuestas se parecieron mucho entre varios estilos. Esta vez no salio uno solo.'
        };
    }

    if (topValue - secondValue < 2) {
        return {
            valid: false,
            reason: 'diferencia_insuficiente',
            title: 'Todavia no salio un estilo claro',
            description: 'Dos estilos quedaron muy cerquita. Necesitamos una diferencia mas clara para elegir uno solo.'
        };
    }

    return {
        valid: true,
        reason: 'clasificable',
        code: topCode,
        title: `Tu estilo se parece mas a: ${VARK_STYLE_META[topCode].label}`,
        description: VARK_STYLE_META[topCode].description,
        platform: VARK_STYLE_META[topCode].platform
    };
}

function getAnswerSignature() {
    return JSON.stringify(
        VARK_QUESTIONS.map((question) => `${question.id}:${varkState.answers[question.id] || ''}`)
    );
}

function getFriendlyInvalidCopy(reason) {
    if (reason === 'puntaje_bajo') {
        return {
            title: 'Todavia no salio un estilo claro',
            description: 'Tus respuestas quedaron muy repartidas. No pasa nada, despues podremos revisarlas otra vez con calma.'
        };
    }

    if (reason === 'empate') {
        return {
            title: 'Todavia no salio un estilo claro',
            description: 'Tus respuestas se parecieron mucho entre varios estilos. Esta vez no salio uno solo.'
        };
    }

    return {
        title: 'Todavia no salio un estilo claro',
        description: 'Dos estilos quedaron muy cerquita. Necesitamos una diferencia mas clara para elegir uno solo.'
    };
}

function buildDisplayResult() {
    const localTotals = computeScores();
    const localResult = classifyScores(localTotals);
    const signature = getAnswerSignature();

    if (submissionState.savedPayload && submissionState.savedSignature === signature) {
        const serverResult = submissionState.savedPayload.resultado;
        const totals = submissionState.savedPayload.totales || localTotals;
        const successNote = serverResult.es_clasificable
            ? 'Tu resultado ya quedó guardado.'
            : 'Tus respuestas ya quedaron guardadas.';

        if (serverResult.es_clasificable) {
            return {
                totals,
                note: successNote,
                noteIsError: false,
                result: {
                    valid: true,
                    title: `Tu estilo se parece mas a: ${serverResult.estilo_label}`,
                    description: VARK_STYLE_META[serverResult.codigo_estilo]?.description || '',
                    badge: 'Resultado guardado'
                }
            };
        }

        const invalidCopy = getFriendlyInvalidCopy(serverResult.motivo_no_clasificable);
        return {
            totals,
            note: successNote,
            noteIsError: false,
            result: {
                valid: false,
                title: invalidCopy.title,
                description: invalidCopy.description,
                badge: 'Resultado guardado'
            }
        };
    }

    return {
        totals: localTotals,
        note: submissionState.error || '',
        noteIsError: Boolean(submissionState.error),
        result: {
            valid: localResult.valid,
            title: localResult.title,
            description: localResult.description,
            badge: localResult.valid ? 'Resultado listo' : 'Resultado no clasificado'
        }
    };
}

async function saveVarkResult() {
    const signature = getAnswerSignature();
    if (submissionState.savedSignature === signature && submissionState.savedPayload) {
        return submissionState.savedPayload;
    }

    submissionState.saving = true;
    submissionState.error = '';

    try {
        const response = await fetch('/api/vark/guardar', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ respuestas: varkState.answers })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || 'No se pudo guardar el resultado');
        }

        submissionState.savedSignature = signature;
        submissionState.savedPayload = data;
        return data;
    } catch (error) {
        console.error('saveVarkResult:', error);
        submissionState.error = 'No pudimos guardar tu resultado todavia, pero si pudimos mostrarlo en pantalla.';
        return null;
    } finally {
        submissionState.saving = false;
    }
}

function renderQuestionnaire() {
    const shell = document.getElementById('varkShell');
    if (!shell) {
        return;
    }

    const question = getCurrentQuestion();
    const selected = varkState.answers[question.id] || '';
    const answeredCount = getAnsweredCount();
    const progressPercent = ((varkState.currentIndex + 1) / VARK_QUESTIONS.length) * 100;
    const optionsMarkup = Object.entries(question.options).map(([key, text]) => `
        <button type="button" class="vark-option${selected === key ? ' is-selected' : ''}" data-option="${key}">
            <strong>${key.toUpperCase()})</strong> ${text}
        </button>
    `).join('');

    shell.innerHTML = `
        <div class="vark-shell-head">
            <span class="vark-shell-pill">Pregunta ${varkState.currentIndex + 1} de ${VARK_QUESTIONS.length}</span>
            <span class="vark-shell-pill">${answeredCount} respondidas</span>
        </div>
        <div class="vark-progress-meta">
            <span>Vas muy bien</span>
            <span>${VARK_QUESTIONS.length - answeredCount} por responder</span>
        </div>
        <div class="vark-progress-track">
            <div class="vark-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <article class="vark-question-card">
            <h2 class="vark-question-title">${question.id}. ${question.prompt}</h2>
            <div class="vark-option-list">${optionsMarkup}</div>
            <p class="vark-empty-note">Elige solo una opcion: la que mas se parezca a ti.</p>
        </article>
        <div class="vark-shell-foot">
            <button type="button" class="vark-link-btn" id="btnVarkPrev" ${varkState.currentIndex === 0 ? 'disabled' : ''}>Anterior</button>
            <button type="button" class="vark-nav-btn" id="btnVarkNext" ${selected ? '' : 'disabled'}>
                ${varkState.currentIndex === VARK_QUESTIONS.length - 1 ? 'Ver resultado' : 'Siguiente'}
            </button>
        </div>
    `;

    shell.querySelectorAll('.vark-option').forEach((button) => {
        button.addEventListener('click', () => {
            varkState.answers[question.id] = button.getAttribute('data-option');
            renderQuestionnaire();
        });
    });

    const prevBtn = document.getElementById('btnVarkPrev');
    const nextBtn = document.getElementById('btnVarkNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (varkState.currentIndex > 0) {
                varkState.currentIndex -= 1;
                renderQuestionnaire();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            if (!varkState.answers[question.id]) {
                return;
            }

            if (varkState.currentIndex === VARK_QUESTIONS.length - 1) {
                renderSavingResult();
                await saveVarkResult();
                renderResult();
                return;
            }

            varkState.currentIndex += 1;
            renderQuestionnaire();
        });
    }
}

function renderResult() {
    const shell = document.getElementById('varkShell');
    if (!shell) {
        return;
    }

    const display = buildDisplayResult();
    const { totals, result, note, noteIsError } = display;
    const scoreOrder = ['V', 'A', 'R', 'K'];
    const scoreMarkup = scoreOrder.map((code) => `
        <div class="vark-score-item">
            <strong>${code}</strong>
            <div class="vark-score-value">${totals[code]}</div>
            <div class="vark-score-name">${VARK_STYLE_META[code].label}</div>
        </div>
    `).join('');

    shell.innerHTML = `
        <div class="vark-shell-head">
            <span class="vark-shell-pill">Test terminado</span>
            <span class="vark-shell-pill">16 respuestas</span>
        </div>
        <article class="vark-result-card">
            <span class="vark-result-badge">${result.badge}</span>
            <h2>${result.title}</h2>
            <p>${result.description}</p>
            ${note ? `<div class="vark-result-note${noteIsError ? ' is-error' : ''}">${note}</div>` : ''}
        </article>
        <div class="vark-score-grid">${scoreMarkup}</div>
        <div class="vark-shell-foot">
            <button type="button" class="vark-link-btn" id="btnVarkReview">Revisar respuestas</button>
            <button type="button" class="vark-nav-btn" id="btnVarkBackHome">Volver a actividades</button>
        </div>
    `;

    const reviewBtn = document.getElementById('btnVarkReview');
    const backHomeBtn = document.getElementById('btnVarkBackHome');

    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            varkState.currentIndex = 0;
            renderQuestionnaire();
        });
    }

    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            window.location.href = 'inicio.html';
        });
    }
}

function renderSavingResult() {
    const shell = document.getElementById('varkShell');
    if (!shell) {
        return;
    }

    shell.innerHTML = `
        <div class="vark-shell-head">
            <span class="vark-shell-pill">Test terminado</span>
            <span class="vark-shell-pill">Guardando resultado</span>
        </div>
        <article class="vark-result-card">
            <span class="vark-result-badge">Un momento</span>
            <h2>Estamos guardando tu resultado</h2>
            <p>Espera tantito. Ya casi terminamos.</p>
        </article>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    if (path !== 'test-vark.html') {
        return;
    }

    const usuario = localStorage.getItem('usuario');
    const greeting = document.getElementById('varkGreeting');
    const startBtn = document.getElementById('btnVarkEmpezar');
    const shell = document.getElementById('varkShell');

    if (usuario && greeting) {
        greeting.textContent = `${usuario}, vamos a descubrir cómo te gusta aprender`;
    }

    if (typeof obtenerXP === 'function') {
        obtenerXP();
    }

    if (startBtn && shell) {
        startBtn.addEventListener('click', () => {
            varkState.started = true;
            shell.hidden = false;
            renderQuestionnaire();
            shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
