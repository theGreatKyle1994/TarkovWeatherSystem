// General
import Module from "./core/Module";
import { calendarOrder } from "../models/calendar";
import type { Database } from "../models/database";
import type { TimeFrameEntry, TimeStampEntry } from "../models/calendar";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default class CalendarModule extends Module {
    constructor(db: Database, logger: ILogger) {
        super(db, logger);
    }

    public enable(): void {}

    public update(): void {
        this._db.date.day++;
        if (this._db.date.day > 30) {
            this._db.date.day = 1;
            this._db.date.month++;
            if (this._db.date.month > 12) {
                this._db.date.month = 1;
                this._db.date.year++;
            }
        }

        this._db.date.name.numeric = `${this._db.date.month}/${this._db.date.day}/${this._db.date.year}`;
        this._db.date.name.alpha = `${this.getMonthName()} ${this.getDayName()}, ${
            this._db.date.year
        }`;
    }

    private getDayName(): string {
        let dayName: string = `${this._db.date.day}`;
        switch (this._db.date.day) {
            case 1:
                dayName += "st";
                break;
            case 2:
                dayName += "nd";
                break;
            case 3:
                dayName += "rd";
                break;
            default:
                dayName += "th";
        }
        return dayName;
    }

    private getMonthName(): string {
        return this._db.date.month === calendarOrder.length
            ? calendarOrder[calendarOrder.length - 1]
            : calendarOrder[this._db.date.month - 1];
    }
}
