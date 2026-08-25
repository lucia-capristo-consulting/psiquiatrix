import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, OG_IMAGE } from './site.js';

export default function Seo({
  title,
  description,
  path = '/',
  ogImage = OG_IMAGE.url,
  ogType = 'website',
  jsonLd,
}) {
  const url = `${SITE_URL}${path}`;
  // Tipo, dimensiones y alt sólo se declaran para la imagen por defecto: si una
  // página pasa su propia `ogImage`, declarar el tamaño de otra sería incorrecto.
  const imageMeta = ogImage === OG_IMAGE.url ? OG_IMAGE : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content={SITE_NAME} />

      {imageMeta && <meta property="og:image:type" content={imageMeta.type} />}
      {imageMeta && <meta property="og:image:width" content={String(imageMeta.width)} />}
      {imageMeta && <meta property="og:image:height" content={String(imageMeta.height)} />}
      {imageMeta && <meta property="og:image:alt" content={imageMeta.alt} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
