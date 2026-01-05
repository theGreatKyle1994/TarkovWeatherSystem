// Configs
import seasonWeights from "../../config/season/weights.json";

// General
import Module from "./core/Module";
import { seasonDates, seasonOrder } from "../models/seasons";
import type { SeasonName, SeasonWeights } from "../models/seasons";
import { chooseWeight } from "../utilities/utils";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { Season } from "@spt/models/enums/Season";

export default class SeasonModule extends Module {
    private _seasonValues: IWeatherConfig;
    private readonly _seasonWeights: SeasonWeights = seasonWeights;

    constructor(logger: ILogger) {
        super("season", logger);
    }

    get season(): keyof typeof SeasonName {
        return this._localDB.name as keyof typeof SeasonName;
    }

    public override setConfig(config: IWeatherConfig): void {
        this._seasonValues = config;
        this._seasonValues.seasonDates = seasonDates;
    }

    public override cycleDB(): void {
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

    public override setDB(
        newSeason: keyof typeof SeasonName,
        isForced: boolean = false
    ): void {
        this._seasonValues.overrideSeason = Season[newSeason];
        super.setDB(newSeason, isForced);
    }

    private randomSeason(): keyof typeof SeasonName {
        const seasonChoice = chooseWeight(
            this._seasonWeights
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
