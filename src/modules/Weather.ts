// // General
// import Module from "./core/Module";
// import type { Database } from "../models/database";
// import type {
//     WeatherWeightsConfig,
//     WeatherCustomConfig,
// } from "../models/weather";
// import {
//     chooseWeight,
//     loadConfig,
//     loadConfigs,
//     loadWeights,
// } from "./core/Utilities";

// // SPT
// import type { ILogger } from "@spt/models/spt/utils/ILogger";
// import type {
//     ISeasonalValues,
//     IWeatherConfig,
// } from "@spt/models/spt/config/IWeatherConfig";

// export default class WeatherModule extends Module {
//     private _weatherValues: IWeatherConfig;
//     private _weatherConfigs: WeatherCustomConfig[] = [];
//     private _weatherTypes: string[] = [];
//     private _weatherWeights: WeatherWeightsConfig;

//     constructor(db: Database, logger: ILogger) {
//         super(db, logger);
//     }

// public setConfig(config: IWeatherConfig): void {
//     this._weatherValues = config;

//     this._weatherWeights = loadWeights(this._logger, "weather/default");
//     this._weatherConfigs = loadConfigs<WeatherCustomConfig>(
//         this._logger,
//         "weather/default",
//         ["weights.json"]
//     );

//     if (this._db.useCustom) {
//         const weatherCount = this._weatherConfigs.length;

//         this._weatherConfigs = loadConfigs<WeatherCustomConfig>(
//             this._logger,
//             "weather/custom",
//             ["weights.json", "example.json", "exampleWeights.json"],
//             this._weatherConfigs
//         );
//         this._weatherWeights = loadWeights(
//             this._logger,
//             "weather/custom",
//             this._weatherWeights
//         );
//     }

//     for (let { name } of this._weatherConfigs)
//         this._weatherTypes.push(name);

//     this._weatherValues.weather.generateWeatherAmountHours = 1;
// }

// public cycleDB(): void {
//     const weatherChoice = chooseWeight(
//         this._weatherWeights[this._db.name]
//     );
// }

// private applyWeather(newWeather: string): void {
//     const weatherChoice = this.findWeather(newWeather);
//     for (let key in this._weatherValues.weather.seasonValues)
//         this._weatherValues.weather.seasonValues[key] = weatherChoice;
// }

// private findWeather(target: string): ISeasonalValues {
//     for (let i = 0; i < this._weatherConfigs.length; i++)
//         if (this._weatherConfigs[i].name === target)
//             return this._weatherConfigs[i].weather;
// }
// }
