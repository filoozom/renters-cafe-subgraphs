export function addToArray<T>(array: T[], element: T): T[] {
  array.push(element);
  return array;
}
