
/**
 * Generates a random integer between the specified minimum and maximum values.
 * 
 * @param max - The maximum value (inclusive).
 * @param min - The minimum value (inclusive). Defaults to 0.
 * @returns A random integer between min and max.
 */
export function randomInt(max: number, min: number = 0): number {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Generates a random boolean value.
 * 
 * @returns A random boolean value.
 */
export function randomBoolean(): boolean {

  return Boolean( Math.round( Math.random() ) );

}
