// Centralized conversion utilities for all unit types
// Organized by category with pure functions for easy testing

// ============================================================================
// CSS / Web Units
// ============================================================================

export interface CSSUnitConfig {
	baseFontSize: number; // default 16px
	viewportWidth: number; // for vw calculations
	viewportHeight: number; // for vh calculations
	parentFontSize?: number; // for em calculations (defaults to baseFontSize)
}

export const DEFAULT_CSS_CONFIG: CSSUnitConfig = {
	baseFontSize: 16,
	viewportWidth: 1920,
	viewportHeight: 1080,
};

// px conversions
export const pxToRem = (px: number, baseFontSize = 16): number => px / baseFontSize;
export const remToPx = (rem: number, baseFontSize = 16): number => rem * baseFontSize;

export const pxToEm = (px: number, parentFontSize = 16): number => px / parentFontSize;
export const emToPx = (em: number, parentFontSize = 16): number => em * parentFontSize;

export const pxToVw = (px: number, viewportWidth = 1920): number => (px / viewportWidth) * 100;
export const vwToPx = (vw: number, viewportWidth = 1920): number => (vw * viewportWidth) / 100;

export const pxToVh = (px: number, viewportHeight = 1080): number => (px / viewportHeight) * 100;
export const vhToPx = (vh: number, viewportHeight = 1080): number => (vh * viewportHeight) / 100;

export const pxToPercent = (px: number, baseValue: number): number => (px / baseValue) * 100;
export const percentToPx = (percent: number, baseValue: number): number => (percent * baseValue) / 100;

export const pxToPt = (px: number): number => px * 0.75; // 1px = 0.75pt at 96dpi
export const ptToPx = (pt: number): number => pt / 0.75;

export const pxToPc = (px: number): number => px * 0.0625; // 1pc = 12pt = 16px
export const pcToPx = (pc: number): number => pc / 0.0625;

// rem/em interconversion
export const remToEm = (rem: number, baseFontSize = 16, parentFontSize = 16): number => 
	(rem * baseFontSize) / parentFontSize;
export const emToRem = (em: number, parentFontSize = 16, baseFontSize = 16): number => 
	(em * parentFontSize) / baseFontSize;

// Get all CSS unit conversions from px
export function getAllCSSUnits(px: number, config: Partial<CSSUnitConfig> = {}) {
	const cfg = { ...DEFAULT_CSS_CONFIG, ...config };
	const parentFontSize = cfg.parentFontSize ?? cfg.baseFontSize;
	
	return {
		px,
		rem: pxToRem(px, cfg.baseFontSize),
		em: pxToEm(px, parentFontSize),
		vw: pxToVw(px, cfg.viewportWidth),
		vh: pxToVh(px, cfg.viewportHeight),
		pt: pxToPt(px),
		pc: pxToPc(px),
	};
}

// ============================================================================
// Length / Distance
// ============================================================================

// Base unit: millimeters (mm)
const MM_PER_INCH = 25.4;
const MM_PER_CM = 10;
const MM_PER_M = 1000;
const MM_PER_KM = 1000000;
const INCH_PER_FT = 12;
const PX_PER_INCH = 96; // CSS standard

// Pixel conversions (using 96 DPI standard)
export const pxToMm = (px: number, dpi = 96): number => (px * MM_PER_INCH) / dpi;
export const mmToPx = (mm: number, dpi = 96): number => (mm * dpi) / MM_PER_INCH;

export const pxToCm = (px: number, dpi = 96): number => pxToMm(px, dpi) / MM_PER_CM;
export const cmToPx = (cm: number, dpi = 96): number => mmToPx(cm * MM_PER_CM, dpi);

export const pxToInch = (px: number, dpi = 96): number => px / dpi;
export const inchToPx = (inch: number, dpi = 96): number => inch * dpi;

// Physical length conversions
export const mmToCm = (mm: number): number => mm / MM_PER_CM;
export const cmToMm = (cm: number): number => cm * MM_PER_CM;

export const mmToInch = (mm: number): number => mm / MM_PER_INCH;
export const inchToMm = (inch: number): number => inch * MM_PER_INCH;

