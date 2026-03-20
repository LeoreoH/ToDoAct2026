const area = "matematicas";
const slug = "equivalencias-numericas";

let preguntas = [];
let contenidoId = null;

async function cargarPreguntas() {
    try {
        document.getElementById("formulario").innerHTML =
            '<p style="text-align: center;">Cargando preguntas...</p>';

        const contenidoRes = await fetch(`/api/contenido/${area}/${slug}`, {
            credentials: 'include'
        });

        if (!contenidoRes.ok) {
            throw new Error(`Error ${contenidoRes.status}: No se pudo obtener el contenido`);
        }

        const contenidoData = await contenidoRes.json();

        if (!contenidoData.contenido_id) {
            throw new Error("No se pudo obtener la información del contenido");
        }

        contenidoId = contenidoData.contenido_id;

        const preguntasRes = await fetch(`/api/diagnostico/${contenidoId}`, {
            credentials: 'include'
        });

        if (!preguntasRes.ok) {
            throw new Error(`Error ${preguntasRes.status}: No se pudieron cargar las preguntas`);
        }

        preguntas = await preguntasRes.json();

        if (!preguntas || preguntas.length === 0) {
            document.getElementById("formulario").innerHTML =
                '<p class="mensaje-error">No hay preguntas disponibles para este contenido.</p>';
            return;
        }

        mostrarPreguntas();

    } catch (e) {
        console.error("Error al cargar preguntas:", e);
        document.getElementById("formulario").innerHTML =
            `<p class="mensaje-error">Error al cargar las preguntas: ${e.message}</p>`;
    }
}

function mostrarPreguntas() {
    const contenedor = document.getElementById("formulario");
    contenedor.innerHTML = "";

    preguntas.forEach((p, index) => {
        const div = document.createElement("div");
        div.classList.add("pregunta");

        const titulo = document.createElement("p");
        titulo.innerHTML = `<strong>${index + 1}. </strong>${p.pregunta}`;
        div.appendChild(titulo);

        ["A", "B", "C", "D"].forEach(letra => {
            const label = document.createElement("label");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = "p" + p.id;
            input.value = letra;

            label.appendChild(input);
            label.appendChild(
                document.createTextNode(` ${letra}) ${p["opcion_" + letra.toLowerCase()]}`)
            );

            div.appendChild(label);
        });

        contenedor.appendChild(div);
    });
}

async function enviarDiagnostico() {
    if (!preguntas || preguntas.length === 0) return;

    const sinResponder = preguntas.filter(p =>
        !document.querySelector(`input[name="p${p.id}"]:checked`)
    );

    if (sinResponder.length > 0) {
        document.getElementById("resultado").innerHTML =
            `⚠️ Por favor responde todas las preguntas (faltan ${sinResponder.length}).`;
        return;
    }

    const respuestas = {};
    preguntas.forEach(p => {
        const seleccion = document.querySelector(`input[name="p${p.id}"]:checked`);
        if (seleccion) {
            respuestas[p.id] = seleccion.value;
        }
    });

    const btn = document.getElementById("btn-enviar");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
        const res = await fetch(`/api/diagnostico/guardar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                contenido_id: contenidoId,
                respuestas: respuestas
            })
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || "Error desconocido");
        }

        const mensajesNivel = {
            facil: "📘 Empezarás con equivalencias básicas para reforzar paso a paso.",
            normal: "📚 ¡Vas bien! Trabajarás con equivalencias de nivel intermedio.",
            dificil: "⭐ ¡Excelente! Ya puedes avanzar a retos más complejos."
        };

        document.getElementById("resultado").innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 20px; margin-bottom: 10px;">✅ Diagnóstico completado</p>
                <p style="font-size: 18px;">Puntaje: <strong>${data.correctas}/${data.total}</strong></p>
                <p style="font-size: 18px; color: #6a1b9a;">Nivel asignado: <strong>${data.nivel_asignado}</strong></p>
                <p style="margin-top: 15px;">${mensajesNivel[data.nivel_asignado] || ""}</p>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">Redirigiendo al menú...</p>
            </div>
        `;

        setTimeout(() => {
            window.location.href = '../menu.html';
        }, 3000);

    } catch (e) {
        console.error("Error al enviar diagnóstico:", e);
        document.getElementById("resultado").innerHTML =
            `❌ Error: ${e.message}`;
        btn.disabled = false;
        btn.textContent = "Enviar respuestas";
    }
}

function volver() {
    window.location.href = '../menu.html';
}

document.addEventListener('DOMContentLoaded', cargarPreguntas);