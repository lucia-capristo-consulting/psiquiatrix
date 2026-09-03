// Códigos de país para el campo de teléfono.
//
// La lista se ordena sola, alfabéticamente y respetando los acentos del
// castellano (México antes que Mónaco, Perú antes que Polonia). Por eso acá
// abajo están agrupados por región y no en orden: agregar un país es sumarlo
// donde corresponda, sin preocuparse por dónde va a aparecer.
//
// Aunque la lista es larga, NO pretende ser completa: al final del desplegable
// hay una opción "Otro" que deja escribir el código a mano. Es la red de
// seguridad para lo que falte o esté mal.

const PAISES = [
  // América del Sur
  { codigo: '+54', pais: 'Argentina' },
  { codigo: '+591', pais: 'Bolivia' },
  { codigo: '+55', pais: 'Brasil' },
  { codigo: '+56', pais: 'Chile' },
  { codigo: '+57', pais: 'Colombia' },
  { codigo: '+593', pais: 'Ecuador' },
  { codigo: '+592', pais: 'Guyana' },
  { codigo: '+595', pais: 'Paraguay' },
  { codigo: '+51', pais: 'Perú' },
  { codigo: '+597', pais: 'Surinam' },
  { codigo: '+598', pais: 'Uruguay' },
  { codigo: '+58', pais: 'Venezuela' },

  // América Central, Norte y Caribe
  { codigo: '+501', pais: 'Belice' },
  { codigo: '+1', pais: 'Canadá' },
  { codigo: '+506', pais: 'Costa Rica' },
  { codigo: '+53', pais: 'Cuba' },
  { codigo: '+503', pais: 'El Salvador' },
  { codigo: '+1', pais: 'Estados Unidos' },
  { codigo: '+502', pais: 'Guatemala' },
  { codigo: '+509', pais: 'Haití' },
  { codigo: '+504', pais: 'Honduras' },
  { codigo: '+1876', pais: 'Jamaica' },
  { codigo: '+52', pais: 'México' },
  { codigo: '+505', pais: 'Nicaragua' },
  { codigo: '+507', pais: 'Panamá' },
  { codigo: '+1787', pais: 'Puerto Rico' },
  { codigo: '+1809', pais: 'República Dominicana' },
  { codigo: '+1868', pais: 'Trinidad y Tobago' },

  // Europa
  { codigo: '+355', pais: 'Albania' },
  { codigo: '+49', pais: 'Alemania' },
  { codigo: '+43', pais: 'Austria' },
  { codigo: '+32', pais: 'Bélgica' },
  { codigo: '+375', pais: 'Bielorrusia' },
  { codigo: '+387', pais: 'Bosnia y Herzegovina' },
  { codigo: '+359', pais: 'Bulgaria' },
  { codigo: '+357', pais: 'Chipre' },
  { codigo: '+385', pais: 'Croacia' },
  { codigo: '+45', pais: 'Dinamarca' },
  { codigo: '+421', pais: 'Eslovaquia' },
  { codigo: '+386', pais: 'Eslovenia' },
  { codigo: '+34', pais: 'España' },
  { codigo: '+372', pais: 'Estonia' },
  { codigo: '+358', pais: 'Finlandia' },
  { codigo: '+33', pais: 'Francia' },
  { codigo: '+30', pais: 'Grecia' },
  { codigo: '+36', pais: 'Hungría' },
  { codigo: '+353', pais: 'Irlanda' },
  { codigo: '+354', pais: 'Islandia' },
  { codigo: '+39', pais: 'Italia' },
  { codigo: '+371', pais: 'Letonia' },
  { codigo: '+370', pais: 'Lituania' },
  { codigo: '+352', pais: 'Luxemburgo' },
  { codigo: '+389', pais: 'Macedonia del Norte' },
  { codigo: '+356', pais: 'Malta' },
  { codigo: '+373', pais: 'Moldavia' },
  { codigo: '+382', pais: 'Montenegro' },
  { codigo: '+47', pais: 'Noruega' },
  { codigo: '+31', pais: 'Países Bajos' },
  { codigo: '+48', pais: 'Polonia' },
  { codigo: '+351', pais: 'Portugal' },
  { codigo: '+44', pais: 'Reino Unido' },
  { codigo: '+420', pais: 'Chequia' },
  { codigo: '+40', pais: 'Rumania' },
  { codigo: '+7', pais: 'Rusia' },
  { codigo: '+381', pais: 'Serbia' },
  { codigo: '+46', pais: 'Suecia' },
  { codigo: '+41', pais: 'Suiza' },
  { codigo: '+380', pais: 'Ucrania' },

  // Asia y Medio Oriente
  { codigo: '+966', pais: 'Arabia Saudita' },
  { codigo: '+374', pais: 'Armenia' },
  { codigo: '+994', pais: 'Azerbaiyán' },
  { codigo: '+880', pais: 'Bangladés' },
  { codigo: '+974', pais: 'Catar' },
  { codigo: '+86', pais: 'China' },
  { codigo: '+82', pais: 'Corea del Sur' },
  { codigo: '+971', pais: 'Emiratos Árabes Unidos' },
  { codigo: '+63', pais: 'Filipinas' },
  { codigo: '+995', pais: 'Georgia' },
  { codigo: '+91', pais: 'India' },
  { codigo: '+62', pais: 'Indonesia' },
  { codigo: '+964', pais: 'Irak' },
  { codigo: '+98', pais: 'Irán' },
  { codigo: '+972', pais: 'Israel' },
  { codigo: '+81', pais: 'Japón' },
  { codigo: '+962', pais: 'Jordania' },
  { codigo: '+7', pais: 'Kazajistán' },
  { codigo: '+965', pais: 'Kuwait' },
  { codigo: '+961', pais: 'Líbano' },
  { codigo: '+60', pais: 'Malasia' },
  { codigo: '+977', pais: 'Nepal' },
  { codigo: '+92', pais: 'Pakistán' },
  { codigo: '+65', pais: 'Singapur' },
  { codigo: '+94', pais: 'Sri Lanka' },
  { codigo: '+66', pais: 'Tailandia' },
  { codigo: '+90', pais: 'Turquía' },
  { codigo: '+998', pais: 'Uzbekistán' },
  { codigo: '+84', pais: 'Vietnam' },

  // África
  { codigo: '+213', pais: 'Argelia' },
  { codigo: '+244', pais: 'Angola' },
  { codigo: '+237', pais: 'Camerún' },
  { codigo: '+225', pais: 'Costa de Marfil' },
  { codigo: '+20', pais: 'Egipto' },
  { codigo: '+251', pais: 'Etiopía' },
  { codigo: '+233', pais: 'Ghana' },
  { codigo: '+254', pais: 'Kenia' },
  { codigo: '+212', pais: 'Marruecos' },
  { codigo: '+258', pais: 'Mozambique' },
  { codigo: '+234', pais: 'Nigeria' },
  { codigo: '+221', pais: 'Senegal' },
  { codigo: '+27', pais: 'Sudáfrica' },
  { codigo: '+255', pais: 'Tanzania' },
  { codigo: '+216', pais: 'Túnez' },
  { codigo: '+256', pais: 'Uganda' },
  { codigo: '+263', pais: 'Zimbabue' },

  // Oceanía
  { codigo: '+61', pais: 'Australia' },
  { codigo: '+679', pais: 'Fiyi' },
  { codigo: '+64', pais: 'Nueva Zelanda' },
];