export const cmToInch = (cm: number): number => (cm * MM_PER_CM) / MM_PER_INCH;
export const inchToCm = (inch: number): number => (inch * MM_PER_INCH) / MM_PER_CM;

export const inchToFt = (inch: number): number => inch / INCH_PER_FT;
export const ftToInch = (ft: number): number => ft * INCH_PER_FT;

export const mToKm = (m: number): number => m / 1000;
export const kmToM = (km: number): number => km * 1000;

export const mmToM = (mm: number): number => mm / MM_PER_M;
export const mToMm = (m: number): number => m * MM_PER_M;

// Get all length conversions from mm
export function getAllLengthUnits(mm: number, dpi = 96) {
	return {
		mm,
		cm: mmToCm(mm),
		m: mmToM(mm),
		km: mm / MM_PER_KM,
		inch: mmToInch(mm),
		ft: mmToInch(mm) / INCH_PER_FT,
		px: mmToPx(mm, dpi),
	};
}

// ============================================================================
// Screen / Resolution
// ============================================================================

export interface ScreenConfig {
	dpi: number; // or ppi
	diagonalInches?: number;
	widthPx?: number;
	heightPx?: number;
}

// DPI is the same as PPI for screen purposes
export const dpiToPpi = (dpi: number): number => dpi;
export const ppiToDpi = (ppi: number): number => ppi;

// Calculate physical dimensions from pixels and DPI
export const pixelsToInches = (pixels: number, dpi: number): number => pixels / dpi;
export const inchesToPixels = (inches: number, dpi: number): number => inches * dpi;

// Calculate diagonal size
export const getScreenDiagonal = (widthPx: number, heightPx: number, dpi: number): number => {
	const diagonalPx = Math.sqrt(widthPx ** 2 + heightPx ** 2);
	return diagonalPx / dpi;
};

// Calculate resolution from physical size and DPI
export const getResolutionFromSize = (widthInches: number, heightInches: number, dpi: number) => ({
	width: Math.round(widthInches * dpi),
	height: Math.round(heightInches * dpi),
});

// Calculate physical size from resolution and DPI
export const getSizeFromResolution = (widthPx: number, heightPx: number, dpi: number) => ({
	widthInches: widthPx / dpi,
	heightInches: heightPx / dpi,
	diagonalInches: getScreenDiagonal(widthPx, heightPx, dpi),
});

// Calculate DPI from dimensions
export const getDpiFromDimensions = (widthPx: number, diagonalInches: number, aspectRatio = 16/9): number => {
	const heightPx = widthPx / aspectRatio;
	const diagonalPx = Math.sqrt(widthPx ** 2 + heightPx ** 2);
	return diagonalPx / diagonalInches;
};

// ============================================================================
// Time
// ============================================================================

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

export const msToSeconds = (ms: number): number => ms / MS_PER_SECOND;
export const secondsToMs = (s: number): number => s * MS_PER_SECOND;

export const msToMinutes = (ms: number): number => ms / MS_PER_MINUTE;
export const minutesToMs = (m: number): number => m * MS_PER_MINUTE;

export const msToHours = (ms: number): number => ms / MS_PER_HOUR;
export const hoursToMs = (h: number): number => h * MS_PER_HOUR;

export const msToDays = (ms: number): number => ms / MS_PER_DAY;
export const daysToMs = (d: number): number => d * MS_PER_DAY;

export const secondsToMinutes = (s: number): number => s / 60;
export const minutesToSeconds = (m: number): number => m * 60;

export const minutesToHours = (m: number): number => m / 60;
export const hoursToMinutes = (h: number): number => h * 60;

export const hoursToDays = (h: number): number => h / 24;
export const daysToHours = (d: number): number => d * 24;

// Get all time conversions from ms
export function getAllTimeUnits(ms: number) {
	return {
		ms,
		seconds: msToSeconds(ms),
		minutes: msToMinutes(ms),
		hours: msToHours(ms),
		days: msToDays(ms),
		humanReadable: msToHumanReadable(ms),
	};
}

