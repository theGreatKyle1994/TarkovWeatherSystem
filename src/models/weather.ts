// SPT
import type { ISeasonalValues } from "@spt/models/spt/config/IWeatherConfig";

export interface WeatherConfigEntry {
    name: string;
    changeInterval: number;
    weather: ISeasonalValues;
}

export interface WeatherConfig {
    [key: string]: WeatherConfigEntry;
}
