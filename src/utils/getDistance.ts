import haversine, { Coordinate } from 'haversine';

type Unit = 'mile' | 'km' | 'meter' | 'nmi' | undefined;

// Default unit is kilometer
export const getDistance = (start: Coordinate, end: Coordinate, unit?: Unit) =>
  haversine(start, end, { unit });
