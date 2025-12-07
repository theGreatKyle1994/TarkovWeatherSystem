// Configs
import modConfig from "../config/config.json";
import dbWeatherConfig from "../config/weather.json";
import dbSeasonConfig from "../config/season.json";
import weightsConfig from "../config/weightsConfig.json";

// General Imports
import { seasonDates } from "./models/seasons";
import { weatherLayouts, type WeatherDB } from "./models/weather";
import type { SeasonDB } from "./models/seasons";
import { checkConfigs } from "./validation/validationUtilities";

// SPT Imports
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";

class WeatherSystem {
  public dbWeather = dbWeatherConfig as WeatherDB;
  public dbSeason = dbSeasonConfig as SeasonDB;
  public logger: ILogger;

  // Main mod initialization
  public enable(weatherSeasonValues: IWeatherConfig, logger: ILogger): void {
    this.logger = logger;

    // Begin loading
    this.logger.log(`[TWS] Loading...`, LogTextColor.GREEN);

    // Validate db configs
    checkConfigs(this.dbSeason, this.dbWeather, this.logger);

    // Check current season
    if (modConfig.enableSeasons) {
      this.logger.log(
        `[TWS] Season is: ${this.dbSeason.seasonName}`,
        LogTextColor.CYAN
      );
    } else {
      this.logger.log("[TWS] Season is disabled.", LogTextColor.YELLOW);
    }

    // Check current weather
    if (modConfig.enableWeather) {
      this.logger.log(
        `[TWS] Weather is: ${this.dbWeather.weatherName}`,
        LogTextColor.CYAN
      );
    } else {
      this.logger.log("[TWS] Weather is disabled.", LogTextColor.YELLOW);
    }

    // Setup game database to initial values from db files
    weatherSeasonValues = {
      ...weatherSeasonValues,
      seasonDates: seasonDates,
      overrideSeason: this.dbSeason.seasonType,
      weather: {
        ...weatherSeasonValues.weather,
        seasonValues: {
          ...weatherSeasonValues.weather.seasonValues,
          default: weatherLayouts[this.dbWeather.weatherName],
        },
      },
    };

    // End loading
    this.logger.log(`[TWS] Loading finished!`, LogTextColor.GREEN);
  }

  public setSeason = (seasonValues: IWeatherConfig) => {
    seasonValues.overrideSeason = this.dbSeason.seasonType;
  };

  public setWeather = (weatherValues: IWeatherConfig) => {
    // Generate random weather choice
    const weatherChoice = this.getRandomWeather();

    // Set chosen weather to database
    weatherValues.weather.seasonValues["default"] =
      weatherLayouts[weatherChoice];

    // Check new weather choice
    this.logger.log(
      `[TWS] The weather changed to: ${weatherChoice}`,
      LogTextColor.BLUE
    );
  };

  public getRandomWeather(): string {
    // Fetch weather weights based on current season
    const seasonWeights: typeof weightsConfig.weatherWeights =
      weightsConfig.weatherWeights[this.dbSeason.seasonName];

    // Calculate total weight of season weather types
    let totalWeight = 0;
    for (let key in seasonWeights) {
      totalWeight += seasonWeights[key];
    }

    // Determine random weather choice
    const cursor = Math.ceil(Math.random() * totalWeight);
    let total = 0;
    for (let key in seasonWeights) {
      total += seasonWeights[key];
      if (total >= cursor) return key;
    }
  }
}

export default WeatherSystem;
