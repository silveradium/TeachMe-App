export function roundNumber(number: number, numberOfPlaces = 2) {
  return Math.round((number + Number.EPSILON) * Math.pow(10, numberOfPlaces)) / Math.pow(10, numberOfPlaces);
}
