export interface TimeStampEntry {
    start: number;
    end: number;
}

export interface EventEntry {
    enable: boolean;
    month: TimeStampEntry;
    day: TimeStampEntry;
}

export interface DurationEntry {
    enable: boolean;
    length: number;
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
        };
        weather: {
            enable: boolean;
            useCustom: boolean;
            duration: DurationEntry;
        };
        calendar: {
            enable: boolean;
            duration: DurationEntry;
            events: {
                enable: boolean;
                xmas: EventEntry;
                halloween: EventEntry;
            };
        };
    };
}
