//Metadata
export interface RouteInfo {
		path: string;
		title: string;
		type: string;
		icontype: string;
		collapse?: string;
		children?: ChildrenItems[];
		tourAnchor?: string;
}

export interface ChildrenItems {
		path: string;
		subpath?: string;
		title: string;
		ab: string;
		type?: string;
		tourAnchor?: string;
}

export const ROUTES_1: RouteInfo[] = [{
				path: '/dashboard',
				title: 'Panel',
				type: 'link',
				icontype: 'dashboard',
				tourAnchor: 'panel.tour'
		},{
				path: '/calendar',
				title: 'Calendario',
				type: 'link',
				icontype: 'date_range',
				tourAnchor: 'calendar.tour'
		}
];

export const ROUTES_2: RouteInfo[] = [{
				path: '/editor',
				title: 'Editor',
				type: 'link',
				icontype: 'content_paste'
		},{
				path: '/admin',
				title: 'Administrador',
				type: 'link',
				icontype: 'settings_applications'
		},{
				path: '/charts',
				title: 'Reportes',
				type: 'link',
				icontype: 'timeline'
		}
];
