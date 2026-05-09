BEGIN;

UPDATE preguntas_diagnostico
SET pregunta = 'En la fracción 3/4, ¿qué número indica cuántas partes se toman?',
    opcion_a = '4',
    opcion_b = '3',
    opcion_c = '7',
    opcion_d = '1'
WHERE id = 51 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'En la fracción 3/4, ¿qué número indica en cuántas partes iguales se divide el todo?',
    opcion_a = '3',
    opcion_b = '4',
    opcion_c = '1',
    opcion_d = '7'
WHERE id = 52 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'Si una pizza se divide en 4 partes iguales y se colorea 1 parte, ¿qué fracción representa la parte coloreada?',
    opcion_a = '1/4',
    opcion_b = '4/1',
    opcion_c = '1/3',
    opcion_d = '3/4'
WHERE id = 53 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'Si una barra se divide en 2 partes iguales y se colorea 1 parte, ¿qué fracción representa la parte coloreada?',
    opcion_a = '2/1',
    opcion_b = '1/3',
    opcion_c = '1/2',
    opcion_d = '2/2'
WHERE id = 54 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué fracción representa 2 partes coloreadas de un total de 3 partes iguales?',
    opcion_a = '3/2',
    opcion_b = '2/3',
    opcion_c = '1/3',
    opcion_d = '2/2'
WHERE id = 55 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál de las siguientes fracciones representa la mitad de un entero?',
    opcion_a = '1/2',
    opcion_b = '1/4',
    opcion_c = '2/3',
    opcion_d = '3/4'
WHERE id = 56 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'Si un rectángulo está dividido en 8 partes iguales y se colorean 4, ¿qué fracción representa la parte coloreada?',
    opcion_a = '4/8',
    opcion_b = '8/4',
    opcion_c = '4/4',
    opcion_d = '2/8'
WHERE id = 57 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'En la fracción 5/6, el número 6 representa:',
    opcion_a = 'Las partes que se toman',
    opcion_b = 'Las partes que faltan',
    opcion_c = 'El total de partes iguales',
    opcion_d = 'El número de figuras'
WHERE id = 58 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué fracción representa tres partes tomadas de un total de cuatro partes iguales?',
    opcion_a = '4/3',
    opcion_b = '3/4',
    opcion_c = '1/4',
    opcion_d = '2/4'
WHERE id = 59 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'Si una figura está dividida en 5 partes iguales y solo 1 parte está coloreada, ¿qué fracción la representa?',
    opcion_a = '5/1',
    opcion_b = '1/5',
    opcion_c = '4/5',
    opcion_d = '1/4'
WHERE id = 60 AND examen_id = 4;

UPDATE preguntas_diagnostico
SET pregunta = 'En el mapa de una colonia, las calles que van de norte a sur se llaman "calles" y están numeradas (Calle 1, Calle 2...). Las que van de este a oeste se llaman "avenidas" y tienen nombres (Reforma, Insurgentes...). Para ubicar una casa en el mapa, ¿qué información es suficiente?',
    opcion_a = 'El nombre de la avenida y el color de la casa',
    opcion_b = 'El número de la calle y el nombre de la avenida',
    opcion_c = 'El número de la calle y la distancia al parque',
    opcion_d = 'El nombre de la avenida y el número de la cuadra'
WHERE id = 71 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'Isabel vive en la calle Revolución, entre las calles 5 y 6. Minerva vive en la calle 12, entre Insurgentes y Reforma. Para ir de la casa de Isabel a la de Minerva, primero debe caminar 7 cuadras hacia el sur. ¿Qué instrucción falta para completar el camino?',
    opcion_a = 'Caminar 5 cuadras hacia el norte',
    opcion_b = 'Caminar 3 cuadras hacia el este',
    opcion_c = 'Caminar 2 cuadras hacia el oeste',
    opcion_d = 'Caminar 4 cuadras hacia el sur'
WHERE id = 72 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'Las instrucciones para ir de la escuela al parque son: "Sal de la escuela, camina 3 cuadras hacia el norte, dobla a la derecha y camina 2 cuadras más". Si al salir de la escuela estás viendo hacia el norte, ¿en qué dirección quedará el parque respecto a la escuela?',
    opcion_a = 'Al noroeste de la escuela',
    opcion_b = 'Al noreste de la escuela',
    opcion_c = 'Al suroeste de la escuela',
    opcion_d = 'Al sureste de la escuela'
WHERE id = 73 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'En el Metro de la CDMX, la Línea 2 (azul) va de Tasqueña (sur) a Cuatro Caminos (norte). La Línea 3 (verde) va de Universidad (sur) a Indios Verdes (norte). Si estás en Zócalo (Línea 2) y quieres ir a Copilco (Línea 3), ¿en qué estación debes hacer transbordo?',
    opcion_a = 'En Balderas',
    opcion_b = 'En Hidalgo',
    opcion_c = 'En Tacuba',
    opcion_d = 'En Pantitlán'
