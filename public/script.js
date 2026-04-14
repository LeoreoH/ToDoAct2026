function mostrarBienvenida() {
    const usuario = localStorage.getItem('usuario');
    const bienvenida = document.getElementById('bienvenida');

    if (usuario && bienvenida) {
        bienvenida.innerHTML = `<h1>Bienvenido, ${usuario}!</h1>`;
    } else if (bienvenida) {
        bienvenida.innerHTML = `<h1>Bienvenido!</h1>`;
    }
}

async function obtenerXP () {
  const xpEl = document.getElementById('xp-total');
  const xpSideEl = document.getElementById('xp-side');
  if (!xpEl) return;

  try {
    const r    = await fetch('/xp-total', { credentials:'include' });
    const data = await r.json();
    const xp = data.success ? data.xp : 0;

    xpEl.textContent = `XP: ${xp}`;
    if (xpSideEl) {
        xpSideEl.textContent = xp;
    }
  } catch (e) {
    console.error('obtenerXP:', e);
    xpEl.textContent = 'XP: 0';
    if (xpSideEl) {
        xpSideEl.textContent = '0';
    }
  }
}

async function obtenerPerfil() {
    try {
        const response = await fetch(`${window.servidorActivo}/perfil`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('usuario').textContent = data.usuario;
            document.getElementById('nombrecompleto').textContent = data.nombrecompleto;
            document.getElementById('fechanacimiento').textContent = new Date(data.fechanacimiento).toLocaleDateString('es-ES');
            document.getElementById('genero').textContent = data.genero;
        } else if (response.status === 401) {
            alert('Debes iniciar sesión para ver tu perfil');
            window.location.href = 'index.html';
        } else {
            alert('Error al obtener los datos del perfil');
        }
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        alert('Error al conectar con el servidor');
    }
}

function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.querySelector('input[name="usuario"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;

    const data = { usuario, contrasena };

    fetch(`${window.servidorActivo}/index`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.setItem('usuario', usuario);
                window.location.href = "inicio.html";
            } else {
                alert(data.message || 'Usuario o contrasena incorrectos');
            }
        })
        .catch(error => {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión: ' + error.message);
        });
}

function crearCuenta(event) {
    event.preventDefault();

    const usuario = document.querySelector('input[name="usuario"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;
    const nombrecompleto = document.querySelector('input[name="nombrecompleto"]').value;
    const fechanacimiento = document.querySelector('input[name="fechanacimiento"]').value;
    const genero = document.querySelector('select[name="genero"]').value;

    const data = {
        usuario,
        contrasena,
        nombrecompleto,
        fechanacimiento,
        genero
    };

    fetch(`${window.servidorActivo}/crearcuenta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            alert('Cuenta creada con éxito');
            window.location.href = "index.html";
        })
        .catch(error => {
            alert('Error al crear cuenta');
        });
}

function cerrarSesion() {
    fetch(`${window.servidorActivo}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.removeItem('usuario');
                window.location.href = "index.html";
            } else {
                alert('Error al cerrar sesión: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        });
}

let estiloActual = null;

async function cargarContenido(tema) {

    const res = await fetch(`/contenido/${encodeURIComponent(tema)}`, {
        credentials: 'include'
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok || !data.archivo) {
        alert('No se encontró contenido para tu estilo.');
        return;
    }

    estiloActual = data.estilo;

    window.location.href = '/' + data.archivo;
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();

    const usuario = localStorage.getItem('usuario');

    if (path === 'inicio.html') {
        mostrarBienvenida();
        obtenerXP();
    } else if (path === 'perfil.html') {
        obtenerPerfil();
        obtenerXP();
    } else if (path === 'index.html') {
        const formulario = document.getElementById('forminiciarsesion');
        if (formulario) {
            formulario.addEventListener('submit', iniciarSesion);
        }
    } else if (path === 'crearcuenta.html') {
        const formulario = document.querySelector('.formulario');
        if (formulario) {
            formulario.addEventListener('submit', crearCuenta);
        }
    }

    localStorage.removeItem('pefilRaw');
});

const btnGuardarEstilo = document.getElementById('guardarEstilo');

if (btnGuardarEstilo) {

    btnGuardarEstilo.addEventListener('click', async () => {

        const estilo = document.getElementById('estilo').value;

        if (!estilo) {
            alert('Selecciona un estilo');
            return;
        }

        const resp = await fetch('/actualizar-estilo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estilo })
        });

        if (resp.ok) {
            alert('Estilo guardado');
        } else {
            alert('Error');
        }

    });

}
