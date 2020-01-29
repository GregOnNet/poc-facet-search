export function getLast<T>(collection: T[]): T {
  const lastIndex = collection.length - 1;

  return { ...collection[lastIndex] };
}

export function setLast<T>(collection: T[], update: T): T[] {
  const lastIndex = collection.length - 1;
  const shallow = [...collection];

  shallow[lastIndex] = update;
  return shallow;
}