// Human readable time format
export function msToHumanReadable(ms: number): string {
	if (ms < 0) return '-' + msToHumanReadable(-ms);
	if (ms < 1000) return `${ms}ms`;
	
	const days = Math.floor(ms / MS_PER_DAY);
	const hours = Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR);
	const minutes = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
	const seconds = Math.floor((ms % MS_PER_MINUTE) / MS_PER_SECOND);
	const remainingMs = ms % MS_PER_SECOND;
	
	const parts: string[] = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (seconds > 0) parts.push(`${seconds}s`);
	if (remainingMs > 0 && parts.length === 0) parts.push(`${remainingMs}ms`);
	
	return parts.join(' ') || '0s';
}

// ============================================================================
// Data / File Size
// ============================================================================

export type DataSizeUnit = 'bits' | 'nibbles' | 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';

const BITS_PER_BYTE = 8;
const BITS_PER_NIBBLE = 4;
const DECIMAL_BASE = 1000;
const BINARY_BASE = 1024;

export const bitsToBytes = (bits: number): number => bits / BITS_PER_BYTE;
export const bytesToBits = (bytes: number): number => bytes * BITS_PER_BYTE;

export const nibblesToBytes = (nibbles: number): number => (nibbles * BITS_PER_NIBBLE) / BITS_PER_BYTE;
export const bytesToNibbles = (bytes: number): number => (bytes * BITS_PER_BYTE) / BITS_PER_NIBBLE;

// Decimal (SI) units - base 1000
export const bytesToKB = (bytes: number): number => bytes / DECIMAL_BASE;
export const kbToBytes = (kb: number): number => kb * DECIMAL_BASE;

export const bytesToMB = (bytes: number): number => bytes / (DECIMAL_BASE ** 2);
export const mbToBytes = (mb: number): number => mb * (DECIMAL_BASE ** 2);

export const bytesToGB = (bytes: number): number => bytes / (DECIMAL_BASE ** 3);
export const gbToBytes = (gb: number): number => gb * (DECIMAL_BASE ** 3);

export const bytesToTB = (bytes: number): number => bytes / (DECIMAL_BASE ** 4);
export const tbToBytes = (tb: number): number => tb * (DECIMAL_BASE ** 4);

export const bytesToPB = (bytes: number): number => bytes / (DECIMAL_BASE ** 5);
export const pbToBytes = (pb: number): number => pb * (DECIMAL_BASE ** 5);

// Binary (IEC) units - base 1024
export const bytesToKiB = (bytes: number): number => bytes / BINARY_BASE;
export const kibToBytes = (kib: number): number => kib * BINARY_BASE;

export const bytesToMiB = (bytes: number): number => bytes / (BINARY_BASE ** 2);
export const mibToBytes = (mib: number): number => mib * (BINARY_BASE ** 2);

export const bytesToGiB = (bytes: number): number => bytes / (BINARY_BASE ** 3);
export const gibToBytes = (gib: number): number => gib * (BINARY_BASE ** 3);

export const bytesToTiB = (bytes: number): number => bytes / (BINARY_BASE ** 4);
export const tibToBytes = (tib: number): number => tib * (BINARY_BASE ** 4);

export const bytesToPiB = (bytes: number): number => bytes / (BINARY_BASE ** 5);
export const pibToBytes = (pib: number): number => pib * (BINARY_BASE ** 5);

// Get all data size conversions from bytes
export function getAllDataSizeUnits(bytes: number) {
	return {
		bits: bytesToBits(bytes),
		nibbles: bytesToNibbles(bytes),
		bytes,
		// Decimal (SI)
		KB: bytesToKB(bytes),
		MB: bytesToMB(bytes),
		GB: bytesToGB(bytes),
		TB: bytesToTB(bytes),
		PB: bytesToPB(bytes),
		// Binary (IEC)
		KiB: bytesToKiB(bytes),
		MiB: bytesToMiB(bytes),
		GiB: bytesToGiB(bytes),
		TiB: bytesToTiB(bytes),
		PiB: bytesToPiB(bytes),
	};
}

