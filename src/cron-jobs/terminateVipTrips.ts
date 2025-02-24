import moment from 'moment';
import schedule from 'node-schedule';
import prisma from '../../prisma/client';
import { TripStatus, TripType } from '../enum/trip';

const vipTripsToCancel = schedule.scheduleJob('0,30 * * * *', async () => {
  try {
    const time = moment().subtract(30, 'minutes').toDate();
    await prisma.trip.updateMany({
      where: {
        type: TripType.VIPTRIP,
        status: TripStatus.PENDING,
        start_date: {
          lte: time,
        },
      },
      data: {
        status: TripStatus.CANCELLED,
      },
    });
  } catch (error) {
    console.error('Error in terminating VIP trips:', error);
  }
});

export default vipTripsToCancel;
