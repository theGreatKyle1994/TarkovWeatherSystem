// Configs
import seasonLayouts from "../../config/calendar/seasonLayouts.json";

// General
import Module from "./core/Module";
import {
    CalendarName,
    calendarOrder,
    type SeasonLayoutEntry,
    type SeasonLayouts,
} from "../models/calendar";
import type { SeasonName } from "../models/seasons";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default class CalendarModule extends Module {
    private _seasonLayouts: SeasonLayouts = seasonLayouts;

    constructor(logger: ILogger) {
        super("calendar", logger);
        this._isDecrementing = false;
    }

    public override cycleDB(): void {
        const monthIndex = this.getMonthIndex();
        const monthChoice =
            monthIndex === calendarOrder.length - 1
                ? calendarOrder[0]
                : calendarOrder[monthIndex + 1];
        super.cycleDB(CalendarName[monthChoice]);
    }

    public getNextSeason(): keyof typeof SeasonName {
        for (let key in this._seasonLayouts) {
            const seasonLayout: SeasonLayoutEntry = this._seasonLayouts[key];
            if (
                this.checkMonthRange(seasonLayout) &&
                this.checkDayRange(seasonLayout)
            )
                return key as keyof typeof SeasonName;
        }
    }

    public getNextWeather(): string {
        return "";
    }

    public checkSeasonChange(seasonName: keyof typeof SeasonName): boolean {
        // Grab current season layout
        const seasonLayout: SeasonLayoutEntry = this._seasonLayouts[seasonName];
        // Check month and day range for season update
        this.log(seasonName);
        this.log(`checkMonthRange: ${this.checkMonthRange(seasonLayout)}`);
        this.log(`isFinalMonth: ${this.isFinalMonth(seasonLayout)}`);
        this.log(`checkDayRange: ${this.checkDayRange(seasonLayout)}`);
        return (
            !this.checkMonthRange(seasonLayout) ||
            (this.isFinalMonth(seasonLayout) &&
                !this.checkDayRange(seasonLayout))
        );
    }

    private checkMonthRange(seasonLayout: SeasonLayoutEntry): boolean {
        // Validate season timeframes
        const monthIndex = this.getMonthIndex() + 1;
        const monthOffset =
            seasonLayout.month.start + seasonLayout.month.end - monthIndex;

        // Determine if current month falls inside season range
        return seasonLayout.month.start > seasonLayout.month.end
            ? monthOffset >= seasonLayout.month.start ||
                  monthOffset <= seasonLayout.month.end
            : monthOffset >= seasonLayout.month.start &&
                  monthOffset <= seasonLayout.month.end;
    }

    private checkDayRange(seasonLayout: SeasonLayoutEntry): boolean {
        const dayOffset =
            seasonLayout.day.start + seasonLayout.day.end - this._localDB.value;

        // Check if current day falls inside season range
        return seasonLayout.day.start > seasonLayout.day.end
            ? dayOffset >= seasonLayout.day.start ||
                  dayOffset <= seasonLayout.day.end
            : dayOffset >= seasonLayout.day.start &&
                  dayOffset <= seasonLayout.day.end;
    }

    private isFinalMonth(seasonLayout: SeasonLayoutEntry): boolean {
        // Determine if current month is last month of the season
        const monthIndex = this.getMonthIndex() + 1;
        return monthIndex === seasonLayout.month.end;
    }

    private getMonthIndex(): number {
        return calendarOrder.indexOf(this._localDB.name);
    }

    public override logCurrent(): void {
        super.logCurrent(
            `Current date is: ${this._localDB.name} / ${this._localDB.value}.`
        );
    }

    public override logChange(): void {
        super.logChange(
            `The date changed to: ${this._localDB.name} / ${this._localDB.value}.`
        );
    }
}
