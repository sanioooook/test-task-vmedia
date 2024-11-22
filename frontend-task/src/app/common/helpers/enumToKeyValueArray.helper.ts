/**
 * Converts a TypeScript enum to an array of objects with key and value pairs.
 * @param enumObj - The enum to be converted.
 * @returns An array of objects with `key` and `value` properties.
 */
export function enumToArray<T extends object>(enumObj: T): Array<{ key: string; value: number }> {
  return Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) // Filter out numeric keys
    .map(key => ({
      key: key,
      value: (enumObj as any)[key], // Access the numeric value
    }));
}
