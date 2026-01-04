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
        this._seasonValues.seasonDates = seasonDates;
        super.configure();
    }

    protected override cycleDB(): void {
        super.cycleDB(
            this._moduleConfig.useRandom
                ? this.randomSeason()
                : this.cycleSeason()
        );
    }

    protected override enforceDB(): void {
        this._seasonValues.overrideSeason =
            Season[this._localDB.name as keyof typeof SeasonName];
        super.enforceDB();
    }

    public override forceDBChange(newSeason: keyof typeof SeasonName): void {
        this._seasonValues.overrideSeason = Season[newSeason];
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
