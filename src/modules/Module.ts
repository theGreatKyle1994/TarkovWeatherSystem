// Configs
import modConfig from "../../config/config.json";

// General
import type { ModConfig, ModEntry } from "../models/mod";
import type { DBEntry, Database } from "../models/database";
import { writeDatabase } from "../utilities/utils";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

export default abstract class Module {
    protected readonly _modName: string = "[DES]";
    protected readonly _moduleName: keyof Database;
    protected readonly _logger: ILogger;
    protected readonly _modConfig: ModConfig = modConfig;
    protected readonly _moduleConfig: ModEntry;
    protected _localDB: DBEntry;

    constructor(moduleName: keyof Database, localDB: DBEntry, logger: ILogger) {
        this._moduleName = moduleName;
        this._moduleConfig = this._modConfig.modules[this._moduleName];
        this._localDB = localDB;
        this._logger = logger;
    }

    public enable(): void {
        this._moduleConfig.enable ? this.configure() : this.logDisabled();
    }

    protected configure(isDecrementing: boolean = true): void {
        if (this._moduleConfig.override.enable) {
            this.forceDBChange();
            return;
        } else if (this.checkUpdate(isDecrementing)) this.cycleDB();
        else this.enforceDB();
        this.logRemaining();
    }

    public updateDB(isDecrementing: boolean = true): void {
        if (this._moduleConfig.override.enable) {
            this.enforceDB();
            return;
        } else {
            isDecrementing ? this._localDB.value-- : this._localDB.value++;
            if (this.checkUpdate(isDecrementing)) this.cycleDB();
            this.logRemaining();
        }
    }

    private checkUpdate(isDecrementing: boolean): boolean {
        return isDecrementing
            ? this._localDB.value <= 0
            : this._localDB.value >= this._localDB.length;
    }

    protected cycleDB(newValue?: string): void {
        if (newValue) {
            this._localDB.name = newValue;
            this._localDB.value = this._moduleConfig.duration;
            writeDatabase(this._localDB, this._moduleName, this._logger);
            this.logChange();
        }
    }

    public forceDBChange(
        newValue: string = this._moduleConfig.override.name
    ): void {
        if (newValue) {
            this._localDB.name = newValue;
            this.logForced();
        }
    }

    protected enforceDB(): void {
        this.logCurrent();
    }

    public log(
        logMessage: string,
        color: LogTextColor = LogTextColor.GRAY
    ): void {
        this._logger.logWithColor(`${this._modName} ${logMessage}`, color);
    }

    public logCurrent(): void {
        this._modConfig.log.current &&
            this._logger.logWithColor(
                `${this._modName} Current ${this._moduleName} is: ${this._localDB.name}.`,
                LogTextColor.CYAN
            );
    }

    public logChange(): void {
        this._modConfig.log.change &&
            this._logger.logWithColor(
                `${this._modName} The ${this._moduleName} changed to: ${this._localDB.name}.`,
                LogTextColor.GREEN
            );
    }

    public logRemaining(): void {
        this._modConfig.log.remaining &&
            this._logger.logWithColor(
                `${this._modName} ${this._localDB.value} raid(s) left for ${this._localDB.name}.`,
                LogTextColor.CYAN
            );
    }

    public logDisabled(): void {
        this._logger.logWithColor(
            `${this._modName} Module: ${this._moduleName} is disabled.`,
            LogTextColor.RED
        );
    }

    public logForced(): void {
        this._moduleConfig.override.enable &&
            this._logger.logWithColor(
                `${this._modName} Forced ${this._moduleName}: ${this._localDB.name}`,
                LogTextColor.YELLOW
            );
    }
}
