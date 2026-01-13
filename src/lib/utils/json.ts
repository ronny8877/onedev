/**
 * JSON Utilities for all JSON tools
 * Centralized functions for parsing, formatting, validating, and transforming JSON
 */

export interface ParseError {
	message: string;
	line?: number;
	column?: number;
	position?: number;
}

export interface ValidationResult {
	valid: boolean;
	error?: ParseError;
	data?: unknown;
}

/**
 * Parse JSON with detailed error information
 */
export function parseJSONSafe(input: string): ValidationResult {
	try {
		const data = JSON.parse(input);
		return { valid: true, data };
	} catch (err) {
		const error = err as SyntaxError;
		const parseError = extractErrorPosition(error.message, input);
		return {
			valid: false,
			error: {
				message: parseError.message,
				line: parseError.line,
				column: parseError.column,
				position: parseError.position
			}
		};
	}
}

/**
 * Extract line and column from JSON parse error
 */
function extractErrorPosition(
	errorMessage: string,
	input: string
): { message: string; line?: number; column?: number; position?: number } {
	// Try to extract position from error message
	// Format: "... at position X" or "... at line X column Y"
	const positionMatch = errorMessage.match(/at position (\d+)/);
	const lineColMatch = errorMessage.match(/at line (\d+) column (\d+)/);

	if (lineColMatch) {
		return {
			message: errorMessage,
			line: parseInt(lineColMatch[1], 10),
			column: parseInt(lineColMatch[2], 10)
		};
	}

	if (positionMatch) {
		const position = parseInt(positionMatch[1], 10);
		const { line, column } = positionToLineColumn(input, position);
		return { message: errorMessage, line, column, position };
	}

	// Fallback: try to find the issue by parsing incrementally
	return { message: errorMessage };
}

/**
 * Convert character position to line and column
 */
function positionToLineColumn(
	input: string,
	position: number
): { line: number; column: number } {
	const lines = input.substring(0, position).split('\n');
	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}

/**
 * Validate JSON string
 */
export function validateJSON(input: string): ValidationResult {
	return parseJSONSafe(input);
}

/**
 * Format (prettify) JSON with custom indentation
 */
export function formatJSON(input: string, indent: number = 2): string {
	const result = parseJSONSafe(input);
	if (!result.valid || result.data === undefined) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}
	return JSON.stringify(result.data, null, indent);
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJSON(input: string): string {
	const result = parseJSONSafe(input);
	if (!result.valid || result.data === undefined) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}
	return JSON.stringify(result.data);
}

/**
 * Convert JSON array to table data
 */
export interface TableData {
	headers: string[];
	rows: (string | number | boolean | null)[][];
}

export function jsonToTable(input: string): TableData {
	const result = parseJSONSafe(input);
	if (!result.valid) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}

	const data = result.data;
	if (!Array.isArray(data)) {
		throw new Error('Input must be a JSON array');
	}

	if (data.length === 0) {
		return { headers: [], rows: [] };
	}

	// Collect all unique keys from all objects
	const headerSet = new Set<string>();
	for (const item of data) {
		if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
			Object.keys(item).forEach((key) => headerSet.add(key));
		}
	}

	const headers = Array.from(headerSet);
	const rows = data.map((item) => {
		if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
			return headers.map((header) => {
				const value = (item as Record<string, unknown>)[header];
				if (typeof value === 'object') {
					return JSON.stringify(value);
				}
				return value as string | number | boolean | null;
			});
		}
		// For non-object items, put them in a single "value" column
		return [typeof item === 'object' ? JSON.stringify(item) : item];
	});

	return { headers: headers.length > 0 ? headers : ['value'], rows };
}

/**
 * Convert table data to CSV string
 */
export function tableToCSV(table: TableData): string {
	const escapeCSV = (value: unknown): string => {
		const str = String(value ?? '');
		if (str.includes(',') || str.includes('"') || str.includes('\n')) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	};

	const headerRow = table.headers.map(escapeCSV).join(',');
	const dataRows = table.rows.map((row) => row.map(escapeCSV).join(','));

	return [headerRow, ...dataRows].join('\n');
}

/**
 * Generate TypeScript interface from JSON
 * Enhanced with union types, optional fields, and better array handling
 */
