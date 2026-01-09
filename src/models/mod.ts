// SPT
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { ILocations } from "@spt/models/spt/server/ILocations";

export interface GameConfigs {
    weatherSeason?: IWeatherConfig;
    events?: ISeasonalEventConfig;
    locations?: ILocations;
}

export interface ModConfig {
    enable: boolean;
}
