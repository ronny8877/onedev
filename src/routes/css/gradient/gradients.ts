export interface GradientDef {
	name: string;
	css: string;
	type: 'linear' | 'radial' | 'conic' | 'animated';
}

export const linearGradients: GradientDef[] = [
	{ name: 'Sunset Vibes', css: 'linear-gradient(to right, #ff7e5f, #feb47b)', type: 'linear' },
	{ name: 'Ocean Blue', css: 'linear-gradient(to right, #2b5876, #4e4376)', type: 'linear' },
	{ name: 'Purple Love', css: 'linear-gradient(to right, #cc2b5e, #753a88)', type: 'linear' },
	{ name: 'Piggy Pink', css: 'linear-gradient(to right, #ee9ca7, #ffdde1)', type: 'linear' },
	{ name: 'Cool Blues', css: 'linear-gradient(to right, #2193b0, #6dd5ed)', type: 'linear' },
	{ name: 'Mega Tron', css: 'linear-gradient(to right, #C33764, #1D2671)', type: 'linear' },
	{ name: 'Green Beach', css: 'linear-gradient(to right, #02aab0, #00cdac)', type: 'linear' },
	{ name: 'Sunny Days', css: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', type: 'linear' },
	{ name: 'Citrus Peel', css: 'linear-gradient(to right, #fddb92 0%, #d1fdff 100%)', type: 'linear' },
	{ name: 'Azure Pop', css: 'linear-gradient(to right, #ad5389, #3c1053)', type: 'linear' },
	{ name: 'Cosmic Fusion', css: 'linear-gradient(to right, #ff00cc, #333399)', type: 'linear' },
	{ name: 'Deep Space', css: 'linear-gradient(to right, #000000, #434343)', type: 'linear' },
	{ name: 'Metallic', css: 'linear-gradient(to right, #D3CCE3, #E9E4F0)', type: 'linear' },
	{ name: 'Morning Mist', css: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)', type: 'linear' },
	{ name: 'Ripe Malinka', css: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)', type: 'linear' },
	{ name: 'Perfect White', css: 'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)', type: 'linear' },
	{ name: 'Soft Grass', css: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)', type: 'linear' },
	{ name: 'Rare Wind', css: 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)', type: 'linear' },
	{ name: 'Near Moon', css: 'linear-gradient(to top, #5ee7df 0%, #b490ca 100%)', type: 'linear' },
	{ name: 'Wild Apple', css: 'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)', type: 'linear' }
];

export const radialGradients: GradientDef[] = [
	{ name: 'Sunny Radial', css: 'radial-gradient(circle, #ffecd2 0%, #fcb69f 100%)', type: 'radial' },
	{ name: 'Cosmic Void', css: 'radial-gradient(circle, #0f0c29, #302b63, #24243e)', type: 'radial' },
	{ name: 'Aqua Splash', css: 'radial-gradient(circle, #89f7fe 0%, #66a6ff 100%)', type: 'radial' },
	{ name: 'Soft Purple', css: 'radial-gradient(circle, #e0c3fc 0%, #8ec5fc 100%)', type: 'radial' },
	{ name: 'Night Eye', css: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)', type: 'radial' },
	{ name: 'Warm Glow', css: 'radial-gradient(circle, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', type: 'radial' },
	{ name: 'Juicy Peach', css: 'radial-gradient(circle, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', type: 'radial' },
	{ name: 'Frozen Berry', css: 'radial-gradient(circle, #e6e9f0 0%, #eef1f5 100%)', type: 'radial' },
	{ name: 'Gentle Care', css: 'radial-gradient(circle, #ffecd2 0%, #fcb69f 100%)', type: 'radial' }
];

export const conicGradients: GradientDef[] = [
	{ name: 'Rainbow Wheel', css: 'conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)', type: 'conic' },
	{ name: 'Pie Chart', css: 'conic-gradient(from 0deg, #ff0000 0deg 60deg, #00ff00 60deg 180deg, #0000ff 180deg)', type: 'conic' },
	{ name: 'Metal Cone', css: 'conic-gradient(from 180deg at 50% 50%, #B8C6DB 0deg, #F5F7FA 180deg, #B8C6DB 360deg)', type: 'conic' },
	{ name: 'Neon Radar', css: 'conic-gradient(from 90deg at 50% 50%, #000000 0%, #00ff00 100%)', type: 'conic' },
	{ name: 'Sunset Spin', css: 'conic-gradient(from 180deg, #ff9a9e, #fad0c4, #fad0c4, #ff9a9e)', type: 'conic' }
];

export const animatedGradients: GradientDef[] = [
	{ 
		name: 'Slow Shift', 
		css: 'linear-gradient(270deg, #ff9a9e, #fad0c4, #fad0c4); background-size: 400% 400%; animation: gradient-shift 15s ease infinite;', 
		type: 'animated'
	},
	{ 
		name: 'Neon Pulse', 
		css: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59); background-size: 200% auto; animation: gradient-shine 5s linear infinite;', 
		type: 'animated' 
	},
	{ 
		name: 'Aurora', 
		css: 'linear-gradient(45deg, #00c6ff, #0072ff); background-size: 200% 200%; animation: gradient-aurora 10s ease infinite;', 
		type: 'animated'
	},
	{
		name: 'Disco Light',
		css: 'conic-gradient(from 0deg, red, yellow, green, blue, purple, red); animation: spin 4s linear infinite;',
		type: 'animated'
	},
	{
		name: 'Hyper Color',
		css: 'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045); background-size: 200% 200%; animation: gradient-pan 5s linear infinite;',
		type: 'animated'
	},
	{
		name: 'Deep Sea',
		css: 'linear-gradient(to bottom, #2c3e50, #4ca1af); background-size: 100% 200%; animation: gradient-rise 8s ease-in-out infinite alternate;',
		type: 'animated'
	},
	{
		name: 'Candy Dream',
		css: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%); background-size: 200% 200%; animation: gradient-pulse 6s ease infinite;',
		type: 'animated'
	},
	{
		name: 'Mystic Night',
		css: 'radial-gradient(circle at 50% 50%, #2b5876, #4e4376); background-size: 200% 200%; animation: gradient-breathe 10s ease infinite;',
		type: 'animated'
	},
	{
		name: 'Electric Violet',
		css: 'linear-gradient(45deg, #4776E6, #8E54E9); background-size: 200% 200%; animation: gradient-diagonal 5s ease infinite alternate;',
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
