import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.psiquiatrix.ar';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-psiquiatrix.jpg`;
const DEFAULT_OG_IMAGE_META = {
  type: 'image/jpeg',
  width: 1731,
  height: 909,
  alt: 'PsiquiatriX — Centro de psiquiatría online: psiquiatría profesional con mirada humana.',
};

export default function Seo({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) {
  const url = `${SITE_URL}${path}`;
  // Tipo, dimensiones y alt sólo se declaran para la imagen por defecto: si una
  // página pasa su propia `ogImage`, declarar el tamaño de otra sería incorrecto.
  const imageMeta = ogImage === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_META : null;

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
      <meta property="og:site_name" content="PsiquiatriX" />

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
