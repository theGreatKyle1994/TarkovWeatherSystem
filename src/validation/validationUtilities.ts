// Configs
import weightsConfig from "../../config/weightsConfig.json";

// General Imports
import { weatherDBModel, WeatherType, type WeatherDB } from "../models/weather";
import { seasonDBModel, SeasonType, type SeasonDB } from "../models/seasons";
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

  for (let key in weatherDBModel) {
    if (!Object.keys(dbWeather).includes(key)) {
      isError = true;
      logger.error(`[TWS] "${key}" is missing in weather.json.`);
      dbWeather = {
        ...dbWeather,
        [key]: weatherDBModel[key],
      };
    }
  }

  for (let key in dbWeather) {
    if (!Object.keys(weatherDBModel).includes(key)) {
      isError = true;
      logger.error(`[TWS] Invalid key: "${key}" found in weather.json.`);
      delete dbWeather[key];
    }
  }

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

  if (isError) repairDB(dbWeather, "weather", logger);
}

async function repairDB(
  db: SeasonDB | WeatherDB,
  filName: string,
  logger: ILogger
): Promise<void> {
  logger.warning(`[TWS] Repairing ${filName}.json...`);
  try {
    await fs.writeFile(
      path.join(__dirname, "../db", `${filName}.json`),
      JSON.stringify(db, null, 2)
    );
    logger.success(`[TWS] Successfully updated ${filName}.json.`);
  } catch {
    logger.error(`[TWS] Could not write to /src/db/${filName}.json.`);
  }
}
