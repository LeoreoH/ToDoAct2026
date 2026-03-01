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

client.connect()
    .then(async () => {
        console.log('Conexión exitosa a la base de datos');
        await client.query("SET client_encoding TO 'UTF8'");
    })
    .catch(err => console.error('Error al conectar a la base de datos', err));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
}));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// ============================================
// =====  AUTENTICACIÓN Y USUARIOS  =====
// ============================================

app.post('/crearcuenta', async (req, res) => {
    const { usuario, contraseña, nombrecompleto, fechanacimiento, genero } = req.body;

    try {
        const insertUsuario = await client.query(
            `INSERT INTO usuarios(usuario, contraseña, nombrecompleto, fechanacimiento, genero)
             VALUES($1, $2, $3, $4, $5) RETURNING id`,
            [usuario, contraseña, nombrecompleto, fechanacimiento, genero]
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
    const { usuario, contraseña } = req.body;

    try {
        const result = await client.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.contraseña === contraseña) {
                req.session.usuario = usuario;
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al verificar inicio de sesión', error);
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
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Sesión cerrada' });
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
// =====  ENDPOINTS GENÉRICOS PARA CONTENIDOS  =====
// ============================================

/**
 * Obtiene información de un contenido por área y slug
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
// =====  ENDPOINTS PARA DIAGNÓSTICO  =====
// ============================================

/**
 * Obtiene las preguntas de diagnóstico para un contenido
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
        res.status(500).json({ error: 'Error al obtener diagnóstico' });
    }
});

/**
 * Guarda los resultados del diagnóstico y asigna nivel
 * POST /api/diagnostico/guardar
 */
app.post('/api/diagnostico/guardar', async (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { contenido_id, respuestas, tiempo_segundos } = req.body;
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

        // 3. Calcular cuántas correctas tuvo
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

        // 4. Asignar nivel según reglas del sistema
        let nivel_asignado;
        if (correctas <= 4) {
            nivel_asignado = 'facil';
        } else if (correctas <= 8) {
            nivel_asignado = 'normal';
        } else {
            nivel_asignado = 'dificil';
        }

        // 5. Guardar cada respuesta individual para análisis
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
                (usuario, contenido_id, diagnostico_realizado, nivel_asignado, contenido_completado, fecha, tiempo_total_diagnostico, fecha_fin_diagnostico)
            VALUES ($1, $2, true, $3, false, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (usuario, contenido_id)
            DO UPDATE SET
                diagnostico_realizado = true,
                nivel_asignado        = $3,
                tiempo_total_diagnostico = $4,
                fecha_fin_diagnostico = CURRENT_TIMESTAMP
        `, [usuario, contenido_id, nivel_asignado, tiempo_segundos || 0]);

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
        res.status(500).json({ error: 'Error al guardar diagnóstico' });
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

    const { contenido_id, nivel_completado, puntaje, aprobado, tiempo_segundos, aciertos, total_preguntas } = req.body;
    const usuario = req.session.usuario;

    if (!contenido_id || !nivel_completado || puntaje === undefined) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const siguienteNivel = {
        'facil':   'normal',
        'normal':  'dificil',
        'dificil':  null
    };

    try {
        // 1. Verificar que el contenido existe
        const cont = await client.query(`
            SELECT id FROM contenidos
            WHERE id = $1 AND activo = true
        `, [contenido_id]);

        if (!cont.rows.length) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        // 2. Obtener progreso actual
        const progresoActual = await client.query(`
            SELECT nivel_asignado FROM progreso_contenido_usuario
            WHERE usuario = $1 AND contenido_id = $2
        `, [usuario, contenido_id]);

        const nivelActual = progresoActual.rows[0]?.nivel_asignado;
        const nivelSiguiente = siguienteNivel[nivel_completado];

        const ordenNiveles = { 'facil': 1, 'normal': 2, 'dificil': 3 };
        const nivelNuevo = aprobado && nivelSiguiente
            ? (ordenNiveles[nivelSiguiente] > (ordenNiveles[nivelActual] || 0)
                ? nivelSiguiente
                : nivelActual)
            : nivelActual;

        const estaCompletado = aprobado && nivelSiguiente === null;

        // 3. Actualizar progreso
        await client.query(`
            INSERT INTO progreso_contenido_usuario
                (usuario, contenido_id, diagnostico_realizado, nivel_asignado, contenido_completado, fecha)
            VALUES ($1, $2, true, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (usuario, contenido_id)
            DO UPDATE SET
                nivel_asignado       = $3,
                contenido_completado = CASE
                    WHEN $4 = true THEN true
                    ELSE progreso_contenido_usuario.contenido_completado
                END,
                fecha = CURRENT_TIMESTAMP
        `, [usuario, contenido_id, nivelNuevo || nivel_completado, estaCompletado]);

        // 4. Guardar puntaje del mini-quiz en puntuaciones
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
                0,
                u.estilo_aprendizaje
            FROM usuarios u
            WHERE u.usuario = $1
        `, [usuario, contenido_id, nivel_completado, nivel_completado, puntaje, tiempo_segundos || 0]);

        // 5. Guardar en resultados_quiz si se proporcionan aciertos y total
        if (aciertos !== undefined && total_preguntas !== undefined) {
            await client.query(`
                INSERT INTO resultados_quiz
                    (usuario, contenido_id, nivel, estilo, aciertos, total_preguntas, puntaje, tiempo_total, aprobado, fecha)
                SELECT $1, $2, $3, u.estilo_aprendizaje, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP
                FROM usuarios u WHERE u.usuario = $1
            `, [usuario, contenido_id, nivel_completado, aciertos, total_preguntas, puntaje, tiempo_segundos || 0, aprobado]);
        }

        res.json({
            success: true,
            aprobado,
            nivel_completado,
            nivel_siguiente: aprobado ? nivelSiguiente : null,
            mensaje: aprobado
                ? nivelSiguiente
                    ? `¡Aprobaste! Nivel "${nivelSiguiente}" desbloqueado.`
                    : '¡Completaste todos los niveles del módulo!'
                : 'No aprobaste. Repasa el contenido e intenta de nuevo.'
        });

    } catch (e) {
        console.error('Error en /api/progreso/nivel:', e);
        res.status(500).json({ error: 'Error al guardar progreso' });
    }
});

/**
 * Obtiene el progreso de un usuario para un contenido específico
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

        // Si tiene 'normal', puede ver 'facil' y 'normal'
        // Si tiene 'dificil', puede ver los 3 niveles
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
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        const { rows: uRows } = await client.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [req.session.usuario]
        );
        if (!uRows.length) {
            return res.status(401).json({ success: false, message: 'Sesión inválida' });
        }
        const id_usuario = uRows[0].id;

        const id_actividad = parseInt(req.query.id_actividad, 10);
        const categoria = req.query.categoria ?? null;

        if (Number.isNaN(id_actividad)) {
            return res.status(400).json({ success: false, message: 'id_actividad inválido' });
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
        console.error('xp-total:', err);
        res.status(500).json({ success: false, message: 'Error al obtener XP' });
    }
});

app.listen(config.port, config.host, () => {
    console.log(`⚡️ Servidor funcionando en http://0.0.0.0:${config.port}`);
});
