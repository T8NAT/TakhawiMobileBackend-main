export interface MeetingLocation {
  id: number;
  ar_name: string;
  en_name: string;
  location: JsonValue;
  cityId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  City?: City;
}

export type LocationType = {
  lat: number;
  lng: number;
};

export type CreateMeetingLocation = Omit<
  MeetingLocation,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'City'
>;
export type UpdateMeetingLocation = Partial<CreateMeetingLocation>;
