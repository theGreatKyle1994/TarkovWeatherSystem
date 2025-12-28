// Config
import modConfig from "../../config/config.json";

// SPT
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILocations } from "@spt/models/spt/server/ILocations";
import type { ILocation } from "@spt/models/eft/common/ILocation";

export default class EventModule {
    private _logger: ILogger;
    private _locations: ILocations;

    static preConfig(eventValues: ISeasonalEventConfig, logger: ILogger): void {
        // Disable any event detection
        eventValues.enableSeasonalEventDetection = false;

        for (let key in eventValues.hostilitySettingsForEvent) {
            if (key == "aprilFools")
                logger.warning(
                    JSON.stringify(
                        eventValues.hostilitySettingsForEvent[key],
                        null,
                        2
                    )
                );
        }

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
        for (let loc in this._locations) {
            let location: ILocation = this._locations[loc];
            // this._logger.warning(loc);
            // this._logger.warning(
            //     JSON.stringify(location?.base?.Events?.Halloween2024, null, 2)
            // );
        }

        this.setEvent(eventValues);
    }

    private setEvent(eventValues: ISeasonalEventConfig): void {}
}
