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
				icontype: 'dashboard',
				role: 'all'
		},{
				path: '/calendar',
				title: 'Calendario',
				type: 'link',
				icontype: 'date_range',
				role: 'all'
		}
];

// export const ROUTES_2: RouteInfo[] = [{
// 				path: '/editor',
// 				title: 'Editor',
// 				type: 'link',
// 				icontype: 'content_paste'
// 		},{
// 				path: '/admin',
// 				title: 'Administrador',
// 				type: 'link',
// 				icontype: 'settings_applications'
// 		},{
// 				path: '/charts',
// 				title: 'Reportes',
// 				type: 'link',
// 				icontype: 'timeline'
// 		}
// ];

export const ROUTES_2: RouteInfo[] = [
	{
		path: '/requester',
		title: 'Solicitante',
		type: 'sub',
		icontype: 'content_paste',
		collapse: 'Solicitante',
		role: 'isRequester',
		children: [
			{ path: 'userpublic',
				title: 'Usuarios Públicos',
				ab: 'UP'
			}
		]
	},{
			path: '/reports',
			title: 'Reportes',
			type: 'link',
			icontype: 'format_align_justify',
			role: 'isSupervisor'
	}
];
