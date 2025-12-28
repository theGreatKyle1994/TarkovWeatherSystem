// Config
import modConfig from "../../config/config.json";

// SPT
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { DatabaseService } from "@spt/services/DatabaseService";

export default class EventModule {
    private _logger: ILogger;

    public enable(
        database: DatabaseService,
        eventValues: ISeasonalEventConfig,
        logger: ILogger
    ): void {
        this._logger = logger;

        // Setup events
        modConfig.modules.events.enable
            ? this.enableEvents(eventValues)
            : this._logger.logWithColor(
                  "[DES] Events are disabled.",
                  LogTextColor.YELLOW
              );
    }

    private enableEvents(eventValues: ISeasonalEventConfig): void {
        // Disable any forced ongoing events
        eventValues.enableSeasonalEventDetection = false;

        // Configure vanilla events
        for (let event of eventValues.events) {
            // Disable any ongoing events
            event.enabled = false;

            // Allow all events to occur at any time
            event.startDay = 1;
            event.startMonth = 1;
            event.endDay = 31;
            event.endMonth = 12;
        }

        this.setEvent(eventValues);
    }

    private setEvent(eventValues: ISeasonalEventConfig): void {}
}
