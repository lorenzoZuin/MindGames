export interface SequenceTask {
  id: number;
  title: string;
  steps: string[];
}

export const ORDEN_PASOS_LEVELS: SequenceTask[] = [
  { id: 1, title: "Lavarse las manos", steps: ["Abrir la canilla", "Mojarse las manos", "Ponerse jabón", "Frotarse bien", "Enjuagarse", "Secarse con una toalla"] },
  { id: 2, title: "Hacer un sándwich", steps: ["Tomar dos rebanadas de pan", "Untar aderezo", "Agregar jamón y queso", "Juntar las rebanadas", "Comer el sándwich"] },
  { id: 3, title: "Preparar un té", steps: ["Llenar la pava con agua", "Poner el agua a hervir", "Poner el saquito en la taza", "Servir el agua caliente", "Esperar unos minutos", "Retirar el saquito"] },
  { id: 4, title: "Cepillarse los dientes", steps: ["Agarrar el cepillo", "Poner pasta dental", "Cepillar los dientes", "Enjuagarse la boca", "Lavar el cepillo"] },
  { id: 5, title: "Salir en un día de lluvia", steps: ["Ponerse el abrigo", "Agarrar el paraguas", "Abrir la puerta de casa", "Abrir el paraguas", "Cerrar la puerta y caminar"] },
  { id: 6, title: "Irse a dormir", steps: ["Ponerse el pijama", "Lavarse los dientes", "Meterse en la cama", "Apagar la luz", "Cerrar los ojos"] },
  { id: 7, title: "Plantar una semilla", steps: ["Hacer un pozo en la tierra", "Poner la semilla", "Cubrir con tierra", "Regar con agua", "Esperar a que crezca"] },
  { id: 8, title: "Poner la mesa", steps: ["Limpiar la mesa", "Poner el mantel", "Colocar los platos", "Colocar los cubiertos", "Poner los vasos"] },
  { id: 9, title: "Lavar los platos", steps: ["Juntar los platos sucios", "Poner detergente en la esponja", "Frotar los platos", "Enjuagar con agua", "Dejar secar"] },
  { id: 10, title: "Subir a un auto", steps: ["Encontrar el auto", "Abrir la puerta", "Sentarse en el asiento", "Ponerse el cinturón de seguridad", "Cerrar la puerta"] },
  { id: 11, title: "Cruzar la calle", steps: ["Llegar a la esquina", "Mirar el semáforo", "Mirar a ambos lados", "Esperar a que los autos paren", "Cruzar caminando"] },
  { id: 12, title: "Hacer una llamada telefónica", steps: ["Agarrar el teléfono", "Desbloquear la pantalla", "Buscar el contacto", "Presionar llamar", "Hablar"] },
  { id: 13, title: "Bañar al perro", steps: ["Llevar al perro al agua", "Mojarle el pelo", "Ponerle shampoo", "Frotar y masajear", "Enjuagar bien", "Secarlo con toalla"] },
  { id: 14, title: "Preparar la mochila", steps: ["Abrir la mochila", "Ver los útiles necesarios", "Guardar los cuadernos", "Guardar la cartuchera", "Cerrar el cierre"] },
  { id: 15, title: "Comprar en el supermercado", steps: ["Tomar un carrito", "Elegir los productos", "Ir a la caja", "Pagar la cuenta", "Guardar en bolsas"] },
  { id: 16, title: "Preparar huevos revueltos", steps: ["Romper los huevos en un plato", "Batirlos con un tenedor", "Calentar la sartén", "Volcar los huevos", "Cocinar y servir"] },
  { id: 17, title: "Tomar el colectivo (bus)", steps: ["Ir a la parada", "Esperar que llegue", "Hacerle señas para que pare", "Subir y pagar el boleto", "Buscar un asiento"] },
  { id: 18, title: "Lavar la ropa en lavarropas", steps: ["Separar la ropa por color", "Meter la ropa en el lavarropas", "Poner jabón y suavizante", "Elegir el programa", "Presionar inicio"] },
  { id: 19, title: "Darse una ducha", steps: ["Desvestirse", "Entrar y abrir el agua", "Enjabonarse y lavarse el pelo", "Enjuagarse", "Salir y secarse"] },
  { id: 20, title: "Hacer un regalo", steps: ["Elegir el regalo en la tienda", "Comprarlo", "Envolverlo con papel lindo", "Hacer una tarjeta", "Entregárselo a la persona"] }
];

export const TOTAL_LEVELS_ORDEN = ORDEN_PASOS_LEVELS.length;