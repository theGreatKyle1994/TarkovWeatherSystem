"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Configs
const config_json_1 = __importDefault(require("../config/config.json"));
const weather_json_1 = __importDefault(require("../config/weather.json"));
const season_json_1 = __importDefault(require("../config/season.json"));
const weightsConfig_json_1 = __importDefault(require("../config/weightsConfig.json"));
// General Imports
const seasons_1 = require("./models/seasons");
const weather_1 = require("./models/weather");
const validationUtilities_1 = require("./validation/validationUtilities");
// SPT Imports
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class WeatherSystem {
    dbWeather = weather_json_1.default;
    dbSeason = season_json_1.default;
    logger;
    enable(weatherSeasonValues, logger) {
        this.logger = logger;
        this.logger.log(`[TWS] Loading...`, LogTextColor_1.LogTextColor.GREEN);
        (0, validationUtilities_1.checkConfigs)(this.dbSeason, this.dbWeather, this.logger);
        if (config_json_1.default.enableSeasons)
            this.logger.log(`[TWS] Season is: ${this.dbSeason.seasonName}`, LogTextColor_1.LogTextColor.CYAN);
        else
            this.logger.log("[TWS] Season is disabled.", LogTextColor_1.LogTextColor.YELLOW);
        if (config_json_1.default.enableWeather)
            this.logger.log(`[TWS] Weather is: ${this.dbWeather.weatherName}`, LogTextColor_1.LogTextColor.CYAN);
        else
            this.logger.log("[TWS] Weather is disabled.", LogTextColor_1.LogTextColor.YELLOW);
        weatherSeasonValues = {
            ...weatherSeasonValues,
            seasonDates: seasons_1.seasonDates,
            overrideSeason: this.dbSeason.seasonType,
            weather: {
                ...weatherSeasonValues.weather,
                seasonValues: {
                    ...weatherSeasonValues.weather.seasonValues,
                    default: weather_1.weatherLayouts[this.dbWeather.weatherName],
                },
            },
        };
        this.logger.log(`[TWS] Loading finished!`, LogTextColor_1.LogTextColor.GREEN);
    }
    setSeason = (seasonValues) => {
        seasonValues.overrideSeason = this.dbSeason.seasonType;
    };
    setWeather = (weatherValues) => {
        const weatherChoice = this.getRandomWeather();
        weatherValues.weather.seasonValues["default"] =
            weather_1.weatherLayouts[weatherChoice];
        this.logger.log(`[TWS] The weather changed to: ${weatherChoice}`, LogTextColor_1.LogTextColor.BLUE);
    };
    getRandomWeather() {
        const seasonWeights = weightsConfig_json_1.default.weatherWeights[this.dbSeason.seasonName];
        let totalWeight = 0;
        for (let key in seasonWeights) {
            totalWeight += seasonWeights[key];
        }
        const cursor = Math.ceil(Math.random() * totalWeight);
        let total = 0;
        for (let key in seasonWeights) {
            total += seasonWeights[key];
            if (total >= cursor)
                return key;
        }
    }
}
exports.default = WeatherSystem;
//# sourceMappingURL=weatherSystem.js.map