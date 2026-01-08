// Configs
import modConfig from "../../../config/config.json";
import db from "../../../config/database/database.json";

// General
import type { ModConfig } from "../../models/mod";
import type { Database } from "../../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default abstract class Module {
    protected readonly _logger: ILogger;
    protected readonly _modConfig: ModConfig = modConfig;
    protected _db: Database = db;

    constructor(db: Database, logger: ILogger) {
        this._db = db;
        this._logger = logger;
    }

    public initialize(): void {}
    public enable(): void {}
}
