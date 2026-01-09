export enum MonthName {
    JAN = "January",
    FEB = "February",
    MAR = "March",
    APR = "April",
    MAY = "May",
    JUN = "June",
    JUL = "July",
    AUG = "August",
    SEP = "September",
    OCT = "October",
    NOV = "November",
    DEC = "December",
}

export interface TimeStampEntry {
    start: number;
    end: number;
}

export interface TimeFrameEntry {
    month: TimeStampEntry;
    day: TimeStampEntry;
}

export const calendarOrder: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
