import schedule from 'node-schedule';

import warningService from '../services/warningService';
import vehicleService from '../services/vehicleService';

// Running scheduled tasks at 12 AM every day
const scheduleDailyCleanupTasks = schedule.scheduleJob(
  '0 0 * * *',
  async () => {
    await warningService.deleteExpiredWarnings();
    await vehicleService.cleanupOrphanUploads();
  },
);

export default scheduleDailyCleanupTasks;
