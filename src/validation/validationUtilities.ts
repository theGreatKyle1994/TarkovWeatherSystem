// Configs
import weightsConfig from "../../config/weightsConfig.json";

// General Imports
import {
  type WeatherDB,
  weatherDBDefaults,
  WeatherType,
} from "../models/weather";
import { type SeasonDB, seasonDBDefaults, SeasonType } from "../models/seasons";
import path from "path";
import fs from "fs/promises";

// SPT Imports
import type { ILogger } from "@spt/models/spt/utils/ILogger";

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
}

function checkWeatherDB(dbWeather: WeatherDB, logger: ILogger): void {
  let isError: boolean = false;

  isError = validateConfigKeys<WeatherDB, typeof weatherDBDefaults>(
    dbWeather,
    weatherDBDefaults,
    "weather",
    logger
  );

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

  if (isError) repairDB<WeatherDB>(dbWeather, "weather", logger);
}

function validateConfigKeys<configType, modelType>(
  config: configType,
  model: modelType,
  fileName: string,
  logger: ILogger
): boolean {
  let isError: boolean = false;
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

async function repairDB<T>(
  db: T,
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
