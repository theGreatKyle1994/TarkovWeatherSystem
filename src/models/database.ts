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
        nameForm: string;
        season: string;
        weather: string;
    };
    season: {
        name: string;
        nameForm: string;
    };
    weather: {
        name: string;
        nameForm: string;
    };
}
