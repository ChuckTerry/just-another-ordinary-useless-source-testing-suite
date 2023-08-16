export function compareEntryArrays(a, b) {
  if (a.length !== b.length) return false;
  const length = a.length;
  for (let index = 0; index < length; index++) {
    if (a[index][0] !== b[index][0]) return false;
    if (a[index][1] !== b[index][1]) return false;
  }
  return true;
}
