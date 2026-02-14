import type { BoxShadowConfig } from '$lib/utils/css-utils';

export interface BoxShadowDef {
	name: string;
	layers: BoxShadowConfig[]; 
	type: 'soft' | 'elevated' | 'neumorphism' | 'neon' | 'retro' | 'inset';
	bgColor?: string; // Optional custom bg for preview
	boxColor?: string; // Optional custom box color for preview
    borderRadius?: number; // Optional border radius
}

export const softShadows: BoxShadowDef[] = [
	{ 
		name: 'Subtle Drop', 
		layers: [
			{ x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
			{ x: 0, y: 2, blur: 4, spread: -1, color: 'rgba(0, 0, 0, 0.06)', inset: false }
		], 
		type: 'soft' 
	},
	{ 
		name: 'Medium Soft', 
		layers: [
			{ x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false },
			{ x: 0, y: 4, blur: 6, spread: -2, color: 'rgba(0, 0, 0, 0.05)', inset: false }
		], 
		type: 'soft' 
	},
	{ 
		name: 'Floaty', 
		layers: [
			{ x: 0, y: 20, blur: 25, spread: -5, color: 'rgba(0, 0, 0, 0.1)', inset: false },
			{ x: 0, y: 10, blur: 10, spread: -5, color: 'rgba(0, 0, 0, 0.04)', inset: false }
		], 
		type: 'soft',
        borderRadius: 24
	},
	{ 
		name: 'Dreamy', 
		layers: [
			{ x: 0, y: 0, blur: 15, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false }
		], 
		type: 'soft',
        borderRadius: 99
	},
	{ 
		name: 'Clean', 
		layers: [
			{ x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false },
			{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.06)', inset: false }
		], 
		type: 'soft' 
	},
	{ 
		name: 'Material 1', 
		layers: [
			{ x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0,0,0,0.12)', inset: false },
			{ x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.24)', inset: false }
		], 
		type: 'soft',
        borderRadius: 4
	},
	{ 
		name: 'Material 2', 
		layers: [
			{ x: 0, y: 3, blur: 6, spread: 0, color: 'rgba(0,0,0,0.16)', inset: false },
			{ x: 0, y: 3, blur: 6, spread: 0, color: 'rgba(0,0,0,0.23)', inset: false }
		], 
		type: 'soft',
        borderRadius: 4
	},
    {
        name: 'Smooth Lift',
        layers: [
            { x: 0, y: 12, blur: 24, spread: -6, color: 'rgba(0, 0, 0, 0.15)', inset: false },
            { x: 0, y: 4, blur: 8, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false }
        ],
        type: 'soft',
        borderRadius: 16
    },
    {
        name: 'Velvet Touch',
        layers: [
            { x: 0, y: 8, blur: 30, spread: -4, color: 'rgba(0, 0, 0, 0.12)', inset: false }
        ],
        type: 'soft',
        borderRadius: 12
    },
    {
        name: 'Ghostly',
        layers: [
            { x: 0, y: 2, blur: 30, spread: 0, color: 'rgba(0, 0, 0, 0.08)', inset: false }
        ],
        type: 'soft',
        borderRadius: 50
    },
    {
        name: 'Gentle Rise',
        layers: [
            { x: 0, y: 6, blur: 12, spread: -2, color: 'rgba(50, 50, 93, 0.25)', inset: false },
            { x: 0, y: 3, blur: 7, spread: -3, color: 'rgba(0, 0, 0, 0.3)', inset: false }
        ],
        type: 'soft',
        borderRadius: 8
    }
];

export const elevatedShadows: BoxShadowDef[] = [
	{ 
		name: 'High Lift', 
		layers: [
			{ x: 0, y: 25, blur: 50, spread: -12, color: 'rgba(0, 0, 0, 0.25)', inset: false }
		], 
		type: 'elevated',
        borderRadius: 20
	},
	{ 
		name: 'Sharp Lift', 
		layers: [
			{ x: 10, y: 10, blur: 0, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false }
		], 
		type: 'elevated',
        borderRadius: 0
	},
	{ 
		name: 'Layered', 
		layers: [
			{ x: 0, y: 1, blur: 1, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false },
			{ x: 0, y: 2, blur: 2, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false },
			{ x: 0, y: 4, blur: 4, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false },
			{ x: 0, y: 8, blur: 8, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false }
		], 
		type: 'elevated' 
	},
	{ 
		name: 'Bottom Heavy', 
		layers: [
			{ x: 0, y: 8, blur: 6, spread: -6, color: 'black', inset: false }
		], 
		type: 'elevated' 
	},
	{ 
		name: 'Crisp', 
		layers: [
			{ x: 0, y: 4, blur: 4, spread: 0, color: 'rgba(0,0,0,0.25)', inset: false }
		], 
		type: 'elevated' 
	},
    {
        name: 'Stack Effect',
        layers: [
            { x: 4, y: 4, blur: 0, spread: 0, color: '#000', inset: false },
            { x: 8, y: 8, blur: 0, spread: 0, color: '#333', inset: false }
        ],
        type: 'elevated',
        borderRadius: 0
    },
    {
        name: 'Floating Deck',
        layers: [
            { x: 0, y: 15, blur: 30, spread: 0, color: 'rgba(0,0,0,0.11)', inset: false },
            { x: 0, y: 5, blur: 15, spread: 0, color: 'rgba(0,0,0,0.08)', inset: false }
        ],
        type: 'elevated',
        borderRadius: 16
    },
    {
        name: 'Deep Shadow',
        layers: [
            { x: 0, y: 30, blur: 60, spread: -12, color: 'rgba(50, 50, 93, 0.25)', inset: false },
            { x: 0, y: 18, blur: 36, spread: -18, color: 'rgba(0, 0, 0, 0.3)', inset: false }
        ],
        type: 'elevated'
    },
    {
        name: 'Intense Drops',
        layers: [
            { x: 0, y: 19, blur: 38, spread: 0, color: 'rgba(0,0,0,0.30)', inset: false },
            { x: 0, y: 15, blur: 12, spread: 0, color: 'rgba(0,0,0,0.22)', inset: false }
        ],
        type: 'elevated'
    }
];

export const neumorphicShadows: BoxShadowDef[] = [
	{ 
		name: 'Soft Convex', 
		layers: [
			{ x: 9, y: 9, blur: 16, spread: 0, color: 'rgb(163,177,198,0.6)', inset: false },
			{ x: -9, y: -9, blur: 16, spread: 0, color: 'rgba(255,255,255, 0.5)', inset: false }
		],
		type: 'neumorphism',
		bgColor: '#e0e5ec',
		boxColor: '#e0e5ec',
        borderRadius: 30
	},
	{ 
		name: 'Soft Concave', 
		layers: [
			{ x: 6, y: 6, blur: 10, spread: 0, color: 'rgba(163,177,198, 0.7)', inset: true },
			{ x: -6, y: -6, blur: 10, spread: 0, color: 'rgba(255,255,255, 0.8)', inset: true }
		],
		type: 'neumorphism',
		bgColor: '#e0e5ec',
		boxColor: '#e0e5ec',
        borderRadius: 50
	},
	{ 
		name: 'Dark Mode', 
		layers: [
			{ x: 5, y: 5, blur: 10, spread: 0, color: '#1a1a1a', inset: false },
			{ x: -5, y: -5, blur: 10, spread: 0, color: '#2e2e2e', inset: false }
		],
		type: 'neumorphism',
		bgColor: '#242424',
		boxColor: '#242424',
        borderRadius: 15
	},
	{ 
		name: 'Pressed Dark', 
		layers: [
			{ x: 5, y: 5, blur: 10, spread: 0, color: '#1a1a1a', inset: true },
			{ x: -5, y: -5, blur: 10, spread: 0, color: '#2e2e2e', inset: true }
		],
		type: 'neumorphism',
		bgColor: '#242424',
		boxColor: '#242424',
        borderRadius: 15
	},
    {
        name: 'Colored Soft',
        layers: [
            { x: 5, y: 5, blur: 10, spread: 0, color: '#b8b9be', inset: false },
            { x: -5, y: -5, blur: 10, spread: 0, color: '#ffffff', inset: false }
        ],
        type: 'neumorphism',
        bgColor: '#e0e0e0',
        boxColor: '#e0e0e0',
        borderRadius: 50
    },
    {
        name: 'Deep Pressed',
        layers: [
            { x: 2, y: 2, blur: 5, spread: 0, color: '#b8b9be', inset: true },
            { x: -3, y: -3, blur: 7, spread: 0, color: '#ffffff', inset: true }
        ],
        type: 'neumorphism',
        bgColor: '#e0e0e0',
        boxColor: '#e0e0e0',
        borderRadius: 12
    },
    {
        name: 'Flat Plate',
        layers: [
            { x: 20, y: 20, blur: 60, spread: 0, color: '#bebebe', inset: false },
            { x: -20, y: -20, blur: 60, spread: 0, color: '#ffffff', inset: false }
        ],
        type: 'neumorphism',
        bgColor: '#e0e0e0',
        boxColor: '#e0e0e0',
        borderRadius: 40
    }
];

export const neonShadows: BoxShadowDef[] = [
	{ 
		name: 'Blue Glow', 
		layers: [
			{ x: 0, y: 0, blur: 5, spread: 0, color: '#03e9f4', inset: false },
			{ x: 0, y: 0, blur: 25, spread: 0, color: '#03e9f4', inset: false },
			{ x: 0, y: 0, blur: 50, spread: 0, color: '#03e9f4', inset: false },
			{ x: 0, y: 0, blur: 100, spread: 0, color: '#03e9f4', inset: false }
		],
		type: 'neon',
		bgColor: '#1a1a2e',
		boxColor: '#1a1a2e',
        borderRadius: 100
	},
	{ 
		name: 'Pink Neon', 
		layers: [
			{ x: 0, y: 0, blur: 10, spread: 0, color: '#fff', inset: false },
			{ x: 0, y: 0, blur: 20, spread: 0, color: '#fff', inset: false },
			{ x: 0, y: 0, blur: 30, spread: 0, color: '#e60073', inset: false },
			{ x: 0, y: 0, blur: 40, spread: 0, color: '#e60073', inset: false },
            { x: 0, y: 0, blur: 50, spread: 0, color: '#e60073', inset: false },
            { x: 0, y: 0, blur: 60, spread: 0, color: '#e60073', inset: false },
            { x: 0, y: 0, blur: 70, spread: 0, color: '#e60073', inset: false }
		],
		type: 'neon',
		bgColor: '#000',
		boxColor: '#fff',
        borderRadius: 50
	},
	{ 
		name: 'Green Energy', 
		layers: [
			{ x: 0, y: 0, blur: 10, spread: 0, color: '#00ff7f', inset: false },
			{ x: 0, y: 0, blur: 20, spread: 0, color: '#00ff7f', inset: false },
			{ x: 0, y: 0, blur: 10, spread: 0, color: '#00ff7f', inset: true }
		],
		type: 'neon',
		bgColor: '#111',
		boxColor: '#111',
        borderRadius: 12
	},
    {
        name: 'Cyber Purple',
        layers: [
            { x: 0, y: 0, blur: 5, spread: 0, color: '#bc13fe', inset: false },
            { x: 0, y: 0, blur: 10, spread: 0, color: '#bc13fe', inset: false },
            { x: 0, y: 0, blur: 20, spread: 0, color: '#bc13fe', inset: false },
            { x: 0, y: 0, blur: 40, spread: 0, color: '#bc13fe', inset: false }
        ],
        type: 'neon',
        bgColor: '#050510',
        boxColor: '#fff'
    },
    {
        name: 'Golden Glint',
        layers: [
             { x: 0, y: 0, blur: 5, spread: 0, color: '#ffd700', inset: false },
             { x: 0, y: 0, blur: 15, spread: 0, color: '#ffd700', inset: false },
             { x: 0, y: 0, blur: 30, spread: 0, color: '#ff8c00', inset: false }
        ],
        type: 'neon',
        bgColor: '#1e0f00',
        boxColor: '#fff'
    },
    {
        name: 'Matrix',
        layers: [
            { x: 0, y: 0, blur: 4, spread: 0, color: '#0f0', inset: false },
            { x: 0, y: 0, blur: 8, spread: 0, color: '#0f0', inset: false },
            { x: 0, y: 0, blur: 2, spread: 0, color: '#0f0', inset: true }
        ],
        bgColor: '#000',
        boxColor: '#000',
        type: 'neon'
    }
];

export const retroShadows: BoxShadowDef[] = [
	{ 
		name: '8-bit', 
		layers: [
			{ x: 4, y: 4, blur: 0, spread: 0, color: '#000000', inset: false }
		], 
		type: 'retro' 
	},
	{ 
		name: 'Stack', 
		layers: [
			{ x: 5, y: 5, blur: 0, spread: 0, color: '#289FED', inset: false },
			{ x: 10, y: 10, blur: 0, spread: 0, color: '#5FB8FF', inset: false },
			{ x: 15, y: 15, blur: 0, spread: 0, color: '#A1D8FF', inset: false },
			{ x: 20, y: 20, blur: 0, spread: 0, color: '#CAE6FF', inset: false },
			{ x: 25, y: 25, blur: 0, spread: 0, color: '#E1EEFF', inset: false },
            { x: 5, y: 5, blur: 15, spread: 5, color: 'rgba(0,0,0,0)', inset: false } // Kept for spacing but alpha is 0
		], 
		type: 'retro' 
	},
	{ 
		name: 'Brutalism', 
		layers: [
			{ x: 6, y: 6, blur: 0, spread: 0, color: '#000', inset: false }
		], 
		type: 'retro', 
		boxColor: '#ffcc00' 
	},
	{ 
		name: 'Offset Outline', 
		layers: [
			{ x: 10, y: 10, blur: 0, spread: -2, color: '#fff', inset: false },
			{ x: 10, y: 10, blur: 0, spread: 2, color: '#000', inset: false }
		], 
		type: 'retro', 
		boxColor: '#000' 
	},
    {
        name: 'Neo-Brutal',
        layers: [
            { x: 8, y: 8, blur: 0, spread: 0, color: '#000', inset: false }
        ],
        type: 'retro',
        boxColor: '#ff6b6b'
    },
    {
        name: 'Comic Book',
        layers: [
            { x: 4, y: 4, blur: 0, spread: 1, color: '#000', inset: false }
        ],
        type: 'retro',
        boxColor: '#fff'
    },
    {
        name: 'Paper Cut',
        layers: [
            { x: 1, y: 1, blur: 0, spread: 0, color: '#ccc', inset: false },
            { x: 2, y: 2, blur: 0, spread: 0, color: '#c9c9c9', inset: false },
            { x: 3, y: 3, blur: 0, spread: 0, color: '#bbb', inset: false },
            { x: 4, y: 4, blur: 0, spread: 0, color: '#b9b9b9', inset: false },
            { x: 5, y: 5, blur: 0, spread: 0, color: '#aaa', inset: false }
        ],
        type: 'retro'
    }
];

export const insetShadows: BoxShadowDef[] = [
	{ 
		name: 'Deep Well', 
		layers: [
			{ x: 0, y: 0, blur: 15, spread: 0, color: 'rgba(0,0,0,0.5)', inset: true }
		], 
		type: 'inset' 
	},
	{ 
		name: 'Inner Border', 
		layers: [
			{ x: 0, y: 0, blur: 0, spread: 4, color: 'rgba(0,0,0,0.1)', inset: true }
		], 
		type: 'inset' 
	},
	{ 
		name: 'Top Inner', 
		layers: [
			{ x: 0, y: 10, blur: 10, spread: -10, color: 'rgba(0,0,0,0.5)', inset: true }
		], 
		type: 'inset' 
	},
	{ 
		name: 'Cushion', 
		layers: [
			{ x: 5, y: 5, blur: 15, spread: 0, color: 'rgba(0,0,0,0.15)', inset: true },
			{ x: -5, y: -5, blur: 15, spread: 0, color: 'rgba(255,255,255,0.8)', inset: true }
		], 
		type: 'inset',
		bgColor: '#f0f0f3',
		boxColor: '#f0f0f3'
	},
    {
        name: 'Engraved',
        layers: [
            { x: 1, y: 1, blur: 0, spread: 0, color: 'rgba(255,255,255,0.5)', inset: false }, // Highlight
            { x: 1, y: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.5)', inset: true } // Shadow
        ],
        type: 'inset',
        bgColor: '#ddd',
        boxColor: '#ddd'
    },
    {
        name: 'Pressed Button',
        layers: [
            { x: 3, y: 3, blur: 6, spread: 0, color: 'rgba(0,0,0,0.2)', inset: true }
        ],
        type: 'inset'
    },
    {
        name: 'Vignette',
        layers: [
             { x: 0, y: 0, blur: 50, spread: 0, color: 'rgba(0,0,0,0.5)', inset: true }
        ],
        type: 'inset'
    }
];
