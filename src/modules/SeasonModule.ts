// Configs
import localDB from "../../config/db/database.json";
import seasonWeights from "../../config/season/weights.json";

// General
import Module from "./Module";
import { seasonDates, SeasonName, seasonOrder } from "../models/seasons";
import { chooseWeight } from "../utilities/utils";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { Season } from "@spt/models/enums/Season";

export default class SeasonModule extends Module {
    private _seasonValues: IWeatherConfig;

    constructor(seasonValues: IWeatherConfig, logger: ILogger) {
        super("season", localDB.season, logger);
        this._seasonValues = seasonValues;
    }

    get season(): keyof typeof SeasonName {
        return this._localDB.name as keyof typeof SeasonName;
    }

    protected override configure(): void {
        // Setup season dates to allow any season
        this._seasonValues.seasonDates = seasonDates;
        super.configure();
    }

    public override updateDB(): void {
        const seasonChoice = this._moduleConfig.useRandom
            ? this.randomSeason()
            : this.cycleSeason();

        // Set chosen season to game database
        this._seasonValues.overrideSeason =
            Season[seasonChoice as keyof typeof SeasonName];

        // Update db
        super.updateDB();
    }

    protected override cycleDB(): void {
        if (this._moduleConfig.useRandom) super.cycleDB(this.randomSeason());
        else super.cycleDB(this.cycleSeason());
    }

    protected override enforceDB(): void {
        this._seasonValues.overrideSeason =
            Season[this._localDB.name as keyof typeof SeasonName];
        // Enforce current db
        super.enforceDB();
    }

    public override forceDBChange(newSeason: keyof typeof SeasonName): void {
        this._seasonValues.overrideSeason = Season[newSeason];
        // Bypass system to force db change
        super.forceDBChange(newSeason);
    }

    private randomSeason(): keyof typeof SeasonName {
        const seasonChoice = chooseWeight(
            seasonWeights
        ) as keyof typeof SeasonName;
        this._seasonValues.overrideSeason = Season[seasonChoice];
        return seasonChoice;
    }

    private cycleSeason(): keyof typeof SeasonName {
        // Find next season in list
        return seasonOrder.indexOf(
            this._localDB.name as keyof typeof SeasonName
        ) ===
            seasonOrder.length - 1
            ? seasonOrder[0]
            : seasonOrder[
                  seasonOrder.indexOf(
                      this._localDB.name as keyof typeof SeasonName
                  ) + 1
              ];
    }
}
