// General
import type { TimeFrameEntry } from "./calendar";

// SPT
import type { ISeasonDateTimes } from "@spt/models/spt/config/IWeatherConfig";

export interface SeasonConfigEntry {
    name: string;
    value: number;
    weight: number;
    weather: Record<string, number>;
    timeFrame: TimeFrameEntry;
}

export interface SeasonConfig {
    [key: string]: SeasonConfigEntry;
}

export const seasonDates: ISeasonDateTimes[] = [
    {
        seasonType: 0,
        name: "SUMMER",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 1,
        name: "AUTUMN",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 2,
        name: "WINTER",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 3,
        name: "SPRING",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 4,
        name: "AUTUMN_LATE",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 5,
        name: "SPRING_EARLY",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 6,
        name: "STORM",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
];
