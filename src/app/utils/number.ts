export function limitNumberRange(
  val: number,
  min: number,
  max: number
): number {
  return Math.min(max, Math.max(val, min));
}

export function getPercent(val: number, min: number, max: number): number {
  return ((val - min) / (max - min)) * 100;
}

export function valuesEqual(valA: any, valB: any): boolean {
  if (typeof valA != typeof valB) {
    return false;
  }
  return valA == valB;
}