export function generateTypeScript(input: string, interfaceName: string = 'Root'): string {
	const result = parseJSONSafe(input);
	if (!result.valid) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}

	const interfaces: string[] = [];
	const generated = new Map<string, string>(); // Track generated interfaces by structure

	function inferType(value: unknown, name: string, isArrayItem: boolean = false): string {
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		
		if (Array.isArray(value)) {
			if (value.length === 0) return 'unknown[]';
			
			// Analyze all items to find union types
			const itemTypes = new Set<string>();
			const objectItems: Record<string, unknown>[] = [];
			
			for (const item of value) {
				if (item === null) {
					itemTypes.add('null');
				} else if (typeof item === 'object' && !Array.isArray(item)) {
					objectItems.push(item as Record<string, unknown>);
				} else {
					itemTypes.add(inferType(item, `${name}Item`, true));
				}
			}
			
			// If we have object items, merge their properties
			if (objectItems.length > 0) {
				const mergedType = generateMergedInterface(objectItems, `${name}Item`);
				itemTypes.add(mergedType);
			}
			
			const types = Array.from(itemTypes);
			if (types.length === 1) {
				return `${types[0]}[]`;
			}
			return `(${types.join(' | ')})[]`;
		}
		
		if (typeof value === 'object') {
			const obj = value as Record<string, unknown>;
			const structureKey = JSON.stringify(Object.keys(obj).sort());
			const typeName = capitalize(name);
			
			// Check if we already generated this structure
			if (generated.has(structureKey)) {
				return generated.get(structureKey)!;
			}
			
			generated.set(structureKey, typeName);
			generateInterface(obj, typeName);
			return typeName;
		}
		
		return typeof value;
	}

	function generateMergedInterface(objects: Record<string, unknown>[], name: string): string {
		// Merge all properties from all objects
		const allProps = new Map<string, { types: Set<string>; count: number }>();
		
		for (const obj of objects) {
			for (const [key, value] of Object.entries(obj)) {
				if (!allProps.has(key)) {
					allProps.set(key, { types: new Set(), count: 0 });
				}
				const prop = allProps.get(key)!;
				prop.types.add(inferType(value, key, true));
				prop.count++;
			}
		}
		
		const typeName = capitalize(name);
		const props = Array.from(allProps.entries())
			.map(([key, { types, count }]) => {
				const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
				const isOptional = count < objects.length;
				const typeStr = types.size === 1 ? Array.from(types)[0] : Array.from(types).join(' | ');
				return `  ${propName}${isOptional ? '?' : ''}: ${typeStr};`;
			})
			.join('\n');

		interfaces.push(`interface ${typeName} {\n${props}\n}`);
		return typeName;
	}

	function generateInterface(obj: Record<string, unknown>, name: string): void {
		const props = Object.entries(obj)
			.map(([key, value]) => {
				const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
				const type = inferType(value, key);
				return `  ${propName}: ${type};`;
			})
			.join('\n');

		interfaces.push(`interface ${name} {\n${props}\n}`);
	}

	if (Array.isArray(result.data)) {
		if (result.data.length > 0 && typeof result.data[0] === 'object' && result.data[0] !== null) {
			// Merge all objects in the array to detect optional fields
			const mergedType = generateMergedInterface(
				result.data.filter(item => typeof item === 'object' && item !== null) as Record<string, unknown>[],
				interfaceName
			);
			return interfaces.reverse().join('\n\n') + `\n\ntype ${interfaceName}Array = ${mergedType}[];`;
		}
		const itemType = inferType(result.data[0], 'Item');
		return `type ${interfaceName} = ${itemType}[];`;
	}

	if (typeof result.data === 'object' && result.data !== null) {
		generateInterface(result.data as Record<string, unknown>, interfaceName);
		return interfaces.reverse().join('\n\n');
	}

	return `type ${interfaceName} = ${typeof result.data};`;
}

/**
 * Generate Go struct from JSON
 */
export function generateGoStruct(input: string, structName: string = 'Root'): string {
	const result = parseJSONSafe(input);
	if (!result.valid) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}

	const structs: string[] = [];
	const generated = new Set<string>();

	function goType(value: unknown, name: string): string {
		if (value === null) return 'interface{}';
		if (Array.isArray(value)) {
			if (value.length === 0) return '[]interface{}';
			return `[]${goType(value[0], `${name}Item`)}`;
		}
		if (typeof value === 'object') {
			const typeName = capitalize(name);
			if (!generated.has(typeName)) {
				generated.add(typeName);
				generateStruct(value as Record<string, unknown>, typeName);
			}
			return typeName;
		}
		switch (typeof value) {
			case 'string':
				return 'string';
			case 'number':
				return Number.isInteger(value) ? 'int' : 'float64';
			case 'boolean':
				return 'bool';
			default:
				return 'interface{}';
		}
	}

	function generateStruct(obj: Record<string, unknown>, name: string): void {
		const fields = Object.entries(obj)
			.map(([key, value]) => {
				const goName = capitalize(key);
				const type = goType(value, key);
				return `\t${goName} ${type} \`json:"${key}"\``;
			})
			.join('\n');

		structs.push(`type ${name} struct {\n${fields}\n}`);
	}

	if (Array.isArray(result.data)) {
		if (result.data.length > 0 && typeof result.data[0] === 'object') {
			generateStruct(result.data[0] as Record<string, unknown>, structName);
			return structs.reverse().join('\n\n');
		}
		return `type ${structName} = []${goType(result.data[0], 'Item')}`;
	}

	if (typeof result.data === 'object' && result.data !== null) {
		generateStruct(result.data as Record<string, unknown>, structName);
		return structs.reverse().join('\n\n');
	}

	return `type ${structName} = ${goType(result.data, '')}`;
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Compare two JSON objects and find differences
 */
