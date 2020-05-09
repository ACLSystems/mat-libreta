export interface Environment {
	instanceName: string,
	instanceRef: string,
	url: string,
	footerName: string,
	footerLink: string,
	colorEvents: string[],
	bank: string,
	bankAccount: string,
	bankCLABE: string,
	mocAmount?: string,
	platform: string,
	production: boolean,
	backOffice?: string
}
