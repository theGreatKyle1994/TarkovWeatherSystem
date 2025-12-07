"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfigs = checkConfigs;
// Configs
const weightsConfig_json_1 = __importDefault(require("../../config/weightsConfig.json"));
// General Imports
const weather_1 = require("../models/weather");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function checkConfigs(dbSeason, dbWeather, logger) {
    checkSeasonDB(dbSeason, logger);
    checkWeatherDB(dbWeather, logger);
}
function checkSeasonDB(dbSeason, logger) {
    let isError = false;
}
function checkWeatherDB(dbWeather, logger) {
    let isError = false;
    isError = validateConfigKeys(dbWeather, weather_1.weatherDBDefaults, "weather", logger);
    if (!Object.values(weather_1.WeatherType).includes(dbWeather.weatherName)) {
        isError = true;
        logger.error(`[TWS] "${dbWeather.weatherName}" is not a valid weather type.`);
        dbWeather.weatherName = weather_1.WeatherType.SUNNY;
    }
    if (dbWeather.weatherLength <= 0 || dbWeather.weatherLeft < 0) {
        isError = true;
        logger.error(`[TWS] ${dbWeather.weatherLength <= 0 ? "weatherLength" : "weatherLeft"} must be ${dbWeather.weatherLength <= 0 ? ">" : ">="} 0.`);
        dbWeather.weatherLength = weightsConfig_json_1.default.minWeatherDuration;
        dbWeather.weatherLeft = dbWeather.weatherLength;
    }
    else if (dbWeather.weatherLeft > dbWeather.weatherLength) {
        isError = true;
        logger.error("[TWS] weatherLeft must be <= weatherLength.");
        dbWeather.weatherLeft = dbWeather.weatherLength;
    }
    if (isError)
        repairDB(dbWeather, "weather", logger);
}
function validateConfigKeys(config, model, fileName, logger) {
    let isError = false;
    // Replace missing keys
    for (let key in model) {
        if (!Object.keys(config).includes(key)) {
            isError = true;
            logger.error(`[TWS] "${key}" is missing in ${fileName}.json.`);
            config = {
                ...config,
                [key]: model[key],
            };
        }
    }
    // Delete unknown keys
    for (let key in config) {
        if (!Object.keys(model).includes(key)) {
            isError = true;
            logger.error(`[TWS] Invalid key: "${key}" found in ${fileName}.json.`);
            delete config[key];
        }
    }
    return isError;
}
async function repairDB(db, fileName, logger) {
    logger.warning(`[TWS] Repairing ${fileName}.json...`);
    try {
        await promises_1.default.writeFile(path_1.default.join(__dirname, "../../config", `${fileName}.json`), JSON.stringify(db, null, 2));
        logger.success(`[TWS] Successfully updated ${fileName}.json.`);
    }
    catch {
        logger.error(`[TWS] Could not write to /config/${fileName}.json.`);
    }
}
//# sourceMappingURL=validationUtilities.js.map