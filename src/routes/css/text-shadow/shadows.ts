export interface TextShadowDef {
	name: string;
	css: string;
	type: 'basic' | 'neon' | 'retro' | '3d' | 'creative';
	bgColor?: string; // Optional custom bg for preview
	textColor?: string; // Optional custom text color
    fontFamily?: string;
}

export const basicShadows: TextShadowDef[] = [
	{ name: 'Soft Drop', css: '2px 2px 4px rgba(0,0,0,0.5)', type: 'basic', textColor: '#333' },
	{ name: 'Hard Edge', css: '4px 4px 0px rgba(0,0,0,0.2)', type: 'basic', textColor: '#333' },
	{ name: 'Subtle Glow', css: '0 0 10px rgba(0,0,0,0.5)', type: 'basic', textColor: '#333' },
    { name: 'Lagging', css: '-1px 23px 4px rgba(0, 0, 0, 0.3), 0px 9px 11px rgba(0, 0, 0, 0.2), 2px 2px 0px #a3a3a3;', type: 'basic', textColor: '#333' },
	{ name: 'Outline', css: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', type: 'basic', textColor: '#fff' },
];

export const neonShadows: TextShadowDef[] = [
	{ 
		name: 'Cyber Pink', 
		css: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de', 
		type: 'neon',
		bgColor: '#0f0f1a',
		textColor: '#fff'
	},
	{ 
		name: 'Neon Blue', 
		css: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa', 
		type: 'neon',
		bgColor: '#000',
		textColor: '#fff'
	},
	{
		name: 'Vaporwave',
		css: '2px 2px 0px #b3404a',
		type: 'neon',
		bgColor: '#000',
		textColor: '#40e0d0'
	}
];

export const retroShadows: TextShadowDef[] = [
	{ name: 'Retro 3D', css: '4px 4px 0px #000', type: 'retro', textColor: '#ffcc00', bgColor: '#fff' },
	{ name: 'Old School', css: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', type: 'retro', textColor: '#fff' },
	{ name: 'Stamped', css: '1px 1px 0 #fff, 2px 2px 0 rgba(0,0,0,0.2)', type: 'retro', textColor: '#333', bgColor: '#ddd' },
	{ name: 'Layered Pop', css: '-2px -2px 0 #ff00de, 2px 2px 0 #00eaff', type: 'retro', textColor: '#fff', bgColor: '#222' }
];

export const threeDShadows: TextShadowDef[] = [
	{ 
		name: 'Long Shadow', 
		css: '1px 1px 0 #ccc, 2px 2px 0 #ccc, 3px 3px 0 #ccc, 4px 4px 0 #ccc, 5px 5px 0 #ccc, 6px 6px 0 #ccc, 7px 7px 0 #ccc, 8px 8px 0 #ccc', 
		type: '3d',
		textColor: '#333'
	},
	{ 
		name: 'Extruded', 
		css: '1px 1px #804f4f, 2px 2px #804f4f, 3px 3px #804f4f, 4px 4px #804f4f, 5px 5px #804f4f',
		type: '3d',
		textColor: '#fff',
		bgColor: '#a36666'
	},
	{
		name: 'Deep',
		css: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)',
		type: '3d',
		textColor: '#fff',
		bgColor: '#e0e0e0'
	}
];

export const creativeShadows: TextShadowDef[] = [
	{ name: 'Fire', css: '0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00', type: 'creative', bgColor: '#111', textColor: '#fff' },
	{ name: 'Anaglyph', css: '3px 3px 0 rgba(0,255,255,0.7), -3px -3px 0 rgba(255,0,0,0.7)', type: 'creative', textColor: '#fff', bgColor: '#333' },
	{ name: 'Blurry Motion', css: '10px 0 10px rgba(0,0,0,0.5)', type: 'creative', textColor: '#333' }
];
