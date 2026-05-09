const natural = require('natural');

const MODEL_VERSION = 'bayes-monitor-v1.1';
const LABELS = ['avance', 'mantener', 'repaso', 'apoyo'];

let quizClassifier = null;
let reinforcementClassifier = null;

function addExample(modelo, label, tokens) {
  modelo.addDocument([...new Set(tokens)], label);
}

function trainQuizClassifier() {
  const modelo = new natural.BayesClassifier();

  // Rendimiento fuerte: puede asumir retos mayores si el flujo pedagógico lo permite.
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_excelente', 'errores_bajos', 'tiempo_rapido', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_excelente', 'errores_bajos', 'tiempo_rapido', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_alto', 'errores_bajos', 'tiempo_rapido', 'intento_uno', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_alto', 'errores_bajos', 'tiempo_medio', 'intento_uno', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_excelente', 'errores_bajos', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_matematicas']);
  addExample(modelo, 'avance', ['fuente_quiz', 'aprobado_si', 'puntaje_alto', 'errores_bajos', 'tiempo_rapido', 'intento_dos', 'nivel_dificil', 'area_geografia']);

  // Rendimiento aceptable: conviene mantener el mismo acompañamiento.
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_alto', 'errores_medios', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_bajos', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_medios', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_matematicas']);
  addExample(modelo, 'mantener', ['fuente_quiz', 'aprobado_si', 'puntaje_alto', 'errores_medios', 'tiempo_medio', 'intento_muchos', 'nivel_dificil', 'area_geografia']);

  // Cercano al logro, pero conviene reforzar antes de escalar.
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_medios', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_medios', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_medios', 'tiempo_lento', 'intento_muchos', 'nivel_dificil', 'area_matematicas']);
  addExample(modelo, 'repaso', ['fuente_quiz', 'aprobado_si', 'puntaje_medio', 'errores_medios', 'tiempo_lento', 'intento_muchos', 'nivel_dificil', 'area_geografia']);

  // Señal de que conviene apoyo adicional más explícito.
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_muy_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_muy_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_muy_bajo', 'errores_altos', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_matematicas']);
  addExample(modelo, 'apoyo', ['fuente_quiz', 'aprobado_no', 'puntaje_muy_bajo', 'errores_altos', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_geografia']);

  modelo.train();
  return modelo;
}

function trainReinforcementClassifier() {
  const modelo = new natural.BayesClassifier();

  // Sesiones cerradas con buen dominio del contenido.
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_rapido', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_rapido', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_medio', 'intento_uno', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_medio', 'intento_uno', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_bajos', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_geografia']);
  addExample(modelo, 'avance', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_bajos', 'tiempo_medio', 'intento_dos', 'nivel_dificil', 'area_matematicas']);

  // Sesiones correctas, pero todavía sin señales fuertes para escalar apoyo o dificultad.
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_medios', 'tiempo_medio', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_medios', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_medios', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_lento', 'intento_dos', 'nivel_dificil', 'area_geografia']);
  addExample(modelo, 'mantener', ['fuente_reforzamiento', 'cierre_quiz', 'completado_total', 'errores_bajos', 'tiempo_lento', 'intento_dos', 'nivel_dificil', 'area_matematicas']);

  // Sesiones donde logra parte del recorrido, pero conviene reforzar antes de seguir.
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_medios', 'tiempo_lento', 'intento_uno', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_medios', 'tiempo_lento', 'intento_uno', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_altos', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_alto', 'errores_altos', 'tiempo_lento', 'intento_dos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_medios', 'tiempo_lento', 'intento_muchos', 'nivel_dificil', 'area_geografia']);
  addExample(modelo, 'repaso', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_medios', 'tiempo_lento', 'intento_muchos', 'nivel_dificil', 'area_matematicas']);

  // Sesiones donde el alumno muestra clara necesidad de apoyo adicional.
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_facil', 'area_geografia']);
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_bajo', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_facil', 'area_matematicas']);
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_normal', 'area_geografia']);
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_parcial', 'errores_altos', 'tiempo_lento', 'intento_muchos', 'nivel_normal', 'area_matematicas']);
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_bajo', 'errores_altos', 'tiempo_lento', 'intento_dos', 'nivel_dificil', 'area_geografia']);
  addExample(modelo, 'apoyo', ['fuente_reforzamiento', 'cierre_quiz', 'completado_bajo', 'errores_altos', 'tiempo_lento', 'intento_dos', 'nivel_dificil', 'area_matematicas']);

  modelo.train();
  return modelo;
}

function getQuizClassifier() {
  if (!quizClassifier) {
    quizClassifier = trainQuizClassifier();
  }
  return quizClassifier;
}

function getReinforcementClassifier() {
  if (!reinforcementClassifier) {
    reinforcementClassifier = trainReinforcementClassifier();
  }
  return reinforcementClassifier;
}

function inferArea(contenidoId) {
  const id = Number(contenidoId);
  return id >= 1 && id <= 3 ? 'area_geografia' : 'area_matematicas';
}

