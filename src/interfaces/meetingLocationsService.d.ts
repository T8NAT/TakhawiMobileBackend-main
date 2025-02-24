import {
  MeetingLocation,
  CreateMeetingLocation,
  UpdateMeetingLocation,
} from '../types/meetingLocationType';

export interface IMeetingLocationsService {
  create(data: CreateMeetingLocation): Promise<MeetingLocation>;
  getOne(id: number): Promise<MeetingLocation>;
  getAll(): Promise<MeetingLocation[]>;
  update(id: number, data: UpdateMeetingLocation): Promise<MeetingLocation>;
  delete(id: number): Promise<void>;
}
