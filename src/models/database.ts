export interface Database {
    date: {
        name: {
            numeric: string;
            alpha: string;
        };
        month: number;
        day: number;
        year: number;
    };
    event: {
        name: string;
        season: string;
        weather: string;
    };
    season: {
        name: string;
        value: string;
    };
    weather: {
        name: string;
        value: string;
    };
}