WHERE id = 74 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'Observa este mapa simple del Metro: Línea 1: Observatorio - Pantitlán (oeste a este). Línea 2: Tasqueña - Cuatro Caminos (sur a norte). Línea 3: Universidad - Indios Verdes (sur a norte). Si viajas de la estación "Zócalo" (Línea 2) hacia el norte, ¿cuál será la siguiente estación después de Hidalgo?',
    opcion_a = 'Guerrero',
    opcion_b = 'Balderas',
    opcion_c = 'Juárez',
    opcion_d = 'Bellas Artes'
WHERE id = 75 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'Un robot avanza en línea recta. En su programación, cada paso que da lo mueve 2 unidades. Si el robot da 5 pasos, luego retrocede 3 pasos y luego avanza 4 pasos, ¿a qué distancia del punto de partida se encuentra?',
    opcion_a = '6 unidades',
    opcion_b = '8 unidades',
    opcion_c = '10 unidades',
    opcion_d = '12 unidades'
WHERE id = 76 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'En un teatro, las filas se numeran del 1 al 20 (cerca del escenario son las filas bajas). Los asientos en cada fila se numeran del 1 al 15 (el 1 es el pasillo izquierdo y el 15, el pasillo derecho). Si tienes el boleto "Fila 8, Asiento 12", ¿dónde estás ubicado?',
    opcion_a = 'Fila 8, del lado izquierdo, atrás del teatro',
    opcion_b = 'Fila 8, del lado derecho, en medio del teatro',
    opcion_c = 'Fila 12, del lado izquierdo, adelante del teatro',
    opcion_d = 'Fila 12, del lado derecho, en medio del teatro'
WHERE id = 77 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'En el mismo teatro, tu amigo tiene el boleto "Fila 14, Asiento 4". ¿Cuál de las siguientes afirmaciones es correcta comparando sus lugares?',
    opcion_a = 'Tu amigo está 6 filas más atrás y 8 asientos más a la izquierda',
    opcion_b = 'Tu amigo está 6 filas más atrás y 8 asientos más a la derecha',
    opcion_c = 'Tu amigo está 6 filas más adelante y 8 asientos más a la izquierda',
    opcion_d = 'Tu amigo está 6 filas más adelante y 8 asientos más a la derecha'
WHERE id = 78 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'En el juego "Batalla aérea" se usa un tablero con filas numeradas (1 al 10) y columnas con letras (A a la J). Las coordenadas se dan diciendo primero la letra y luego el número. Si dices "E,7", ¿en qué casilla estás?',
    opcion_a = 'Columna E, fila 7',
    opcion_b = 'Columna 7, fila E',
    opcion_c = 'Columna 5, fila 7',
    opcion_d = 'Columna 7, fila 5'
WHERE id = 79 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = 'En el mismo juego, tu oponente tiene un avión en "C,5". Tú disparas primero a "C,6" y luego a "D,5". ¿Cuál de estas afirmaciones es correcta?',
    opcion_a = 'Ambos disparos fallaron porque el avión está en C,5',
    opcion_b = 'El primer disparo acertó, el segundo falló',
    opcion_c = 'El primer disparo falló, el segundo acertó',
    opcion_d = 'Ambos disparos acertaron porque están cerca'
WHERE id = 80 AND examen_id = 5;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué decimal es equivalente a 1/2?',
    opcion_a = '0.2',
    opcion_b = '0.5',
    opcion_c = '0.25',
    opcion_d = '0.75'
WHERE id = 81 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué porcentaje es equivalente a 1/4?',
    opcion_a = '75%',
    opcion_b = '50%',
    opcion_c = '25%',
    opcion_d = '10%'
WHERE id = 82 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué fracción es equivalente a 0.75?',
    opcion_a = '1/4',
    opcion_b = '1/2',
    opcion_c = '3/4',
    opcion_d = '2/4'
WHERE id = 83 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué decimal representa 25%?',
    opcion_a = '0.25',
    opcion_b = '0.5',
    opcion_c = '0.75',
    opcion_d = '0.2'
WHERE id = 84 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué porcentaje representa 0.5?',
    opcion_a = '5%',
    opcion_b = '25%',
    opcion_c = '50%',
    opcion_d = '75%'
WHERE id = 85 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál grupo muestra cantidades equivalentes?',
    opcion_a = '1/2, 0.25, 50%',
    opcion_b = '1/4, 0.25, 25%',
    opcion_c = '3/4, 0.5, 75%',
    opcion_d = '1/2, 0.75, 25%'
WHERE id = 86 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué fracción equivale a 50%?',
    opcion_a = '1/4',
    opcion_b = '2/4',
    opcion_c = '3/4',
    opcion_d = '1/3'
