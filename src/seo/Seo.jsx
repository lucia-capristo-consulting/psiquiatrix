import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://psiquiatrix.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-psiquiatrix.jpg`;

export default function Seo({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) {
  const url = `${SITE_URL}${path}`;
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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
