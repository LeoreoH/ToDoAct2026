const QUESTION_IDS = Array.from({ length: 16 }, (_, index) => index + 1);
const VALID_OPTIONS = new Set(['a', 'b', 'c', 'd']);

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

const STYLE_META = {
    V: {
        label: 'Visual no verbal',
        platform: 'visual_no_verbal'
    },
    A: {
        label: 'Auditivo',
        platform: 'auditivo'
    },
    R: {
        label: 'Visual verbal',
        platform: 'visual_verbal'
    },
    K: {
        label: 'Kinestesico',
        platform: 'kinestesico'
    }
};

function normalizeAnswers(rawAnswers) {
    if (!rawAnswers || typeof rawAnswers !== 'object' || Array.isArray(rawAnswers)) {
        return null;
    }

    const normalized = {};
    for (const questionId of QUESTION_IDS) {
        const rawValue = rawAnswers[questionId] ?? rawAnswers[String(questionId)] ?? rawAnswers[`q${questionId}`];
        if (typeof rawValue !== 'string') {
            return null;
        }

        const cleaned = rawValue.trim().toLowerCase();
        if (!VALID_OPTIONS.has(cleaned)) {
            return null;
        }

        normalized[questionId] = cleaned;
    }

    return normalized;
}

function computeTotals(answers) {
    const totals = { V: 0, A: 0, R: 0, K: 0 };

    for (const questionId of QUESTION_IDS) {
        const answer = answers[questionId];
        const styleCode = VARK_SCORING[questionId]?.[answer];
        if (styleCode && totals[styleCode] !== undefined) {
            totals[styleCode] += 1;
        }
    }

    return totals;
}

function classifyTotals(totals) {
    const ranking = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const [topCode, topValue] = ranking[0];
    const [, secondValue] = ranking[1];
    const tiedTopCount = ranking.filter((entry) => entry[1] === topValue).length;

    if (topValue < 7) {
        return {
            valid: false,
            reason: 'puntaje_bajo',
            code: null,
            styleLabel: null,
            platformStyle: null
        };
    }

    if (tiedTopCount > 1) {
        return {
            valid: false,
            reason: 'empate',
            code: null,
            styleLabel: null,
            platformStyle: null
        };
    }

    if (topValue - secondValue < 2) {
        return {
            valid: false,
            reason: 'diferencia_insuficiente',
            code: null,
            styleLabel: null,
            platformStyle: null
        };
    }

    return {
        valid: true,
        reason: 'clasificable',
        code: topCode,
        styleLabel: STYLE_META[topCode].label,
        platformStyle: STYLE_META[topCode].platform
    };
}

function evaluateVarkAnswers(rawAnswers) {
    const answers = normalizeAnswers(rawAnswers);
    if (!answers) {
        throw new Error('Respuestas VARK invalidas');
    }

    const totals = computeTotals(answers);
    const classification = classifyTotals(totals);

    return {
        answers,
        totals,
        classification
    };
}

module.exports = {
    QUESTION_IDS,
    STYLE_META,
    evaluateVarkAnswers
};
