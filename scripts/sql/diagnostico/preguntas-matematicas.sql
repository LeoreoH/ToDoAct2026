-- INSERTAR PREGUNTAS DE DIAGNÓSTICO - MATEMÁTICAS

SET client_encoding TO 'UTF8';

-- BLOQUE I: RECONOCER FRACCIONES (contenido_id = 4, examen_id = 4)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(4, 'En la fracción 3/4, ¿qué número indica cuántas partes se toman?',
 '4', '3', '7', '1', 'B'),

(4, 'En la fracción 3/4, ¿qué número indica en cuántas partes iguales se divide el todo?',
 '3', '4', '1', '7', 'B'),

(4, 'Si una pizza se divide en 4 partes iguales y se colorea 1 parte, ¿qué fracción representa la parte coloreada?',
 '1/4', '4/1', '1/3', '3/4', 'A'),

(4, 'Si una barra se divide en 2 partes iguales y se colorea 1 parte, ¿qué fracción representa la parte coloreada?',
 '2/1', '1/3', '1/2', '2/2', 'C'),

(4, '¿Qué fracción representa 2 partes coloreadas de un total de 3 partes iguales?',
 '3/2', '2/3', '1/3', '2/2', 'B'),

(4, '¿Cuál de las siguientes fracciones representa la mitad de un entero?',
 '1/2', '1/4', '2/3', '3/4', 'A'),

(4, 'Si un rectángulo está dividido en 8 partes iguales y se colorean 4, ¿qué fracción representa la parte coloreada?',
 '4/8', '8/4', '4/4', '2/8', 'A'),

(4, 'En la fracción 5/6, el número 6 representa:',
 'Las partes que se toman', 'Las partes que faltan', 'El total de partes iguales', 'El número de figuras', 'C'),

(4, '¿Qué fracción representa tres partes tomadas de un total de cuatro partes iguales?',
 '4/3', '3/4', '1/4', '2/4', 'B'),

(4, 'Si una figura está dividida en 5 partes iguales y solo 1 parte está coloreada, ¿qué fracción la representa?',
 '5/1', '1/5', '4/5', '1/4', 'B');

-- BLOQUE II: IDENTIFICAR COORDENADAS (contenido_id = 5, examen_id = 5)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(5, 'En el mapa de una colonia, las calles que van de norte a sur se llaman "calles" y están numeradas (Calle 1, Calle 2...). Las que van de este a oeste se llaman "avenidas" y tienen nombres (Reforma, Insurgentes...). Para ubicar una casa en el mapa, ¿qué información es suficiente?',
 'El nombre de la avenida y el color de la casa', 'El número de la calle y el nombre de la avenida', 'El número de la calle y la distancia al parque', 'El nombre de la avenida y el número de la cuadra', 'B'),

(5, 'Isabel vive en la calle Revolución, entre las calles 5 y 6. Minerva vive en la calle 12, entre Insurgentes y Reforma. Para ir de la casa de Isabel a la de Minerva, primero debe caminar 7 cuadras hacia el sur. ¿Qué instrucción falta para completar el camino?',
 'Caminar 5 cuadras hacia el norte', 'Caminar 3 cuadras hacia el este', 'Caminar 2 cuadras hacia el oeste', 'Caminar 4 cuadras hacia el sur', 'B'),

(5, 'Las instrucciones para ir de la escuela al parque son: "Sal de la escuela, camina 3 cuadras hacia el norte, dobla a la derecha y camina 2 cuadras más". Si al salir de la escuela estás viendo hacia el norte, ¿en qué dirección quedará el parque respecto a la escuela?',
 'Al noroeste de la escuela', 'Al noreste de la escuela', 'Al suroeste de la escuela', 'Al sureste de la escuela', 'B'),

