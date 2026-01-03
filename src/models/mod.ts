export interface TimeStampEntry {
    start: number;
    end: number;
}

export interface DurationEntry {
    enable: boolean;
    length: number;
}

export interface OverrideEntry {
    enable: boolean;
    name: string;
}

export interface ModEntry {
    enable: boolean;
    useRandom?: boolean;
    useCustom?: boolean;
    duration?: DurationEntry;
    override?: OverrideEntry;
}

export interface ModConfig {
    enable: boolean;
    log: {
        current: boolean;
        change: boolean;
        remaining: boolean;
    };
    modules: {
        season: ModEntry;
        weather: ModEntry;
        calendar: ModEntry;
        event: ModEntry;
    };
}
