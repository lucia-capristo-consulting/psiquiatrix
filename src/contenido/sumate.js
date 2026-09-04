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
  // Dos líneas, cortadas a propósito: "la experiencia se transmite" tiene que
  // leerse junta. Si se deja al navegador, dónde parte depende del ancho.
  titulo: [
    ['Sumate a un equipo donde'],
    ['la experiencia ', { acento: 'se transmite' }, '.'],
  ],
  bajada:
    'Buscamos psiquiatras y residentes desde segundo año para atender pacientes derivados por la institución. Vas a llevar tus propios tratamientos, con supervisión, ateneos y la dirección clínica de dos psiquiatras con más de treinta años de práctica.',
};

export const DIRECCION = {
  // El título afirma qué ES el respaldo. Antes decía "no es una marca lo que
  // respalda", y abrir por la negación obliga a leer dos frases para entender
  // de qué se trata.
  titulo: [
    'Dos psiquiatras con treinta años de práctica, ',
    { acento: 'atentas' },
    ' a la tuya.',
  ],
  parrafos: [
    'Claudia Heller y Amanda Villaverde dirigen clínicamente el equipo. Las dos se formaron en hospitales de alta complejidad y siguen ejerciendo. Participan de los ateneos, supervisan los casos difíciles y siguen de cerca cómo trabaja cada profesional del equipo.',
    'Eso es lo que estás por sumar: un lugar donde se aprende trabajando, con alguien que responde con vos por cada tratamiento. No es una plataforma que te consigue pacientes: es un equipo clínico, y vas a formar parte de él.',
  ],
  puntos: [
    'Ateneos semanales, con todo el equipo y las directoras.',
    'Supervisión de los casos difíciles, cuando la necesitás.',
    'Si algo sale mal, no lo resolvés solo: te ayudamos a reconducirlo con el paciente y con quien lo derivó.',
    'Los pacientes siguen con vos. Vas a sostener tratamientos durante años y ver qué pasó con lo que indicaste, que es la experiencia que la rotación de una residencia no da.',
  ],
};

// Responde la primera pregunta que se hace un residente al leer esto: si puede
// hacerlo mientras cursa. Antes la página no la contestaba, y lo único que
// decía de horarios ("cuanto más amplia, mejor") estaba escrito desde lo que
// necesita la institución: se leía como que piden mucho.
export const COMIENZO = {
  antetitulo: 'Cómo se empieza',
  titulo: 'Nadie arranca con la agenda llena.',
  puntos: [
    'Empezás con pocos pacientes y sumás horas a medida que te vas acomodando. No hay un mínimo de dedicación ni hace falta que este sea tu único trabajo.',
    'Los días y los horarios los acordamos con vos, para que entren donde te sirvan: la residencia, el hospital, tu consultorio.',
    'Una vez acordados, se sostienen. No es una agenda que cambia cada semana, y es a propósito: tu paciente necesita encontrarte siempre a la misma hora.',
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
    'Se cobra por consulta, cada quince días, con ajuste por IPC cada tres o cuatro meses.',
  ],
};

export const PERFIL = {
  antetitulo: 'A quién buscamos',
  // Afirmativo y sin comparar. El título anterior ponía la antigüedad en el
  // centro para después restarle valor, y sonaba raro viniendo de quien
  // justamente ofrece experiencia.
  titulo: ['Nos interesa ', { acento: 'cómo' }, ' atendés.'],
  intro:
    'Buscamos profesionales que ejerzan una psiquiatría cercana: con tiempo real para cada paciente, con un vínculo que se sostiene y con ganas de seguir formándose. Lo demás se aprende.',
  requisitos: [
    'Título de médico/a especialista en Psiquiatría, o certificado de residencia o curso superior a partir del segundo año.',
    'Monotributo vigente.',
    'Seguro de mala praxis.',
    'Buena conexión a internet.',
    'Disponibilidad horaria para sostener un día y un horario fijos por semana.',
  ],
  // Dicho sin vueltas: el problema real de la institución es que los
  // profesionales se van cuando consiguen algo mejor pago. Decirlo de entrada
  // no espanta a quien viene a formarse; sí filtra a quien viene de paso.
  cierre:
    'No pedimos permanencia mínima, pero buscamos vínculos largos. Lo que se aprende acá lleva tiempo, y los pacientes también.',
};

export const NO_ES = {
  antetitulo: 'Qué no es',
  // El titulo anterior --'para que no perdamos tiempo'-- insinuaba que quien
  // lee podria ser una perdida de tiempo. La seccion hace lo contrario: le
  // ahorra a la otra persona una entrevista que no iba a ningun lado.
  titulo: 'Preferimos decirlo antes.',
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