(5, 'En el Metro de la CDMX, la Línea 2 (azul) va de Tasqueña (sur) a Cuatro Caminos (norte). La Línea 3 (verde) va de Universidad (sur) a Indios Verdes (norte). Si estás en Zócalo (Línea 2) y quieres ir a Copilco (Línea 3), ¿en qué estación debes hacer transbordo?',
 'En Balderas', 'En Hidalgo', 'En Tacuba', 'En Pantitlán', 'B'),

(5, 'Observa este mapa simple del Metro: Línea 1: Observatorio - Pantitlán (oeste a este). Línea 2: Tasqueña - Cuatro Caminos (sur a norte). Línea 3: Universidad - Indios Verdes (sur a norte). Si viajas de la estación "Zócalo" (Línea 2) hacia el norte, ¿cuál será la siguiente estación después de Hidalgo?',
 'Guerrero', 'Balderas', 'Juárez', 'Bellas Artes', 'A'),

(5, 'Un robot avanza en línea recta. En su programación, cada paso que da lo mueve 2 unidades. Si el robot da 5 pasos, luego retrocede 3 pasos y luego avanza 4 pasos, ¿a qué distancia del punto de partida se encuentra?',
 '6 unidades', '8 unidades', '10 unidades', '12 unidades', 'D'),

(5, 'En un teatro, las filas se numeran del 1 al 20 (cerca del escenario son las filas bajas). Los asientos en cada fila se numeran del 1 al 15 (el 1 es el pasillo izquierdo y el 15, el pasillo derecho). Si tienes el boleto "Fila 8, Asiento 12", ¿dónde estás ubicado?',
 'Fila 8, del lado izquierdo, atrás del teatro', 'Fila 8, del lado derecho, en medio del teatro', 'Fila 12, del lado izquierdo, adelante del teatro', 'Fila 12, del lado derecho, en medio del teatro', 'B'),

(5, 'En el mismo teatro, tu amigo tiene el boleto "Fila 14, Asiento 4". ¿Cuál de las siguientes afirmaciones es correcta comparando sus lugares?',
 'Tu amigo está 6 filas más atrás y 8 asientos más a la izquierda', 'Tu amigo está 6 filas más atrás y 8 asientos más a la derecha', 'Tu amigo está 6 filas más adelante y 8 asientos más a la izquierda', 'Tu amigo está 6 filas más adelante y 8 asientos más a la derecha', 'A'),

(5, 'En el juego "Batalla aérea" se usa un tablero con filas numeradas (1 al 10) y columnas con letras (A a la J). Las coordenadas se dan diciendo primero la letra y luego el número. Si dices "E,7", ¿en qué casilla estás?',
 'Columna E, fila 7', 'Columna 7, fila E', 'Columna 5, fila 7', 'Columna 7, fila 5', 'A'),

(5, 'En el mismo juego, tu oponente tiene un avión en "C,5". Tú disparas primero a "C,6" y luego a "D,5". ¿Cuál de estas afirmaciones es correcta?',
 'Ambos disparos fallaron porque el avión está en C,5', 'El primer disparo acertó, el segundo falló', 'El primer disparo falló, el segundo acertó', 'Ambos disparos acertaron porque están cerca', 'A');

-- BLOQUE III: EQUIVALENCIAS NUMÉRICAS (contenido_id = 6, examen_id = 6)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(6, '¿Qué decimal es equivalente a 1/2?',
 '0.2', '0.5', '0.25', '0.75', 'B'),

(6, '¿Qué porcentaje es equivalente a 1/4?',
 '75%', '50%', '25%', '10%', 'C'),

(6, '¿Qué fracción es equivalente a 0.75?',
 '1/4', '1/2', '3/4', '2/4', 'C'),

(6, '¿Qué decimal representa 25%?',
 '0.25', '0.5', '0.75', '0.2', 'A'),

(6, '¿Qué porcentaje representa 0.5?',
 '5%', '25%', '50%', '75%', 'C'),

(6, '¿Cuál grupo muestra cantidades equivalentes?',
 '1/2, 0.25, 50%', '1/4, 0.25, 25%', '3/4, 0.5, 75%', '1/2, 0.75, 25%', 'B'),

