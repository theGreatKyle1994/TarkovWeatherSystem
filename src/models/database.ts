export interface DBEntry {
    name: string;
    length: number;
    remaining: number;
}

export interface Database {
    season: DBEntry;
    weather: DBEntry;
    calendar: DBEntry;
}
