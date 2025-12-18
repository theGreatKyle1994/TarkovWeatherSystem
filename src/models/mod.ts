export interface ModConfig {
    enable: boolean;
    log: {
        debug: boolean;
        season: boolean;
        weather: boolean;
        raidsRemaining: boolean;
    };
    modules: {
        seasons: {
            enable: boolean;
            useLength: boolean;
            useRandom: boolean;
        };
        weather: {
            enable: boolean;
            useLength: boolean;
            useCustom: boolean;
        };
    };
}
