//Metadata
export interface RouteInfo {
		path: string;
		title: string;
		type: string;
		icontype: string;
		collapse?: string;
		children?: ChildrenItems[];
		role?: string;
}

export interface ChildrenItems {
		path: string;
		subpath?: string;
		title: string;
		ab: string;
		type?: string;
}

export const ROUTES_1: RouteInfo[] = [{
			path: '/pages/catalog',
			title: 'Catálogo de cursos',
			type: 'link',
			icontype: 'view_column'
		},{
			path: '/dashboard',
			title: 'Panel',
			type: 'link',
			icontype: 'dashboard'
		},{
			path: '/calendar',
			title: 'Calendario',
			type: 'link',
			icontype: 'date_range'
		}
];

export const ROUTES_2: RouteInfo[] = [{
		path: '/reports',
		title: 'Reportes MOOC',
		type: 'link',
		icontype: 'format_align_justify',
		role: 'isMoocSupervisor'
}
];
