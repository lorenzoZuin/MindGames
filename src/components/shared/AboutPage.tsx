import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-200 px-4 sm:px-6 md:px-14 py-6 sm:py-8 md:py-14 mx-4 sm:mx-6 md:mx-0">
      <header className="mb-6 md:mb-10">
        <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2 md:mb-3">
          Sobre MindGames
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-slate-900 leading-tight">
          Entrenamiento cognitivo accesible para adultos mayores
        </h1>
      </header>
      <article className="space-y-5 md:space-y-9 text-base sm:text-lg md:text-2xl text-slate-700 leading-relaxed md:leading-relaxed">
    
        <div className="space-y-2 md:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-900">Para quién está pensada</h2>
            <p>
                MindGames es una aplicación de ejercicios mentales destinada especialmente a adultos
                mayores. Cada actividad busca estimular la memoria, la atención, el lenguaje y la
                agilidad mental con desafíos breves y claros.
            </p>
            <p>
                También está pensada para familiares, cuidadores o profesionales que quieran proponer
                una rutina sencilla de práctica, sin necesidad de registros, cuentas ni configuraciones
                complicadas.
            </p>
            <p>
                Podés usarla en sesiones cortas de unos minutos o como parte de una rutina diaria.
                Lo importante no es “ganar”, sino mantener la constancia y disfrutar el proceso.
            </p>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-900">Quién está detrás</h2>
          <p>
            Soy un ingeniero en sistemas de Córdoba y desarrollé esta aplicación para que cualquier persona pueda
            entrenar su mente de forma simple, gratuita y sin publicidad.
          </p>
          <p>
            La idea nació porque a mi abuelo le recomendaron este tipo de ejercicios y no pude encontrar 
            una aplicación con instrucciones claras, letras grandes, sin publicidad y sin pantallas cargadas de opciones. 
            De ahí se me ocurrió hacerlo por mi cuneta. Por eso MindGames busca ser directo: 
            entrás, elegís un juego y practicás sin vueltas.
          </p>
          <p>
            Me interesa que la experiencia sea amable y accesible: instrucciones cortas, desafíos breves y
            resultados fáciles de entender.
          </p>
        </div>

        <div className="space-y-2 md:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-900">Beneficios del entrenamiento mental</h2>
          <p>
            Practicar este tipo de ejercicios de manera constante ayuda a mantener la mente activa,
            fortalece funciones cognitivas del día a día y aporta más seguridad al resolver tareas
            cotidianas.
          </p>
          <p>
            La clave está en la repetición: hacer un poquito, seguido. Alternar actividades (memoria,
            atención, lenguaje) permite trabajar diferentes habilidades sin que se vuelva monótono.
          </p>
          <p>
            Cada persona avanza a su ritmo. Si un nivel se siente difícil, está perfecto bajar la dificultad
            y volver a intentarlo más adelante. El objetivo es sumar práctica, no sumar presión.
          </p>
        </div>

        <div className="space-y-2 md:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-900">Contacto</h2>
          <p>
            Si tenés sugerencias, comentarios o ideas para mejorar la experiencia, podés escribir a
            {' '}
            <a
              href="mailto:lorenzuin@gmail.com"
              className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4"
            >
              lorenzuin@gmail.com
            </a>
            .
          </p>
          <p>
            Así puedo mejorar la aplicación con ayuda de todos.
          </p>
        </div>
      </article>
    </section>
  );
};

export default AboutPage;