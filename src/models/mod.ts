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

export interface ModConfig {
    enable: boolean;
    log: {
        current: boolean;
        onChange: boolean;
        remaining: boolean;
    };
    modules: {
        seasons: {
            enable: boolean;
            useRandom: boolean;
            duration: DurationEntry;
            override: OverrideEntry;
        };
        weather: {
            enable: boolean;
            useCustom: boolean;
            duration: DurationEntry;
            override: OverrideEntry;
        };
        calendar: {
            enable: boolean;
            duration: DurationEntry;
        };
        events: {
            enable: boolean;
            useCustom: boolean;
            override: OverrideEntry;
        };
    };
}