function bucketScore(puntaje) {
  if (puntaje >= 90) return 'puntaje_excelente';
  if (puntaje >= 75) return 'puntaje_alto';
  if (puntaje >= 60) return 'puntaje_medio';
  if (puntaje >= 40) return 'puntaje_bajo';
  return 'puntaje_muy_bajo';
}

function bucketErrors(errores, totalPreguntas) {
  const total = Math.max(Number(totalPreguntas) || 0, 1);
  const ratio = errores / total;
  if (ratio <= 0.2) return 'errores_bajos';
  if (ratio <= 0.4) return 'errores_medios';
  return 'errores_altos';
}

function bucketTime(tiempoSegundos, totalPreguntas) {
  const total = Math.max(Number(totalPreguntas) || 0, 1);
  const porPregunta = tiempoSegundos / total;
  if (porPregunta <= 12) return 'tiempo_rapido';
  if (porPregunta <= 25) return 'tiempo_medio';
  return 'tiempo_lento';
}

function bucketAttempts(intento) {
  const valor = Math.max(Number(intento) || 1, 1);
  if (valor === 1) return 'intento_uno';
  if (valor === 2) return 'intento_dos';
  return 'intento_muchos';
}

function bucketReinforcementCompletion(apartadosCompletados, apartadosVisitados) {
  const visitados = Math.max(Number(apartadosVisitados) || 0, 0);
  const completados = Math.max(Number(apartadosCompletados) || 0, 0);

  if (visitados <= 0) return 'completado_bajo';

  const ratio = completados / visitados;
  if (ratio >= 1) return 'completado_total';
  if (ratio >= 0.75) return 'completado_alto';
  if (ratio >= 0.5) return 'completado_parcial';
  return 'completado_bajo';
}

function bucketReinforcementTime(tiempoSegundos, apartadosVisitados) {
  const total = Math.max(Number(apartadosVisitados) || 0, 1);
  const porApartado = Math.max(Number(tiempoSegundos) || 0, 0) / total;
  if (porApartado <= 20) return 'tiempo_rapido';
  if (porApartado <= 60) return 'tiempo_medio';
  return 'tiempo_lento';
}

function normalizeCloseEvent(eventoCierre) {
  const cleaned = String(eventoCierre || '').toLowerCase().trim();
  return cleaned ? `cierre_${cleaned}` : 'cierre_quiz';
}

function normalizeRanking(ranking) {
  const total = ranking.reduce((acc, item) => acc + Number(item.value || 0), 0);
  if (total <= 0) {
    return ranking.map((item) => ({
      label: item.label,
      probability: 0
    }));
  }

  return ranking.map((item) => ({
    label: item.label,
    probability: Number((Number(item.value || 0) / total).toFixed(6))
  }));
}

function findProbability(ranking, label) {
  const match = ranking.find((item) => item.label === label);
  return match ? match.probability : 0;
}

function buildQuizTokens(payload) {
  const totalPreguntas = Math.max(Number(payload.totalPreguntas) || 0, 1);
  const aciertos = Math.max(Number(payload.aciertos) || 0, 0);
  const errores = Number.isFinite(Number(payload.errores))
    ? Math.max(Number(payload.errores), 0)
    : Math.max(totalPreguntas - aciertos, 0);
  const puntaje = Number.isFinite(Number(payload.puntaje))
    ? Math.max(Number(payload.puntaje), 0)
    : Math.round((aciertos / totalPreguntas) * 100);
  const tiempoSegundos = Math.max(Number(payload.tiempoSegundos) || 0, 0);
  const aprobado = payload.aprobado === true || payload.aprobado === 'true';
  const nivel = String(payload.nivel || '').toLowerCase().trim() || 'nivel_desconocido';

  return [
    'fuente_quiz',
    inferArea(payload.contenidoId),
    `contenido_${payload.contenidoId}`,
    `nivel_${nivel}`,
    aprobado ? 'aprobado_si' : 'aprobado_no',
    bucketScore(puntaje),
    bucketErrors(errores, totalPreguntas),
    bucketTime(tiempoSegundos, totalPreguntas),
    bucketAttempts(payload.intento),
    aciertos >= totalPreguntas ? 'acierto_total' : 'acierto_parcial'
  ];
}

function classifyQuizPerformance(payload) {
  const tokens = buildQuizTokens(payload);
  const modelo = getQuizClassifier();
  const rawRanking = modelo.getClassifications(tokens);
  const ranking = normalizeRanking(rawRanking);
  const totalPreguntas = Math.max(Number(payload.totalPreguntas) || 0, 1);
  const aciertos = Math.max(Number(payload.aciertos) || 0, 0);
  const puntaje = Number.isFinite(Number(payload.puntaje))
    ? Math.max(Number(payload.puntaje), 0)
    : Math.round((aciertos / totalPreguntas) * 100);
  const aprobado = payload.aprobado === true || payload.aprobado === 'true';

  let selectedLabel = ranking[0]?.label || 'mantener';

  // Regla pedagógica: "avance" solo se muestra en un dominio realmente sobresaliente.
  // Un aprobado bueno, pero no excelente, se comunica como "mantener".
  if (aprobado) {
    if (aciertos >= totalPreguntas || puntaje >= 90) {
      selectedLabel = 'avance';
    } else {
      selectedLabel = 'mantener';
    }
  } else if (puntaje >= 40) {
    selectedLabel = 'repaso';
  } else {
    selectedLabel = 'apoyo';
  }

  const top = {
    label: selectedLabel,
    probability: findProbability(ranking, selectedLabel)
  };

  return {
    source: 'quiz',
    modelVersion: MODEL_VERSION,
    recommendation: top.label,
    confidence: top.probability,
    ranking,
    tokens
  };
}

