import { IMeetingLocationsService } from '../interfaces/meetingLocationsService';
import { CreateMeetingLocation, UpdateMeetingLocation, MeetingLocation } from '../types/meetingLocationType';
declare class MeetingLocationService implements IMeetingLocationsService {
    create(data: CreateMeetingLocation): Promise<MeetingLocation>;
    getOne(id: number): Promise<MeetingLocation>;
    getAll(): Promise<MeetingLocation[]>;
    update(id: number, data: UpdateMeetingLocation): Promise<MeetingLocation>;
    delete(id: number): Promise<void>;
}
declare const meetingLocationService: MeetingLocationService;
export default meetingLocationService;
