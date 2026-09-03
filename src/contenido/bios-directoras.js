// ─────────────────────────────────────────────────────────────────────────────
// BIOS DE LAS DIRECTORAS — fuente única de verdad.
//
// Este archivo alimenta las dos páginas: / (pacientes) y /psicologos. Lo que se
// edite acá cambia en las dos, no hay que tocar nada más.
//
//   intro → el resumen. Siempre visible.
//   body  → el detalle. Aparece al tocar "Leer más".
//
// Los dos son listas: cada texto entre comillas es UN párrafo. Para sumar un
// párrafo, agregá otra línea con su coma al final. No hace falta poner saltos
// de línea: el espacio entre párrafos lo pone el diseño solo, y el largo no
// rompe la card porque el detalle arranca plegado.
//
// Reglas para que no se rompa nada:
//   · No borres las comillas ni las comas.
//   · Si el texto lleva un apóstrofo, usá la comilla tipográfica (’),
//     no la recta, para no cerrar el texto por accidente.
//   · El resto (nombre, matrícula) se edita igual, entre comillas.
//
// Sobre las fotos: hay DOS por directora y no es un descuido.
//   img   → 400x480, la que se ve en / (pacientes)
//   imgSm → 224x280, la que se ve en /psicologos
// Van recortadas al tamaño exacto en que se muestran porque si se sube una
// foto grande, el navegador la achica con un filtro malo y los estampados
// finos (rayas, cuadros) salen con espirales — el efecto \"camisa en la tele\".
// Si reemplazás una foto, hay que regenerar las dos medidas, no alcanza con
// pisar el archivo.
// ─────────────────────────────────────────────────────────────────────────────

export const directors = [
  {
    id: 'claudia',
    name: 'Dra. Claudia Heller',
    role: 'Psiquiatra · Co-fundadora',
    mn: 'M.N. 70.463',
    img: '/team/claudia-heller-bio.jpg',
    imgSm: '/team/claudia-heller-bio-sm.jpg',
    intro: [
      'Médica Especialista en Psiquiatría con más de 30 años de experiencia clínica, en instituciones hospitalarias y consultorio privado.',
      'Su trayectoria está marcada por una vocación doble: la atención directa de pacientes y la formación de otros psiquiatras. Durante casi tres décadas trabajó en el Instituto de Investigaciones Médicas Dr. Alfredo Lanari (UBA), donde llegó a dirigir el Servicio de Salud Mental. Fue también docente en la Universidad de Buenos Aires, la Universidad de Belgrano y otras instituciones académicas.',
      'Co-funda Psiquiatrix convencida de que la psiquiatría de calidad se construye con criterio clínico, tiempo y equipos bien formados. Hoy integra la dirección clínica del equipo: participa en la selección de los profesionales, acompaña su formación continua y está presente cuando los casos más complejos lo requieren.',
    ],
    body: [
      'Su vínculo con el Lanari atraviesa casi toda su carrera. Ingresó como Subjefa del Servicio de Salud Mental en 1996 y lo condujo como Jefa hasta 2012. Durante ese período fue también miembro del equipo de Trasplante Renal del INCUCAI — una experiencia que amplió su perspectiva hacia la psiquiatría de interconsulta y el trabajo en contextos de alta complejidad médica general.',
      'Entre 2006 y 2012 supervisó y orientó clínicamente a los profesionales del Curso de Especialista en Psiquiatría de la UBA — formando a quienes hoy ejercen la especialidad. Fue encargada docente en el Hospital Houssay (Departamento de Salud Mental, Provincia de Buenos Aires) hasta 2024, y docente en la Universidad de Belgrano, la Universidad Nacional de La Plata, la UCES y el Instituto de Psicocardiología de Buenos Aires.',
      'Su formación en psicoanálisis contemporáneo le permite dialogar con fluidez con psicólogos y terapeutas, entender sus marcos de trabajo y articular con ellos sin fricciones — una base central del modelo de Psiquiatrix.',
      'Desde sus primeros años de ejercicio profesional mantiene una práctica clínica privada en consultorio particular, que sostiene en la actualidad en paralelo a su rol en Psiquiatrix.',
    ],
  },
  {
    id: 'amanda',
    name: 'Dra. Amanda Villaverde',
    role: 'Psiquiatra · Co-fundadora',
    mn: 'M.N. 60.654',
    img: '/team/amanda-villaverde-bio.jpg',
    imgSm: '/team/amanda-villaverde-bio-sm.jpg',
    intro: [
      'Médica Especialista en Psiquiatría y Psicología Médica con más de 35 años de experiencia clínica, en instituciones hospitalarias y consultorio privado.',
      'Cuenta con formación en Antropología Cultural y un curso de posgrado en Geriatría y Gerontología (Hospital Durand), lo que le aporta una perspectiva más amplia sobre los procesos de salud y enfermedad: el paciente como persona situada en una historia, un contexto y un momento vital.',
      'Co-funda Psiquiatrix con la convicción de que la psiquiatría de calidad requiere tiempo, criterio y continuidad. Hoy dirige clínicamente el equipo: selecciona y forma a los profesionales, supervisa casos complejos y garantiza que cada tratamiento responda al estándar que la institución exige.',
    ],
    body: [
      'A lo largo de su carrera atendió pacientes en contextos muy diversos. En el Instituto de Investigaciones Médicas Dr. Alfredo Lanari, hospital universitario de la UBA, desarrolló su práctica en un entorno de alta complejidad médica. En la Clínica Cormillot integró un equipo interdisciplinario especializado en trastornos de la alimentación. También se desempeñó en el Centro de Salud Mental N°3 Dr. Arturo Ameghino.',
      'En el plano académico, fue Jefa de Trabajos Prácticos de las Cátedras de Salud Mental I y II en la Facultad de Medicina de la UBA. Participó de la Fundación Argentina de Salud Mental (FASAM) y de la Fundación de Docencia e Investigación en Psiquiatría y Psicofarmacología (FUNDOPSI). Cuenta además con formación en psicoterapia de orientación psicoanalítica contemporánea (APdeBA).',
      'Desde sus primeros años de ejercicio profesional mantiene una práctica clínica privada en consultorio particular, que sostiene en la actualidad en paralelo a su rol en Psiquiatrix.',
    ],
  },
];
