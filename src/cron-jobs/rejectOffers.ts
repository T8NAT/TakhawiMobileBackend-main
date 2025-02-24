import schedule from 'node-schedule';
import moment from 'moment';
import prisma from '../../prisma/client';
import { OfferStatus } from '../enum/trip';

// Reject offers that are pending for more than 3 minutes every minute
const rejectOffers = schedule.scheduleJob('00 * * * * *', async () => {
  try {
    const time = moment().subtract(3, 'minutes').toDate();
    await prisma.offers.updateMany({
      where: {
        status: OfferStatus.PENDING,
        createdAt: {
          lte: time,
        },
      },
      data: {
        status: OfferStatus.REJECTED,
      },
    });
  } catch (error) {
    console.error('Error rejecting offers');
  }
});

export default rejectOffers;
