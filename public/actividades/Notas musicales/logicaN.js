const ID_ACTIVIDAD_NOTAS = 4;

document.addEventListener("DOMContentLoaded", () => {
  const sequenceDisplay = document.getElementById("sequence-display");
  const instrumentButtons = document.querySelectorAll(".instrument");
  const startButton = document.getElementById("start-button");
  const feedback = document.getElementById("feedback");
  const levelDisplay = document.getElementById("level-display");
  const sequenceLengthDisplay = document.getElementById(
    "sequence-length-display"
  );
  const timeDisplay = document.getElementById("time-display");
  const errorsDisplay = document.getElementById("errors-display");
  let sequence = [];
  let playerSequence = [];
  let level = 1;
  let timeElapsed = 0;
  let timer = null;
  let isTimerPaused = false;
  let errors = 0;
  let notesCorrect = 0;
  let isPlayingSequence = false;

  const notes = ["do", "re", "mi", "fa", "sol"];

  const noteColors = {
    do: "#FF5252",
    re: "#FFEB3B",
    mi: "#4CAF50",
    fa: "#2196F3",
    sol: "#9C27B0",
  };

  const sounds = {
    do: new Audio("sounds/do.mp3"),
    re: new Audio("sounds/re.mp3"),
    mi: new Audio("sounds/mi.mp3"),
    fa: new Audio("sounds/fa.mp3"),
    sol: new Audio("sounds/sol.mp3"),
  };
  
  const sonidoVictoria = new Audio("../../recursos/sonidos/victoria.mp3");

  function startTimer() {
    const tiempoLimite = 30;
    timeElapsed = 0;
    timeDisplay.textContent = `Tiempo: ${timeElapsed}s/${tiempoLimite}s`;
    clearInterval(timer);
    isTimerPaused = false;

    timer = setInterval(() => {
      if (!isTimerPaused) {

        timeElapsed++;
        timeDisplay.textContent = `Tiempo: ${timeElapsed}s/${tiempoLimite}s`;

        if (timeElapsed >= tiempoLimite) {
          stopTimer();
          showSummary();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    isTimerPaused = true;
  }

  function resumeTimer() {
    isTimerPaused = false;
  }

  function stopTimer() {
    clearInterval(timer);
    isTimerPaused = false;
  }

  function updateDisplays() {
    levelDisplay.textContent = `Nivel: ${level}`;
    sequenceLengthDisplay.textContent = `Notas faltantes: ${sequence.length - playerSequence.length
      }`;
    errorsDisplay.textContent = `Errores: ${errors}`;
  }

  function playSound(note) {
    return new Promise((resolve) => {
      if (sounds[note]) {
        sounds[note].currentTime = 0;
        sounds[note].play();

        sounds[note].onended = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  }

  async function displaySequence(sequence) {
    isPlayingSequence = true;
    disableButtons();
    pauseTimer();

    feedback.textContent = "Escuchando secuencia...";

    for (let i = 0; i < sequence.length; i++) {
      const currentNote = sequence[i];
      sequenceDisplay.textContent = currentNote.toUpperCase();
      sequenceDisplay.style.color = "white";
      sequenceDisplay.style.backgroundColor = noteColors[currentNote];
      sequenceDisplay.style.visibility = "visible";

      animateButton(currentNote);
      await playSound(currentNote);

      sequenceDisplay.style.visibility = "hidden";
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    sequenceDisplay.style.visibility = "visible";
    sequenceDisplay.textContent = "¡Tu turno!";
    sequenceDisplay.style.backgroundColor = "#f8f8f8";
    sequenceDisplay.style.color = "#6a1b9a";
    isPlayingSequence = false;
    resumeTimer();
    enableButtons();

    feedback.textContent = "Repite la secuencia...";
  }

  function disableButtons() {
    instrumentButtons.forEach((button) => {
      button.disabled = true;
      button.style.opacity = "0.6";
    });
  }

  function enableButtons() {
    instrumentButtons.forEach((button) => {
      button.disabled = false;
      button.style.opacity = "1";
    });
  }

  function animateButton(note) {
    const button = document.querySelector(`[data-note="${note}"]`);
    if (button) {

      button.style.backgroundColor = noteColors[note];
      button.classList.add("active");

      setTimeout(() => {
        button.style.backgroundColor = "";
        button.classList.remove("active");
      }, 300);
    }
  }

  instrumentButtons.forEach((button) => {
    button.disabled = true;
    button.style.opacity = "0.6";
  });

  function updateLevelDisplay() {
    levelDisplay.textContent = `Nivel: ${level}`;
  }

  function updateSequenceLengthDisplay() {
    sequenceLengthDisplay.textContent = `Notas faltantes: ${sequence.length - playerSequence.length
      }`;
  }

  function checkSequence() {
    const currentIndex = playerSequence.length - 1;
    const isCorrect = playerSequence[currentIndex] === sequence[currentIndex];

    if (isCorrect) {
      if (playerSequence.length === sequence.length) {
        notesCorrect += sequence.length;
        feedback.textContent = `¡Correcto! Nivel ${level} completado.`;
        feedback.style.color = "#4CAF50";
        level++;

        const newNote = notes[Math.floor(Math.random() * notes.length)];
        sequence.push(newNote);

        playerSequence = [];
        updateDisplays();
        disableButtons();
        pauseTimer();

        setTimeout(() => {
          feedback.textContent = `Escucha la secuencia para el nivel ${level}...`;
          displaySequence(sequence);
        }, 1500);
      } else {
        updateSequenceLengthDisplay();
      }
    } else {
      errors++;
      feedback.textContent =
        "¡Ups! Nota incorrecta. Escucha la secuencia de nuevo.";
      feedback.style.color = "#F44336";

      playerSequence = [];
      updateDisplays();

      disableButtons();
      pauseTimer();

      setTimeout(() => {
        feedback.textContent = "Escucha la secuencia nuevamente...";
        playSequence();
      }, 1500);
    }
  }

  function updateSequenceLengthDisplay() {
    const remainingNotes = sequence.length - playerSequence.length;
    sequenceLengthDisplay.textContent = `Notas faltantes: ${remainingNotes}`;
  }

  function showSummary() {
    sonidoVictoria.play();
    guardarProgreso();

    const summary = document.createElement("div");
    summary.className = "modal-resumen";
    summary.innerHTML = `
      <div class="modal-contenido">
          <h2>Resumen del Juego</h2>
          <p>Nivel alcanzado: ${level}</p>
          <p>Notas acertadas: ${notesCorrect}</p>
          <p>Errores: ${errors}</p>
          <button id="close-summary">Volver a jugar</button>
      </div>
    `;
    document.body.appendChild(summary);
    document.getElementById("close-summary").addEventListener("click", () => {
      summary.remove();
      resetGame();
    });
  }

  function resetGame() {
    stopTimer();
    level = 1;
    playerSequence = [];
    sequence = [];
    errors = 0;
    notesCorrect = 0;
    feedback.textContent = 'Presiona "Comenzar" para iniciar';
    feedback.style.color = "#6a1b9a";
    updateDisplays();
    disableButtons();
    startButton.textContent = "Comenzar";
    startButton.disabled = false;
    startButton.style.opacity = "1";
    sequenceDisplay.textContent = "Esperando para comenzar...";
    sequenceDisplay.style.backgroundColor = "#f8f8f8";
  }

  function playSequence() {

    if (level === 1 && sequence.length === 0) {
      sequence = [notes[Math.floor(Math.random() * notes.length)]];
    }

    else if (playerSequence.length === sequence.length && errors === 0) {
      const newNote = notes[Math.floor(Math.random() * notes.length)];
      sequence.push(newNote);
    }

    updateSequenceLengthDisplay();
    displaySequence(sequence);
  }

  instrumentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isPlayingSequence) return;

      const note = button.getAttribute("data-note");
      playerSequence.push(note);
      playSound(note);
      animateButton(note);
      checkSequence();
    });
  });

  startButton.addEventListener("click", () => {
    resetGame();
    startTimer();

    startButton.disabled = true;
    feedback.textContent = "Escucha la secuencia atentamente...";

    instrumentButtons.forEach((button) => {
      button.disabled = false;
      button.style.opacity = "1";
    });

    playSequence();
  });

  async function guardarProgreso() {
    try {
      await fetch('/guardar-progreso', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_actividad: ID_ACTIVIDAD_NOTAS,
          categoria: null,
          dificultad: 1,
          puntuacion: notesCorrect,
          tiempoFinalizacion: timeElapsed,
          erroresCometidos: errors
        })
      });
    } catch (err) {
      console.error('Error al guardar progreso:', err);
    }
  }
});

function volverAInicio() {
  window.location.href = "../../inicio.html";
}
