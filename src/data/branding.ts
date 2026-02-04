export const colors = {
  primary: '#00ADE0',
  primaryDark: '#0090BD',
  blue: '#006BB6',
  blueDark: '#004A7F',
  navy: '#0A2540',
  yellow: '#E7E44D',
  orange: '#F39401',
  green: '#39A958',
} as const;

export const blockColors = {
  markt: colors.primary,
  wettbewerb: colors.orange,
  unternehmen: colors.green,
} as const;

export const companyInfo = {
  name: 'ideenparc GmbH',
  address: 'Mandlstraße 26, 80802 München',
  contact: 'Jürgen Benkovich',
  email: 'jbenkovich@ideenparc.net',
  phone: '+49 172 84 27 114',
  website: 'https://www.ideenparc.net',
} as const;