function buildReinforcementTokens(payload) {
  const apartadosVisitados = Math.max(Number(payload.apartadosVisitados) || 0, 0);
  const apartadosCompletados = Math.max(Number(payload.apartadosCompletados) || 0, 0);
  const aciertos = Math.max(Number(payload.aciertos) || 0, 0);
  const errores = Math.max(Number(payload.errores) || 0, 0);
  const nivel = String(payload.nivel || '').toLowerCase().trim() || 'nivel_desconocido';

  return [
    'fuente_reforzamiento',
    inferArea(payload.contenidoId),
    `contenido_${payload.contenidoId}`,
    `nivel_${nivel}`,
    normalizeCloseEvent(payload.eventoCierre),
    bucketReinforcementCompletion(apartadosCompletados, apartadosVisitados),
    bucketErrors(errores, Math.max(aciertos + errores, 1)),
    bucketReinforcementTime(payload.tiempoSegundos, Math.max(apartadosVisitados, apartadosCompletados, 1)),
    bucketAttempts(payload.intento),
    apartadosCompletados >= apartadosVisitados && apartadosVisitados > 0 ? 'recorrido_completo' : 'recorrido_parcial'
  ];
}

function classifyReinforcementSession(payload) {
  const tokens = buildReinforcementTokens(payload);
  const modelo = getReinforcementClassifier();
  const rawRanking = modelo.getClassifications(tokens);
  const ranking = normalizeRanking(rawRanking);
  const top = ranking[0] || { label: 'mantener', probability: 0 };
  const contenidoId = Number(payload.contenidoId) || 0;
  const apartadosVisitados = Math.max(Number(payload.apartadosVisitados) || 0, 0);
  const apartadosCompletados = Math.max(Number(payload.apartadosCompletados) || 0, 0);
  const aciertos = Math.max(Number(payload.aciertos) || 0, 0);
  const errores = Math.max(Number(payload.errores) || 0, 0);
  const completionRatio =
    apartadosVisitados > 0 ? apartadosCompletados / apartadosVisitados : 0;
  const interactionTotal = Math.max(aciertos + errores, 1);
  const accuracyPercent = Math.round((aciertos / interactionTotal) * 100);

  let selectedLabel = top.label;

  // Regla especial para "seguir instrucciones espaciales":
  // el nivel gira alrededor de un solo reto grande, asi que aqui importa
  // mas la cantidad de errores dentro del recorrido que un porcentaje general.
  if (contenidoId === 7) {
    if (aciertos <= 0 && errores > 0) {
      selectedLabel = 'apoyo';
    } else if (errores === 0) {
      selectedLabel = 'avance';
    } else if (errores === 1) {
      selectedLabel = 'mantener';
    } else if (errores <= 3) {
      selectedLabel = 'repaso';
    } else {
      selectedLabel = 'apoyo';
    }
  } else if (contenidoId === 4 || contenidoId === 6) {
    if (accuracyPercent >= 90) {
      selectedLabel = 'avance';
    } else if (accuracyPercent >= 75) {
      selectedLabel = 'mantener';
    } else if (accuracyPercent >= 40) {
      selectedLabel = 'repaso';
    } else {
      selectedLabel = 'apoyo';
    }
  } else
  // Regla pedagógica para niveles:
  // usamos porcentaje de acierto y una guardia adicional de errores altos.
  // En niveles con muchas interacciones, 40% era demasiado permisivo para "apoyo".
  if (completionRatio < 0.75 && accuracyPercent < 60) {
    selectedLabel = 'apoyo';
  } else if (errores >= aciertos && errores > 0) {
    selectedLabel = 'apoyo';
  } else if (accuracyPercent >= 90) {
    selectedLabel = 'avance';
  } else if (accuracyPercent >= 75) {
    selectedLabel = 'mantener';
  } else if (accuracyPercent >= 55) {
    selectedLabel = 'repaso';
  } else {
    selectedLabel = 'apoyo';
  }

  const selectedProbability = findProbability(ranking, selectedLabel);

  return {
    source: 'reforzamiento',
    modelVersion: MODEL_VERSION,
    recommendation: selectedLabel,
    confidence: selectedProbability,
    ranking,
    tokens
  };
}

module.exports = {
  MODEL_VERSION,
  LABELS,
  classifyQuizPerformance,
  buildQuizTokens,
  classifyReinforcementSession,
  buildReinforcementTokens
};