(6, '¿Qué fracción equivale a 50%?',
 '1/4', '2/4', '3/4', '1/3', 'B'),

(6, '¿Cuál de estos valores representa tres cuartos?',
 '25%', '0.5', '75%', '0.2', 'C'),

(6, 'Si marcas 0.25 en una recta numérica, ¿qué valor cae en el mismo lugar?',
 '1/2', '25%', '3/4', '50%', 'B'),

(6, '¿Cuál NO es equivalente a 1/2?',
 '0.5', '50%', '2/4', '0.25', 'D');

-- BLOQUE IV: SEGUIR INSTRUCCIONES ESPACIALES (contenido_id = 7, examen_id = 7)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(7, 'Observa la siguiente secuencia de movimientos en un mapa: flecha arriba, flecha arriba, flecha derecha, flecha abajo, flecha izquierda. Si comenzaste en el punto de partida, ¿en qué posición terminas?',
 '1 paso arriba del inicio', '1 paso a la derecha del inicio', '1 paso arriba y 1 a la derecha', 'En el mismo punto de inicio', 'A'),

(7, 'Una instrucción dice: avanza 3 pasos hacia el norte, luego 2 pasos hacia el este. Si cada paso equivale a una cuadra, ¿cuál es la ubicación final respecto al inicio?',
 '3 cuadras arriba, 2 a la derecha', '3 cuadras arriba, 2 a la izquierda', '2 cuadras arriba, 3 a la derecha', '5 cuadras arriba', 'A'),

(7, 'En un mapa, el norte está hacia arriba. Si una instrucción dice "ve hacia el oeste", ¿hacia qué lado te mueves en el mapa?',
 'Arriba', 'Abajo', 'Derecha', 'Izquierda', 'D'),

(7, '¿Cuál de las siguientes opciones representa el mismo camino que: flecha derecha, flecha derecha, flecha arriba, flecha arriba?',
 '2 pasos a la derecha, 2 pasos arriba', '2 pasos arriba, 2 pasos a la derecha', '1 paso a la derecha, 2 arriba, 1 derecha', '2 pasos abajo, 2 a la izquierda', 'A'),

(7, 'Si estás mirando hacia el sur y te piden que avances hacia tu derecha, ¿hacia qué dirección te mueves?',
 'Norte', 'Sur', 'Este', 'Oeste', 'D'),

(7, 'En un mapa con coordenadas, el punto A está en (2, 3) y el punto B está en (5, 3). ¿Qué instrucción te lleva de A a B?',
 '3 pasos arriba', '3 pasos abajo', '3 pasos a la derecha', '3 pasos a la izquierda', 'C'),

(7, 'Una instrucción dice: desde la entrada, camina hasta el árbol grande, luego gira hacia donde sale el sol y avanza hasta la fuente. ¿Qué dirección tomas después del árbol?',
 'Norte', 'Sur', 'Este', 'Oeste', 'C'),

(7, '¿Qué diferencia hay entre "gira a tu izquierda" y "ve hacia el oeste"?',
 'La primera depende de hacia dónde miras; la segunda es una dirección fija', 'La primera es una dirección fija; la segunda depende de hacia dónde miras', 'Ambas significan lo mismo siempre', 'Ninguna es correcta', 'A'),

(7, 'Si recibes las instrucciones "2 cuadras al sur, 3 cuadras al este, 2 cuadras al norte", ¿en qué posición terminas respecto al inicio?',
 '3 cuadras al este', '3 cuadras al oeste', '2 cuadras al sur', 'En el mismo punto', 'A'),

(7, 'En un mapa, el tesoro está en la coordenada (4, 2). Tú estás en (1, 2). ¿Cuál es la instrucción más directa para llegar?',
 '3 pasos a la derecha', '3 pasos a la izquierda', '3 pasos arriba', '3 pasos abajo', 'A');