WHERE id = 87 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál de estos valores representa tres cuartos?',
    opcion_a = '25%',
    opcion_b = '0.5',
    opcion_c = '75%',
    opcion_d = '0.2'
WHERE id = 88 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = 'Si marcas 0.25 en una recta numérica, ¿qué valor cae en el mismo lugar?',
    opcion_a = '1/2',
    opcion_b = '25%',
    opcion_c = '3/4',
    opcion_d = '50%'
WHERE id = 89 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál NO es equivalente a 1/2?',
    opcion_a = '0.5',
    opcion_b = '50%',
    opcion_c = '2/4',
    opcion_d = '0.25'
WHERE id = 90 AND examen_id = 6;

UPDATE preguntas_diagnostico
SET pregunta = 'Observa la siguiente secuencia de movimientos en un mapa: flecha arriba, flecha arriba, flecha derecha, flecha abajo, flecha izquierda. Si comenzaste en el punto de partida, ¿en qué posición terminas?',
    opcion_a = '1 paso arriba del inicio',
    opcion_b = '1 paso a la derecha del inicio',
    opcion_c = '1 paso arriba y 1 a la derecha',
    opcion_d = 'En el mismo punto de inicio'
WHERE id = 91 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'Una instrucción dice: avanza 3 pasos hacia el norte, luego 2 pasos hacia el este. Si cada paso equivale a una cuadra, ¿cuál es la ubicación final respecto al inicio?',
    opcion_a = '3 cuadras arriba, 2 a la derecha',
    opcion_b = '3 cuadras arriba, 2 a la izquierda',
    opcion_c = '2 cuadras arriba, 3 a la derecha',
    opcion_d = '5 cuadras arriba'
WHERE id = 92 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'En un mapa, el norte está hacia arriba. Si una instrucción dice "ve hacia el oeste", ¿hacia qué lado te mueves en el mapa?',
    opcion_a = 'Arriba',
    opcion_b = 'Abajo',
    opcion_c = 'Derecha',
    opcion_d = 'Izquierda'
WHERE id = 93 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál de las siguientes opciones representa el mismo camino que: flecha derecha, flecha derecha, flecha arriba, flecha arriba?',
    opcion_a = '2 pasos a la derecha, 2 pasos arriba',
    opcion_b = '2 pasos arriba, 2 pasos a la derecha',
    opcion_c = '1 paso a la derecha, 2 arriba, 1 derecha',
    opcion_d = '2 pasos abajo, 2 a la izquierda'
WHERE id = 94 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'Si estás mirando hacia el sur y te piden que avances hacia tu derecha, ¿hacia qué dirección te mueves?',
    opcion_a = 'Norte',
    opcion_b = 'Sur',
    opcion_c = 'Este',
    opcion_d = 'Oeste'
WHERE id = 95 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'En un mapa con coordenadas, el punto A está en (2, 3) y el punto B está en (5, 3). ¿Qué instrucción te lleva de A a B?',
    opcion_a = '3 pasos arriba',
    opcion_b = '3 pasos abajo',
    opcion_c = '3 pasos a la derecha',
    opcion_d = '3 pasos a la izquierda'
WHERE id = 96 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'Una instrucción dice: desde la entrada, camina hasta el árbol grande, luego gira hacia donde sale el sol y avanza hasta la fuente. ¿Qué dirección tomas después del árbol?',
    opcion_a = 'Norte',
    opcion_b = 'Sur',
    opcion_c = 'Este',
    opcion_d = 'Oeste'
WHERE id = 97 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué diferencia hay entre "gira a tu izquierda" y "ve hacia el oeste"?',
    opcion_a = 'La primera depende de hacia dónde miras; la segunda es una dirección fija',
    opcion_b = 'La primera es una dirección fija; la segunda depende de hacia dónde miras',
    opcion_c = 'Ambas significan lo mismo siempre',
    opcion_d = 'Ninguna es correcta'
WHERE id = 98 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'Si recibes las instrucciones "2 cuadras al sur, 3 cuadras al este, 2 cuadras al norte", ¿en qué posición terminas respecto al inicio?',
    opcion_a = '3 cuadras al este',
    opcion_b = '3 cuadras al oeste',
    opcion_c = '2 cuadras al sur',
    opcion_d = 'En el mismo punto'
WHERE id = 99 AND examen_id = 7;

UPDATE preguntas_diagnostico
SET pregunta = 'En un mapa, el tesoro está en la coordenada (4, 2). Tú estás en (1, 2). ¿Cuál es la instrucción más directa para llegar?',
    opcion_a = '3 pasos a la derecha',
    opcion_b = '3 pasos a la izquierda',
    opcion_c = '3 pasos arriba',
    opcion_d = '3 pasos abajo'
WHERE id = 100 AND examen_id = 7;

COMMIT;
