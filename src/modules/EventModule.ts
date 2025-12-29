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
import CalendarModule from "./CalendarModule";
import SeasonModule from "./SeasonModule";
import WeatherModule from "./WeatherModule";

export default class EventModule {
    private _logger: ILogger;
    private _dbEvent: string = localDB.event;
    private _locations: ILocations;
    private _CalendarModule: CalendarModule;
    private _SeasonModule: SeasonModule;
    private _WeatherModule: WeatherModule;
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
        CalendarModule: CalendarModule,
        SeasonModule: SeasonModule,
        WeatherModule: WeatherModule,
        logger: ILogger
    ): void {
        this._logger = logger;
        this._locations = locations;
        this._CalendarModule = CalendarModule;
        this._SeasonModule = SeasonModule;
        this._WeatherModule = WeatherModule;

        // Setup events
        modConfig.modules.events.enable
            ? this.enableEvents(eventValues)
            : this._logger.logWithColor(
                  "[DES] Events are disabled.",
                  LogTextColor.YELLOW
              );
    }

    private enableEvents(eventValues: ISeasonalEventConfig): void {
        let eventCount = 0;

        // Get all folder names
        let folderNames: string[] = getFolderNames(
            this._logger,
            "event/default"
        );

        // Grab all default events
        this._eventNames = folderNames;
        eventCount += this._eventNames.length;

        // Get default events
        this.getEvents(folderNames);

        this._logger.logWithColor(
            `[DES] Loaded ${eventCount} default event(s).`,
            LogTextColor.GREEN
        );

        if (modConfig.modules.events.useCustom) {
            folderNames = getFolderNames(this._logger, "event/custom");

            // Get custom events
            this.getEvents(folderNames, true);
            this._eventNames = this._eventNames.concat(folderNames);

            // Find difference for custom config length
            eventCount -= this._eventNames.length;
            this._logger.logWithColor(
                `[DES] Loaded ${Math.abs(eventCount)} custom event(s).`,
                LogTextColor.GREEN
            );
        }

        this.setEvent(eventValues);
    }

    private setEvent(eventValues: ISeasonalEventConfig): void {}

    private getEvents(folderNames: string[], isCustom: boolean = false): void {
        for (let folder of folderNames) {
            // Simplify loading config syntax
            const getConfig = <ConfigType>(subPath: string): ConfigType =>
                loadConfig(
                    this._logger,
                    `event/${
                        isCustom ? "custom" : "default"
                    }/${folder}/${subPath}`
                );

            // Get event config
            const eventConfig = getConfig<EventConfig>("event");

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

            // Assign event information to event entry
            this._events[folder] = {
                config: eventConfig,
                bots:
                    (useBotAppearances || useEventGear || useEventLoot) &&
                    getConfig("bots"),
                hostility: useBotHostility && getConfig("hostility"),
                summon: useSummoningEvent && getConfig("summon"),
                spawns: useCustomSpawns && getConfig("spawns"),
                zombies: useZombies && getConfig("zombies"),
                santa: useSanta && getConfig("santa"),
            };
        }
    }

    public logEvent(): void {
        modConfig.log.current &&
            this._logger.logWithColor(
                `[DES] Event is: ${this._dbEvent}`,
                LogTextColor.CYAN
            );
    }

    private logEventChange(): void {
        if (modConfig.log.onChange) {
            const isNone = this._dbEvent === "NONE";
            this._logger.logWithColor(
                isNone
                    ? `[DES] Event: ${this._dbEvent} has ended.`
                    : `[DES] Event changed to: ${this._dbEvent}.`,
                LogTextColor.BLUE
            );
        }
    }
}
