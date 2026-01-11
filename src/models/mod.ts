// SPT
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { ConfigServer } from "@spt/servers/ConfigServer";

export interface GameConfigs {
    database?: DatabaseService;
    configs?: ConfigServer;
}

export interface ModConfig {
    enable: boolean;
}
