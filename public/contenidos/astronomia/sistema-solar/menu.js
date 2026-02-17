const SLUG_CONTENIDO = 'sistema-solar';

let estadoContenido = null;

async function cargarEstadoContenido() {

    try {

        const res = await fetch(
            `/api/astronomia/contenido/${SLUG_CONTENIDO}`,
            { credentials: 'include' }
        );

        if (!res.ok) return;

        estadoContenido = await res.json();
        actualizarBotones();

    } catch (e) {
        console.error(e);
    }
}

function mostrarContenidos(){
    document.getElementById('bloque-contenidos').style.display = 'block';
}

function actualizarBotones() {

    const btnFacil   = document.getElementById('btn-facil');
    const btnNormal  = document.getElementById('btn-normal');
    const btnDificil = document.getElementById('btn-dificil');

    btnFacil.innerHTML   = `<span>Fácil</span><span class="descripcion-nivel">Nivel inicial</span>`;
    btnNormal.innerHTML  = `<span>Normal</span><span class="descripcion-nivel">Nivel intermedio</span>`;
    btnDificil.innerHTML = `<span>Difícil</span><span class="descripcion-nivel">Nivel avanzado</span>`;

    btnFacil.disabled   = true;
    btnNormal.disabled  = true;
    btnDificil.disabled = true;

    if (!estadoContenido || !estadoContenido.diagnostico_realizado) return;

    const nivelAsignado = estadoContenido.nivel_asignado;

    if (nivelAsignado === 'facil'){
        btnFacil.disabled = false;
    }

    if (nivelAsignado === 'normal'){
        btnFacil.disabled  = false;
        btnNormal.disabled = false;
    }

    if (nivelAsignado === 'dificil'){
        btnFacil.disabled   = false;
        btnNormal.disabled  = false;
        btnDificil.disabled = false;
    }
}

function irADiagnostico(){
    window.location.href =
        `/contenidos/astronomia/${SLUG_CONTENIDO}/diagnostico/index.html`;
}

function irAEjercicios(){
    window.location.href =
        `/contenidos/astronomia/${SLUG_CONTENIDO}/ejercicios/index.html`;
}

async function abrirNivel(nivel){

    try{

        const res = await fetch(
            `/api/astronomia/abrir-contenido/${SLUG_CONTENIDO}/${nivel}`,
            { credentials:'include' }
        );

        const data = await res.json();

        if(!res.ok){
            alert(data.error || 'No disponible');
            return;
        }

        window.location.href = data.archivo;

    }catch(e){
        console.error(e);
        alert('Error al abrir contenido');
    }

}

function volver(){
    window.location.href = '/contenidos/astronomia/menu.html';
}

document.addEventListener('DOMContentLoaded', cargarEstadoContenido);
