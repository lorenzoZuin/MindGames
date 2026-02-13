# Colores: Desafio mental

Una aplicación web interactiva para desafiar tu mente con un juego de colores y palabras. Identifica rápidamente el color correcto cuando el nombre de un color aparece escrito en un color diferente.

## Descripcion

Es un juego para entrenar tu capacidad de concentración y velocidad de reacción. El juego presenta el nombre de un color escrito en un color diferente, y debes seleccionar la opción que corresponde al color en el que está escrito el texto, no el color que dice la palabra. Este es un ejemplo del efecto Stroop, un fenómeno psicológico bien conocido.

## Despliegue
Se puede ver el juegop desplegado en el siguiente link.
https://mind-games-eight.vercel.app/

## Características

- 50 niveles progresivos con dificultad creciente
- Sistema de 3 estrellas basado en velocidad y precisión
- Modo Infinito para jugar sin límite de niveles
- 10 colores diferentes en cada desafío
- Sonidos de feedback auditivo
- Progreso guardado automáticamente en localStorage
- Interfaz responsiva (móvil, tablet, desktop)

## Requisitos

- Node.js 18+
- npm o yarn

## Instalacion

1. Clona o descarga el repositorio:
```bash
cd MindGames
```

2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Uso

La aplicación se cargará en `http://localhost:5173`

### Sistema de Estrellas

- 3 estrellas: Completado en menos de 16 segundos sin errores
- 2 estrellas: Completado en menos de 25 segundos con máximo 1 error
- 1 estrella: Completado dentro del tiempo

### Modo Infinito

- Juega sin límite de niveles
- La dificultad aumenta con cada acierto
- Guarda tu puntaje final al terminar

## Estructura del Proyecto

```
src/
├── App.tsx                 # Componente principal y gestión de estado
├── index.tsx              # Punto de entrada de React
├── index.html             # HTML base
├── constants.ts           # Configuración y datos estáticos
├── types.ts               # Tipos de TypeScript
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── metadata.json          # Metadatos de la aplicación
├── components/
│   ├── MainMenu.tsx       # Pantalla principal
│   ├── LevelSelector.tsx  # Selector de niveles
│   ├── GameBoard.tsx      # Tablero principal del juego
│   └── ResultScreen.tsx   # Pantalla de resultados
└── services/
    └── geminiService.ts   # Integración con API de Google Gemini
```

## Tecnologias Utilizadas

- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS
- Google Generative AI

## Scripts

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa de la compilación de producción

## Autor

Proyecto creado por Lorenzo Zuin
