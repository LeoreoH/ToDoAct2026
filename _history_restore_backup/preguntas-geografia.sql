-- INSERTAR PREGUNTAS DE DIAGNÓSTICO - GEOGRAFÍA

SET client_encoding TO 'UTF8';

-- BLOQUE I: LA TIERRA (contenido_id = 1, examen_id = 1)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(1, 'Que linea imaginaria divide la Tierra en hemisferio norte y hemisferio sur?', 
 'Meridiano de Greenwich', 'Ecuador', 'Tropico de Cancer', 'Circulo Polar Artico', 'B'),

(1, 'Cual es la causa principal de que existan diferentes zonas termicas en la Tierra?', 
 'La distancia al Sol', 'La forma esferica y la inclinacion del eje terrestre', 'La rotacion de la Tierra', 'La presencia de oceanos', 'B'),

(1, 'Que movimiento de la Tierra causa la sucesion de los dias y las noches?', 
 'Traslacion', 'Rotacion', 'Precesion', 'Nutacion', 'B'),

(1, 'Cuanto tiempo tarda la Tierra en completar su movimiento de traslacion alrededor del Sol?', 
 '24 horas', '30 dias', '365 dias y 6 horas', '12 meses exactos', 'C'),

(1, 'Que coordenadas geograficas se utilizan para localizar un punto en la superficie terrestre?', 
 'Altitud y profundidad', 'Latitud y longitud', 'Norte y sur', 'Este y oeste', 'B'),

(1, 'Que paralelo marca el limite de la zona tropical en el hemisferio norte?', 
 'Ecuador', 'Tropico de Capricornio', 'Tropico de Cancer', 'Circulo Polar Artico', 'C'),

(1, 'Que estacion del año comienza el 21 de junio en el hemisferio norte?', 
 'Primavera', 'Verano', 'Otoño', 'Invierno', 'B'),

(1, 'Que tipo de proyeccion cartografica distorsiona menos las formas de los continentes cerca del ecuador?', 
 'Mercator', 'Robinson', 'Goode', 'Peters', 'B'),

(1, 'Que es la altitud?', 
 'Distancia desde el ecuador', 'Distancia desde el meridiano de Greenwich', 'Distancia vertical respecto al nivel del mar', 'Distancia horizontal entre dos puntos', 'C'),

(1, 'Por que en el ecuador el dia y la noche duran casi lo mismo durante todo el año?', 
 'Porque los rayos del sol caen perpendicularmente', 'Porque la inclinacion del eje no afecta esa zona', 'Porque esta mas cerca del sol', 'Porque no hay estaciones', 'B');

-- BLOQUE II: COMPONENTES NATURALES (contenido_id = 2, examen_id = 2)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(2, 'Que formas de relieve continental existen?', 
 'Montañas, mesetas, llanuras y depresiones', 'Volcanes, rios, lagos y oceanos', 'Valles, colinas, dunas y acantilados', 'Sierras, cordilleras, penillanuras y fosas', 'A'),

(2, 'Que fenomenos naturales son causados por el movimiento de las placas tectonicas?', 
 'Huracanes y tornados', 'Sismos y volcanes', 'Inundaciones y sequias', 'Erosion y sedimentacion', 'B'),

(2, 'Que porcentaje del agua del planeta es agua dulce disponible para el consumo humano?', 
 '97%', '3%', '1%', '0.5%', 'C'),

(2, 'Cual es el rio mas largo del mundo?', 
 'Nilo', 'Amazonas', 'Misisipi', 'Yangtsé', 'B'),

(2, 'Que factores modifican el clima en la Tierra?', 
 'La latitud, altitud y cercania al mar', 'La rotacion y traslacion', 'Las fases lunares', 'Las mareas', 'A'),

(2, 'Que region natural se caracteriza por tener arboles densos y altos, con abundantes lluvias?', 
 'Desierto', 'Sabana', 'Selva tropical', 'Taiga', 'C'),

(2, 'Donde se localizan los climas polares?', 
 'Cerca del ecuador', 'En latitudes altas, despues de los circulos polares', 'En zonas montañosas', 'En el centro de los continentes', 'B'),

(2, 'Que agente erosivo es el principal modelador del relieve?', 
 'El viento', 'El agua', 'El hielo', 'Los sismos', 'B'),

(2, 'Que es un manto acuifero?', 
 'Un rio subterraneo', 'Depositos de agua en el subsuelo', 'Un lago de agua dulce', 'Un glaciar', 'B'),

(2, 'Que tipo de vegetacion predomina en la tundra?', 
 'Arboles de coniferas', 'Pastizales', 'Liquenes, musgos y hierbas', 'Cactus y arbustos', 'C');


-- BLOQUE III: POBLACION MUNDIAL (contenido_id = 3, examen_id = 3)

INSERT INTO preguntas_diagnostico (examen_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta) VALUES
(3, 'Cual es el pais mas poblado del mundo?', 
 'India', 'Estados Unidos', 'China', 'Indonesia', 'C'),

(3, 'Que es la densidad de poblacion?', 
 'Numero total de habitantes de un pais', 'Numero de habitantes por kilometro cuadrado', 'Tasa de natalidad de un pais', 'Porcentaje de poblacion urbana', 'B'),

(3, 'Que caracteristica define a un espacio urbano?', 
 'Predominio de actividades agricolas', 'Alta concentracion de poblacion y servicios', 'Baja densidad de poblacion', 'Viviendas dispersas', 'B'),

(3, 'Que es la migracion?', 
 'El crecimiento natural de la poblacion', 'El desplazamiento de personas de un lugar a otro', 'La densidad de poblacion', 'El censo de poblacion', 'B'),

(3, 'Cual es el principal pais receptor de migrantes en America?', 
 'Mexico', 'Canada', 'Estados Unidos', 'Brasil', 'C'),

(3, 'Que es la cultura?', 
 'El idioma oficial de un pais', 'Las costumbres, tradiciones y formas de vida de un grupo', 'La religion predominante', 'El arte de una region', 'B'),

(3, 'Cuantos idiomas aproximadamente se hablan en Mexico?', 
 '68', '120', '288', '365', 'C'),

(3, 'Que es un pais expulsor de migrantes?', 
 'Pais que recibe muchos inmigrantes', 'Pais del que sale mucha gente a vivir a otro lugar', 'Pais con alta densidad de poblacion', 'Pais con bajo desarrollo', 'B'),

(3, 'Donde se concentra mayor poblacion rural?', 
 'En paises desarrollados', 'En paises en vias de desarrollo', 'En ciudades grandes', 'En zonas polares', 'B'),

(3, 'Que religion tiene mas seguidores en el mundo?', 
 'Islam', 'Hinduismo', 'Budismo', 'Cristianismo', 'D');