// Format data size with appropriate unit
export function formatDataSize(bytes: number, binary = false): string {
	const base = binary ? BINARY_BASE : DECIMAL_BASE;
	const units = binary ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	
	let unitIndex = 0;
	let value = bytes;
	
	while (value >= base && unitIndex < units.length - 1) {
		value /= base;
		unitIndex++;
	}
	
	return `${value.toFixed(2)} ${units[unitIndex]}`;
}

// ============================================================================
// Angle
// ============================================================================

const DEG_PER_RAD = 180 / Math.PI;
const DEG_PER_GRAD = 0.9; // 360 degrees = 400 gradians

export const degToRad = (deg: number): number => deg / DEG_PER_RAD;
export const radToDeg = (rad: number): number => rad * DEG_PER_RAD;

export const degToGrad = (deg: number): number => deg / DEG_PER_GRAD;
export const gradToDeg = (grad: number): number => grad * DEG_PER_GRAD;

export const radToGrad = (rad: number): number => degToGrad(radToDeg(rad));
export const gradToRad = (grad: number): number => degToRad(gradToDeg(grad));

// Get all angle conversions from degrees
export function getAllAngleUnits(deg: number) {
	return {
		deg,
		rad: degToRad(deg),
		grad: degToGrad(deg),
		turns: deg / 360,
	};
}

// Normalize angle to 0-360
export const normalizeDegrees = (deg: number): number => ((deg % 360) + 360) % 360;

// ============================================================================
// Number Bases
// ============================================================================

export const decimalToBinary = (dec: number): string => {
	if (!Number.isInteger(dec) || dec < 0) return '';
	return dec.toString(2);
};

export const binaryToDecimal = (bin: string): number => {
	const cleaned = bin.replace(/[^01]/g, '');
	if (!cleaned) return NaN;
	return parseInt(cleaned, 2);
};

export const decimalToHex = (dec: number): string => {
	if (!Number.isInteger(dec) || dec < 0) return '';
	return dec.toString(16).toUpperCase();
};

export const hexToDecimal = (hex: string): number => {
	const cleaned = hex.replace(/[^0-9A-Fa-f]/g, '');
	if (!cleaned) return NaN;
	return parseInt(cleaned, 16);
};

export const decimalToOctal = (dec: number): string => {
	if (!Number.isInteger(dec) || dec < 0) return '';
	return dec.toString(8);
};

export const octalToDecimal = (oct: string): number => {
	const cleaned = oct.replace(/[^0-7]/g, '');
	if (!cleaned) return NaN;
	return parseInt(cleaned, 8);
};

export const hexToBinary = (hex: string): string => decimalToBinary(hexToDecimal(hex));
export const binaryToHex = (bin: string): string => decimalToHex(binaryToDecimal(bin));

// Get all number base conversions from decimal
export function getAllNumberBases(dec: number) {
	if (!Number.isInteger(dec) || dec < 0) return null;
	return {
		decimal: dec,
		binary: decimalToBinary(dec),
		hex: decimalToHex(dec),
		octal: decimalToOctal(dec),
	};
}

// ============================================================================
// Typography
// ============================================================================

// pt and em relative to px
export const pxToPtTypo = (px: number): number => px * 0.75; // same as pxToPt
export const ptToPxTypo = (pt: number): number => pt / 0.75;

export const ptToEm = (pt: number, baseFontSize = 16): number => ptToPxTypo(pt) / baseFontSize;
export const emToPt = (em: number, baseFontSize = 16): number => pxToPtTypo(em * baseFontSize);

// Line-height conversions
export const lineHeightUnitlessToPx = (unitless: number, fontSize: number): number => unitless * fontSize;
export const lineHeightPxToUnitless = (px: number, fontSize: number): number => px / fontSize;

// Get all typography conversions from px
export function getAllTypographyUnits(px: number, baseFontSize = 16) {
	return {
		px,
		pt: pxToPtTypo(px),
		em: px / baseFontSize,
		rem: px / baseFontSize,
		lineHeightUnitless: px / baseFontSize,
	};
}

// ============================================================================
// Color Values
// ============================================================================

