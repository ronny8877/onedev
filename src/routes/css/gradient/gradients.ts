export interface GradientDef {
	name: string;
	type: 'linear' | 'radial' | 'conic' | 'animated';
	angle?: number;
	shape?: 'circle' | 'ellipse';
	position?: { x: number; y: number };
	stops: { color: string; position: number }[];
	css?: string; // For animated or complex overrides
    animation?: string; // For animated gradients
}

export const linearGradients: GradientDef[] = [
	{ 
        name: 'Sunset Vibes', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#ff7e5f', position: 0 }, { color: '#feb47b', position: 100 }] 
    },
	{ 
        name: 'Ocean Blue', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#2b5876', position: 0 }, { color: '#4e4376', position: 100 }] 
    },
	{ 
        name: 'Purple Love', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#cc2b5e', position: 0 }, { color: '#753a88', position: 100 }] 
    },
	{ 
        name: 'Piggy Pink', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#ee9ca7', position: 0 }, { color: '#ffdde1', position: 100 }] 
    },
	{ 
        name: 'Cool Blues', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] 
    },
	{ 
        name: 'Mega Tron', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#C33764', position: 0 }, { color: '#1D2671', position: 100 }] 
    },
	{ 
        name: 'Green Beach', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#02aab0', position: 0 }, { color: '#00cdac', position: 100 }] 
    },
	{ 
        name: 'Sunny Days', 
        type: 'linear', 
        angle: 120, 
        stops: [{ color: '#d4fc79', position: 0 }, { color: '#96e6a1', position: 100 }] 
    },
	{ 
        name: 'Citrus Peel', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#fddb92', position: 0 }, { color: '#d1fdff', position: 100 }] 
    },
	{ 
        name: 'Azure Pop', 
        type: 'linear', 
        angle: 90, 
        stops: [{ color: '#ad5389', position: 0 }, { color: '#3c1053', position: 100 }] 
    },
    // New Additions
    {
        name: 'Cosmic Fusion',
        type: 'linear',
        angle: 90,
        stops: [{ color: '#ff00cc', position: 0 }, { color: '#333399', position: 100 }]
    },
    {
        name: 'Deep Space',
        type: 'linear',
        angle: 90,
        stops: [{ color: '#000000', position: 0 }, { color: '#434343', position: 100 }]
    },
    {
        name: 'Metallic',
        type: 'linear',
        angle: 90,
        stops: [{ color: '#D3CCE3', position: 0 }, { color: '#E9E4F0', position: 100 }]
    },
    {
        name: 'Morning Mist',
        type: 'linear',
        angle: 0,
        stops: [{ color: '#a18cd1', position: 0 }, { color: '#fbc2eb', position: 100 }]
    },
    {
        name: 'Ripe Malinka',
        type: 'linear',
        angle: 120,
        stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }]
    },
    {
        name: 'Perfect White',
        type: 'linear',
        angle: -225, // Normalized usually 135
        stops: [{ color: '#E3FDF5', position: 0 }, { color: '#FFE6FA', position: 100 }]
    },
     {
        name: 'Soft Grass',
        type: 'linear',
        angle: 0,
        stops: [{ color: '#c1dfc4', position: 0 }, { color: '#deecdd', position: 100 }]
    },
    {
        name: 'Rare Wind',
        type: 'linear',
        angle: 0,
        stops: [{ color: '#a8edea', position: 0 }, { color: '#fed6e3', position: 100 }]
    },
    {
        name: 'Near Moon',
        type: 'linear',
        angle: 0,
        stops: [{ color: '#5ee7df', position: 0 }, { color: '#b490ca', position: 100 }]
    },
    {
        name: 'Wild Apple',
        type: 'linear',
        angle: 0,
        stops: [{ color: '#d299c2', position: 0 }, { color: '#fef9d7', position: 100 }]
    }
];

export const radialGradients: GradientDef[] = [
	{ 
        name: 'Sunny Radial', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }] 
    },
	{ 
        name: 'Cosmic Void', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] 
    },
	{ 
        name: 'Aqua Splash', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#89f7fe', position: 0 }, { color: '#66a6ff', position: 100 }] 
    },
	{ 
        name: 'Soft Purple', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#e0c3fc', position: 0 }, { color: '#8ec5fc', position: 100 }] 
    },
	{ 
        name: 'Night Eye', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#1b2735', position: 0 }, { color: '#090a0f', position: 100 }] 
    },
	{ 
        name: 'Warm Glow', 
        type: 'radial', 
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 99 }, { color: '#fecfef', position: 100 }] 
    },
    {
        name: 'Juicy Peach',
        type: 'radial',
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 99 }, { color: '#fecfef', position: 100 }]
    },
    {
        name: 'Frozen Berry',
        type: 'radial',
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#e6e9f0', position: 0 }, { color: '#eef1f5', position: 100 }]
    },
    {
        name: 'Gentle Care',
        type: 'radial',
        shape: 'circle',
        position: { x: 50, y: 50 },
        stops: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }]
    }
];

