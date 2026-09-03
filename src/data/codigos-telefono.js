// Códigos de país sugeridos para el campo de teléfono.
//
// NO es una lista cerrada: el campo es un input con datalist, así que estos son
// atajos y quien esté en otro país puede escribir su código a mano. Por eso no
// hace falta mantener acá los 200 países del mundo.
//
// Argentina va primera porque es el valor por defecto; el resto sigue el orden
// de probabilidad, no el alfabético.

export const CODIGOS_TELEFONO = [
  { codigo: '+54', pais: 'Argentina' },
  { codigo: '+598', pais: 'Uruguay' },
  { codigo: '+56', pais: 'Chile' },
  { codigo: '+595', pais: 'Paraguay' },
  { codigo: '+591', pais: 'Bolivia' },
  { codigo: '+55', pais: 'Brasil' },
  { codigo: '+51', pais: 'Perú' },
  { codigo: '+57', pais: 'Colombia' },
  { codigo: '+593', pais: 'Ecuador' },
  { codigo: '+58', pais: 'Venezuela' },
  { codigo: '+52', pais: 'México' },
  { codigo: '+1', pais: 'Estados Unidos / Canadá' },
  { codigo: '+34', pais: 'España' },
  { codigo: '+39', pais: 'Italia' },
  { codigo: '+33', pais: 'Francia' },
  { codigo: '+49', pais: 'Alemania' },
  { codigo: '+44', pais: 'Reino Unido' },
  { codigo: '+351', pais: 'Portugal' },
  { codigo: '+972', pais: 'Israel' },
  { codigo: '+61', pais: 'Australia' },
];

export const CODIGO_POR_DEFECTO = '+54';
