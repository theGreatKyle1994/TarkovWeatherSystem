// General
import Module from "./core/Module";
import { calendarOrder } from "../models/calendar";
import type { Database } from "../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default class CalendarModule extends Module {
    constructor(db: Database, logger: ILogger) {
        super(db, logger);
    }

    // public cycleDB(): void {
    //     const monthIndex = this.getMonthIndex();
    //     const monthChoice =
    //         monthIndex === calendarOrder.length - 1
    //             ? calendarOrder[0]
    //             : calendarOrder[monthIndex + 1];
    // }

    // private checkMonthRange(seasonLayout: SeasonLayoutEntry): boolean {
    //     // Validate season timeframes
    //     const monthIndex = this.getMonthIndex() + 1;
    //     const monthOffset =
    //         seasonLayout.month.start + seasonLayout.month.end - monthIndex;

    //     // Determine if current month falls inside season range
    //     return seasonLayout.month.start > seasonLayout.month.end
    //         ? monthOffset >= seasonLayout.month.start ||
    //               monthOffset <= seasonLayout.month.end
    //         : monthOffset >= seasonLayout.month.start &&
    //               monthOffset <= seasonLayout.month.end;
    // }

    // private checkDayRange(seasonLayout: SeasonLayoutEntry): boolean {
    //     const dayOffset =
    //         seasonLayout.day.start + seasonLayout.day.end - this._db.value;

    //     // Check if current day falls inside season range
    //     return seasonLayout.day.start > seasonLayout.day.end
    //         ? dayOffset >= seasonLayout.day.start ||
    //               dayOffset <= seasonLayout.day.end
    //         : dayOffset >= seasonLayout.day.start &&
    //               dayOffset <= seasonLayout.day.end;
    // }

    // private isFinalMonth(seasonLayout: SeasonLayoutEntry): boolean {
    //     // Determine if current month is last month of the season
    //     const monthIndex = this.getMonthIndex() + 1;
    //     return monthIndex === seasonLayout.month.end;
    // }

    // private getMonthIndex(): number {
    //     return calendarOrder.indexOf(this._db.name);
    // }
}
