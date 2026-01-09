// Configs
import seasonConfig from "../../config/season/seasons.json";

// General
import Module from "./core/Module";
import { seasonDates } from "../models/seasons";
import type { SeasonConfig, SeasonConfigEntry } from "../models/seasons";
import type { Database } from "../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";

export default class SeasonModule extends Module {
    private _seasonValues: IWeatherConfig;
    private readonly _seasonConfig: SeasonConfig = seasonConfig;

    constructor(db: Database, logger: ILogger) {
        super(db, logger);
    }

    private get season(): number {
        return this._seasonConfig[this._db.season.value].value;
    }

    private get seasonEntry(): SeasonConfigEntry {
        return this._seasonConfig[this._db.season.value];
    }

    public initialize(config: IWeatherConfig): void {
        this._seasonValues = config;
        this._seasonValues.seasonDates = seasonDates;
    }

    public enable(): void {
        this._seasonValues.overrideSeason = this.season;
        // TEMP
        this.update();
    }

    public update(): void {
        if (
            !this.Utilities.checkWithinDateRange(
                this._db.date.day,
                this._db.date.month,
                this.seasonEntry.timeFrame
            )
        ) {
            for (let key in this._seasonConfig) {
                if (
                    this.Utilities.checkWithinDateRange(
                        this._db.date.day,
                        this._db.date.month,
                        this._seasonConfig[key].timeFrame
                    )
                ) {
                    this._db.season.name = this._seasonConfig[key].name;
                    this._db.season.value = key;
                    this._seasonValues.overrideSeason = this.season;
                    this._logger.success(
                        JSON.stringify(this._db.season, null, 4)
                    );
                }
            }
        }
    }
}
