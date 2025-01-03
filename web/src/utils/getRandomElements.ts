function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function getRandomElements<T>(arr: T[], numElements: number): T[] {
  shuffleArray(arr);

  return arr.slice(0, numElements);
}
