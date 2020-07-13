export interface Environment {
	hostname: string,
	instanceName: string,
	instanceRef: string,
	url: string,
	urlLibreta: string,
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
