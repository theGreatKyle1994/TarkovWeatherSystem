// Configs
import db from "../../../config/database/database.json";

// General
import Utilities from "./Utilities";
import type { GameConfigs } from "../../models/mod";
import type { Database } from "../../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default abstract class Module {
    protected readonly Utilities = Utilities;
    protected readonly _logger: ILogger;
    protected _db: Database = db;
    protected _gameConfigs: GameConfigs;

    constructor(gameConfigs: GameConfigs, db: Database, logger: ILogger) {
        this._gameConfigs = gameConfigs;
        this._db = db;
        this._logger = logger;
    }

    public preInitialize(): void {}
    public initialize(): void {}
    public abstract enable(): void;
    public abstract update(): void;
}