export const conicGradients: GradientDef[] = [
	{ 
        name: 'Rainbow Wheel', 
        type: 'conic', 
        angle: 0,
        position: { x: 50, y: 50 },
        stops: [
            { color: 'red', position: 0 }, 
            { color: 'orange', position: 17 }, 
            { color: 'yellow', position: 33 }, 
            { color: 'green', position: 50 }, 
            { color: 'blue', position: 67 }, 
            { color: 'indigo', position: 83 }, 
            { color: 'violet', position: 100 } /* simplified positions */
        ],
        css: 'conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)' // Keep CSS for complex ones
    },
	{ 
        name: 'Pie Chart', 
        type: 'conic', 
        angle: 0,
         position: { x: 50, y: 50 },
        stops: [
             { color: '#ff0000', position: 0 },
             { color: '#00ff00', position: 60 },
             { color: '#0000ff', position: 180 }
        ], // Simplified representation
        css: 'conic-gradient(from 0deg, #ff0000 0deg 60deg, #00ff00 60deg 180deg, #0000ff 180deg)' 
    },
	{ 
        name: 'Metal Cone', 
        type: 'conic', 
        angle: 180,
         position: { x: 50, y: 50 },
        stops: [{ color: '#B8C6DB', position: 0 }, { color: '#F5F7FA', position: 50 }, { color: '#B8C6DB', position: 100 }],
        css: 'conic-gradient(from 180deg at 50% 50%, #B8C6DB 0deg, #F5F7FA 180deg, #B8C6DB 360deg)'
    },
	{ 
        name: 'Neon Radar', 
        type: 'conic', 
        angle: 90,
         position: { x: 50, y: 50 },
        stops: [{ color: '#000000', position: 0 }, { color: '#00ff00', position: 100 }]
    },
	{ 
        name: 'Sunset Spin', 
        type: 'conic', 
        angle: 180,
         position: { x: 50, y: 50 },
         stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fad0c4', position: 50 }, { color: '#ff9a9e', position: 100 }]
    }
];

export const animatedGradients: GradientDef[] = [
	{ 
		name: 'Slow Shift', 
		css: 'linear-gradient(270deg, #ff9a9e, #fad0c4, #fad0c4)',
        animation: 'gradient-shift 15s ease infinite',
        stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fad0c4', position: 100 }],
		type: 'animated'
	},
	{ 
		name: 'Neon Pulse', 
		css: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
        animation: 'gradient-shine 5s linear infinite',
        stops: [{ color: '#12c2e9', position: 0 }, { color: '#c471ed', position: 50 }, { color: '#f64f59', position: 100 }],
		type: 'animated' 
	},
	{ 
		name: 'Aurora', 
		css: 'linear-gradient(45deg, #00c6ff, #0072ff)',
        animation: 'gradient-aurora 10s ease infinite',
        stops: [{ color: '#00c6ff', position: 0 }, { color: '#0072ff', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Disco Light',
		css: 'conic-gradient(from 0deg, red, yellow, green, blue, purple, red)',
        animation: 'spin 4s linear infinite',
        stops: [{ color: 'red', position: 0 }, { color: 'blue', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Hyper Color',
		css: 'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)',
        animation: 'gradient-pan 5s linear infinite',
        stops: [{ color: '#833ab4', position: 0 }, { color: '#fcb045', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Deep Sea',
		css: 'linear-gradient(to bottom, #2c3e50, #4ca1af)',
        animation: 'gradient-rise 8s ease-in-out infinite alternate',
        stops: [{ color: '#2c3e50', position: 0 }, { color: '#4ca1af', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Candy Dream',
		css: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
        animation: 'gradient-pulse 6s ease infinite',
        stops: [{ color: '#d4fc79', position: 0 }, { color: '#96e6a1', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Mystic Night',
		css: 'radial-gradient(circle at 50% 50%, #2b5876, #4e4376)',
        animation: 'gradient-breathe 10s ease infinite',
        stops: [{ color: '#2b5876', position: 0 }, { color: '#4e4376', position: 100 }],
		type: 'animated'
	},
	{
		name: 'Electric Violet',
		css: 'linear-gradient(45deg, #4776E6, #8E54E9)',
        animation: 'gradient-diagonal 5s ease infinite alternate',
        stops: [{ color: '#4776E6', position: 0 }, { color: '#8E54E9', position: 100 }],
		type: 'animated'
	}
];

export const keyframes = `
@keyframes gradient-shift {
	0% { background-position: 0% 50% }
	50% { background-position: 100% 50% }
	100% { background-position: 0% 50% }
}
@keyframes gradient-shine {
	to { background-position: 200% center; }
}
@keyframes gradient-aurora {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
@keyframes gradient-pan {
	0% { background-position: 0% 50%; }
	100% { background-position: 100% 50%; }
}
@keyframes gradient-rise {
	0% { background-position: 50% 0%; }
	100% { background-position: 50% 100%; }
}
@keyframes gradient-pulse {
	0% { background-size: 200% 200%; }
	50% { background-size: 100% 100%; }
	100% { background-size: 200% 200%; }
}
@keyframes gradient-breathe {
	0% { background-size: 100% 100%; }
	50% { background-size: 150% 150%; }
	100% { background-size: 100% 100%; }
}
@keyframes gradient-diagonal {
	0% { background-position: 0% 50%; }
	100% { background-position: 100% 50%; }
}
`;
