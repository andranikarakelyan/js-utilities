export function randomInt(max: number, min: number = 0): number {

  return Math.round(Math.random() * (max - min) + min);

}

export function randomBoolean(): boolean {

  return Boolean( Math.round( Math.random() ) );

}
