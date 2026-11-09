import cron from 'node-cron';
import { orchestratorAgent } from '../agents/orchestratorAgent.js';

export const initExpiryScheduler = () => {
  // Run daily at midnight: 0 0 * * *
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Job]: Running daily Expiry Monitoring Agent pipeline...');
    try {
      const audit = await orchestratorAgent.runExpiryMonitoringPipeline();
      console.log(`[Cron Job Success]: Checked ${audit.totalChecked} items. Triggered ${audit.alertsTriggered} notifications.`);
    } catch (err) {
      console.error(`[Cron Job Error]: ${err.message}`);
    }
  });

  console.log('[Scheduler]: Autonomous Expiry Monitoring Agent scheduler initialized (Daily at 00:00).');
};
