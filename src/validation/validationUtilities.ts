// Configs
import weightsConfig from "../../config/weightsConfig.json";

// General Imports
import {
  type WeatherDB,
  weatherDBDefaults,
  WeatherType,
} from "../models/weather";
import { type SeasonDB, seasonDBDefaults, SeasonName } from "../models/seasons";
import { type ModConfig, modConfigDefaults } from "../models/mod";
import path from "path";
import fs from "fs/promises";

// SPT Imports
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { Season } from "@spt/models/enums/Season";

export function checkConfigs(
  dbSeason: SeasonDB,
  dbWeather: WeatherDB,
  logger: ILogger
): void {
  checkSeasonDB(dbSeason, logger);
  checkWeatherDB(dbWeather, logger);
}

function checkSeasonDB(dbSeason: SeasonDB, logger: ILogger): void {
  let isError: boolean = false;

  // Check season config for invalid keys
  isError = validateConfigKeys<SeasonDB, typeof seasonDBDefaults>(
    dbSeason,
    seasonDBDefaults,
    "season",
    logger
  );

  // Run config validation checks
  if (!Object.values(SeasonName).includes(dbSeason.seasonName as SeasonName)) {
    isError = true;
    logger.error(
      `[TWS] seasonName: "${dbSeason.seasonName}" is not a valid season type.`
    );
    dbSeason.seasonName = SeasonName.SUMMER;
    dbSeason.seasonType = Season.SUMMER;
  } else if (dbSeason.seasonType !== Season[dbSeason.seasonName]) {
    isError = true;
    logger.error(
      `[TWS] seasonType: "${dbSeason.seasonType}" does not match internal enum for Season.`
    );
    dbSeason.seasonType = Season[dbSeason.seasonName];
  }
  if (dbSeason.seasonLength <= 0 || dbSeason.seasonLeft < 0) {
    isError = true;
    logger.error(
      `[TWS] ${
        dbSeason.seasonLength <= 0 ? "seasonLength" : "seasonLeft"
      } must be ${dbSeason.seasonLength <= 0 ? ">" : ">="} 0.`
    );
    dbSeason.seasonLength = weightsConfig.minSeasonDuration;
    dbSeason.seasonLeft = dbSeason.seasonLength;
  } else if (dbSeason.seasonLeft > dbSeason.seasonLength) {
    isError = true;
    logger.error("[TWS] seasonLeft must be <= seasonLength.");
    dbSeason.seasonLeft = dbSeason.seasonLength;
  }

  // Repair config issues
  if (isError) repairDB<SeasonDB>(dbSeason, "season", logger);
}

function checkWeatherDB(dbWeather: WeatherDB, logger: ILogger): void {
  let isError: boolean = false;

  // Check weather config for invalid keys
  isError = validateConfigKeys<WeatherDB, typeof weatherDBDefaults>(
    dbWeather,
    weatherDBDefaults,
    "weather",
    logger
  );

  // Run config validation checks
  if (
    !Object.values(WeatherType).includes(dbWeather.weatherName as WeatherType)
  ) {
    isError = true;
    logger.error(
      `[TWS] "${dbWeather.weatherName}" is not a valid weather type.`
    );
    dbWeather.weatherName = WeatherType.SUNNY;
  }
  if (dbWeather.weatherLength <= 0 || dbWeather.weatherLeft < 0) {
    isError = true;
    logger.error(
      `[TWS] ${
        dbWeather.weatherLength <= 0 ? "weatherLength" : "weatherLeft"
      } must be ${dbWeather.weatherLength <= 0 ? ">" : ">="} 0.`
    );
    dbWeather.weatherLength = weightsConfig.minWeatherDuration;
    dbWeather.weatherLeft = dbWeather.weatherLength;
  } else if (dbWeather.weatherLeft > dbWeather.weatherLength) {
    isError = true;
    logger.error("[TWS] weatherLeft must be <= weatherLength.");
    dbWeather.weatherLeft = dbWeather.weatherLength;
  }

  // Repair config issues
  if (isError) repairDB<WeatherDB>(dbWeather, "weather", logger);
}

function validateConfigKeys<ConfigType, ModelType>(
  config: ConfigType,
  model: ModelType,
  fileName: string,
  logger: ILogger
): boolean {
  let isError: boolean = false;

  // Delete unknown keys
  for (let key in config) {
    if (!Object.keys(model).includes(key)) {
      isError = true;
      logger.error(`[TWS] Invalid key: "${key}" found in ${fileName}.json.`);
      delete config[key];
    }
  }

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
  return isError;
}

export function checkModConfig(modConfig: ModConfig, logger: ILogger): void {
  let isError: boolean = false;

  // Check mod config for invalid keys
  isError = validateConfigKeys<ModConfig, typeof modConfigDefaults>(
    modConfig,
    modConfigDefaults,
    "config",
    logger
  );

  // Confirm mod config contains only boolean values
  for (let key in modConfig) {
    if (typeof modConfig[key] !== "boolean") {
      isError = true;
      logger.error(`[TWS] ${key}: "${modConfig[key]}" is not a boolean.`);
      modConfig[key] = modConfigDefaults[key];
    }
  }

  // Repair config issues
  if (isError) repairDB<ModConfig>(modConfig, "config", logger);
}

async function repairDB<DBType>(
  db: DBType,
  fileName: string,
  logger: ILogger
): Promise<void> {
  logger.warning(`[TWS] Repairing ${fileName}.json...`);
  try {
    await fs.writeFile(
      path.join(__dirname, "../../config", `${fileName}.json`),
      JSON.stringify(db, null, 2)
    );
    logger.success(`[TWS] Successfully updated ${fileName}.json.`);
  } catch {
    logger.error(`[TWS] Could not write to /config/${fileName}.json.`);
  }
}
