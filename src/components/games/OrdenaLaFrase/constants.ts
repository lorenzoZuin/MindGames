export const ORDERED_PHRASES: string[] = [
  'hoy llueve fuerte',
  'mama cocina sopa',
  'nina canta feliz',
  'perro corre rapido',
  'sol brilla mucho',
  'hoy leo cuentos cortos',
  'ana pinta flores rojas',
  'luis guarda llaves nuevas',
  'mario compra pan fresco',
  'clara riega plantas verdes',
  'hoy camino por parque tranquilo',
  'ana prepara jugo con naranjas',
  'luis ordena libros sobre mesa',
  'marta limpia vidrios cada sabado',
  'pedro escribe cartas para amigos',
  'sara escucha musica durante estudio',
  'diego cocina pasta con tomate',
  'laura practica piano todas tardes',
  'marcos revisa correo antes desayuno',
  'nora cuida gatos en casa',
  'hoy salimos temprano hacia playa dorada',
  'ana comparte galletas con vecinos amables',
  'luis arregla bicicleta frente escuela primaria',
  'marta lleva cuadernos dentro mochila azul',
  'pedro visita museo durante tarde lluviosa',
  'sara aprende recetas usando videos cortos',
  'diego organiza fotos para album familiar',
  'laura entrega informe antes reunion mensual',
  'marcos prepara cafe mientras suena radio',
  'nora escribe poemas junto ventana abierta',
  'hoy visitamos mercado central para comprar frutas',
  'ana organiza escritorio antes comenzar tarea diaria',
  'luis practica ajedrez contra rival muy paciente',
  'marta prepara postre casero para cena familiar',
  'pedro cambia lampara antigua por modelo moderno',
  'sara decora cuaderno nuevo con pegatinas brillantes',
  'diego revisa mapa digital antes salir temprano',
  'laura ensena pintura acrilica durante taller nocturno',
  'marcos instala programa seguro en computadora personal',
  'nora acomoda zapatos limpios dentro armario grande',
  'hoy compartimos desayuno saludable antes iniciar jornada escolar',
  'ana prepara mochila liviana para excursiones de montana',
  'luis organiza documentos importantes dentro carpeta resistente azul',
  'marta corta verduras frescas para cocinar sopa nutritiva',
  'pedro limpia bicicleta nueva despues recorrer camino largo',
  'sara practica respiracion profunda durante sesiones de meditacion',
  'diego revisa calendario semanal para planificar actividades familiares',
  'laura escribe resumen completo sobre lectura de historia',
  'marcos guarda herramientas pequenas dentro caja metalica segura',
  'nora pinta mural colorido sobre pared del patio'
];

export const getPhraseWordsByLevel = (level: number): string[] => {
  const index = Math.max(0, Math.min(level - 1, ORDERED_PHRASES.length - 1));
  return ORDERED_PHRASES[index].split(' ');
};

export const getInfinitePhraseWords = (round: number): string[] => {
  const index = (round - 1) % ORDERED_PHRASES.length;
  return ORDERED_PHRASES[index].split(' ');
};
