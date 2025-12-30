// Configs
import modConfig from "../../config/config.json";
import localDB from "../../config/db/database.json";
import seasonWeights from "../../config/season/weights.json";

// General
import type { DBEntry } from "../models/database";
import { seasonDates, SeasonName, seasonOrder } from "../models/seasons";
import { writeDatabase, chooseWeight } from "../utilities/utils";

// SPT
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { Season } from "@spt/models/enums/Season";

export default class SeasonModule {
    private _logger: ILogger;
    private _seasonDB: DBEntry = localDB.season;
    private _seasonValues: IWeatherConfig;

    get season(): keyof typeof SeasonName {
        return this._seasonDB.name as keyof typeof SeasonName;
    }

    public enable(seasonValues: IWeatherConfig, logger: ILogger): void {
        this._logger = logger;
        this._seasonValues = seasonValues;

        // Setup season
        modConfig.modules.seasons.enable
            ? this.enableSeasons()
            : this._logger.logWithColor(
                  "[DES] Season is disabled.",
                  LogTextColor.YELLOW
              );
    }

    private enableSeasons(): void {
        // Setup season dates to allow any season
        this._seasonValues.seasonDates = seasonDates;

        // Set initial season if calendar is disabled
        if (!modConfig.modules.calendar.enable) {
            this.setSeason();
            if (!modConfig.modules.seasons.override.enable)
                this.logSeasonRemaining();
        }
    }

    public setSeason(): void {
        // Check if season change is needed
        if (modConfig.modules.seasons.override.enable)
            this.forceSeason(
                modConfig.modules.seasons.override
                    .name as keyof typeof SeasonName
            );
        else if (this._seasonDB.value <= 0) {
            let seasonChoice = "";

            // Use random seasons
            if (modConfig.modules.seasons.useRandom)
                seasonChoice = chooseWeight(seasonWeights);
            //  Or determine next season in queue
            else {
                const seasonIndex: number = seasonOrder.indexOf(this.season);
                if (seasonIndex === seasonOrder.length - 1)
                    seasonChoice = seasonOrder[0];
                else seasonChoice = seasonOrder[seasonIndex + 1];
            }

            // Set local season database
            this._seasonDB.name = SeasonName[seasonChoice];
            this._seasonDB.value = this._seasonDB.length;

            // Set chosen season to game database
            this._seasonValues.overrideSeason = Season[this.season];

            writeDatabase(this._seasonDB, "season", this._logger);
            this.logSeasonChange();
        } else {
            // Enforce current values
            this._seasonValues.overrideSeason = Season[this.season];
            this.logSeason();
        }
    }

    public forceSeason(seasonName: keyof typeof SeasonName): void {
        // Manually set season
        this._seasonDB.name = seasonName;
        writeDatabase(this._seasonDB, "season", this._logger);

        // Set chosen season to game database
        this._seasonValues.overrideSeason = Season[this.season];

        this.logSeasonChangeForced();
    }

    public calcNewSeason(): void {
        // Find next season in list
        const newSeason =
            seasonOrder.indexOf(this.season) === seasonOrder.length - 1
                ? seasonOrder[0]
                : seasonOrder[seasonOrder.indexOf(this.season) + 1];
        this.forceSeason(newSeason);
    }

    public decrementSeason(): void {
        // Confirm seasondb has more raids left
        if (this._seasonDB.value > 0) {
            this._seasonDB.value--;
            this.logSeasonRemaining();
            writeDatabase(this._seasonDB, "season", this._logger);
            // Or set new season data
        } else this.setSeason();
    }

    public logSeason(): void {
        modConfig.log.current &&
            this._logger.logWithColor(
                `[DES] Season is: ${this.season}`,
                LogTextColor.CYAN
            );
    }

    private logSeasonChange(): void {
        modConfig.log.onChange &&
            this._logger.logWithColor(
                `[DES] The season changed to: ${this.season}`,
                LogTextColor.BLUE
            );
    }

    private logSeasonChangeForced(): void {
        modConfig.log.onChange &&
            this._logger.logWithColor(
                `[DES] Forced season: ${this.season}`,
                LogTextColor.YELLOW
            );
    }

    private logSeasonRemaining(): void {
        modConfig.log.value &&
            modConfig.modules.seasons.duration.enable &&
            this._logger.logWithColor(
                `[DES] ${this._seasonDB.value} raid(s) left for ${this.season}`,
                LogTextColor.CYAN
            );
    }
}
