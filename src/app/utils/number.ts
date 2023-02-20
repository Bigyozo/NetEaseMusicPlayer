export function limitNumberRange(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(val, min));
}

export function getPercent(val: number, min: number, max: number): number {
  return ((val - min) / (max - min)) * 100;
}

export function valuesEqual(valA: any, valB: any): boolean {
  if (typeof valA !== typeof valB) {
    return false;
  }
  return valA === valB;
}

// 取[min，max]之间的随机数
export function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}
