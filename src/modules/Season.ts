// Configs
import seasonWeights from "../../config/season/weights.json";

// General
import Module from "./core/Module";
import { seasonDates, seasonOrder } from "../models/seasons";
import type { SeasonName, SeasonWeights } from "../models/seasons";
import { chooseWeight } from "../utilities/utils";
import type { Database } from "../models/database";

// SPT
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { Season } from "@spt/models/enums/Season";

export default class SeasonModule extends Module {
    private _seasonValues: IWeatherConfig;
    private readonly _seasonWeights: SeasonWeights = seasonWeights;

    constructor(db: Database, logger: ILogger) {
        super(db, logger);
    }

    // public enable(config: IWeatherConfig): void {
    //     this._seasonValues = config;
    //     this._seasonValues.seasonDates = seasonDates;
    //     this._seasonValues.overrideSeason =
    //         Season[this._localDB.name as keyof typeof SeasonName];
    // }

    // private randomSeason(): keyof typeof SeasonName {
    //     const seasonChoice = chooseWeight(
    //         this._seasonWeights
    //     ) as keyof typeof SeasonName;
    //     this._seasonValues.overrideSeason = Season[seasonChoice];
    //     return seasonChoice;
    // }

    // private cycleSeason(): keyof typeof SeasonName {
    //     return seasonOrder.indexOf(this._db.name as keyof typeof SeasonName) ===
    //         seasonOrder.length - 1
    //         ? seasonOrder[0]
    //         : seasonOrder[
    //               seasonOrder.indexOf(
    //                   this._db.name as keyof typeof SeasonName
    //               ) + 1
    //           ];
    // }
}
