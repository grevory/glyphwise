import { CONFUSE_ALPHABET } from '../data/specimens';

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function genKey(seed: number, groups = 4, len = 4): string {
  const rnd = mulberry32(seed);
  const A = CONFUSE_ALPHABET;
  const out: string[] = [];
  for (let g = 0; g < groups; g++) {
    let s = '';
    for (let i = 0; i < len; i++) s += A[Math.floor(rnd() * A.length)];
    out.push(s);
  }
  return out.join('-');
}

export function genKeyBatch(seed: number, count = 6): string[] {
  return Array.from({ length: count }, (_, i) => genKey(seed + i * 977));
}
