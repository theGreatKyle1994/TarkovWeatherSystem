// Configs
import modConfig from "../../../config/config.json";
import db from "../../../config/db/database.json";

// General
import { loadConfig } from "../../utilities/utils";
import type { ModConfig, ModEntry } from "../../models/mod";
import type { DBEntry, Database } from "../../models/database";
import { writeDatabase } from "../../utilities/utils";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

export default abstract class Module {
    protected readonly _modName: string = "[DES]";
    protected readonly _moduleName: keyof Database;
    protected _isDecrementing: boolean = true;
    protected readonly _logger: ILogger;
    protected readonly _modConfig: ModConfig = modConfig;
    protected readonly _moduleConfig: ModEntry;
    protected _localDB: DBEntry;
    protected _db: Database = db;

    constructor(moduleName: keyof Database, logger: ILogger) {
        this._moduleName = moduleName;
        this._moduleConfig = this._modConfig.modules[this._moduleName];
        this._localDB = this._db[moduleName];
        this._logger = logger;
    }

    public setConfig(config: any): void {}

    public enable(): void {
        this._moduleConfig.enable ? this.configure() : this.logDisabled();
    }

    protected configure(): void {
        if (this._moduleConfig.override.enable)
            this.setDB(this._moduleConfig.override.name, true);
        else if (this.checkUpdate()) this.cycleDB();
        else {
            this.enforceDB();
            this.logRemaining();
        }
    }

    public updateDB(): void {
        if (this._moduleConfig.enable) {
            if (this._moduleConfig.override.enable) this.enforceDB();
            else {
                this._isDecrementing
                    ? this._localDB.value--
                    : this._localDB.value++;
                if (this.checkUpdate()) this.cycleDB();
                else {
                    writeDatabase(
                        this._localDB,
                        this._moduleName,
                        this._logger
                    );
                    this.logRemaining();
                }
            }
            this._db = loadConfig(this._logger, "db/database");
        }
    }

    private checkUpdate(): boolean {
        return this._isDecrementing
            ? this._localDB.value <= 0
            : this._localDB.value > this._localDB.length;
    }

    public cycleDB(newValue: string = this._localDB.name): void {
        if (this._moduleConfig.enable) {
            if (!this._moduleConfig.override.enable) {
                this._localDB.name = newValue;
                this._localDB.value = this._isDecrementing
                    ? this._moduleConfig.duration
                    : 1;
                this._localDB.length = this._moduleConfig.duration;
                writeDatabase(this._localDB, this._moduleName, this._logger);
                this.logChange();
                this.logRemaining();
            }
        }
    }

    public setDB(
        newValue: string = this._localDB.name,
        isForced: boolean = false
    ): void {
        if (this._moduleConfig.enable) {
            this._localDB.name = newValue;
            if (isForced) this.logForced();
            else {
                writeDatabase(this._localDB, this._moduleName, this._logger);
                this.logChange();
            }
        }
    }

    protected enforceDB(): void {
        this._moduleConfig.enable && this.logCurrent();
    }

    protected log(
        logMessage: string,
        color: LogTextColor = LogTextColor.GRAY
    ): void {
        this._moduleConfig.enable &&
            this._logger.logWithColor(`${this._modName} ${logMessage}`, color);
    }

    public logCurrent(logMessage?: string): void {
        this._moduleConfig.enable &&
            this._modConfig.log.current &&
            this._logger.logWithColor(
                `${this._modName} ${
                    logMessage
                        ? logMessage
                        : `Current ${this._moduleName} is: ${this._localDB.name}.`
                }`,
                LogTextColor.CYAN
            );
    }

    public logChange(logMessage?: string): void {
        this._moduleConfig.enable &&
            this._modConfig.log.change &&
            this._logger.logWithColor(
                `${this._modName} ${
                    logMessage
                        ? logMessage
                        : `The ${this._moduleName} changed to: ${this._localDB.name}.`
                }`,
                LogTextColor.GREEN
            );
    }

    public logRemaining(logMessage?: string): void {
        this._moduleConfig.enable &&
            this._modConfig.log.remaining &&
            this._logger.logWithColor(
                `${this._modName} ${
                    logMessage
                        ? logMessage
                        : `${
                              this._isDecrementing
                                  ? this._localDB.value
                                  : this._localDB.length -
                                    this._localDB.value +
                                    1
                          } raid(s) left for ${this._localDB.name}.`
                } `,
                LogTextColor.CYAN
            );
    }

    public logDisabled(logMessage?: string): void {
        this._moduleConfig.enable &&
            this._logger.logWithColor(
                `${this._modName} ${
                    logMessage
                        ? logMessage
                        : `Module: ${this._moduleName} is disabled.`
                }`,
                LogTextColor.RED
            );
    }

    public logForced(logMessage?: string): void {
        this._moduleConfig.enable &&
            this._moduleConfig.override.enable &&
            this._logger.logWithColor(
                `${this._modName} ${
                    logMessage
                        ? logMessage
                        : `Forced ${this._moduleName}: ${this._localDB.name}`
                }`,
                LogTextColor.YELLOW
            );
    }
}
