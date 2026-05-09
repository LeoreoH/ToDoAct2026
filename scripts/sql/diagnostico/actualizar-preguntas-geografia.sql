BEGIN;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué línea imaginaria divide la Tierra en hemisferio norte y hemisferio sur?',
    opcion_a = 'Meridiano de Greenwich',
    opcion_b = 'Ecuador',
    opcion_c = 'Trópico de Cáncer',
    opcion_d = 'Círculo Polar Ártico'
WHERE id = 1 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál es la causa principal de que existan diferentes zonas térmicas en la Tierra?',
    opcion_a = 'La distancia al Sol',
    opcion_b = 'La forma esférica y la inclinación del eje terrestre',
    opcion_c = 'La rotación de la Tierra',
    opcion_d = 'La presencia de océanos'
WHERE id = 2 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué movimiento de la Tierra causa la sucesión de los días y las noches?',
    opcion_a = 'Traslación',
    opcion_b = 'Rotación',
    opcion_c = 'Precesión',
    opcion_d = 'Nutación'
WHERE id = 3 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuánto tiempo tarda la Tierra en completar su movimiento de traslación alrededor del Sol?',
    opcion_a = '24 horas',
    opcion_b = '30 días',
    opcion_c = '365 días y 6 horas',
    opcion_d = '12 meses exactos'
WHERE id = 4 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué coordenadas geográficas se utilizan para localizar un punto en la superficie terrestre?',
    opcion_a = 'Altitud y profundidad',
    opcion_b = 'Latitud y longitud',
    opcion_c = 'Norte y sur',
    opcion_d = 'Este y oeste'
WHERE id = 5 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué paralelo marca el límite de la zona tropical en el hemisferio norte?',
    opcion_a = 'Ecuador',
    opcion_b = 'Trópico de Capricornio',
    opcion_c = 'Trópico de Cáncer',
    opcion_d = 'Círculo Polar Ártico'
WHERE id = 6 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué estación del año comienza el 21 de junio en el hemisferio norte?',
    opcion_a = 'Primavera',
    opcion_b = 'Verano',
    opcion_c = 'Otoño',
    opcion_d = 'Invierno'
WHERE id = 7 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué tipo de proyección cartográfica distorsiona menos las formas de los continentes cerca del ecuador?',
    opcion_a = 'Mercator',
    opcion_b = 'Robinson',
    opcion_c = 'Goode',
    opcion_d = 'Peters'
WHERE id = 8 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es la altitud?',
    opcion_a = 'Distancia desde el ecuador',
    opcion_b = 'Distancia desde el meridiano de Greenwich',
    opcion_c = 'Distancia vertical respecto al nivel del mar',
    opcion_d = 'Distancia horizontal entre dos puntos'
WHERE id = 9 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Por qué en el ecuador el día y la noche duran casi lo mismo durante todo el año?',
    opcion_a = 'Porque los rayos del sol caen perpendicularmente',
    opcion_b = 'Porque la inclinación del eje no afecta esa zona',
    opcion_c = 'Porque está más cerca del sol',
    opcion_d = 'Porque no hay estaciones'
WHERE id = 10 AND examen_id = 1;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué formas de relieve continental existen?',
    opcion_a = 'Montañas, mesetas, llanuras y depresiones',
    opcion_b = 'Volcanes, ríos, lagos y océanos',
    opcion_c = 'Valles, colinas, dunas y acantilados',
    opcion_d = 'Sierras, cordilleras, penillanuras y fosas'
WHERE id = 11 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué fenómenos naturales son causados por el movimiento de las placas tectónicas?',
    opcion_a = 'Huracanes y tornados',
    opcion_b = 'Sismos y volcanes',
    opcion_c = 'Inundaciones y sequías',
    opcion_d = 'Erosión y sedimentación'
WHERE id = 12 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué porcentaje del agua del planeta es agua dulce disponible para el consumo humano?',
    opcion_a = '97%',
    opcion_b = '3%',
    opcion_c = '1%',
    opcion_d = '0.5%'
WHERE id = 13 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál es el río más largo del mundo?',
    opcion_a = 'Nilo',
    opcion_b = 'Amazonas',
    opcion_c = 'Misisipi',
    opcion_d = 'Yangtsé'
