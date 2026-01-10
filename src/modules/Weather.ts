// Configs
import weatherConfig from "../../config/season/weather.json";
import seasonConfig from "../../config/season/seasons.json";

// General
import Module from "./core/Module";
import type { Database } from "../models/database";
import type { WeatherConfig, WeatherConfigEntry } from "../models/weather";
import type { SeasonConfig } from "../models/seasons";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import type { ISeasonalValues } from "@spt/models/spt/config/IWeatherConfig";

export default class WeatherModule extends Module {
    private _weatherValues: IWeatherConfig;
    private readonly _weatherConfig: WeatherConfig = weatherConfig;
    private readonly _seasonConfig: SeasonConfig = seasonConfig;
    private readonly _weatherNames: string[] = [];

    constructor(db: Database, logger: ILogger) {
        super(db, logger);
    }

    private get weather(): ISeasonalValues {
        return this._weatherConfig[this._db.weather.value].weather;
    }

    private get weatherWeights(): Record<string, number> {
        return this._seasonConfig[this._db.season.value].weather;
    }

    private get weatherEntry(): WeatherConfigEntry {
        return this._weatherConfig[this._db.weather.value];
    }

    public initialize(config: IWeatherConfig): void {
        this._weatherValues = config;
        this._weatherValues.weather.generateWeatherAmountHours = 5;
        for (let weather in this._weatherConfig)
            this._weatherNames.push(weather);
    }

    public enable(): void {
        if (!this._weatherNames.includes(this._db.weather.value))
            this._db.weather.value = "sunny";
        if (this._db.weather.name !== this.weatherEntry.name)
            this._db.weather.name = this.weatherEntry.name;
        this.applyWeather();
        this.update();
    }

    public update(): void {
        if (!this._db.event.weather) {
            const weights: Record<string, number> = {};
            for (let key in this.weatherWeights)
                weights[key] = this.weatherWeights[key];
            const weatherChoice: string = this.Utilities.chooseWeight(weights);
            this._db.weather.value = weatherChoice;
            this._db.weather.name =
                this._weatherConfig[this._db.weather.value].name;
            this.applyWeather(this._weatherConfig[weatherChoice].weather);
        } else {
            if (this._weatherNames.includes(this._db.event.weather)) {
                this.applyWeather(
                    this._weatherConfig[this._db.event.weather].weather
                );
            } else {
                this.applyWeather(this.weather);
                this._logger.warning(
                    `[DES] Invalid weather override found in event: '${this._db.event.name}' value: '${this._db.event.weather}'. Using season weather.`
                );
            }
        }
        this._logger.success(
            JSON.stringify(this._weatherValues.weather, null, 4)
        );
    }

    private applyWeather(
        weather: ISeasonalValues = this.weatherEntry.weather
    ): void {
        this._weatherValues.weather.timePeriod = {
            values: [this.weatherEntry.changeInterval],
            weights: [1],
        };
        for (let key in this._weatherValues.weather.seasonValues)
            this._weatherValues.weather.seasonValues[key] = weather;
    }
}
