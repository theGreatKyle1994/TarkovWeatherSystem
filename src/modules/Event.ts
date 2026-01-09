// // General
// import type { Events, EventConfig } from "../models/event";
// import { getFolderNames, loadConfig } from "./core/Utilities";

// // SPT
// import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
// import type { ILogger } from "@spt/models/spt/utils/ILogger";
// import type { ILocations } from "@spt/models/spt/server/ILocations";

// export default class EventModule {
//     private _eventNames: string[];
//     private _events: Events = {};
//     private _locations: ILocations;

// static preConfig(eventValues: ISeasonalEventConfig, logger: ILogger): void {
//     // Disable any event detection
//     eventValues.enableSeasonalEventDetection = false;

//     for (let event of eventValues.events) {
//         // Disable vanilla events
//         event.enabled = false;
//         // Allow all events to occur at any time
//         event.startDay = 1;
//         event.startMonth = 1;
//         event.endDay = 31;
//         event.endMonth = 12;
//     }
// }

// public enable(locations: ILocations, logger: ILogger): void {
//     this._logger = logger;
//     this._locations = locations;
// }

// private enableEvents(eventValues: ISeasonalEventConfig): void {
//     let eventCount = 0;

//     // Get all folder names
//     let folderNames: string[] = getFolderNames(
//         this._logger,
//         "event/default"
//     );

//     // Grab all default events
//     this._eventNames = folderNames;
//     eventCount += this._eventNames.length;

//     // Get default events
//     this.getEvents(folderNames);
// }

// private getEvents(folderNames: string[], isCustom: boolean = false): void {
//     for (let folder of folderNames) {
//         // Simplify loading config syntax
//         const getConfig = <ConfigType>(subPath: string): ConfigType =>
//             loadConfig(
//                 this._logger,
//                 `event/${
//                     isCustom ? "custom" : "default"
//                 }/${folder}/${subPath}`
//             );

//         // Get event config
//         const eventConfig = getConfig<EventConfig>("event");

//         // Skip config if it's disabled
//         if (!eventConfig.enable) continue;

//         const {
//             useBotAppearances,
//             useEventGear,
//             useEventLoot,
//             useSanta,
//             useZombies,
//             useBotHostility,
//             useSummoningEvent,
//             useCustomSpawns,
//         } = eventConfig.settings;

//         // Assign event information to event entry
//         this._events[folder] = {
//             config: eventConfig,
//             bots:
//                 (useBotAppearances || useEventGear || useEventLoot) &&
//                 getConfig("bots"),
//             hostility: useBotHostility && getConfig("hostility"),
//             summon: useSummoningEvent && getConfig("summon"),
//             spawns: useCustomSpawns && getConfig("spawns"),
//             zombies: useZombies && getConfig("zombies"),
//             santa: useSanta && getConfig("santa"),
//         };
//     }
// }
// }
