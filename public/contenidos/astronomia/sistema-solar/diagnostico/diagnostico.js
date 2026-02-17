const slug = "sistema-solar";

async function cargarPreguntas() {

    const contenidoRes = await fetch(`${window.servidorActivo}/api/astronomia/contenido/${slug}`);
    const contenidoData = await contenidoRes.json();

    const contenidoId = contenidoData.contenido_id;

    const preguntasRes = await fetch(`${window.servidorActivo}/api/diagnostico/${contenidoId}`);
    const preguntas = await preguntasRes.json();

    const contenedor = document.getElementById("formulario");
    contenedor.innerHTML = "";

    preguntas.forEach((p, index) => {

        const div = document.createElement("div");
        div.classList.add("pregunta");

        const titulo = document.createElement("p");
        titulo.innerHTML = `<strong>${index + 1}. </strong>`;
        titulo.appendChild(document.createTextNode(p.pregunta));
        div.appendChild(titulo);

        ["A", "B", "C", "D"].forEach(letra => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "p" + p.id;
            input.value = letra;

            label.appendChild(input);
            label.appendChild(
                document.createTextNode(" " + p["opcion_" + letra.toLowerCase()])
            );

            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });

        div.appendChild(document.createElement("hr"));
        contenedor.appendChild(div);
    });

    window.preguntas = preguntas;
    window.contenidoId = contenidoId;
}

async function enviarDiagnostico() {

    if (!window.preguntas) return;

    // Verificar que respondió todas las preguntas
    const sinResponder = window.preguntas.filter(p => 
        !document.querySelector(`input[name="p${p.id}"]:checked`)
    );

    if (sinResponder.length > 0) {
        document.getElementById("resultado").innerHTML =
            `⚠️ Por favor responde todas las preguntas antes de continuar.`;
        return;
    }

    // Construir objeto de respuestas: { pregunta_id: 'letra' }
    const respuestas = {};
    window.preguntas.forEach(p => {
        const seleccion = document.querySelector(`input[name="p${p.id}"]:checked`);
        if (seleccion) {
            respuestas[p.id] = seleccion.value;
        }
    });

    // Deshabilitar el botón mientras procesa
    const btn = document.querySelector("button[onclick='enviarDiagnostico()']");
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Calculando...";
    }

    try {
        const res = await fetch(`${window.servidorActivo}/api/diagnostico/guardar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contenido_id: window.contenidoId,
                respuestas       // manda todas las respuestas al servidor
            })
        });

        const data = await res.json();

        if (!data.success) {
            document.getElementById("resultado").innerHTML =
                `❌ Error al guardar: ${data.error || 'Error desconocido'}`;
            if (btn) { btn.disabled = false; btn.textContent = "Enviar"; }
            return;
        }

        // Mostrar resultado con el nivel asignado
        const mensajesNivel = {
            facil:   "Comenzarás desde lo básico, ¡tú puedes! 🚀",
            normal:  "¡Buen conocimiento previo! Vas al nivel intermedio 📚",
            dificil: "¡Excelente! Tienes conocimiento avanzado ⭐"
        };

        document.getElementById("resultado").innerHTML = `
            <strong>Tu puntaje: ${data.correctas}/${data.total}</strong><br>
            Nivel asignado: <strong>${data.nivel_asignado}</strong><br>
            ${mensajesNivel[data.nivel_asignado] || ''}
        `;

        // Redirigir al contenido después de 2 segundos
        setTimeout(() => {
            window.location.href = 
                `/contenidos/astronomia/${slug}/menu.html`;
        }, 2000);

    } catch (e) {
        console.error("Error al enviar diagnóstico:", e);
        document.getElementById("resultado").innerHTML =
            `❌ Error de conexión. Intenta de nuevo.`;
        if (btn) { btn.disabled = false; btn.textContent = "Enviar"; }
    }
}

cargarPreguntas();