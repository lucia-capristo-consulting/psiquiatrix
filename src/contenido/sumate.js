// ─────────────────────────────────────────────────────────────────────────────
// CONVOCATORIA: TEXTOS DE /sumate
//
// La página es PERMANENTE. No se despublica cuando se cubren los puestos: se
// cambia `BUSQUEDA_ABIERTA` a false y el cartel de arriba pasa a decir que no
// hay búsquedas abiertas. Así sigue recibiendo candidaturas espontáneas en vez
// de quedar vieja o desaparecer.
//
// Cada texto entre comillas se edita libremente. Las listas son un renglón por
// ítem: para sumar uno, se agrega otra línea con su coma al final.
// ─────────────────────────────────────────────────────────────────────────────

export const BUSQUEDA_ABIERTA = true;

export const ESTADO = {
  abierta: 'Búsqueda abierta',
  cerrada: 'Sin búsquedas abiertas por ahora',
};

export const HERO = {
  antetitulo: 'Para psiquiatras y residentes',
  // El título se parte en tres para poder resaltar el medio, como en el resto
  // del sitio. La "x" de Psiquiatrix y las frases en itálica van en acento.
  titulo: ['Sumate a un equipo donde la experiencia ', 'se transmite', '.'],
  bajada:
    'Buscamos psiquiatras y residentes desde segundo año para atender pacientes derivados por la institución. Vas a llevar tus propios tratamientos, con supervisión, ateneos y la dirección clínica de dos psiquiatras con más de treinta años de práctica.',
};

export const DIRECCION = {
  // El título afirma qué ES el respaldo. Antes decía "no es una marca lo que
  // respalda", y abrir por la negación obliga a leer dos frases para entender
  // de qué se trata.
  titulo: 'Dos psiquiatras con treinta años de práctica, atentas a la tuya.',
  parrafos: [
    'Claudia Heller y Amanda Villaverde dirigen clínicamente el equipo. Las dos se formaron en hospitales de alta complejidad y siguen ejerciendo. Participan de los ateneos, supervisan los casos difíciles y siguen de cerca cómo trabaja cada profesional del equipo.',
    'Eso es lo que estás por sumar: un lugar donde se aprende trabajando, con alguien que responde con vos por cada tratamiento. No es una plataforma que te consigue pacientes: es un equipo clínico, y vas a formar parte de él.',
  ],
};

export const TRABAJO = {
  antetitulo: 'Cómo se trabaja',
  // El título estaba en negativo ("de lo que no te vas a tener que ocupar") y
  // los puntos también. Se enuncian como lo que la persona recibe, que es lo
  // que realmente son: ejercer sin tener que montar un consultorio.
  titulo: 'Vos atendés. De todo lo demás nos ocupamos nosotras.',
  puntos: [
    'Los pacientes te llegan derivados por la institución.',
    'Atendés desde donde estés: la modalidad es enteramente online.',
    'Te damos las herramientas para gestionar turnos e historias clínicas.',
    'Nosotras facturamos y le cobramos al paciente.',
    'Cobrás cada quince días, con ajuste por IPC cada tres o cuatro meses.',
  ],
};

export const PERFIL = {
  antetitulo: 'A quién buscamos',
  // Afirmativo y sin comparar. El título anterior ponía la antigüedad en el
  // centro para después restarle valor, y sonaba raro viniendo de quien
  // justamente ofrece experiencia.
  titulo: 'Nos interesa cómo atendés.',
  intro:
    'Buscamos profesionales que ejerzan una psiquiatría cercana: con tiempo real para cada paciente, con un vínculo que se sostiene y con ganas de seguir aprendiendo. Lo demás se aprende.',
  requisitos: [
    'Título de médico/a especialista en Psiquiatría, o certificado de residencia o curso superior a partir del segundo año.',
    'Monotributo vigente.',
    'Seguro de mala praxis.',
    'Buena conexión a internet.',
    'Disponibilidad horaria: cuanto más amplia, mejor.',
  ],
};

export const NO_ES = {
  antetitulo: 'Qué no es',
  titulo: 'Para que no perdamos tiempo, ni vos ni nosotras.',
  puntos: [
    'No hacemos psicoterapia. La atención es psiquiátrica.',
    'No trabajamos con obras sociales ni prepagas.',
    'No somos una plataforma de turnos: hay un equipo detrás, y se espera que participes de él.',
  ],
};

export const POSTULACION = {
  antetitulo: 'Postulación',
  titulo: 'Escribinos.',
  bajada:
    'Contanos en qué instancia de tu formación estás y qué te interesa de esta modalidad de trabajo.',
  // OJO: esta frase es una promesa chica y muy visible. Quien se postula y no
  // recibe respuesta lo cuenta. Si no se va a poder cumplir, se saca.
  promesa: 'Respondemos todas las postulaciones.',
  // Alternativa para quien esté desde el celular y no tenga el CV a mano.
  nota: 'Si preferís, escribinos a',
  mailCv: 'psiquiatrix.online@gmail.com',
};

// Las opciones del desplegable de formación. El orden va de más a menos
// avanzado, que es como se presenta alguien.
export const INSTANCIAS = [
  'Especialista en Psiquiatría',
  'Curso superior',
  'Residencia — 4.º año',
  'Residencia — 3.º año',
  'Residencia — 2.º año',
  'Otra',
];
