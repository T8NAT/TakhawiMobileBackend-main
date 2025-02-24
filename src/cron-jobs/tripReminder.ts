import schedule from 'node-schedule';
import moment from 'moment';
import prisma from '../../prisma/client';
import sendPushNotification from '../utils/pushNotification';
import { PassengerTripStatus, TripStatus } from '../enum/trip';

const vipTripReminder = async (startTime: Date, endTime: Date) => {
  const trips = await prisma.vIP_Trip.findMany({
    where: {
      Trip: {
        start_date: {
          gte: startTime,
          lte: endTime,
        },
        status: {
          notIn: [
            TripStatus.CANCELLED,
            TripStatus.COMPLETED,
            TripStatus.INPROGRESS,
          ],
        },
      },
    },
    select: {
      Passnger: {
        select: {
          prefered_language: true,
          User_FCM_Tokens: true,
        },
      },
    },
  });
  if (trips.length > 0) {
    const arabicFCM: string[] = [];
    const englishFCM: string[] = [];
    trips.forEach((trip) => {
      if (trip.Passnger.prefered_language === 'ar') {
        arabicFCM.push(
          ...trip.Passnger.User_FCM_Tokens.map((token) => token.token),
        );
      } else {
        englishFCM.push(
          ...trip.Passnger.User_FCM_Tokens.map((token) => token.token),
        );
      }
    });
    if (arabicFCM.length > 0) {
      sendPushNotification({
        title: 'رحلتك على وشك البدء!',
        body: 'رحلتك على وشك البدء. يرجى التوجه إلى نقطة التجمع.',
        tokens: arabicFCM,
      });
    }
    if (englishFCM.length > 0) {
      sendPushNotification({
        title: 'Your trip is about to start!',
        body: 'Your trip is about to start. Please head to the meeting location.',
        tokens: englishFCM,
      });
    }
  }
};

const basicTripReminder = async (startTime: Date, endTime: Date) => {
  const trips = await prisma.basic_Trip.findMany({
    where: {
      Trip: {
        start_date: {
          gte: startTime,
          lte: endTime,
        },
        status: {
          notIn: [
            TripStatus.CANCELLED,
            TripStatus.COMPLETED,
            TripStatus.INPROGRESS,
          ],
        },
      },
    },
    select: {
      Passengers: {
        where: {
          status: PassengerTripStatus.JOINED,
        },
        select: {
          Passnger: {
            select: {
              prefered_language: true,
              User_FCM_Tokens: true,
            },
          },
        },
      },
    },
  });
  if (trips.length > 0) {
    const arabicFCM: string[] = [];
    const englishFCM: string[] = [];
    trips.forEach((trip) => {
      trip.Passengers.forEach((passenger) => {
        if (passenger.Passnger.prefered_language === 'ar') {
          arabicFCM.push(
            ...passenger.Passnger.User_FCM_Tokens.map((token) => token.token),
          );
        } else {
          englishFCM.push(
            ...passenger.Passnger.User_FCM_Tokens.map((token) => token.token),
          );
        }
      });
    });
    if (arabicFCM.length > 0) {
      sendPushNotification({
        title: 'رحلتك على وشك البدء!',
        body: 'رحلتك على وشك البدء. يرجى التوجه إلى نقطة التجمع.',
        tokens: arabicFCM,
      });
    }
    if (englishFCM.length > 0) {
      sendPushNotification({
        title: 'Your trip is about to start!',
        body: 'Your trip is about to start. Please head to the meeting location.',
        tokens: englishFCM,
      });
    }
  }
};

const tripReminder = schedule.scheduleJob('00 */5 * * * *', async () => {
  try {
    /*
    We need to limit this method to only run every 5 minutes to avoid overloading the server
    To avoid sending multiple notifications to the same user, we need to get the trip only once
    We need to get the trips that are scheduled to start in the next 15 minutes
    so if it's 12:00, we need to get the trips that are scheduled to start between 12:15 and 12:20
    when it runs again at 12:05, it will get the trips that are scheduled to start between 12:20 and 12:25
    so will avoid sending multiple notifications to the same user
    */
    const startTime = moment().add(15, 'minutes').toDate();
    const endTime = moment().add(20, 'minutes').toDate();
    await vipTripReminder(startTime, endTime);
    await basicTripReminder(startTime, endTime);
  } catch (error) {
    console.error('Error In Trip Reminder');
  }
});

export default tripReminder;
