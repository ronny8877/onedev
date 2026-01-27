export interface TextGradientDef {
	name: string;
	gradient: string;
	type: 'modern' | 'metal' | 'nature' | 'retro' | 'brand';
    fontFamily?: string;
    fontWeight?: string;
    bgColor?: string; // Optional custom bg for preview
}

export const modernGradients: TextGradientDef[] = [
    { name: 'Aurora', gradient: 'linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7)', type: 'modern' },
    { name: 'Sunset Vibes', gradient: 'linear-gradient(to right, #ff9a9e, #fecfef, #feada6)', type: 'modern' },
    { name: 'Oceanic', gradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', type: 'modern' },
    { name: 'Purple Haze', gradient: 'linear-gradient(to right, #7F00FF, #E100FF)', type: 'modern' },
    { name: 'Electric Violet', gradient: 'linear-gradient(to right, #4776E6, #8E54E9)', type: 'modern' }
];

export const metalGradients: TextGradientDef[] = [
    { name: 'Gold', gradient: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)', type: 'metal', bgColor: '#1a1a1a' },
    { name: 'Silver', gradient: 'linear-gradient(to right, #A9A9A9, #EBEBEB, #A9A9A9)', type: 'metal', bgColor: '#1a1a1a' },
    { name: 'Chrome', gradient: 'linear-gradient(to bottom, #333 0%, #888 50%, #333 100%)', type: 'metal', bgColor: '#fff' },
    { name: 'Copper', gradient: 'linear-gradient(to right, #b87e63, #e8c7b6, #b87e63)', type: 'metal', bgColor: '#1a1a1a' }
];

export const natureGradients: TextGradientDef[] = [
    { name: 'Forest', gradient: 'linear-gradient(to right, #134E5E, #71B280)', type: 'nature' },
    { name: 'Deep Sea', gradient: 'linear-gradient(to right, #2C3E50, #4CA1AF)', type: 'nature' },
    { name: 'Sunny Day', gradient: 'linear-gradient(to right, #fceabb, #f8b500)', type: 'nature' },
    { name: 'Berry', gradient: 'linear-gradient(to right, #C04848, #480048)', type: 'nature' }
];

export const retroGradients: TextGradientDef[] = [
    { name: 'Synthwave', gradient: 'linear-gradient(to right, #ff00cc, #333399)', type: 'retro', fontFamily: "'Courier New', monospace" },
    { name: '80s Pop', gradient: 'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', type: 'retro' },
    { name: 'Disco', gradient: 'linear-gradient(to right, #24C6DC, #514A9D)', type: 'retro' },
    { name: 'Hotline', gradient: 'linear-gradient(to right, #ff6a00, #ee0979)', type: 'retro' }
];

export const brandGradients: TextGradientDef[] = [
    { name: 'Insta-ish', gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', type: 'brand' },
    { name: 'Hyper', gradient: 'linear-gradient(to right, #ec008c, #fc6767)', type: 'brand' },
    { name: 'Cool', gradient: 'linear-gradient(to right, #2193b0, #6dd5ed)', type: 'brand' },
    { name: 'Dark Side', gradient: 'linear-gradient(to right, #232526, #414345)', type: 'brand' }
];
