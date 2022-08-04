import { getRandomInt } from './number';

export function inArray(arr: any[], target: any): boolean {
  return arr.indexOf(target) != -1;
}

export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = 0; i < result.length; i++) {
    const j = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
