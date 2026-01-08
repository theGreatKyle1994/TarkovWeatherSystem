export interface Database {
    date: {
        name: string;
        nameForm: string;
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
