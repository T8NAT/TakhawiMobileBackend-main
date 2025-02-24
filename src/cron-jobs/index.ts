/* eslint-disable @typescript-eslint/no-unused-expressions */
import rejectOffers from './rejectOffers';
import tripReminder from './tripReminder';
import scheduleDailyCleanupTasks from './scheduleDailyCleanupTasks';
import vipTripsToCancel from './terminateVipTrips';

const cronJobs = () => {
  rejectOffers;
  tripReminder;
  scheduleDailyCleanupTasks;
  vipTripsToCancel;
};

export default cronJobs;
