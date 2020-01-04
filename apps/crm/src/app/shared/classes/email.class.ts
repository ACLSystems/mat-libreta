export class EmailValidator {
	static isAcceptable(s: string) {
		let emailAddressRegex = /\S+@\S+\.\S+/;
		return emailAddressRegex.test(s);
	}
}
