export interface DrawingOption {
	enabled: boolean,
	font?: string,
	fontType?: string,
	fontSize?: number,
	textColor?: {
		r: number,
		g: number,
		b: number
	},
	grayColor?: number,
	text: {
		xPos: number,
		yPos: number,
		pre?: string,
		post?: string,
		justify?: string
	}
}

export interface Drawing {
	folio?: DrawingOption,
	to?: DrawingOption,
	studentName: DrawingOption,
	grade?: DrawingOption,
	course: DrawingOption,
	courseDuration?: DrawingOption,
	endDate?: DrawingOption,
	qr?: {
		enabled: boolean,
		url: string,
		size: number,
		x: number,
		y: number,
		w: number,
		h: number
	}
	doc?: {
		orientation?: string,
		unit?: string,
		type?: string,
		x?: number,
		y?: number,
		w?: number,
		h?: number
	}
}
