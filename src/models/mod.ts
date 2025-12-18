interface DurationEntry {
    enable: boolean;
    length: number;
}

interface TimeStampEntry {
    start: number;
    end: number;
}

interface LogEntry {
    current: boolean;
    onChange: boolean;
    raidsRemaining: boolean;
}

interface EventEntry {
    enable: boolean;
    month: TimeStampEntry;
    day: TimeStampEntry;
}

export interface ModConfig {
    enable: true;
    modules: {
        seasons: {
            enable: boolean;
            log: LogEntry;
            duration: DurationEntry;
            useRandom: boolean;
        };
        weather: {
            enable: boolean;
            log: LogEntry;
            duration: DurationEntry;
            useCustom: boolean;
        };
        calander: {
            enable: boolean;
            log: LogEntry;
            duration: DurationEntry;
            events: {
                enable: boolean;
                xmas: EventEntry;
                halloween: EventEntry;
            };
        };
    };
}