export interface RGB { r: number; g: number; b: number; }
export interface RGBA extends RGB { a: number; }
export interface HSL { h: number; s: number; l: number; }
export interface HSLA extends HSL { a: number; }
export interface CMYK { c: number; m: number; y: number; k: number; }

// HEX to RGB
export function hexToRgb(hex: string): RGB | null {
	const cleaned = hex.replace('#', '');
	let r: number, g: number, b: number;
	
	if (cleaned.length === 3) {
		r = parseInt(cleaned[0] + cleaned[0], 16);
		g = parseInt(cleaned[1] + cleaned[1], 16);
		b = parseInt(cleaned[2] + cleaned[2], 16);
	} else if (cleaned.length === 6) {
		r = parseInt(cleaned.slice(0, 2), 16);
		g = parseInt(cleaned.slice(2, 4), 16);
		b = parseInt(cleaned.slice(4, 6), 16);
	} else {
		return null;
	}
	
	if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
	return { r, g, b };
}

// RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HSL {
	r /= 255;
	g /= 255;
	b /= 255;
	
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	
	if (max === min) {
		return { h: 0, s: 0, l: l * 100 };
	}
	
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	
	let h: number;
	switch (max) {
		case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
		case g: h = ((b - r) / d + 2) / 6; break;
		default: h = ((r - g) / d + 4) / 6;
	}
	
	return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSL to RGB
export function hslToRgb(h: number, s: number, l: number): RGB {
	h /= 360;
	s /= 100;
	l /= 100;
	
	if (s === 0) {
		const gray = Math.round(l * 255);
		return { r: gray, g: gray, b: gray };
	}
	
	const hue2rgb = (p: number, q: number, t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	};
	
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	
	return {
		r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
		g: Math.round(hue2rgb(p, q, h) * 255),
		b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
	};
}

// RGB to CMYK
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
	let c = 1 - (r / 255);
	let m = 1 - (g / 255);
	let y = 1 - (b / 255);
	let k = Math.min(c, Math.min(m, y));
	
	c = (c - k) / (1 - k);
	m = (m - k) / (1 - k);
	y = (y - k) / (1 - k);
	
	if (isNaN(c)) c = 0;
	if (isNaN(m)) m = 0;
	if (isNaN(y)) y = 0;
	
	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100)
	};
}

// CMYK to RGB
export function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
	c = c / 100;
	m = m / 100;
	y = y / 100;
	k = k / 100;
	
	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);
	
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

// HEX to HSL
export function hexToHsl(hex: string): HSL | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
	const rgb = hslToRgb(h, s, l);
	return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// RGBA string parsing
export function parseRgba(str: string): RGBA | null {
	const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
	if (!match) return null;
	return {
		r: parseInt(match[1]),
		g: parseInt(match[2]),
		b: parseInt(match[3]),
		a: match[4] ? parseFloat(match[4]) : 1,
	};
}

// Format functions
export const formatRgb = (r: number, g: number, b: number): string => `rgb(${r}, ${g}, ${b})`;
export const formatRgba = (r: number, g: number, b: number, a: number): string => `rgba(${r}, ${g}, ${b}, ${a})`;
export const formatHsl = (h: number, s: number, l: number): string => `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
export const formatHsla = (h: number, s: number, l: number, a: number): string => `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`;
export const formatCmyk = (c: number, m: number, y: number, k: number): string => `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`;

// Get all color conversions from HEX
export function getAllColorFormats(hex: string) {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	
	return {
		hex: hex.toUpperCase().startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`,
		rgb: formatRgb(rgb.r, rgb.g, rgb.b),
		rgba: formatRgba(rgb.r, rgb.g, rgb.b, 1),
		hsl: formatHsl(hsl.h, hsl.s, hsl.l),
		hsla: formatHsla(hsl.h, hsl.s, hsl.l, 1),
		values: { rgb, hsl },
	};
}

// ============================================================================
// Utility: Format numbers with precision
// ============================================================================

export function formatNumber(num: number, precision = 4): string {
	if (Number.isInteger(num)) return num.toString();
	const fixed = num.toFixed(precision);
	// Remove trailing zeros
	return parseFloat(fixed).toString();
}
