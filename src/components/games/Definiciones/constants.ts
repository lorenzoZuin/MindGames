export interface DefinitionItem {
  word: string;
  definition: string;
}

export const DEFINITIONS: DefinitionItem[] = [
  { word: 'sol', definition: 'Estrella que ilumina la Tierra durante el dia.' },
  { word: 'luna', definition: 'Satelite natural que orbita la Tierra.' },
  { word: 'mar', definition: 'Gran extension de agua salada.' },
  { word: 'rio', definition: 'Corriente natural de agua que fluye hacia otro cauce.' },
  { word: 'montana', definition: 'Elevacion natural alta del terreno.' },
  { word: 'bosque', definition: 'Lugar con gran cantidad de arboles y vegetacion.' },
  { word: 'flor', definition: 'Parte colorida de muchas plantas que produce semillas.' },
  { word: 'semilla', definition: 'Estructura de la planta que puede generar una nueva planta.' },
  { word: 'raiz', definition: 'Parte de la planta que absorbe agua y nutrientes del suelo.' },
  { word: 'fruta', definition: 'Alimento de origen vegetal que contiene semillas.' },
  { word: 'perro', definition: 'Animal domestico conocido por su lealtad.' },
  { word: 'gato', definition: 'Animal domestico agil que suele maullar.' },
  { word: 'ave', definition: 'Animal con plumas y pico, muchas veces capaz de volar.' },
  { word: 'pez', definition: 'Animal acuatico que respira por branquias.' },
  { word: 'hormiga', definition: 'Insecto pequeno que vive en colonias organizadas.' },
  { word: 'libro', definition: 'Conjunto de hojas con texto para leer y aprender.' },
  { word: 'lapiz', definition: 'Objeto que se usa para escribir o dibujar sobre papel.' },
  { word: 'silla', definition: 'Mueble con respaldo para sentarse.' },
  { word: 'mesa', definition: 'Mueble con superficie plana para apoyar objetos.' },
  { word: 'puerta', definition: 'Estructura que permite entrar o salir de un lugar.' },
  { word: 'ventana', definition: 'Abertura en una pared que deja pasar luz y aire.' },
  { word: 'escuela', definition: 'Lugar donde se ensena y se aprende.' },
  { word: 'maestra', definition: 'Persona que ensena a estudiantes.' },
  { word: 'reloj', definition: 'Objeto que marca y muestra la hora.' },
  { word: 'calendario', definition: 'Sistema para organizar dias, semanas y meses.' },
  { word: 'familia', definition: 'Grupo de personas unidas por parentesco o afecto.' },
  { word: 'amigo', definition: 'Persona con la que compartes confianza y compania.' },
  { word: 'musica', definition: 'Arte de combinar sonidos con ritmo y melodia.' },
  { word: 'pintura', definition: 'Arte de crear imagenes usando colores y trazos.' },
  { word: 'deporte', definition: 'Actividad fisica con reglas que mejora habilidades y salud.' },
  { word: 'correr', definition: 'Moverse rapido con pasos largos.' },
  { word: 'saltar', definition: 'Elevar el cuerpo del suelo con impulso.' },
  { word: 'pensar', definition: 'Usar la mente para analizar ideas o resolver problemas.' },
  { word: 'leer', definition: 'Interpretar letras y palabras para comprender un texto.' },
  { word: 'escribir', definition: 'Representar ideas con letras y palabras.' },
  { word: 'hablar', definition: 'Expresar ideas o emociones con la voz.' },
  { word: 'escuchar', definition: 'Prestar atencion a sonidos o palabras.' },
  { word: 'caminar', definition: 'Desplazarse paso a paso sin correr.' },
  { word: 'cocina', definition: 'Espacio del hogar donde se preparan alimentos.' },
  { word: 'hospital', definition: 'Lugar donde se atiende y cuida la salud de las personas.' },
  { word: 'ciudad', definition: 'Zona urbana grande con muchas calles y edificios.' },
  { word: 'pueblo', definition: 'Comunidad pequena con menos habitantes que una ciudad.' },
  { word: 'camino', definition: 'Via por la que se transita para llegar a un destino.' },
  { word: 'puente', definition: 'Estructura que permite cruzar un rio, valle u obstaculo.' },
  { word: 'nube', definition: 'Conjunto visible de gotas de agua en el cielo.' },
  { word: 'lluvia', definition: 'Agua que cae de las nubes en forma de gotas.' },
  { word: 'viento', definition: 'Movimiento del aire en la atmosfera.' },
  { word: 'fuego', definition: 'Fenomeno que produce calor, luz y llama por combustion.' },
  { word: 'hielo', definition: 'Agua en estado solido por bajas temperaturas.' },
  { word: 'arena', definition: 'Conjunto de granos finos de roca que suele estar en playas.' },
  { word: 'playa', definition: 'Orilla de mar o rio cubierta de arena o piedras.' },
  { word: 'isla', definition: 'Porcion de tierra rodeada de agua por todos lados.' },
  { word: 'tren', definition: 'Medio de transporte que circula por vias.' },
  { word: 'avion', definition: 'Vehiculo que vuela por el aire y transporta personas o carga.' },
  { word: 'bicicleta', definition: 'Vehiculo de dos ruedas que se impulsa con pedales.' }
];

const shuffle = <T,>(items: T[]): T[] => {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const getOptionsCount = (level: number): number => {
  if (level <= 5) return 2;
  if (level <= 15) return 3;
  if (level <= 25) return 4;
  if (level <= 35) return 5;
  return 6;
};

export const getRoundByLevel = (level: number) => {
  const optionsCount = getOptionsCount(level);
  const target = DEFINITIONS[(Math.max(level, 1) - 1) % DEFINITIONS.length];
  const distractors = shuffle(
    DEFINITIONS.filter((item) => item.word !== target.word).map((item) => item.word),
  ).slice(0, optionsCount - 1);

  const options = shuffle([target.word, ...distractors]);

  return {
    target,
    options,
    optionsCount,
  };
};

export const getRoundForInfinite = (round: number) => {
  return getRoundByLevel(round);
};