// Lista completa, en orden alfabético. Se usa para buscar el código a partir
// del país elegido.
export const CODIGOS_TELEFONO = [...PAISES].sort((a, b) =>
  a.pais.localeCompare(b.pais, 'es')
);

// Los que van arriba de todo en el desplegable, en ESTE orden y no en el
// alfabético. La idea es que casi nadie tenga que buscar en la lista larga.
//
// El orden sigue dónde hay más gente de acá: Argentina primero; después los
// tres destinos grandes de emigración (Italia entra por el tema de la
// ciudadanía, aunque no sea hispanohablante); después los limítrofes,
// empezando por Brasil; y al final el resto de Latinoamérica.
//
// Es una lista de nombres sueltos a propósito: para cambiar las prioridades se
// reordena o se saca un renglón, sin tocar los datos de más abajo. Los nombres
// tienen que coincidir EXACTO con los de PAISES; si uno no coincide, el país
// no aparece destacado (igual sigue estando en el resto de la lista).
const DESTACADOS = [
  'Argentina',
  'España',
  'Estados Unidos',
  'Italia',
  'Brasil',
  'Chile',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Perú',
  'México',
  'Colombia',
];

export const CODIGOS_DESTACADOS = DESTACADOS.map((nombre) =>
  CODIGOS_TELEFONO.find((c) => c.pais === nombre)
).filter(Boolean);

export const CODIGOS_RESTO = CODIGOS_TELEFONO.filter(
  (c) => DESTACADOS.indexOf(c.pais) === -1
);

export const CODIGO_POR_DEFECTO = '+54';

// Valor del <option> que habilita escribir un código a mano.
export const OTRO = 'otro';
