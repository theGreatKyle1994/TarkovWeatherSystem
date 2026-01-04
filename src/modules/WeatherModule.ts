// Configs
import localDB from "../../config/db/database.json";

// General
import Module from "./Module";
import type { Database, DBEntry } from "../models/database";
import type {
    WeatherWeightsConfig,
    WeatherCustomConfig,
} from "../models/weather";
import {
    chooseWeight,
    loadConfig,
    loadConfigs,
    loadWeights,
} from "../utilities/utils";

// SPT
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type {
    ISeasonalValues,
    IWeatherConfig,
} from "@spt/models/spt/config/IWeatherConfig";

export default class WeatherModule extends Module {
    private _dbSeason: DBEntry = localDB.season;
    private _weatherValues: IWeatherConfig;
    private _weatherConfigs: WeatherCustomConfig[] = [];
    private _weatherTypes: string[] = [];
    private _weatherWeights: WeatherWeightsConfig;

    constructor(weatherValues: IWeatherConfig, logger: ILogger) {
        super("weather", localDB.weather, logger);
        this._weatherValues = weatherValues;
    }

    protected override configure(): void {
        this._dbSeason = loadConfig<Database>(
            this._logger,
            "db/database"
        ).season;

        this._weatherWeights = loadWeights(this._logger, "weather/default");
        this._weatherConfigs = loadConfigs<WeatherCustomConfig>(
            this._logger,
            "weather/default",
            ["weights.json"]
        );

        this.log(
            `Loaded ${this._weatherConfigs.length} default weather pattern(s).`,
            LogTextColor.GREEN
        );

        if (this._moduleConfig.useCustom) {
            const weatherCount = this._weatherConfigs.length;

            this._weatherConfigs = loadConfigs<WeatherCustomConfig>(
                this._logger,
                "weather/custom",
                ["weights.json", "example.json", "exampleWeights.json"],
                this._weatherConfigs
            );
            this._weatherWeights = loadWeights(
                this._logger,
                "weather/custom",
                this._weatherWeights
            );

            this.log(
                `Loaded ${Math.abs(
                    weatherCount - this._weatherConfigs.length
                )} custom weather pattern(s).`,
                LogTextColor.GREEN
            );
        }

        for (let { name } of this._weatherConfigs)
            this._weatherTypes.push(name);

        this._weatherValues.weather.generateWeatherAmountHours = 1;
        super.configure();
    }

    public override updateDB(): void {
        this._dbSeason = loadConfig<Database>(
            this._logger,
            "db/database"
        ).season;
        super.updateDB();
    }

    protected override cycleDB(): void {
        const weatherChoice = chooseWeight(
            this._weatherWeights[this._dbSeason.name]
        );
        this.applyWeather(weatherChoice);
        super.cycleDB(weatherChoice);
    }

    protected override enforceDB(): void {
        this.applyWeather(this._localDB.name);
        super.enforceDB();
    }

    public override forceDBChange(newWeather: string): void {
        this.applyWeather(newWeather);
        super.forceDBChange(newWeather);
    }

    private applyWeather(newWeather: string): void {
        const weatherChoice = this.findWeather(newWeather);
        for (let key in this._weatherValues.weather.seasonValues)
            this._weatherValues.weather.seasonValues[key] = weatherChoice;
    }

    private findWeather(target: string): ISeasonalValues {
        for (let i = 0; i < this._weatherConfigs.length; i++)
            if (this._weatherConfigs[i].name === target)
                return this._weatherConfigs[i].weather;
    }
}
