# Fotos originales

Acá viven las fotos **en alta**, tal como salieron de la sesión. Esta carpeta
está **fuera de `public/`** a propósito: no se publica en el sitio, no se sube a
Netlify y no la ve nadie desde internet. Está sólo para poder rehacer los
recortes el día que haga falta.

Lo que se publica son las versiones recortadas que viven en `public/team/`.

## Por qué hay dos medidas de cada foto

| Archivo publicado | Medida | Dónde se ve |
| --- | --- | --- |
| `public/team/<nombre>-bio.jpg` | 400×480 | `/` (pacientes), en 200×240 |
| `public/team/<nombre>-bio-sm.jpg` | 224×280 | `/psicologos`, en 112×140 |

Cada una se entrega ya en el tamaño en que se muestra (al doble, para pantallas
retina). **No es un capricho.** Si se sube la foto grande y se deja que el
navegador la achique, los estampados finos —rayas, cuadros— salen con espirales:
es el mismo efecto que arruina las camisas a rayas en televisión. Pasó con la
primera foto de Claudia y por eso se hace así.

**Si reemplazás una foto, hay que regenerar las dos medidas.** Pisar sólo una
trae el problema de vuelta.

## Cómo regenerar los recortes

`sharp` no es una dependencia del proyecto: se instala sólo cuando hace falta y
no queda anotada en `package.json`.

```bash
npm install --no-save sharp
```

Después, un script como este (ajustando `REGION`):

```js
const sharp = require('sharp');

// Recorte busto en coordenadas de la foto original.
const REGION = { left: 110, top: 290, width: 780, height: 936 };

for (const [salida, w, h] of [
  ['public/team/claudia-heller-bio.jpg', 400, 480],
  ['public/team/claudia-heller-bio-sm.jpg', 224, 280],
]) {
  sharp('originales/claudia-heller.jpeg')
    .extract(REGION)
    .resize(w, h, { fit: 'cover', kernel: 'lanczos3' })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(salida);
}
```

El `chromaSubsampling: '4:4:4'` no es opcional: con el `4:2:0` habitual, los
detalles finos de color (las rayas azules de la primera foto) quedaban con un
halo.

## Los recortes que están en uso hoy

Las dos fotos originales miden 1023×1537 y parecen de la misma sesión.

- **Claudia** — `{ left: 110, top: 290, width: 780, height: 936 }`
  El recorte no puede bajar de `y≈1260`: más abajo empiezan a asomar las manos
  y el libro.
- **Amanda** — recorte al ancho completo alineado arriba, equivalente a
  `{ left: 0, top: 0, width: 1023, height: 1228 }`.

El encuadre de Claudia se eligió midiendo el de Amanda, para que las dos lean
como pareja cuando se ven juntas: la cabeza ocupa cerca del 43 % del alto y
queda alrededor de un 9 % de aire arriba.
