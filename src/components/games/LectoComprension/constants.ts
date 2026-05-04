export interface LectoQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
}

export interface ReadingText {
  id: number;
  title: string;
  paragraphs: string[];
  questions: LectoQuestion[]; // Length 5 (one for each level in the 5-level span)
}

export const LECTO_TEXTS: ReadingText[] = [
  {
    id: 1,
    title: "El Descubrimiento del Café",
    paragraphs: [
      "Cuenta la leyenda que en las montañas de Etiopía, un joven pastor llamado Kaldi notó un comportamiento inusual en sus cabras. Después de comer los frutos rojos de un arbusto desconocido, los animales saltaban con una energía desbordante y no dormían en toda la noche. Intrigado por este fenómeno, Kaldi decidió probar él mismo las bayas, experimentando la misma sensación de vitalidad y asombro.",
      "Kaldi compartió su hallazgo con unos monjes de un monasterio cercano. Al principio, los monjes consideraron que las bayas eran obra del diablo y las arrojaron al fuego. Sin embargo, al tostarse, las semillas desprendieron un aroma tan cautivador que decidieron recuperarlas de las brasas. Las molieron y las disolvieron en agua caliente, creando así la primera taza de café, la cual utilizaron para mantenerse despiertos durante sus largas horas de oración nocturna.",
      "Con el paso del tiempo, el conocimiento sobre esta bebida estimulante se extendió rápidamente. Viajó a través de la Península Arábiga y llegó a Europa, donde los primeros cafés se convirtieron en centros de intercambio intelectual y cultural. Hoy en día, el café no solo es una de las bebidas más consumidas en el mundo, sino que también representa un pilar económico fundamental para muchos países en vías de desarrollo."
    ],
    questions: [
      {
        // Level 1: Literal / muy directa
        question: "¿Qué animales fueron los primeros en comer el fruto del café según la leyenda?",
        options: ["Ovejas", "Cabras", "Caballos", "Camellos"],
        correctAnswer: 1
      },
      {
        // Level 2: Detalle específico
        question: "¿Cuál fue la primera reacción de los monjes al ver las bayas?",
        options: ["Prepararon una infusión inmediatamente", "Las sembraron en su huerto", "Las tiraron al fuego pensando que eran malas", "Se las comieron crudas"],
        correctAnswer: 2
      },
      {
        // Level 3: Comprensión de causa y efecto
        question: "¿Por qué los monjes decidieron hacer una bebida con las semillas tostadas?",
        options: ["Porque querían calentar sus cuerpos en invierno", "Por el delicioso aroma que desprendieron al quemarse", "Porque no tenían otra cosa para comer ese día", "Para dársela a los animales enfermos"],
        correctAnswer: 1
      },
      {
        // Level 4: Inferencia
        question: "¿Qué papel jugaron los primeros establecimientos de café en Europa?",
        options: ["Fueron lugares de oración silenciosa", "Sirvieron exclusivamente para vender semillas", "Fueron espacios donde la gente compartía ideas y cultura", "Eran hospitales para tratar el cansancio"],
        correctAnswer: 2
      },
      {
        // Level 5: Análisis global / conclusión
        question: "¿Cuál es la idea principal del último párrafo?",
        options: ["Explicar el proceso de tueste y molienda", "Describir el impacto cultural y económico global del café desde su expansión", "Detallar cómo preparar la mejor taza de café", "Criticar el consumo excesivo de esta bebida"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 2,
    title: "El Mundo de los Corales",
    paragraphs: [
      "Los arrecifes de coral se encuentran entre los ecosistemas más diversos y biológicamente complejos de nuestro planeta. A menudo se les llama las 'selvas tropicales del mar' porque proporcionan refugio, hábitat y alimento a más de una cuarta parte de todas las especies marinas, a pesar de cubrir menos del uno por ciento de la superficie del océano profundo. Son estructuras vivas, formadas por colonias de diminutos animales llamados pólipos.",
      "Estos pólipos tienen una relación simbiótica imprescindible con unas algas microscópicas llamadas zooxantelas, que viven en sus tejidos. Las algas, a través del proceso de fotosíntesis, proporcionan al coral los nutrientes vitales y los colores vibrantes que los caracterizan. A cambio, el coral ofrece a las algas un entorno seguro y los compuestos necesarios para que realicen la fotosíntesis.",
      "Desafortunadamente, los arrecifes de coral enfrentan amenazas sin precedentes en la actualidad. El aumento de las temperaturas oceánicas provocado por el cambio climático causa un fenómeno conocido como 'blanqueamiento del coral', en el cual los pólipos, al estar estresados, expulsan a las algas. Sin estas algas, los corales pierden su principal fuente de alimento y su color, volviéndose blancos y vulnerables a las enfermedades, lo cual pone en peligro a miles de especies que dependen de ellos."
    ],
    questions: [
      {
        // Level 6
        question: "¿Cómo se llama el animal diminuto que forma los arrecifes de coral?",
        options: ["Zooxantela", "Pólipo", "Esponja", "Alga"],
        correctAnswer: 1
      },
      {
        // Level 7
        question: "¿Qué proporcionan las algas a los corales?",
        options: ["Protección contra depredadores", "Corrientes marinas cálidas", "Nutrientes y colores vibrantes", "Refugio seguro en la roca"],
        correctAnswer: 2
      },
      {
        // Level 8
        question: "¿Qué significa la expresión 'selvas tropicales del mar'?",
        options: ["Que hay muchos árboles creciendo bajo el agua", "Que son ecosistemas con una enorme diversidad de especies", "Que solo se encuentran en Sudamérica y África tropical", "Que reciben mucha lluvia de forma constante"],
        correctAnswer: 1
      },
      {
        // Level 9
        question: "¿Cuál es la causa principal del blanqueamiento de los corales?",
        options: ["La contaminación por plásticos", "El aumento progresivo de la temperatura del océano", "La pesca excesiva e irresponsable", "Las tormentas tropicales fuertes"],
        correctAnswer: 1
      },
      {
        // Level 10
        question: "¿Qué consecuencia directa tiene la expulsión de las zooxantelas para el coral?",
        options: ["Se reproduce más rápido", "Crece hasta formar islas pequeñas", "Pierde su fuente principal de alimento y puede enfermar", "Adquiere nuevos colores brillantes para atraer más peces"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 3,
    title: "La Evolución de la Escritura",
    paragraphs: [
      "La invención de la escritura representa uno de los saltos más importantes en la historia de la humanidad, marcando la frontera entre la prehistoria y la historia documentada. Los primeros sistemas de escritura conocidos surgieron de manera independiente en diferentes regiones, siendo uno de los más antiguos la escritura cuneiforme desarrollada en Sumeria, Mesopotamia, alrededor del 3200 a. C. Al principio, utilizaban pictogramas muy simples que representaban objetos o animales.",
      "Conforme las sociedades se volvieron más complejas, la necesidad de llevar registros precisos impulsó la evolución de la escritura. Los caracteres cuneiformes, hechos con cuñas sobre tablillas de arcilla blanda, dejaron de ser simples dibujos para convertirse en símbolos fonéticos y representaciones abstractas de conceptos. Esto permitió la redacción de las primeras leyes escritas, registros contables e incluso obras literarias épicas que han perdurado en el tiempo.",
      "Posteriormente, los fenicios revolucionaron este sistema al desarrollar un alfabeto compuesto únicamente por consonantes, en el que cada símbolo representaba un sonido específico en lugar de una palabra entera. Este invento simplificó drásticamente el aprendizaje y la difusión de la escritura. Los griegos adoptaron el alfabeto fenicio y añadieron las vocales, sentando las bases de la gran mayoría de los sistemas alfabéticos occidentales que usamos en la actualidad."
    ],
    questions: [
      {
        question: "¿Dónde se desarrolló la escritura cuneiforme?",
        options: ["Egipto", "Fenicia", "Sumeria", "Grecia"],
        correctAnswer: 2
      },
      {
        question: "¿Qué marcaba la diferencia entre un pictograma inicial y un símbolo abstracto en Mesopotamia?",
        options: ["El pictograma representaba un sonido, y el abstracto un objeto", "El pictograma representaba un objeto, y el abstracto podía ser un concepto", "Eran exactamente iguales pero de distinto tamaño", "Uno se hacía en papel y otro en arcilla"],
        correctAnswer: 1
      },
      {
        question: "¿Sobre qué material escribían principalmente los sumerios?",
        options: ["Papel papiro", "Piel de animales", "Tablillas de arcilla blanda", "Paredes de piedra"],
        correctAnswer: 2
      },
      {
        question: "¿Cuál fue el principal aporte de los fenicios a la escritura?",
        options: ["Fueron los inventores de las vocales", "Desarrollaron un alfabeto basado solo en consonantes", "Fueron los primeros en escribir literatura de ficción", "Inventaron el papel pergamino"],
        correctAnswer: 1
      },
      {
        question: "¿Qué efecto tuvo la innovación griega sobre el alfabeto fenicio?",
        options: ["Hizo que el alfabeto fuera más largo y complicado de leer", "Completó el modelo fonético e influyó en los demás alfabetos occidentales", "Lo mantuvo exactamente igual sin alteraciones", "Sustituyó todas las consonantes por símbolos cuneiformes"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 4,
    title: "El Enigma de los Agujeros Negros",
    paragraphs: [
      "Un agujero negro es una región del espacio donde la fuerza de gravedad es tan extraordinariamente intensa que nada, ni siquiera la luz, puede escapar de su atracción. Estas entidades cósmicas se forman cuando estrellas masivas, que superan ampliamente el tamaño de nuestro sol, agotan su combustible nuclear al final de sus vidas. Incapaces de sostener su propio peso, colapsan sobre sí mismas en una explosión monumental conocida como supernova.",
      "La 'superficie' que delimita un agujero negro se denomina 'horizonte de sucesos'. Es un punto de no retorno absoluto: cualquier objeto, planeta o rayo de luz que cruce este límite invisible está inevitablemente destinado a caer hacia el centro del agujero negro. En su núcleo reside lo que los físicos llaman 'singularidad', un concepto teórico donde la materia se comprime en un espacio casi infinitamente pequeño y las leyes conocidas de la física dejan de funcionar.",
      "A pesar de que no pueden ser observados de forma directa porque no emiten luz, los astrónomos deducen la presencia de agujeros negros estudiando el comportamiento de los astros a su alrededor. Si ven estrellas orbitando a velocidades inusuales alrededor de un punto oscuro, o detectan grandes emisiones de rayos X provenientes de gas que se calienta al ser atraído violentamente, asumen que allí probablemente existe uno de los mayores misterios del universo."
    ],
    questions: [
      {
        question: "¿Qué pasa con la luz cuando se acerca a un agujero negro?",
        options: ["Se refleja y brilla más fuerte", "Se convierte en calor instantáneo", "Es absorbida y no puede escapar", "Atraviesa el agujero en línea recta"],
        correctAnswer: 2
      },
      {
        question: "¿De qué se originan los agujeros negros, según el texto?",
        options: ["Del choque frontal de dos planetas gigantes", "Del colapso de estrellas muy masivas que mueren", "De nubes de polvo estelar que flotan en el vacío", "De explosiones en el centro del sol"],
        correctAnswer: 1
      },
      {
        question: "¿Qué nombre recibe el límite que, una vez cruzado, impide regresar de un agujero negro?",
        options: ["El punto de inicio cósmico", "La frontera oscura", "El horizonte de sucesos", "La singularidad luminosa"],
        correctAnswer: 2
      },
      {
        question: "¿Qué es supuestamente una 'singularidad' en la astrofísica?",
        options: ["Un espacio sin gravedad en absoluto", "Una zona gigante llena de estrellas muy brillantes", "Un punto tan comprimido donde las leyes físicas conocidas fallan", "Un sol que nunca se apaga"],
        correctAnswer: 2
      },
      {
        question: "¿Cómo logran detectar los científicos un objeto que es invisible a nuestros ojos?",
        options: ["Escuchando el sonido que emiten en el vacío", "Observando el movimiento acelerado de objetos cercanos y la radiación que emiten al caer", "Mandando sondas espaciales que toman fotos de cerca", "Calculando la cantidad de luz que emiten por sus polos"],
        correctAnswer: 1
      }
    ]
  }
];

export const TOTAL_LEVELS_LECTO = 20; // 4 texts * 5 questions each
