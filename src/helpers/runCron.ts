import * as cron from "node-cron";
import { recalculateVacationDays, refreshDayOffLastYear } from "./leaveDayCalculation";

export const systemRunner = async () => {
    try {
        // Recalculate leave days on the last day of December
        cron.schedule("59 59 23 31 12 *", async () => {
            await recalculateVacationDays();
        });

        // Refresh day off last year on the last day of March
        cron.schedule("59 59 23 31 3 *", async () => {
            await refreshDayOffLastYear();
        });
  
    } catch (error) {
        console.error("Error scheduling tasks:", error);
    }
}