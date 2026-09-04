/**
 * Renderiza un título que puede llevar tramos resaltados y saltos de línea.
 *
 * Los textos se declaran en src/contenido/sumate.js así:
 *
 *   'Un título simple'                                  una sola línea, sin acento
 *   ['Nos interesa ', { acento: 'cómo' }, ' atendés.']  una línea con un tramo resaltado
 *   [['Primera línea'], ['Segunda ', { acento: 'línea' }]]   dos líneas
 *
 * Existe porque el corte de línea de un título es una decisión de redacción,
 * no del navegador: "la experiencia se transmite" tiene que leerse junta, y
 * dónde parte depende del ancho de la pantalla si no se dice.
 */

const Tramo = ({ parte }) =>
  typeof parte === 'string' ? (
    parte
  ) : (
    <span className="italic text-accent">{parte.acento}</span>
  );

export default function Frase({ texto }) {
  if (typeof texto === 'string') return texto;

  // Varias líneas: cada una es a su vez una lista de tramos.
  const esVariasLineas = Array.isArray(texto[0]);
  const lineas = esVariasLineas ? texto : [texto];

  return lineas.map((linea, i) => (
    <span key={i} className="block">
      {linea.map((parte, j) => (
        <Tramo key={j} parte={parte} />
      ))}
    </span>
  ));
}