export interface DiffResult {
	type: 'added' | 'removed' | 'changed' | 'unchanged';
	path: string;
	oldValue?: unknown;
	newValue?: unknown;
}

export function compareJSON(
	json1: string,
	json2: string,
	ignoreKeyOrder: boolean = false
): DiffResult[] {
	const result1 = parseJSONSafe(json1);
	const result2 = parseJSONSafe(json2);

	if (!result1.valid) throw new Error(`Left JSON: ${result1.error?.message}`);
	if (!result2.valid) throw new Error(`Right JSON: ${result2.error?.message}`);

	const diffs: DiffResult[] = [];

	function compare(obj1: unknown, obj2: unknown, path: string = ''): void {
		if (obj1 === obj2) {
			return;
		}

		if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
			diffs.push({
				type: 'changed',
				path: path || '$',
				oldValue: obj1,
				newValue: obj2
			});
			return;
		}

		if (Array.isArray(obj1) && Array.isArray(obj2)) {
			const maxLen = Math.max(obj1.length, obj2.length);
			for (let i = 0; i < maxLen; i++) {
				const itemPath = `${path}[${i}]`;
				if (i >= obj1.length) {
					diffs.push({ type: 'added', path: itemPath, newValue: obj2[i] });
				} else if (i >= obj2.length) {
					diffs.push({ type: 'removed', path: itemPath, oldValue: obj1[i] });
				} else {
					compare(obj1[i], obj2[i], itemPath);
				}
			}
			return;
		}

		if (typeof obj1 === 'object' && typeof obj2 === 'object') {
			const keys1 = Object.keys(obj1 as Record<string, unknown>);
			const keys2 = Object.keys(obj2 as Record<string, unknown>);
			const allKeys = new Set([...keys1, ...keys2]);

			// Check for key order differences when not ignoring
			if (!ignoreKeyOrder) {
				const commonKeys1 = keys1.filter(k => keys2.includes(k));
				const commonKeys2 = keys2.filter(k => keys1.includes(k));
				
				// If common keys exist but are in different order
				if (commonKeys1.length > 0 && JSON.stringify(commonKeys1) !== JSON.stringify(commonKeys2)) {
					diffs.push({
						type: 'changed',
						path: path || '$',
						oldValue: `Key order: [${commonKeys1.join(', ')}]`,
						newValue: `Key order: [${commonKeys2.join(', ')}]`
					});
				}
			}

			for (const key of allKeys) {
				const keyPath = path ? `${path}.${key}` : key;
				const val1 = (obj1 as Record<string, unknown>)[key];
				const val2 = (obj2 as Record<string, unknown>)[key];

				if (!(key in (obj1 as Record<string, unknown>))) {
					diffs.push({ type: 'added', path: keyPath, newValue: val2 });
				} else if (!(key in (obj2 as Record<string, unknown>))) {
					diffs.push({ type: 'removed', path: keyPath, oldValue: val1 });
				} else {
					compare(val1, val2, keyPath);
				}
			}
			return;
		}

		diffs.push({
			type: 'changed',
			path: path || '$',
			oldValue: obj1,
			newValue: obj2
		});
	}

	compare(result1.data, result2.data);
	return diffs.filter((d) => d.type !== 'unchanged');
}

/**
 * Simple JSONPath query evaluator
 * Supports: $.key, $.key.subkey, $[0], $.key[0].subkey
 */
export function queryJSONPath(input: string, path: string): unknown[] {
	const result = parseJSONSafe(input);
	if (!result.valid) {
		throw new Error(result.error?.message || 'Invalid JSON');
	}

	if (!path.startsWith('$')) {
		throw new Error('JSONPath must start with $');
	}

	const segments = path
		.slice(1)
		.split(/\.|\[/)
		.filter(Boolean)
		.map((s) => s.replace(/\]$/, ''));

	let current: unknown[] = [result.data];

	for (const segment of segments) {
		const next: unknown[] = [];

		for (const item of current) {
			if (item === null || item === undefined) continue;

			if (segment === '*') {
				if (Array.isArray(item)) {
					next.push(...item);
				} else if (typeof item === 'object') {
					next.push(...Object.values(item));
				}
			} else if (/^\d+$/.test(segment)) {
				const index = parseInt(segment, 10);
				if (Array.isArray(item) && index < item.length) {
					next.push(item[index]);
				}
			} else {
				if (typeof item === 'object' && !Array.isArray(item)) {
					const val = (item as Record<string, unknown>)[segment];
					if (val !== undefined) {
						next.push(val);
					}
				}
			}
		}

		current = next;
	}

	return current;
}
