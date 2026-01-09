// Configs
import db from "../../../config/database/database.json";

// General
import Utilities from "./Utilities";
import CalendarModule from "../Calendar";
import SeasonModule from "../Season";
import type { ModConfig } from "../../models/mod";
import type { GameConfigs } from "../../models/mod";
import type { Database } from "../../models/database";

// SPT
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { DependencyContainer } from "tsyringe";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";

export default class ModuleManager {
    private readonly _logger: ILogger;
    private readonly _modConfig: ModConfig;
    protected _db: Database = db;
    private readonly _DatabaseService: DatabaseService;
    private readonly _ConfigServer: ConfigServer;
    private _gameConfigs: GameConfigs = {};
    private _Calendar: CalendarModule;
    private _Season: SeasonModule;

    constructor(
        container: DependencyContainer,
        modConfig: ModConfig,
        logger: ILogger
    ) {
        this._logger = logger;
        this._modConfig = modConfig;
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

        this._Calendar = new CalendarModule(this._db, this._logger);

        this._Season = new SeasonModule(this._db, this._logger);
        this._Season.initialize(this._gameConfigs.weatherSeason);
    }

    public enable(): void {
        this._Calendar.enable();
        this._Season.enable();
        Utilities.writeDatabase(this._db, this._logger);
    }

    public update(): void {
        this._Calendar.update();
        Utilities.writeDatabase(this._db, this._logger);
    }
}
