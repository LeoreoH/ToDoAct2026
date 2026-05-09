-- INSERTAR PREGUNTAS DE DIAGNÓSTICO - GEOGRAFÍA

SET client_encoding TO 'UTF8';

-- BLOQUE I: LA TIERRA (contenido_id = 1, examen_id = 1)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(1, '¿Qué línea imaginaria divide la Tierra en hemisferio norte y hemisferio sur?',
 'Meridiano de Greenwich', 'Ecuador', 'Trópico de Cáncer', 'Círculo Polar Ártico', 'B'),

(1, '¿Cuál es la causa principal de que existan diferentes zonas térmicas en la Tierra?',
 'La distancia al Sol', 'La forma esférica y la inclinación del eje terrestre', 'La rotación de la Tierra', 'La presencia de océanos', 'B'),

(1, '¿Qué movimiento de la Tierra causa la sucesión de los días y las noches?',
 'Traslación', 'Rotación', 'Precesión', 'Nutación', 'B'),

(1, '¿Cuánto tiempo tarda la Tierra en completar su movimiento de traslación alrededor del Sol?',
 '24 horas', '30 días', '365 días y 6 horas', '12 meses exactos', 'C'),

(1, '¿Qué coordenadas geográficas se utilizan para localizar un punto en la superficie terrestre?',
 'Altitud y profundidad', 'Latitud y longitud', 'Norte y sur', 'Este y oeste', 'B'),

(1, '¿Qué paralelo marca el límite de la zona tropical en el hemisferio norte?',
 'Ecuador', 'Trópico de Capricornio', 'Trópico de Cáncer', 'Círculo Polar Ártico', 'C'),

(1, '¿Qué estación del año comienza el 21 de junio en el hemisferio norte?',
 'Primavera', 'Verano', 'Otoño', 'Invierno', 'B'),

(1, '¿Qué tipo de proyección cartográfica distorsiona menos las formas de los continentes cerca del ecuador?',
 'Mercator', 'Robinson', 'Goode', 'Peters', 'B'),

(1, '¿Qué es la altitud?',
 'Distancia desde el ecuador', 'Distancia desde el meridiano de Greenwich', 'Distancia vertical respecto al nivel del mar', 'Distancia horizontal entre dos puntos', 'C'),

(1, '¿Por qué en el ecuador el día y la noche duran casi lo mismo durante todo el año?',
 'Porque los rayos del sol caen perpendicularmente', 'Porque la inclinación del eje no afecta esa zona', 'Porque está más cerca del sol', 'Porque no hay estaciones', 'B');

-- BLOQUE II: COMPONENTES NATURALES (contenido_id = 2, examen_id = 2)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(2, '¿Qué formas de relieve continental existen?',
 'Montañas, mesetas, llanuras y depresiones', 'Volcanes, ríos, lagos y océanos', 'Valles, colinas, dunas y acantilados', 'Sierras, cordilleras, penillanuras y fosas', 'A'),

(2, '¿Qué fenómenos naturales son causados por el movimiento de las placas tectónicas?',
 'Huracanes y tornados', 'Sismos y volcanes', 'Inundaciones y sequías', 'Erosión y sedimentación', 'B'),

(2, '¿Qué porcentaje del agua del planeta es agua dulce disponible para el consumo humano?',
 '97%', '3%', '1%', '0.5%', 'C'),

(2, '¿Cuál es el río más largo del mundo?',
 'Nilo', 'Amazonas', 'Misisipi', 'Yangtsé', 'B'),

(2, '¿Qué factores modifican el clima en la Tierra?',
 'La latitud, altitud y cercanía al mar', 'La rotación y traslación', 'Las fases lunares', 'Las mareas', 'A'),

(2, '¿Qué región natural se caracteriza por tener árboles densos y altos, con abundantes lluvias?',
 'Desierto', 'Sabana', 'Selva tropical', 'Taiga', 'C'),

(2, '¿Dónde se localizan los climas polares?',
 'Cerca del ecuador', 'En latitudes altas, después de los círculos polares', 'En zonas montañosas', 'En el centro de los continentes', 'B'),

(2, '¿Qué agente erosivo es el principal modelador del relieve?',
 'El viento', 'El agua', 'El hielo', 'Los sismos', 'B'),

(2, '¿Qué es un manto acuífero?',
 'Un río subterráneo', 'Depósitos de agua en el subsuelo', 'Un lago de agua dulce', 'Un glaciar', 'B'),

(2, '¿Qué tipo de vegetación predomina en la tundra?',
 'Árboles de coníferas', 'Pastizales', 'Líquenes, musgos y hierbas', 'Cactus y arbustos', 'C');


-- BLOQUE III: POBLACIÓN MUNDIAL (contenido_id = 3, examen_id = 3)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(3, '¿Cuál es el país más poblado del mundo?',
 'India', 'Estados Unidos', 'China', 'Indonesia', 'C'),

(3, '¿Qué es la densidad de población?',
 'Número total de habitantes de un país', 'Número de habitantes por kilómetro cuadrado', 'Tasa de natalidad de un país', 'Porcentaje de población urbana', 'B'),

(3, '¿Qué característica define a un espacio urbano?',
 'Predominio de actividades agrícolas', 'Alta concentración de población y servicios', 'Baja densidad de población', 'Viviendas dispersas', 'B'),

(3, '¿Qué es la migración?',
 'El crecimiento natural de la población', 'El desplazamiento de personas de un lugar a otro', 'La densidad de población', 'El censo de población', 'B'),

(3, '¿Cuál es el principal país receptor de migrantes en América?',
 'México', 'Canadá', 'Estados Unidos', 'Brasil', 'C'),

(3, '¿Qué es la cultura?',
 'El idioma oficial de un país', 'Las costumbres, tradiciones y formas de vida de un grupo', 'La religión predominante', 'El arte de una región', 'B'),

(3, '¿Cuántos idiomas aproximadamente se hablan en México?',
 '68', '120', '288', '365', 'C'),

(3, '¿Qué es un país expulsor de migrantes?',
 'País que recibe muchos inmigrantes', 'País del que sale mucha gente a vivir a otro lugar', 'País con alta densidad de población', 'País con bajo desarrollo', 'B'),

(3, '¿Dónde se concentra mayor población rural?',
 'En países desarrollados', 'En países en vías de desarrollo', 'En ciudades grandes', 'En zonas polares', 'B'),

(3, '¿Qué religión tiene más seguidores en el mundo?',
 'Islam', 'Hinduismo', 'Budismo', 'Cristianismo', 'D');
