TRUNCATE preguntas_diagnostico RESTART IDENTITY;
INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(1, '¿Qué es el Sol?', 'Un planeta', 'Una estrella', 'Una luna', 'Un cometa', 'B'),
(1, '¿Qué gira alrededor del Sol?', 'Solo la Tierra', 'Los planetas', 'Las estrellas', 'Las galaxias', 'B'),
(1, '¿En qué planeta vivimos?', 'Marte', 'Venus', 'Tierra', 'Júpiter', 'C'),
(1, '¿Cuál es el planeta más grande del Sistema Solar?', 'Marte', 'Tierra', 'Júpiter', 'Mercurio', 'C'),
(1, '¿Qué causa el día y la noche?', 'El Sol gira alrededor de la Tierra', 'La Tierra gira sobre sí misma', 'La Luna tapa el Sol', 'El Sol se apaga por la noche', 'B'),
(1, '¿Qué planeta es famoso por sus anillos?', 'Saturno', 'Marte', 'Venus', 'Tierra', 'A'),
(1, '¿Qué es la Luna?', 'Un planeta', 'Una estrella', 'Un satélite natural de la Tierra', 'Un cometa', 'C'),
(1, '¿Cómo se llaman los objetos que giran alrededor de los planetas?', 'Estrellas', 'Satélites', 'Cometas', 'Galaxias', 'B'),
(1, '¿Qué tipo de planeta es Júpiter?', 'Rocoso como la Tierra', 'Un planeta gigante formado principalmente por gases', 'Una estrella pequeña', 'Un planeta de hielo sólido', 'B'),
(1, '¿Por qué existen las estaciones del año?', 'Porque la Tierra está inclinada', 'Porque el Sol cambia de tamaño', 'Porque la Luna cambia', 'Porque la Tierra se detiene', 'A');
