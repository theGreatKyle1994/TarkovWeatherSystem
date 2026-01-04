// Configs
import localDB from "../../config/db/database.json";
import seasonLayouts from "../../config/calendar/seasonLayouts.json";

// General
import Module from "./Module";
import SeasonModule from "./SeasonModule";
import {
    CalendarName,
    calendarOrder,
    type SeasonLayoutEntry,
    type SeasonLayouts,
} from "../models/calendar";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

export default class CalendarModule extends Module {
    private _layouts: SeasonLayouts = seasonLayouts;
    private _SeasonModule: SeasonModule;

    constructor(SeasonModule: SeasonModule, logger: ILogger) {
        super("calendar", localDB.calendar, logger);
        this._SeasonModule = SeasonModule;
        this._isDecrementing = false;
    }

    protected override cycleDB(): void {
        let monthIndex = this.getMonthIndex();
        const monthChoice =
            monthIndex === calendarOrder.length - 1
                ? calendarOrder[0]
                : calendarOrder[monthIndex + 1];
        super.cycleDB(CalendarName[monthChoice]);
    }

    private checkSeasonChange(): void {
        // Grab current season layout
        const season: SeasonLayoutEntry =
            this._layouts[this._SeasonModule.season];

        // Check month and day range for season update
        (!this.checkMonthRange(season) ||
            (this.isFinalMonth(season) && !this.checkDayRange(season))) &&
            // TODO: IMPLEMENT WAY TO CHANGE SEASON EXTERNALLY \/
            this._SeasonModule;
        // TODO: IMPLEMENT WAY TO CHANGE SEASON EXTERNALLY /\
    }

    private checkMonthRange(season: SeasonLayoutEntry): boolean {
        // Validate season timeframes
        const monthIndex = this.getMonthIndex();
        const monthOffset = season.month.start + season.month.end - monthIndex;

        // Determine if current month falls inside season range
        return season.month.start > season.month.end
            ? monthOffset >= season.month.start ||
                  monthOffset <= season.month.end
            : monthOffset >= season.month.start &&
                  monthOffset <= season.month.end;
    }

    private checkDayRange(season: SeasonLayoutEntry): boolean {
        const dayOffset =
            season.day.start + season.day.end - this._localDB.value;

        // Check if current day falls inside season range
        return season.day.start > season.day.end
            ? dayOffset >= season.day.start || dayOffset <= season.day.end
            : dayOffset >= season.day.start && dayOffset <= season.day.end;
    }

    private isFinalMonth(season: SeasonLayoutEntry): boolean {
        // Determine if current month is last month of the season
        const monthIndex = this.getMonthIndex();
        return monthIndex === season.month.end;
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
