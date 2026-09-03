import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, OG_IMAGE } from './site.js';

export default function Seo({
  title,
  description,
  path = '/',
  ogImage = OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) {
  const url = `${SITE_URL}${path}`;
  // `ogImage` es el objeto entero, con sus propias dimensiones. Antes era una
  // URL suelta y las dimensiones salían sólo para la imagen por defecto: una
  // página con imagen propia la publicaba sin medidas, y los scrapers tenían
  // que bajarla para deducirlas.
  const img = ogImage || OG_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={img.url} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta property="og:image:type" content={img.type} />
      <meta property="og:image:width" content={String(img.width)} />
      <meta property="og:image:height" content={String(img.height)} />
      <meta property="og:image:alt" content={img.alt} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
