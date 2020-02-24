import { Display } from '@crmshared/types/display.type';

export const TYPES: Display[] = [
	{value: 'lead', viewValue: 'Prospecto'},
	{value: 'contact', viewValue: 'Contacto'},
	{value: 'internal', viewValue: 'Interno'},
	{value: 'partner', viewValue: 'Alianza'},
	{value: 'reseller', viewValue: 'Broker'},
	{value: 'other', viewValue: 'Otro'}
];

export const ROLES: Display[] = [
	{value: 'Decision Maker', viewValue: 'Tomador de decisiones'},
	{value: 'Executive Sponsor', viewValue: 'Promotor Ejecutivo'},
	{value: 'Admin/Project Manager', viewValue: 'Líder/Administrador de proyecto'},
	{value: 'Finance', viewValue: 'Finanzas'},
	{value: 'Legal', viewValue: 'Legal'},
	{value: 'Purchase', viewValue: 'Compras'},
	{value: 'Technical', viewValue: 'Técnico'},
	{value: 'other', viewValue: 'Otro'}
];

export const SOURCES: Display[] = [
	{value: 'web', viewValue: 'Web'},
	{value: 'phone', viewValue: 'Teléfono'},
	{value: 'email', viewValue: 'Email'},
	{value: 'fresh', viewValue: 'Freshworks'},
	{value: 'direct', viewValue: 'Directo'},
	{value: 'refereral', viewValue: 'Referido'},
	{value: 'social', viewValue: 'Redes Sociales'},
	{value: 'other', viewValue: 'Otro'}
];



export const STATES: Display[] = [
	{value: 'AS', viewValue: 'Aguascalientes'},
	{value: 'BC', viewValue: 'Baja California'},
	{value: 'BS', viewValue: 'Baja California Sur'},
	{value: 'CC', viewValue: 'Campeche'},
	{value: 'CS', viewValue: 'Chiapas'},
	{value: 'CH', viewValue: 'Chihuahua'},
	{value: 'DF', viewValue: 'Ciudad de México'},
	{value: 'CL', viewValue: 'Coahuila'},
	{value: 'CM', viewValue: 'Colima'},
	{value: 'DG', viewValue: 'Durango'},
	{value: 'GT', viewValue: 'Guanajuato'},
	{value: 'GR', viewValue: 'Guerrero'},
	{value: 'HG', viewValue: 'Hidalgo'},
	{value: 'JC', viewValue: 'Jalisco'},
	{value: 'MX', viewValue: 'México'},
	{value: 'MN', viewValue: 'Michoacán'},
	{value: 'MS', viewValue: 'Morelos'},
	{value: 'NT', viewValue: 'Nayarit'},
	{value: 'NL', viewValue: 'Nuevo León'},
	{value: 'OC', viewValue: 'Oaxaca'},
	{value: 'PL', viewValue: 'Puebla'},
	{value: 'QO', viewValue: 'Querétaro'},
	{value: 'QR', viewValue: 'Quintana Roo'},
	{value: 'SP', viewValue: 'San Luis Potosí'},
	{value: 'SL', viewValue: 'Sinaloa'},
	{value: 'SR', viewValue: 'Sonora'},
	{value: 'TC', viewValue: 'Tabasco'},
	{value: 'TS', viewValue: 'Tamaulipas'},
	{value: 'TL', viewValue: 'Tlaxcala'},
	{value: 'VZ', viewValue: 'Veracruz'},
	{value: 'YN', viewValue: 'Yucatán'},
	{value: 'ZS', viewValue: 'Zacatecas'}
]

export const HAPPINESS: Display[] = [
	{value: 'unknown', viewValue: 'Desconocido'},
	{value: 'angry', viewValue: 'Enojado'},
	{value: 'fragile', viewValue: 'Frágil'},
	{value: 'neutral', viewValue: 'Neutral'},
	{value: 'happy', viewValue: 'Contento'},
	{value: 'elated', viewValue: 'Exaltado'},
]
