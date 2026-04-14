const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const app = express();
console.log('public:', path.join(__dirname, 'public'));

const config = require('./config');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'todoact',
    password: 'LeonHG15',
    port: 5433,
    client_encoding: 'UTF8'
});

async function ensurePuntuacionesSchema() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS puntuaciones (
            id SERIAL PRIMARY KEY,
            id_usuario INTEGER NOT NULL,
            id_actividad INTEGER,
            categoria VARCHAR(60),
            nivel VARCHAR(20),
            puntuacion INTEGER NOT NULL DEFAULT 0,
            tiempo INTEGER NOT NULL DEFAULT 0,
            errores INTEGER NOT NULL DEFAULT 0,
            estilo_mostrado VARCHAR(30),
            fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        )
    `);
}

async function ensureContentProgressSchema() {
    await client.query(`
        ALTER TABLE resultados_quiz
        ADD COLUMN IF NOT EXISTS errores INTEGER NOT NULL DEFAULT 0
    `);

    await client.query(`
        ALTER TABLE resultados_quiz
        ADD COLUMN IF NOT EXISTS tipo_resultado VARCHAR(20) NOT NULL DEFAULT 'quiz'
    `);

    await client.query(`
        ALTER TABLE resultados_quiz
        ADD COLUMN IF NOT EXISTS nivel_resultante VARCHAR(20)
    `);

    await client.query(`
        ALTER TABLE resultados_quiz
        ADD COLUMN IF NOT EXISTS session_uuid VARCHAR(64)
    `);

    await client.query(`
        UPDATE resultados_quiz
        SET tipo_resultado = 'quiz'
        WHERE tipo_resultado IS NULL OR TRIM(tipo_resultado) = ''
    `);

    await client.query(`
        UPDATE resultados_quiz
        SET nivel_resultante = nivel
        WHERE nivel_resultante IS NULL
          AND nivel IS NOT NULL
          AND nivel <> 'diagnostico'
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_quiz_usuario_contenido_tipo
        ON resultados_quiz (usuario, contenido_id, tipo_resultado)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_quiz_session_uuid
        ON resultados_quiz (session_uuid)
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS resultados_reforzamiento (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(50) NOT NULL,
            contenido_id INTEGER NOT NULL REFERENCES contenidos(id) ON DELETE CASCADE,
            nivel VARCHAR(20) NOT NULL,
            estilo VARCHAR(30) NOT NULL,
            pagina INTEGER NOT NULL,
            apartado_clave VARCHAR(100) NOT NULL,
            tipo_actividad VARCHAR(50) NOT NULL,
            aciertos INTEGER NOT NULL DEFAULT 0,
            errores INTEGER NOT NULL DEFAULT 0,
            intento INTEGER NOT NULL DEFAULT 1,
            completado BOOLEAN NOT NULL DEFAULT true,
            detalle_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await client.query(`
        ALTER TABLE resultados_reforzamiento
        ADD COLUMN IF NOT EXISTS session_uuid VARCHAR(64)
    `);

    await client.query(`
        ALTER TABLE resultados_reforzamiento
        DROP COLUMN IF EXISTS tiempo_total,
        DROP COLUMN IF EXISTS fecha_inicio,
        DROP COLUMN IF EXISTS fecha_fin
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_reforzamiento_usuario
        ON resultados_reforzamiento (usuario)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_reforzamiento_contenido
        ON resultados_reforzamiento (contenido_id)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_reforzamiento_apartado
        ON resultados_reforzamiento (usuario, contenido_id, nivel, estilo, apartado_clave)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_reforzamiento_session_uuid
        ON resultados_reforzamiento (session_uuid)
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS sesiones_reforzamiento (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(50) NOT NULL,
            contenido_id INTEGER NOT NULL REFERENCES contenidos(id) ON DELETE CASCADE,
            nivel VARCHAR(20) NOT NULL,
            estilo VARCHAR(30) NOT NULL,
            session_uuid VARCHAR(64),
            tiempo_total INTEGER NOT NULL DEFAULT 0,
            intento INTEGER NOT NULL DEFAULT 1,
            evento_cierre VARCHAR(30) NOT NULL DEFAULT 'quiz',
            fecha_inicio TIMESTAMP,
            fecha_fin TIMESTAMP,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await client.query(`
        ALTER TABLE sesiones_reforzamiento
        DROP COLUMN IF EXISTS aciertos_totales,
        DROP COLUMN IF EXISTS errores_totales,
        DROP COLUMN IF EXISTS apartados_totales,
        DROP COLUMN IF EXISTS apartados_completados,
        DROP COLUMN IF EXISTS detalle_json
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sesiones_reforzamiento_usuario
        ON sesiones_reforzamiento (usuario)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sesiones_reforzamiento_contenido
        ON sesiones_reforzamiento (contenido_id)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sesiones_reforzamiento_nivel_estilo
        ON sesiones_reforzamiento (usuario, contenido_id, nivel, estilo)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sesiones_reforzamiento_session_uuid
        ON sesiones_reforzamiento (session_uuid)
    `);
}

async function getUsuarioActual(usuario) {
    const result = await client.query(
        'SELECT id, estilo_aprendizaje FROM usuarios WHERE usuario = $1',
        [usuario]
    );

    return result.rows[0] || null;
}

function toUtcTimestampString(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString().slice(0, 19).replace('T', ' ');
}

function normalizeSessionUuid(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const cleaned = value.trim().slice(0, 64);
    if (!cleaned) {
        return null;
    }

    return /^[A-Za-z0-9-]{8,64}$/.test(cleaned) ? cleaned : null;
}

async function getNextContentAttempt(usuario, contenidoId, tipoResultado, nivel = null) {
    const params = [usuario, contenidoId, tipoResultado];
    let sql = `
        SELECT COALESCE(MAX(intento), 0) + 1 AS siguiente_intento
        FROM resultados_quiz
        WHERE usuario = $1
          AND contenido_id = $2
          AND tipo_resultado = $3
    `;

    if (nivel !== null) {
        sql += ' AND nivel = $4';
        params.push(nivel);
    }

    const result = await client.query(sql, params);
    return Number(result.rows[0]?.siguiente_intento || 1);
}

async function getNextReinforcementAttempt(usuario, contenidoId, nivel, estilo, apartadoClave) {
    const result = await client.query(`
        SELECT COALESCE(MAX(intento), 0) + 1 AS siguiente_intento
        FROM resultados_reforzamiento
        WHERE usuario = $1
          AND contenido_id = $2
          AND nivel = $3
          AND estilo = $4
          AND apartado_clave = $5
    `, [usuario, contenidoId, nivel, estilo, apartadoClave]);

    return Number(result.rows[0]?.siguiente_intento || 1);
}

async function getNextReinforcementSessionAttempt(usuario, contenidoId, nivel, estilo) {
    const result = await client.query(`
        SELECT COALESCE(MAX(intento), 0) + 1 AS siguiente_intento
        FROM sesiones_reforzamiento
        WHERE usuario = $1
          AND contenido_id = $2
          AND nivel = $3
          AND estilo = $4
    `, [usuario, contenidoId, nivel, estilo]);

    return Number(result.rows[0]?.siguiente_intento || 1);
}

client.connect()
    .then(async () => {
        console.log('Conexión exitosa a la base de datos');
        await client.query("SET client_encoding TO 'UTF8'");
        await ensurePuntuacionesSchema();
        await ensureContentProgressSchema();
    })
    .catch(err => console.error('Error al conectar a la base de datos', err));

app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    next();
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// ============================================
// =====  AUTENTICACIÃ“N Y USUARIOS  =====
// ============================================

app.post('/crearcuenta', async (req, res) => {
    const { usuario, nombrecompleto, fechanacimiento, genero } = req.body;
    const contrasena = req.body['contraseña'] ?? req.body.contrasena ?? req.body.password;

    try {
        const insertUsuario = await client.query(
            `INSERT INTO usuarios(usuario, contraseña, nombrecompleto, fechanacimiento, genero)
             VALUES($1, $2, $3, $4, $5) RETURNING id`,
            [usuario, contrasena, nombrecompleto, fechanacimiento, genero]
        );
        const id_usuario = insertUsuario.rows[0].id;

        const actividadesResult = await client.query('SELECT * FROM actividades');
        const actividades = actividadesResult.rows;

        for (const act of actividades) {
            if (act.actividad === 'Notas musicales') {
                await client.query(
                    `INSERT INTO niveles (id_usuario, id_actividad, categoria, nivel, desbloqueado)
                     VALUES ($1, $2, NULL, 1, true)`,
                    [id_usuario, act.id]
                );
                continue;
            }

            if (act.id !== 2 && act.id !== 5) {
                const listaNiv = (act.id === 1) ? [1, 2, 3, 4] : [1, 2, 3];
                for (const niv of listaNiv) {
                    await client.query(
                        `INSERT INTO niveles (id_usuario, id_actividad, categoria, nivel, desbloqueado)
                         VALUES ($1, $2, NULL, $3, $4)`,
                        [id_usuario, act.id, niv, niv === 1]
                    );
                }
            }

            else if (act.id === 2) {
                await client.query(
                    `INSERT INTO niveles (id_usuario, id_actividad, categoria, nivel, desbloqueado)
                     VALUES ($1, $2, $3, 1, true)`,
                    [id_usuario, act.id, 'frutas']
                );
            }

            else if (act.id === 5) {
                await client.query(
                    `INSERT INTO niveles (id_usuario, id_actividad, categoria, nivel, desbloqueado)
                     VALUES ($1, $2, $3, 1, true)`,
                    [id_usuario, act.id, 'animales']
                );
            }
        }

        res.status(200).json({ message: 'Cuenta creada exitosamente' });
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
});

app.post('/index', async (req, res) => {
    const { usuario } = req.body;
    const contrasena = req.body['contraseña'] ?? req.body.contrasena ?? req.body.password;

    try {
        const result = await client.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.contraseña === contrasena) {
                req.session.usuario = usuario;
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al verificar inicio de sesiÃ³n', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.get('/perfil', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const usuario = req.session.usuario;

    try {
        const result = await client.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.status(200).json({
                success: true,
                usuario: user.usuario,
                nombrecompleto: user.nombrecompleto,
                fechanacimiento: user.fechanacimiento,
                genero: user.genero,
                estilo_aprendizaje: user.estilo_aprendizaje
            });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesiÃ³n' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'SesiÃ³n cerrada' });
    });
});

app.post('/actualizar-estilo', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { estilo } = req.body;

    try {
        await client.query(
            'UPDATE usuarios SET estilo_aprendizaje = $1 WHERE usuario = $2',
            [estilo, req.session.usuario]
        );
        res.json({ ok: true });
    } catch (error) {
        console.error('Error al actualizar estilo:', error);
        res.status(500).json({ error: 'Error al actualizar estilo' });
    }
});

// ============================================
// =====  ENDPOINT PARA OBTENER ESTILO DEL USUARIO  =====
// ============================================

app.get('/api/usuario/estilo', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const result = await client.query(
            'SELECT estilo_aprendizaje FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );

        if (result.rows.length > 0) {
            res.json({
                success: true,
                estilo: result.rows[0].estilo_aprendizaje
            });
        } else {
            res.json({ success: false, error: 'Usuario no encontrado' });
        }
    } catch (e) {
        console.error('Error al obtener estilo:', e);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ============================================
// =====  ENDPOINTS GENÃ‰RICOS PARA CONTENIDOS  =====
// ============================================

/**
 * Obtiene informaciÃ³n de un contenido por Ã¡rea y slug
 * GET /api/contenido/:area/:slug
 */
app.get('/api/contenido/:area/:slug', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { area, slug } = req.params;
    const usuario = req.session.usuario;

    try {
        const cont = await client.query(`
            SELECT id, nombre
            FROM contenidos
            WHERE slug = $1 AND area = $2 AND activo = true
        `, [slug, area]);

        if (!cont.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const contenidoId = cont.rows[0].id;

        const niveles = await client.query(`
            SELECT nivel
            FROM niveles_contenido
            WHERE contenido_id = $1
            ORDER BY nivel
        `, [contenidoId]);

        const progreso = await client.query(`
            SELECT diagnostico_realizado, nivel_asignado, contenido_completado
            FROM progreso_contenido_usuario
            WHERE usuario = $1 AND contenido_id = $2
        `, [usuario, contenidoId]);

        res.json({
            contenido_id: contenidoId,
            nombre: cont.rows[0].nombre,
            niveles: niveles.rows.map(n => n.nivel),
            diagnostico_realizado: progreso.rows[0]?.diagnostico_realizado || false,
            nivel_asignado: progreso.rows[0]?.nivel_asignado || null,
            contenido_completado: progreso.rows[0]?.contenido_completado || false
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * Obtiene la ruta del archivo HTML para un contenido, nivel y el estilo del usuario
 * GET /api/contenido/archivo/:slug/:nivel
 */
app.get('/api/contenido/archivo/:slug/:nivel', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { slug, nivel } = req.params;
    const usuario = req.session.usuario;

    try {
        const user = await client.query(`
            SELECT estilo_aprendizaje
            FROM usuarios
            WHERE usuario = $1
        `, [usuario]);

        if (!user.rows.length) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const estilo = user.rows[0].estilo_aprendizaje;
        if (!estilo) {
            return res.status(400).json({ error: 'Usuario sin estilo asignado' });
        }

        const cont = await client.query(`
            SELECT id
            FROM contenidos
            WHERE slug = $1 AND activo = true
        `, [slug]);

        if (!cont.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const contenidoId = cont.rows[0].id;

        const archivo = await client.query(`
            SELECT archivo
            FROM contenidos_archivos
            WHERE contenido_id = $1
              AND nivel = $2
              AND estilo = $3
        `, [contenidoId, nivel, estilo]);

        if (!archivo.rows.length) {
            return res.status(404).json({ error: 'Archivo no registrado para este nivel y estilo' });
        }

        res.json({
            archivo: archivo.rows[0].archivo,
            estilo
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ============================================
// =====  ENDPOINTS PARA DIAGNÃ“STICO  =====
// ============================================

/**
 * Obtiene las preguntas de diagnÃ³stico para un contenido
 * GET /api/diagnostico/:contenidoId
 */
app.get('/api/diagnostico/:contenidoId', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { contenidoId } = req.params;

    try {
        const examen = await client.query(
            `SELECT id 
             FROM examenes_diagnostico 
             WHERE contenido_id = $1 
             AND activo = true 
             LIMIT 1`,
            [contenidoId]
        );

        if (examen.rows.length === 0) {
            return res
                .status(200)
                .type('application/json; charset=utf-8')
                .send(JSON.stringify([]));
        }

        const preguntas = await client.query(
            `SELECT id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta
             FROM preguntas_diagnostico
             WHERE examen_id = $1`,
            [examen.rows[0].id]
        );

        res
            .status(200)
            .type('application/json; charset=utf-8')
            .send(JSON.stringify(preguntas.rows));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al obtener diagnÃ³stico' });
    }
});

/**
 * Guarda los resultados del diagnÃ³stico y asigna nivel
 * POST /api/diagnostico/guardar
 */
app.post('/api/diagnostico/guardar', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { contenido_id, respuestas, tiempo_segundos, fecha_inicio } = req.body;
    const usuario = req.session.usuario;

    if (!contenido_id || !respuestas || typeof respuestas !== 'object') {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        // 1. Obtener el examen activo del contenido
        const examen = await client.query(`
            SELECT id FROM examenes_diagnostico
            WHERE contenido_id = $1 AND activo = true
            LIMIT 1
        `, [contenido_id]);

        if (!examen.rows.length) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        const examen_id = examen.rows[0].id;

        // 2. Obtener las respuestas correctas de la BD
        const preguntas = await client.query(`
            SELECT id, respuesta_correcta
            FROM preguntas_diagnostico
            WHERE examen_id = $1
        `, [examen_id]);

        // 3. Calcular cuÃ¡ntas correctas tuvo
        let correctas = 0;
        for (const pregunta of preguntas.rows) {
            const respuestaUsuario = respuestas[pregunta.id];
            if (respuestaUsuario &&
                respuestaUsuario.toUpperCase() === pregunta.respuesta_correcta.toUpperCase()) {
                correctas++;
            }
        }

        const total = preguntas.rows.length;
        const puntaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

        // 4. Asignar nivel segÃºn reglas del sistema
        let nivel_asignado;
        if (correctas <= 4) {
            nivel_asignado = 'facil';
        } else if (correctas <= 8) {
            nivel_asignado = 'normal';
        } else {
            nivel_asignado = 'dificil';
        }

        // 5. Guardar cada respuesta individual para anÃ¡lisis
        for (const pregunta of preguntas.rows) {
            const respuestaUsuario = respuestas[pregunta.id];
            if (!respuestaUsuario) continue;

            const esCorrecta = respuestaUsuario.toUpperCase() === pregunta.respuesta_correcta.toUpperCase();

            await client.query(`
                INSERT INTO respuestas_diagnostico
                    (usuario, contenido_id, pregunta_id, respuesta_dada, es_correcta, fecha)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            `, [usuario, contenido_id, pregunta.id, respuestaUsuario.toUpperCase(), esCorrecta]);
        }

        // 6. Guardar nivel asignado en progreso_contenido_usuario
        await client.query(`
            INSERT INTO progreso_contenido_usuario
                (usuario, contenido_id, diagnostico_realizado, nivel_asignado, contenido_completado, fecha, tiempo_total_diagnostico, fecha_inicio_diagnostico, fecha_fin_diagnostico)
            VALUES ($1, $2, true, $3, false, CURRENT_TIMESTAMP, $4, $5, CURRENT_TIMESTAMP)
            ON CONFLICT (usuario, contenido_id)
            DO UPDATE SET
                diagnostico_realizado = true,
                nivel_asignado        = $3,
                tiempo_total_diagnostico = $4,
                fecha_inicio_diagnostico = $5,
                fecha_fin_diagnostico = CURRENT_TIMESTAMP
        `, [usuario, contenido_id, nivel_asignado, tiempo_segundos || 0, fecha_inicio]);

        // 7. Guardar puntaje general en puntuaciones
        await client.query(`
            INSERT INTO puntuaciones
                (id_usuario, id_actividad, categoria, nivel, puntuacion, tiempo, errores, estilo_mostrado)
            SELECT
                u.id,
                $2,
                'diagnostico',
                0,
                $3,
                $4,
                $5,
                u.estilo_aprendizaje
            FROM usuarios u
            WHERE u.usuario = $1
        `, [usuario, contenido_id, puntaje, tiempo_segundos || 0, total - correctas]);

        res.json({
            success: true,
            correctas,
            total,
            puntaje,
            nivel_asignado,
            mensaje: `Obtuviste ${correctas}/${total}. Tu nivel asignado es: ${nivel_asignado}.`
        });

    } catch (e) {
        console.error('Error en /api/diagnostico/guardar:', e);
        res.status(500).json({ error: 'Error al guardar diagnÃ³stico' });
    }
});

// ============================================
// =====  ENDPOINTS PARA PROGRESO DE CONTENIDOS  =====
// ============================================

/**
 * Guarda el progreso al completar un nivel (mini-quiz)
 * POST /api/progreso/nivel
 */
app.post('/api/progreso/nivel', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const {
        contenido_id,
        nivel_completado,
        puntaje,
        aprobado,
        tiempo_segundos,
        aciertos,
        total_preguntas,
        fecha_inicio,
        errores,
        session_uuid
    } = req.body;
    const usuario = req.session.usuario;

    if (!contenido_id || !nivel_completado || puntaje === undefined) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const puntajeFinal = Number.isFinite(Number(puntaje)) ? Number(puntaje) : 0;
    const tiempoFinal = Number.isFinite(Number(tiempo_segundos)) ? Number(tiempo_segundos) : 0;
    const aciertosFinales = Number.isFinite(Number(aciertos)) ? Number(aciertos) : 0;
    const erroresFinales = Number.isFinite(Number(errores))
        ? Math.max(0, Number(errores))
        : Math.max(Number(total_preguntas || 0) - aciertosFinales, 0);
    const totalPreguntasFinal = Number.isFinite(Number(total_preguntas))
        ? Number(total_preguntas)
        : Math.max(aciertosFinales + erroresFinales, 0);
    const aprobadoFinal = aprobado === true || aprobado === 'true';
    const fechaInicioNormalizada = toUtcTimestampString(fecha_inicio);
    const sessionUuidNormalizada = normalizeSessionUuid(session_uuid);

    const siguienteNivel = {
        'facil': 'normal',
        'normal': 'dificil',
        'dificil':  null
    };

    try {
        const usuarioActual = await getUsuarioActual(usuario);
        if (!usuarioActual) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const cont = await client.query(`
            SELECT id FROM contenidos
            WHERE id = $1 AND activo = true
        `, [contenido_id]);

        if (!cont.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const progresoActual = await client.query(`
            SELECT nivel_asignado FROM progreso_contenido_usuario
            WHERE usuario = $1 AND contenido_id = $2
        `, [usuario, contenido_id]);

        const nivelActual = progresoActual.rows[0]?.nivel_asignado;
        const nivelSiguiente = siguienteNivel[nivel_completado];
        const ordenNiveles = { 'facil': 1, 'normal': 2, 'dificil': 3 };
        const nivelNuevo = aprobadoFinal && nivelSiguiente
            ? (ordenNiveles[nivelSiguiente] > (ordenNiveles[nivelActual] || 0)
                ? nivelSiguiente
                : nivelActual)
            : nivelActual;
        const nivelResultante = nivelNuevo || nivel_completado;
        const estaCompletado = aprobadoFinal && nivelSiguiente === null;

        await client.query('BEGIN');

        await client.query(`
            INSERT INTO progreso_contenido_usuario
                (usuario, contenido_id, diagnostico_realizado, nivel_asignado, contenido_completado, fecha)
            VALUES ($1, $2, true, $3, $4, TIMEZONE('UTC', CURRENT_TIMESTAMP))
            ON CONFLICT (usuario, contenido_id)
            DO UPDATE SET
                nivel_asignado       = $3,
                contenido_completado = CASE
                    WHEN $4 = true THEN true
                    ELSE progreso_contenido_usuario.contenido_completado
                END,
                fecha = TIMEZONE('UTC', CURRENT_TIMESTAMP)
        `, [usuario, contenido_id, nivelResultante, estaCompletado]);

        await client.query(`
            INSERT INTO puntuaciones
                (id_usuario, id_actividad, categoria, nivel, puntuacion, tiempo, errores, estilo_mostrado)
            SELECT
                u.id,
                $2,
                $3,
                CASE $4
                    WHEN 'facil'   THEN 1
                    WHEN 'normal'  THEN 2
                    WHEN 'dificil' THEN 3
                    ELSE 1
                END,
                $5,
                $6,
                $7,
                u.estilo_aprendizaje
            FROM usuarios u
            WHERE u.usuario = $1
        `, [usuario, contenido_id, nivel_completado, nivel_completado, puntajeFinal, tiempoFinal, erroresFinales]);

        const siguienteIntento = await getNextContentAttempt(usuario, contenido_id, 'quiz', nivel_completado);
        await client.query(`
            INSERT INTO resultados_quiz
                (usuario, contenido_id, nivel, estilo, aciertos, total_preguntas, puntaje, tiempo_total, intento, aprobado, errores, fecha_inicio, fecha_fin, tipo_resultado, nivel_resultante, session_uuid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TIMEZONE('UTC', CURRENT_TIMESTAMP), 'quiz', $13, $14)
        `, [
            usuario,
            contenido_id,
            nivel_completado,
            usuarioActual.estilo_aprendizaje || 'visual_verbal',
            aciertosFinales,
            totalPreguntasFinal,
            puntajeFinal,
            tiempoFinal,
            siguienteIntento,
            aprobadoFinal,
            erroresFinales,
            fechaInicioNormalizada,
            nivelResultante,
            sessionUuidNormalizada
        ]);

        await client.query('COMMIT');

        res.json({
            success: true,
            aprobado: aprobadoFinal,
            nivel_completado,
            nivel_siguiente: aprobadoFinal ? nivelSiguiente : null,
            mensaje: aprobadoFinal
                ? nivelSiguiente
                    ? `Â¡Aprobaste! Nivel "${nivelSiguiente}" desbloqueado.`
                    : 'Â¡Completaste todos los niveles del mÃ³dulo!'
                : 'No aprobaste. Repasa el contenido e intenta de nuevo.'
        });

    } catch (e) {
        try { await client.query('ROLLBACK'); } catch (_) {}
        console.error('Error en /api/progreso/nivel:', e);
        res.status(500).json({ error: 'Error al guardar progreso' });
    }
});

app.post('/api/reforzamiento/guardar', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const {
        contenido_id,
        nivel,
        estilo,
        pagina,
        apartado_clave,
        tipo_actividad,
        aciertos,
        errores,
        completado,
        detalle,
        session_uuid
    } = req.body;

    const usuario = req.session.usuario;

    if (!contenido_id || !nivel || !estilo || !pagina || !apartado_clave || !tipo_actividad) {
        return res.status(400).json({ error: 'Faltan campos requeridos del reforzamiento' });
    }

    const paginaFinal = Number.isFinite(Number(pagina)) ? Number(pagina) : 0;
    if (paginaFinal <= 0) {
        return res.status(400).json({ error: 'Pagina invalida' });
    }

    const aciertosFinales = Number.isFinite(Number(aciertos)) ? Math.max(0, Number(aciertos)) : 0;
    const erroresFinales = Number.isFinite(Number(errores)) ? Math.max(0, Number(errores)) : 0;
    const completadoFinal = completado !== false && completado !== 'false';
    const sessionUuidNormalizada = normalizeSessionUuid(session_uuid);
    const detalleNormalizado =
        detalle && typeof detalle === 'object' && !Array.isArray(detalle)
            ? detalle
            : {};

    try {
        const contenido = await client.query(`
            SELECT id
            FROM contenidos
            WHERE id = $1 AND activo = true
        `, [contenido_id]);

        if (!contenido.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const siguienteIntento = await getNextReinforcementAttempt(
            usuario,
            contenido_id,
            nivel,
            estilo,
            apartado_clave
        );

        const insert = await client.query(`
            INSERT INTO resultados_reforzamiento
                (usuario, contenido_id, nivel, estilo, pagina, apartado_clave, tipo_actividad, aciertos, errores, intento, completado, detalle_json, session_uuid)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13)
            RETURNING id, intento, fecha
        `, [
            usuario,
            contenido_id,
            nivel,
            estilo,
            paginaFinal,
            apartado_clave,
            tipo_actividad,
            aciertosFinales,
            erroresFinales,
            siguienteIntento,
            completadoFinal,
            JSON.stringify(detalleNormalizado),
            sessionUuidNormalizada
        ]);

        res.json({
            success: true,
            resultado_id: insert.rows[0]?.id || null,
            intento: insert.rows[0]?.intento || siguienteIntento,
            fecha: insert.rows[0]?.fecha || null
        });
    } catch (e) {
        console.error('Error en /api/reforzamiento/guardar:', e);
        res.status(500).json({ error: 'Error al guardar reforzamiento' });
    }
});

app.post('/api/reforzamiento/sesion', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const {
        contenido_id,
        nivel,
        estilo,
        tiempo_segundos,
        fecha_inicio,
        fecha_fin,
        evento_cierre,
        session_uuid
    } = req.body;

    const usuario = req.session.usuario;

    if (!contenido_id || !nivel || !estilo) {
        return res.status(400).json({ error: 'Faltan campos requeridos de la sesion de reforzamiento' });
    }

    const tiempoFinal = Number.isFinite(Number(tiempo_segundos)) ? Math.max(0, Number(tiempo_segundos)) : 0;
    const eventoFinal =
        typeof evento_cierre === 'string' && evento_cierre.trim()
            ? evento_cierre.trim().slice(0, 30)
            : 'quiz';
    const fechaInicioNormalizada = toUtcTimestampString(fecha_inicio);
    const fechaFinNormalizada = toUtcTimestampString(fecha_fin);
    const sessionUuidNormalizada = normalizeSessionUuid(session_uuid);

    try {
        const contenido = await client.query(`
            SELECT id
            FROM contenidos
            WHERE id = $1 AND activo = true
        `, [contenido_id]);

        if (!contenido.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        const siguienteIntento = await getNextReinforcementSessionAttempt(
            usuario,
            contenido_id,
            nivel,
            estilo
        );

        const insert = await client.query(`
            INSERT INTO sesiones_reforzamiento
                (usuario, contenido_id, nivel, estilo, session_uuid, tiempo_total, intento, evento_cierre, fecha_inicio, fecha_fin)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, TIMEZONE('UTC', CURRENT_TIMESTAMP)))
            RETURNING id, intento, fecha
        `, [
            usuario,
            contenido_id,
            nivel,
            estilo,
            sessionUuidNormalizada,
            tiempoFinal,
            siguienteIntento,
            eventoFinal,
            fechaInicioNormalizada,
            fechaFinNormalizada
        ]);

        res.json({
            success: true,
            sesion_id: insert.rows[0]?.id || null,
            intento: insert.rows[0]?.intento || siguienteIntento,
            fecha: insert.rows[0]?.fecha || null
        });
    } catch (e) {
        console.error('Error en /api/reforzamiento/sesion:', e);
        res.status(500).json({ error: 'Error al guardar la sesion de reforzamiento' });
    }
});

/**
 * Obtiene el progreso de un usuario para un contenido especÃ­fico
 * GET /api/progreso/contenido/:contenidoId
 */
app.get('/api/progreso/contenido/:contenidoId', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { contenidoId } = req.params;
    const usuario = req.session.usuario;

    try {
        const progreso = await client.query(`
            SELECT diagnostico_realizado, nivel_asignado, contenido_completado, fecha
            FROM progreso_contenido_usuario
            WHERE usuario = $1 AND contenido_id = $2
        `, [usuario, contenidoId]);

        if (!progreso.rows.length) {
            return res.json({
                success: true,
                diagnostico_realizado: false,
                nivel_asignado: null,
                contenido_completado: false,
                niveles_desbloqueados: []
            });
        }

        const p = progreso.rows[0];

        const todosLosNiveles = ['facil', 'normal', 'dificil'];
        const idxActual = todosLosNiveles.indexOf(p.nivel_asignado);
        const nivelesDesbloqueados = idxActual >= 0
            ? todosLosNiveles.slice(0, idxActual + 1)
            : [];

        res.json({
            success: true,
            diagnostico_realizado: p.diagnostico_realizado,
            nivel_asignado: p.nivel_asignado,
            contenido_completado: p.contenido_completado,
            niveles_desbloqueados: nivelesDesbloqueados
        });

    } catch (e) {
        console.error('Error en /api/progreso/contenido:', e);
        res.status(500).json({ error: 'Error al consultar progreso' });
    }
});

// ============================================
// =====  ENDPOINTS PARA NIVELES Y XP  =====
// ============================================

app.get('/niveles-desbloqueados', async (req, res) => {
    try {
        if (!req.session?.usuario) {
            return res.json({ success: true, xp: 0 });
        }

        const { rows: uRows } = await client.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );
        if (!uRows.length) {
            return res.status(401).json({ success: false, message: 'SesiÃ³n invÃ¡lida' });
        }
        const id_usuario = uRows[0].id;

        const id_actividad = parseInt(req.query.id_actividad, 10);
        const categoria = req.query.categoria ?? null;

        if (Number.isNaN(id_actividad)) {
            return res.status(400).json({ success: false, message: 'id_actividad invÃ¡lido' });
        }

        let sql = `
            SELECT nivel
            FROM niveles
            WHERE id_usuario   = $1
              AND id_actividad = $2
              AND desbloqueado = true`;
        const params = [id_usuario, id_actividad];

        if (categoria && categoria !== '') {
            sql += ' AND categoria = $3';
            params.push(categoria);
        } else {
            sql += ' AND categoria IS NULL';
        }

        const { rows } = await client.query(sql, params);
        const niveles = rows.map(r => r.nivel).sort((a, b) => a - b);

        res.json({ success: true, niveles });
    } catch (err) {
        console.error('niveles-desbloqueados:', err);
        res.status(500).json({ success: false, message: 'Error al obtener niveles desbloqueados' });
    }
});

app.post('/desbloquear-nivel', async (req, res) => {
    const { id_actividad, categoria = null, nivel } = req.body;
    const nivelNum = parseInt(nivel, 10);

    try {
        if (!req.session?.usuario) {
            return res.json({ success: true, xp: 0 });
        }

        const u = await client.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );
        if (!u.rows.length) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }
        const id_usuario = u.rows[0].id;

        const upd = await client.query(
            `UPDATE niveles
                SET desbloqueado = true
              WHERE id_usuario   = $1
                AND id_actividad = $2
                AND nivel        = $3
                AND (categoria IS NOT DISTINCT FROM $4)`,
            [id_usuario, id_actividad, nivelNum, categoria]
        );

        if (upd.rowCount === 0) {
            await client.query(
                `INSERT INTO niveles (id_usuario, id_actividad, categoria, nivel, desbloqueado)
                VALUES ($1, $2, $3, $4, true)`,
                [id_usuario, id_actividad, categoria, nivelNum]
            );
        }

        res.json({ success: true, nivel: nivelNum });
    } catch (err) {
        console.error('desbloquear-nivel:', err);
        res.status(500).json({ success: false, message: 'Error al desbloquear nivel' });
    }
});

app.post('/guardar-progreso', async (req, res) => {
    const {
        id_actividad,
        categoria = null,
        dificultad,
        puntuacion,
        tiempoFinalizacion,
        erroresCometidos,
        estilo_mostrado
    } = req.body;

    const nivelNum = parseInt(dificultad, 10);
    const puntuacionNum = parseInt(puntuacion, 10);
    const tiempoNum = parseInt(tiempoFinalizacion, 10);
    const erroresNum = parseInt(erroresCometidos, 10);

    try {
        if (!req.session?.usuario) {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        const usrRes = await client.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );
        if (!usrRes.rows.length) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }
        const id_usuario = usrRes.rows[0].id;

        const actRes = await client.query(
            'SELECT id FROM actividades WHERE id = $1',
            [id_actividad]
        );
        if (!actRes.rows.length) {
            return res.status(400).json({ success: false, message: 'Actividad no encontrada' });
        }

        const insertSql = `
            INSERT INTO puntuaciones
                (id_usuario, id_actividad, categoria,
                 nivel, puntuacion, tiempo, errores, estilo_mostrado)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING id
        `;
        const params = [
            id_usuario,
            id_actividad,
            categoria,
            nivelNum,
            puntuacionNum,
            tiempoNum,
            erroresNum,
            estilo_mostrado
        ];
        const { rows } = await client.query(insertSql, params);

        res.status(200).json({ success: true, id: rows[0].id });
    } catch (error) {
        console.error('Error al guardar progreso:', error);
        res.status(500).json({ success: false, message: 'Error al guardar progreso' });
    }
});

app.get('/xp-total', async (req, res) => {
    try {
        if (!req.session?.usuario) {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        const u = await client.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );
        if (!u.rows.length) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = u.rows[0].id;

        const { rows } = await client.query(
            'SELECT COALESCE(SUM(puntuacion),0) AS xp FROM puntuaciones WHERE id_usuario = $1',
            [id_usuario]
        );

        res.json({ success: true, xp: rows[0].xp });
    } catch (err) {
        if (err && (err.code === '42P01' || /puntuaciones/i.test(err.message || ''))) {
            try {
                await ensurePuntuacionesSchema();
            } catch {}
            return res.json({ success: true, xp: 0 });
        }
        console.error('xp-total:', err);
        res.status(500).json({ success: false, message: 'Error al obtener XP' });
    }
});

app.listen(config.port, config.host, () => {
    console.log(`âš¡ï¸ Servidor funcionando en http://0.0.0.0:${config.port}`);
});
