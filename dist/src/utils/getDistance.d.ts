import { Coordinate } from 'haversine';
type Unit = 'mile' | 'km' | 'meter' | 'nmi' | undefined;
export declare const getDistance: (start: Coordinate, end: Coordinate, unit?: Unit) => number;
export {};
