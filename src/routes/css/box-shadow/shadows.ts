export interface BoxShadowDef {
	name: string;
	css: string;
	type: 'soft' | 'elevated' | 'neumorphism' | 'neon' | 'retro' | 'inset';
	bgColor?: string; // Optional custom bg for preview
	boxColor?: string; // Optional custom box color for preview
}

export const softShadows: BoxShadowDef[] = [
	{ name: 'Subtle Drop', css: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', type: 'soft' },
	{ name: 'Medium Soft', css: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', type: 'soft' },
	{ name: 'Floaty', css: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', type: 'soft' },
	{ name: 'Dreamy', css: '0 0 15px rgba(0, 0, 0, 0.1)', type: 'soft' },
	{ name: 'Clean', css: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', type: 'soft' },
	{ name: 'Material 1', css: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', type: 'soft' },
	{ name: 'Material 2', css: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', type: 'soft' },
];

export const elevatedShadows: BoxShadowDef[] = [
	{ name: 'High Lift', css: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', type: 'elevated' },
	{ name: 'Sharp Lift', css: '10px 10px 0px 0px rgba(0,0,0,0.1)', type: 'elevated' },
	{ name: 'Layered', css: '0 1px 1px rgba(0,0,0,0.15), 0 2px 2px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.15), 0 8px 8px rgba(0,0,0,0.15)', type: 'elevated' },
	{ name: 'Bottom Heavy', css: '0 8px 6px -6px black', type: 'elevated' },
	{ name: 'Crisp', css: '0 4px 4px rgba(0,0,0,0.25)', type: 'elevated' },
];

export const neumorphicShadows: BoxShadowDef[] = [
	{ 
		name: 'Soft Convex', 
		css: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)', 
		type: 'neumorphism',
		bgColor: '#e0e5ec',
		boxColor: '#e0e5ec'
	},
	{ 
		name: 'Soft Concave', 
		css: 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)', 
		type: 'neumorphism',
		bgColor: '#e0e5ec',
		boxColor: '#e0e5ec'
	},
	{ 
		name: 'Dark Mode', 
		css: '5px 5px 10px #1a1a1a, -5px -5px 10px #2e2e2e', 
		type: 'neumorphism',
		bgColor: '#242424',
		boxColor: '#242424'
	},
	{ 
		name: 'Pressed Dark', 
		css: 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #2e2e2e', 
		type: 'neumorphism',
		bgColor: '#242424',
		boxColor: '#242424'
	}
];

export const neonShadows: BoxShadowDef[] = [
	{ 
		name: 'Blue Glow', 
		css: '0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4', 
		type: 'neon',
		bgColor: '#1a1a2e',
		boxColor: '#1a1a2e'
	},
	{ 
		name: 'Pink Neon', 
		css: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073', 
		type: 'neon',
		bgColor: '#000',
		boxColor: '#fff' 
	},
	{ 
		name: 'Green Energy', 
		css: '0 0 10px #00ff7f, 0 0 20px #00ff7f, inset 0 0 10px #00ff7f', 
		type: 'neon',
		bgColor: '#111',
		boxColor: '#111'
	}
];

export const retroShadows: BoxShadowDef[] = [
	{ name: '8-bit', css: '4px 4px 0px 0px #000000', type: 'retro' },
	{ name: 'Stack', css: '5px 5px 0px 0px #289FED, 10px 10px 0px 0px #5FB8FF, 15px 15px 0px 0px #A1D8FF, 20px 20px 0px 0px #CAE6FF, 25px 25px 0px 0px #E1EEFF, 5px 5px 15px 5px rgba(0,0,0,0)', type: 'retro' },
	{ name: 'Brutalism', css: '6px 6px 0px 0px #000', type: 'retro', boxColor: '#ffcc00' },
	{ name: 'Offset Outline', css: '10px 10px 0 -2px #fff, 10px 10px 0 2px #000', type: 'retro', boxColor: '#000' }
];

export const insetShadows: BoxShadowDef[] = [
	{ name: 'Deep Well', css: 'inset 0 0 15px rgba(0,0,0,0.5)', type: 'inset' },
	{ name: 'Inner Border', css: 'inset 0 0 0 4px rgba(0,0,0,0.1)', type: 'inset' },
	{ name: 'Top Inner', css: 'inset 0 10px 10px -10px rgba(0,0,0,0.5)', type: 'inset' },
	{ name: 'Cushion', css: 'inset 5px 5px 15px rgba(0,0,0,0.15), inset -5px -5px 15px rgba(255,255,255,0.8)', type: 'inset', bgColor: '#f0f0f3', boxColor: '#f0f0f3' }
];
