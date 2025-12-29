// Config
import modConfig from "../../config/config.json";
import localDB from "../../config/db/database.json";

// General
import type { Events, EventConfig } from "../models/event";
import { getFolderNames, loadConfig } from "../utilities/utils";

// SPT
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILocations } from "@spt/models/spt/server/ILocations";

export default class EventModule {
    private _logger: ILogger;
    private _eventDB: string = localDB.event;
    private _locations: ILocations;
    private _eventNames: string[];
    private _events: Events = {};

    static preConfig(eventValues: ISeasonalEventConfig, logger: ILogger): void {
        // Disable any event detection
        eventValues.enableSeasonalEventDetection = false;

        for (let event of eventValues.events) {
            // Disable vanilla events
            event.enabled = false;
            // Allow all events to occur at any time
            event.startDay = 1;
            event.startMonth = 1;
            event.endDay = 31;
            event.endMonth = 12;
        }
    }

    public enable(
        eventValues: ISeasonalEventConfig,
        locations: ILocations,
        logger: ILogger
    ): void {
        this._logger = logger;
        this._locations = locations;

        // Setup events
        modConfig.modules.events.enable
            ? this.enableEvents(eventValues)
            : this._logger.logWithColor(
                  "[DES] Events are disabled.",
                  LogTextColor.YELLOW
              );
    }

    private enableEvents(eventValues: ISeasonalEventConfig): void {
        // Get all folder names
        const folderNames: string[] = getFolderNames(
            this._logger,
            "event/default"
        );

        // Grab all default events
        this._eventNames = folderNames;

        for (let folder of folderNames) {
            // Get event config
            const eventConfig = loadConfig<EventConfig>(
                this._logger,
                `event/default/${folder}/event`
            );

            // Skip config if it's disabled
            if (!eventConfig.enable) continue;

            const {
                useBotAppearances,
                useEventGear,
                useEventLoot,
                useSanta,
                useZombies,
                useBotHostility,
                useSummoningEvent,
                useCustomSpawns,
            } = eventConfig.settings;

            // Simplify loading config syntax
            const getConfig = <ConfigType>(subPath: string): ConfigType =>
                loadConfig(this._logger, `event/default/${folder}/${subPath}`);

            // Assign event information to event entry
            this._events[folder] = {
                config: eventConfig,
                bots:
                    useBotAppearances || useEventGear || useEventLoot
                        ? getConfig("bots")
                        : undefined,
                hostility: useBotHostility ? getConfig("hostility") : undefined,
                summon: useSummoningEvent ? getConfig("summon") : undefined,
                spawns: useCustomSpawns ? getConfig("spawns") : undefined,
                zombies: useZombies ? getConfig("zombies") : undefined,
                santa: useSanta ? getConfig("santa") : undefined,
            };
        }

        this._logger.warning(JSON.stringify(this._events["xmas"], null, 2));

        this.setEvent(eventValues);
    }

    private setEvent(eventValues: ISeasonalEventConfig): void {}
}