WHERE id = 14 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué factores modifican el clima en la Tierra?',
    opcion_a = 'La latitud, altitud y cercanía al mar',
    opcion_b = 'La rotación y traslación',
    opcion_c = 'Las fases lunares',
    opcion_d = 'Las mareas'
WHERE id = 15 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué región natural se caracteriza por tener árboles densos y altos, con abundantes lluvias?',
    opcion_a = 'Desierto',
    opcion_b = 'Sabana',
    opcion_c = 'Selva tropical',
    opcion_d = 'Taiga'
WHERE id = 16 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Dónde se localizan los climas polares?',
    opcion_a = 'Cerca del ecuador',
    opcion_b = 'En latitudes altas, después de los círculos polares',
    opcion_c = 'En zonas montañosas',
    opcion_d = 'En el centro de los continentes'
WHERE id = 17 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué agente erosivo es el principal modelador del relieve?',
    opcion_a = 'El viento',
    opcion_b = 'El agua',
    opcion_c = 'El hielo',
    opcion_d = 'Los sismos'
WHERE id = 18 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es un manto acuífero?',
    opcion_a = 'Un río subterráneo',
    opcion_b = 'Depósitos de agua en el subsuelo',
    opcion_c = 'Un lago de agua dulce',
    opcion_d = 'Un glaciar'
WHERE id = 19 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué tipo de vegetación predomina en la tundra?',
    opcion_a = 'Árboles de coníferas',
    opcion_b = 'Pastizales',
    opcion_c = 'Líquenes, musgos y hierbas',
    opcion_d = 'Cactus y arbustos'
WHERE id = 20 AND examen_id = 2;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál es el país más poblado del mundo?',
    opcion_a = 'India',
    opcion_b = 'Estados Unidos',
    opcion_c = 'China',
    opcion_d = 'Indonesia'
WHERE id = 21 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es la densidad de población?',
    opcion_a = 'Número total de habitantes de un país',
    opcion_b = 'Número de habitantes por kilómetro cuadrado',
    opcion_c = 'Tasa de natalidad de un país',
    opcion_d = 'Porcentaje de población urbana'
WHERE id = 22 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué característica define a un espacio urbano?',
    opcion_a = 'Predominio de actividades agrícolas',
    opcion_b = 'Alta concentración de población y servicios',
    opcion_c = 'Baja densidad de población',
    opcion_d = 'Viviendas dispersas'
WHERE id = 23 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es la migración?',
    opcion_a = 'El crecimiento natural de la población',
    opcion_b = 'El desplazamiento de personas de un lugar a otro',
    opcion_c = 'La densidad de población',
    opcion_d = 'El censo de población'
WHERE id = 24 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuál es el principal país receptor de migrantes en América?',
    opcion_a = 'México',
    opcion_b = 'Canadá',
    opcion_c = 'Estados Unidos',
    opcion_d = 'Brasil'
WHERE id = 25 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es la cultura?',
    opcion_a = 'El idioma oficial de un país',
    opcion_b = 'Las costumbres, tradiciones y formas de vida de un grupo',
    opcion_c = 'La religión predominante',
    opcion_d = 'El arte de una región'
WHERE id = 26 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Cuántos idiomas aproximadamente se hablan en México?',
    opcion_a = '68',
    opcion_b = '120',
    opcion_c = '288',
    opcion_d = '365'
WHERE id = 27 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué es un país expulsor de migrantes?',
    opcion_a = 'País que recibe muchos inmigrantes',
    opcion_b = 'País del que sale mucha gente a vivir a otro lugar',
    opcion_c = 'País con alta densidad de población',
    opcion_d = 'País con bajo desarrollo'
WHERE id = 28 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Dónde se concentra mayor población rural?',
    opcion_a = 'En países desarrollados',
    opcion_b = 'En países en vías de desarrollo',
    opcion_c = 'En ciudades grandes',
    opcion_d = 'En zonas polares'
WHERE id = 29 AND examen_id = 3;

UPDATE preguntas_diagnostico
SET pregunta = '¿Qué religión tiene más seguidores en el mundo?',
    opcion_a = 'Islam',
    opcion_b = 'Hinduismo',
    opcion_c = 'Budismo',
    opcion_d = 'Cristianismo'
WHERE id = 30 AND examen_id = 3;

COMMIT;
