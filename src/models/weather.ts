// SPT
import type { ISeasonalValues } from "@spt/models/spt/config/IWeatherConfig";

export interface WeatherEntry {
    [key: string]: {
        name: string;
        changeInterval: number;
        weather: ISeasonalValues;
    };
}
