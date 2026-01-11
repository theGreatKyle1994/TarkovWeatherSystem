// General
import type { TimeFrameEntry } from "./calendar";

// SPT
import type { IEquipment } from "@spt/models/eft/common/tables/IBotType";
import type {
    IAdditionalHostilitySettings,
    IBossLocationSpawn,
} from "@spt/models/eft/common/ILocationBase";

export interface EventConfigEntry {
    enabled: boolean;
    name: string;
    eventTypes: string[];
    timeFrame: TimeFrameEntry;
    forceSeason: string;
    forceWeather: string;
}

export interface EventConfig {
    core: {
        [key: string]: EventConfigEntry;
    };
    additive: {
        [key: string]: EventConfigEntry;
    };
}

export interface ZombieCrowdEntry {
    difficulty: "easy" | "normal" | "hard";
    role:
        | "infectedAssault"
        | "infectedPmc"
        | "infectedCivil"
        | "infectedLaborant";
    weight: number;
}

export interface ZombiesMapConfig {
    infectionRange: [number, number];
    crowdAttackBlockRadius: number;
    crowdCooldownPerPlayerSec: number;
    crowdsLimit: number;
    infectedLookCoeff: number;
    minInfectionPercentage: number;
    infectionPercentage: number;
    maxCrowdAttackSpawnLimit: number;
    minSpawnDistToPlayer: number;
    targetPointSearchRadiusLimit: number;
    zombieCallDeltaRadius: number;
    zombieCallPeriodSec: number;
    zombieCallRadiusLimit: number;
    zombieMultiplier: number;
    crowdAttackSpawnParams: ZombieCrowdEntry[];
}

export interface ZombiesConfig {
    bigmap: ZombiesMapConfig;
    factory4_day: ZombiesMapConfig;
    factory4_night: ZombiesMapConfig;
    interchange: ZombiesMapConfig;
    laboratory: ZombiesMapConfig;
    lighthouse: ZombiesMapConfig;
    rezervbase: ZombiesMapConfig;
    sandbox: ZombiesMapConfig;
    sandbox_high: ZombiesMapConfig;
    shoreline: ZombiesMapConfig;
    tarkovstreets: ZombiesMapConfig;
    woods: ZombiesMapConfig;
}

export interface BotConfig {
    appearance: {
        body: Record<string, number>;
        feet: Record<string, number>;
    };
    gear: { [key: string]: IEquipment };
    loot: { [key: string]: IEquipment };
}

export interface HostilityConfig {
    default: IAdditionalHostilitySettings[];
}

export interface SpawnsConfig {
    bigmap: Record<string, IBossLocationSpawn[]>;
    factory4_day: Record<string, IBossLocationSpawn[]>;
    factory4_night: Record<string, IBossLocationSpawn[]>;
    interchange: Record<string, IBossLocationSpawn[]>;
    laboratory: Record<string, IBossLocationSpawn[]>;
    lighthouse: Record<string, IBossLocationSpawn[]>;
    rezervbase: Record<string, IBossLocationSpawn[]>;
    sandbox: Record<string, IBossLocationSpawn[]>;
    sandbox_high: Record<string, IBossLocationSpawn[]>;
    shoreline: Record<string, IBossLocationSpawn[]>;
    tarkovstreets: Record<string, IBossLocationSpawn[]>;
    woods: Record<string, IBossLocationSpawn[]>;
}

export interface SantaConfigEntry {
    zones: string[];
    spawnChance: number;
}

export interface SantaConfig {
    bigmap: SantaConfigEntry;
    factory4_day: SantaConfigEntry;
    factory4_night: SantaConfigEntry;
    interchange: SantaConfigEntry;
    laboratory: SantaConfigEntry;
    lighthouse: SantaConfigEntry;
    rezervbase: SantaConfigEntry;
    sandbox: SantaConfigEntry;
    sandbox_high: SantaConfigEntry;
    shoreline: SantaConfigEntry;
    tarkovstreets: SantaConfigEntry;
    woods: SantaConfigEntry;
}
