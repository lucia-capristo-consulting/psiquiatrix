import { SITE_URL, LOGO, OG_IMAGE } from './site.js';

export const medicalClinicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'PsiquiatriX',
  alternateName: 'Psiquiatrix',
  description:
    'Centro de psiquiatría online para adultos en Argentina, con criterio clínico, seguimiento personalizado y mirada humana.',
  url: SITE_URL,
  logo: LOGO.url,
  image: OG_IMAGE.url,
  medicalSpecialty: 'Psychiatric',
  areaServed: {
    '@type': 'Country',
    name: 'Argentina',
  },
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Atención psiquiátrica online',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Seguimiento psiquiátrico online',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Segunda opinión psiquiátrica',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'patient intake',
    areaServed: 'AR',
    availableLanguage: 'Spanish',
  },
  member: [
    {
      '@type': 'Physician',
      name: 'Dra. Claudia Heller',
      medicalSpecialty: 'Psychiatric',
      identifier: 'M.N. 70.463',
    },
    {
      '@type': 'Physician',
      name: 'Dra. Amanda Villaverde',
      medicalSpecialty: 'Psychiatric',
      identifier: 'M.N. 60.654',
    },
  ],
};

export const psicologosServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Derivación psiquiátrica para psicólogos',
  description:
    'Atención psiquiátrica online para pacientes derivados por psicólogos, con comunicación profesional clara, continuidad terapéutica y criterio clínico compartido.',
  provider: {
    '@type': 'MedicalClinic',
    name: 'PsiquiatriX',
    url: SITE_URL,
  },
  areaServed: 'Argentina',
  serviceType: 'Derivación y atención psiquiátrica online',
  audience: {
    '@type': 'Audience',
    audienceType: 'Psicólogos y profesionales derivadores',
  },
};
