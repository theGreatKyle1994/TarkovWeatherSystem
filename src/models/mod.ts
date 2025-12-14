export interface ModConfig {
    enable: boolean;
    enableSeasons: boolean;
    enableWeather: boolean;
    useSeasonLength: boolean;
    useWeatherLength: boolean;
    useDefaultWeather: boolean;
    useCustomWeather: boolean;
    randomSeasons: boolean;
}

export const modConfigDefaults: ModConfig = {
    enable: true,
    enableSeasons: true,
    enableWeather: true,
    useSeasonLength: true,
    useWeatherLength: true,
    useDefaultWeather: true,
    useCustomWeather: false,
    randomSeasons: false,
};
