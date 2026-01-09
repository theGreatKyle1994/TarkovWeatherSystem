// Configs
import db from "../../../config/database/database.json";

// General
import Utilities from "./Utilities";
import type { Database } from "../../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";

export default abstract class Module {
    protected readonly Utilities = Utilities;
    protected readonly _logger: ILogger;
    protected _db: Database = db;

    constructor(db: Database, logger: ILogger) {
        this._db = db;
        this._logger = logger;
    }

    public initialize(config?: any): void {}
    public abstract enable(): void;
    public abstract update(): void;
}
