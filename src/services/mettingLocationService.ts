import { IMeetingLocationsService } from '../interfaces/meetingLocationsService';
import prisma from '../../prisma/client';
import ApiError from '../utils/ApiError';
import {
  CreateMeetingLocation,
  UpdateMeetingLocation,
  MeetingLocation,
} from '../types/meetingLocationType';

class MeetingLocationService implements IMeetingLocationsService {
  async create(data: CreateMeetingLocation): Promise<MeetingLocation> {
    return prisma.meeting_Location.create({ data });
  }

  async getOne(id: number): Promise<MeetingLocation> {
    const meetingLocation = await prisma.meeting_Location.findUnique({
      where: { id },
      include: {
        City: true,
      },
    });
    if (!meetingLocation) throw new ApiError('Meeting location not found', 404);
    return meetingLocation;
  }

  async getAll(): Promise<MeetingLocation[]> {
    return prisma.meeting_Location.findMany({ where: { deletedAt: null } });
  }

  async update(
    id: number,
    data: UpdateMeetingLocation,
  ): Promise<MeetingLocation> {
    await this.getOne(id);
    return prisma.meeting_Location.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.meeting_Location.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

const meetingLocationService = new MeetingLocationService();
export default meetingLocationService;
