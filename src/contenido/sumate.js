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
  titulo: ['Ejercé con autonomía, y con ', 'quién consultar', ' cuando hace falta.'],
  bajada:
    'Buscamos psiquiatras y residentes desde segundo año para atender pacientes derivados por la institución. Vas a llevar tus propios tratamientos, con tus decisiones, dentro de un equipo que discute los casos y acompaña.',
};

export const DIRECCION = {
  titulo: 'No es una marca lo que respalda: son dos personas.',
  parrafos: [
    'Claudia Heller y Amanda Villaverde dirigen clínicamente el equipo. Las dos ejercen desde hace más de treinta años y se formaron en hospitales de alta complejidad. Participan de los ateneos, supervisan los casos difíciles y están cuando hay que consultar algo.',
    'Es la parte del trabajo que no se puede comprar hecha, y es la razón por la que existe esta convocatoria.',
  ],
};

export const TRABAJO = {
  antetitulo: 'Cómo se trabaja',
  titulo: 'De lo que no te vas a tener que ocupar.',
  puntos: [
    'Los pacientes llegan derivados por la institución. No tenés que conseguirlos.',
    'La atención es enteramente online.',
    'Los turnos y las historias clínicas se gestionan con herramientas que damos nosotros.',
    'La facturación y el cobro al paciente los hacemos nosotros. Vos atendés.',
    'Los honorarios se liquidan cada quince días, con ajuste por IPC cada tres o cuatro meses.',
  ],
};

export const PERFIL = {
  antetitulo: 'A quién buscamos',
  titulo: 'Nos importa menos la antigüedad que la forma de atender.',
  intro:
    'Buscamos gente que ejerza una psiquiatría cercana: con tiempo real para cada paciente, con un vínculo que se sostiene en el tiempo y con ganas de seguir aprendiendo. El resto se enseña.',
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
  // El CV no se sube por el formulario a propósito: son datos personales y
  // terminarían en el mismo Sheet que las consultas de pacientes. Va por mail.
  nota: 'Si querés, mandanos tu CV por mail a',
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
