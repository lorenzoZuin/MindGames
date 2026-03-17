export const ORDERED_PHRASES: string[] = [
  'hoy llueve en la ciudad',
  'mama cocina la sopa',
  'la nina canta feliz',
  'el perro corre rapido',
  'el sol brilla mucho',
  'hoy leo los cuentos cortos',
  'Ana pinta las flores rojas',
  'Luis guarda las llaves nuevas',
  'Mario compra el pan fresco',
  'Clara riega las plantas verdes',
  'hoy camino por el parque tranquilo',
  'Ana prepara el jugo con naranjas',
  'Luis ordena los libros sobre la mesa',
  'Marta limpia los vidrios cada sabado',
  'Pedro escribe cartas para los amigos',
  'Sara escucha la musica durante el estudio',
  'Diego cocina la pasta con tomate',
  'Laura practica el piano todas las tardes',
  'Marcos revisa el correo antes del desayuno',
  'Nora cuida los gatos en la casa',
  'hoy salimos temprano hacia la playa dorada',
  'Ana comparte galletas con los vecinos amables',
  'Luis arregla la bicicleta frente a la escuela primaria',
  'Marta lleva los cuadernos dentro de la mochila azul',
  'Pedro visita el museo durante la tarde lluviosa',
  'Sara aprende recetas usando los videos cortos',
  'Diego organiza fotos para el album familiar',
  'Laura entrega el informe antes de la reunion mensual',
  'Marcos prepara cafe mientras suena la radio',
  'Nora escribe poemas junto a la ventana abierta',
  'hoy visitamos el mercado central para comprar frutas',
  'Ana organiza el escritorio antes de comenzar la tarea diaria',
  'Luis practica ajedrez contra un rival muy paciente',
  'Marta prepara un postre casero para la cena familiar',
  'Pedro cambia la lampara antigua por un modelo moderno',
  'Sara decora el cuaderno nuevo con pegatinas brillantes',
  'Diego revisa el mapa digital antes de salir temprano',
  'Laura ensena pintura acrilica durante el taller nocturno',
  'Marcos instala un programa seguro en la computadora personal',
  'Nora acomoda los zapatos limpios dentro del armario grande',
  'hoy compartimos un desayuno saludable antes de iniciar la jornada escolar',
  'Ana prepara la mochila liviana para las excursiones de montana',
  'Luis organiza documentos importantes dentro de la carpeta resistente azul',
  'Marta corta verduras frescas para cocinar la sopa nutritiva',
  'Pedro limpia la bicicleta nueva despues de recorrer el camino largo',
  'Sara practica respiracion profunda durante las sesiones de meditacion',
  'Diego revisa el calendario semanal para planificar actividades familiares',
  'Laura escribe un resumen completo sobre la lectura de historia',
  'Marcos guarda herramientas pequenas dentro de la caja metalica segura',
  'Nora pinta un mural colorido sobre la pared del patio'
];

export const getPhraseWordsByLevel = (level: number): string[] => {
  const index = Math.max(0, Math.min(level - 1, ORDERED_PHRASES.length - 1));
  return ORDERED_PHRASES[index].split(' ');
};

export const getInfinitePhraseWords = (round: number): string[] => {
  const index = (round - 1) % ORDERED_PHRASES.length;
  return ORDERED_PHRASES[index].split(' ');
};
