// Configs
import modConfig from "../config/config.json";

// General
import type { DependencyContainer } from "tsyringe";
import WeatherModule from "./modules/WeatherModule";
import SeasonModule from "./modules/SeasonModule";
import CalendarModule from "./modules/CalendarModule";
import EventModule from "./modules/EventModule";
import FikaHandler from "./utilities/fikaHandler";

// SPT
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import type { IEndLocalRaidRequestData } from "@spt/models/eft/match/IEndLocalRaidRequestData";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { DatabaseService } from "@spt/services/DatabaseService";

// Fika
import type { IFikaRaidCreateRequestData } from "@spt/models/fika/routes/raid/create/IFikaRaidCreateRequestData";

class DynamicEnvironmentSystem implements IPreSptLoadMod {
    private _FikaHandler = new FikaHandler();
    private _logger: ILogger;
    private _configServer: ConfigServer;
    private _staticRouterModService: StaticRouterModService;
    private _SeasonModule: SeasonModule;
    private _WeatherModule: WeatherModule;
    private _CalendarModule = new CalendarModule();
    private _EventModule = new EventModule();
    private _database: DatabaseService;
    private _weatherSeasonValues: IWeatherConfig;
    private _events: ISeasonalEventConfig;

    public preSptLoad(container: DependencyContainer): void {
        this._logger = container.resolve<ILogger>("WinstonLogger");
        this._staticRouterModService =
            container.resolve<StaticRouterModService>("StaticRouterModService");
        this._database = container.resolve<DatabaseService>("DatabaseService");
        this._configServer = container.resolve<ConfigServer>("ConfigServer");
        this._weatherSeasonValues =
            this._configServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);
        this._events = this._configServer.getConfig<ISeasonalEventConfig>(
            ConfigTypes.SEASONAL_EVENT
        );

        if (!modConfig.enable)
            this._logger.logWithColor(
                "[DES] Mod has been disabled. Check config.",
                LogTextColor.YELLOW
            );
        else {
            // Instatiate Modules
            this._SeasonModule = new SeasonModule(
                this._weatherSeasonValues,
                this._logger
            );
            this._WeatherModule = new WeatherModule(
                this._weatherSeasonValues,
                this._logger
            );

            this._SeasonModule.enable();
            this._WeatherModule.enable();

            // Set host UID for config value changing when fika is enabled
            this._staticRouterModService.registerStaticRouter(
                "[DES] /fika/raid/create",
                [
                    {
                        url: "/fika/raid/create",
                        action: async (
                            _,
                            info: IFikaRaidCreateRequestData,
                            ___,
                            output
                        ) => (this._FikaHandler.setHost(info.serverId), output),
                    },
                ],
                "[DES] /fika/raid/create"
            );

            // Decrement weather and season config values after raid
            this._staticRouterModService.registerStaticRouter(
                "[DES] /client/match/local/end",
                [
                    {
                        url: "/client/match/local/end",
                        action: async (
                            _,
                            info: IEndLocalRaidRequestData,
                            ___,
                            output
                        ) => {
                            // Only host can update database to prevent duplication
                            const UID = info.results.profile._id;
                            const isHost = this._FikaHandler.isHost(UID);

                            if (isHost) {
                                // Check if season module is enabled
                                modConfig.modules.season.enable &&
                                    this._SeasonModule.updateDB();

                                // Check if weather module is enabled
                                modConfig.modules.weather.enable &&
                                    this._WeatherModule.updateDB();
                            }

                            return output;
                        },
                    },
                ],
                "[DES] /client/match/local/end"
            );
        }
    }
}

module.exports = { mod: new DynamicEnvironmentSystem() };
