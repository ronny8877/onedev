export interface BarcodeFormatOption {
	id: string;
	label: string;
	hint: string;
	sample: string;
	validate: (value: string) => string | null;
}

function digitsOnly(value: string): string {
	return value.replace(/\D/g, '');
}

function eanChecksum(digits: string): string {
	let sum = 0;
	for (let i = 0; i < digits.length; i++) {
		const n = Number(digits[i]);
		sum += i % 2 === 0 ? n : n * 3;
	}
	return String((10 - (sum % 10)) % 10);
}

export const BARCODE_FORMATS: BarcodeFormatOption[] = [
	{
		id: 'CODE128',
		label: 'CODE 128',
		hint: 'Any ASCII text. Common for shipping labels and inventory.',
		sample: 'ONDEV-12345',
		validate: (value) => (value.length ? null : 'Enter some text to encode.')
	},
	{
		id: 'CODE39',
		label: 'CODE 39',
		hint: 'Uppercase letters, digits, and - . $ / + % space.',
		sample: 'SKU-42',
		validate: (value) =>
			/^[A-Z0-9\-. $/+%]*$/i.test(value) ? null : 'CODE 39 only allows A-Z, 0-9, and -.$/+% space.'
	},
	{
		id: 'EAN13',
		label: 'EAN-13',
		hint: '12 digits (checksum added) or a full 13-digit code.',
		sample: '5901234123457',
		validate: (value) => {
			const d = digitsOnly(value);
			if (d.length === 12 || d.length === 13) return null;
			return 'EAN-13 needs 12 or 13 digits.';
		}
	},
	{
		id: 'EAN8',
		label: 'EAN-8',
		hint: '7 digits (checksum added) or a full 8-digit code.',
		sample: '96385074',
		validate: (value) => {
			const d = digitsOnly(value);
			if (d.length === 7 || d.length === 8) return null;
			return 'EAN-8 needs 7 or 8 digits.';
		}
	},
	{
		id: 'UPC',
		label: 'UPC-A',
		hint: '11 digits (checksum added) or a full 12-digit UPC.',
		sample: '012345678905',
		validate: (value) => {
			const d = digitsOnly(value);
			if (d.length === 11 || d.length === 12) return null;
			return 'UPC-A needs 11 or 12 digits.';
		}
	},
	{
		id: 'ITF14',
		label: 'ITF-14',
		hint: '13 digits (checksum added) or a full 14-digit carton code.',
		sample: '15400141288763',
		validate: (value) => {
			const d = digitsOnly(value);
			if (d.length === 13 || d.length === 14) return null;
			return 'ITF-14 needs 13 or 14 digits.';
		}
	},
	{
		id: 'MSI',
		label: 'MSI',
		hint: 'Digits only. Used in warehouses and inventory.',
		sample: '1234567',
		validate: (value) => (digitsOnly(value).length ? null : 'MSI needs at least one digit.')
	},
	{
		id: 'pharmacode',
		label: 'Pharmacode',
		hint: 'Integer from 3 to 131070. Used on pharmaceutical packs.',
		sample: '1234',
		validate: (value) => {
			const n = Number(digitsOnly(value));
			if (Number.isInteger(n) && n >= 3 && n <= 131070) return null;
			return 'Pharmacode needs an integer between 3 and 131070.';
		}
	},
	{
		id: 'codabar',
		label: 'Codabar',
		hint: 'Digits plus - $ : / . + . Wrap with A-D start/stop letters if you want them.',
		sample: 'A123456A',
		validate: (value) =>
			/^[A-Da-d]?[0-9\-$:/.+]+[A-Da-d]?$/.test(value) ? null : 'Codabar allows digits and -$:/.+ with optional A-D start/stop.'
	}
];

export function getBarcodeFormat(id: string): BarcodeFormatOption {
	return BARCODE_FORMATS.find((f) => f.id === id) ?? BARCODE_FORMATS[0];
}

export function normalizeBarcodeValue(formatId: string, value: string): string {
	const trimmed = value.trim();
	if (formatId === 'CODE39') return trimmed.toUpperCase();
	if (formatId === 'EAN13' || formatId === 'EAN8' || formatId === 'UPC' || formatId === 'ITF14' || formatId === 'MSI' || formatId === 'pharmacode') {
		return digitsOnly(trimmed);
	}
	return trimmed;
}

export { eanChecksum };
