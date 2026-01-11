// Configs
import eventConfig from "../../config/event/events.json";

// General
import Module from "./core/Module";
import type { GameConfigs } from "../models/mod";
import type { EventConfig } from "../models/event";
import type { Database } from "../models/database";

// SPT
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IGlobals } from "@spt/models/eft/common/IGlobals";

export default class EventModule extends Module {
    private _eventValues: ISeasonalEventConfig;
    private _globals: IGlobals;
    private readonly _eventConfig: EventConfig = eventConfig;
    private readonly _coreEventNames: string[] = [];
    private readonly _additiveEventNames: string[] = [];

    constructor(configs: GameConfigs, db: Database, logger: ILogger) {
        super(configs, db, logger);
    }

    public preInitialize(): void {
        this._eventValues = this._gameConfigs.configs.getConfig(
            ConfigTypes.SEASONAL_EVENT
        );

        this._eventValues.enableSeasonalEventDetection = false;
        for (let event of this._eventValues.events) event.enabled = false;
    }

    public initialize(): void {
        this._globals = this._gameConfigs.database.getGlobals();

        for (let event in this._eventConfig.core)
            this._coreEventNames.push(event);
        for (let event in this._eventConfig.additive)
            this._additiveEventNames.push(event);
    }

    public enable(): void {
        this.update();
    }

    public update(): void {
        // Controls hideout appearance
        // this._globals.config.EventType = [];

        // this._logger.warning(
        //     JSON.stringify(this._globals.config.EventType, null, 4)
        // );
    }
}
