// Configs
import modConfig from "../../../config/config.json";

// General
import CalendarModule from "../CalendarModule";
import SeasonModule from "../SeasonModule";
import WeatherModule from "../WeatherModule";
import EventModule from "../EventModule";
import type { ModConfig } from "../../models/mod";

// SPT
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { DependencyContainer } from "tsyringe";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import type { ILocations } from "@spt/models/spt/server/ILocations";

interface GameConfigs {
    weatherSeason?: IWeatherConfig;
    events?: ISeasonalEventConfig;
    locations?: ILocations;
}

export default class ModuleManager {
    private readonly _logger: ILogger;
    private readonly _modConfig: ModConfig = modConfig;
    private readonly _DatabaseService: DatabaseService;
    private readonly _ConfigServer: ConfigServer;
    private _SeasonModule: SeasonModule;
    private _WeatherModule: WeatherModule;
    private _CalendarModule: CalendarModule;
    private _EventModule: EventModule;
    private _gameConfigs: GameConfigs = {};

    constructor(container: DependencyContainer, logger: ILogger) {
        this._logger = logger;
        this._DatabaseService =
            container.resolve<DatabaseService>("DatabaseService");
        this._ConfigServer = container.resolve<ConfigServer>("ConfigServer");

        this._CalendarModule = new CalendarModule(this._logger);
        this._SeasonModule = new SeasonModule(this._logger);
        this._WeatherModule = new WeatherModule(this._logger);
    }

    public preSPTConfig(): void {
        this._gameConfigs.weatherSeason =
            this._ConfigServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);
        this._gameConfigs.events =
            this._ConfigServer.getConfig<ISeasonalEventConfig>(
                ConfigTypes.SEASONAL_EVENT
            );
    }

    public postDBConfig(): void {
        this._gameConfigs.locations = this._DatabaseService.getLocations();

        this._SeasonModule.setConfig(this._gameConfigs.weatherSeason);
        this._WeatherModule.setConfig(this._gameConfigs.weatherSeason);
    }

    public enable(): void {
        this._CalendarModule.enable();

        if (!this._modConfig.modules.calendar.enable) {
            this._SeasonModule.enable();
            this._WeatherModule.enable();
        } else {
            this._CalendarModule.checkSeasonChange(this._SeasonModule.season) &&
                this._SeasonModule.setDB(this._CalendarModule.getNextSeason());
        }
    }

    public update(): void {
        if (!this._modConfig.modules.calendar.enable) {
            const preSeason = this._SeasonModule.season;
            this._SeasonModule.updateDB();
            const postSeason = this._SeasonModule.season;

            preSeason !== postSeason
                ? this._WeatherModule.cycleDB()
                : this._WeatherModule.updateDB();
        } else {
            this._CalendarModule.updateDB();
            if (
                this._CalendarModule.checkSeasonChange(
                    this._SeasonModule.season
                )
            ) {
                this._SeasonModule.setDB(this._CalendarModule.getNextSeason());
                this._WeatherModule.setDB(
                    this._CalendarModule.getNextWeather()
                );
            }
        }
    }
}
