// Configs
import modConfig from "../../../config/config.json";
import db from "../../../config/database/database.json";

// General
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
import { Database } from "../../models/database";

interface GameConfigs {
    weatherSeason?: IWeatherConfig;
    events?: ISeasonalEventConfig;
    locations?: ILocations;
}

export default class ModuleManager {
    private readonly _logger: ILogger;
    private readonly _modConfig: ModConfig = modConfig;
    protected _db: Database = db;
    private readonly _DatabaseService: DatabaseService;
    private readonly _ConfigServer: ConfigServer;
    private _gameConfigs: GameConfigs = {};

    constructor(container: DependencyContainer, logger: ILogger) {
        this._logger = logger;
        this._DatabaseService =
            container.resolve<DatabaseService>("DatabaseService");
        this._ConfigServer = container.resolve<ConfigServer>("ConfigServer");
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
    }

    public update(): void {}
}
