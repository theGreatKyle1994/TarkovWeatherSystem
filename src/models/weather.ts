// SPT Imports
import type { ISeasonalValues } from "@spt/models/spt/config/IWeatherConfig";

export interface WeatherDB {
    weatherName: string;
    weatherLength: number;
    weatherLeft: number;
}

export const weatherDBDefaults: WeatherDB = {
    weatherName: "SUNNY",
    weatherLength: 3,
    weatherLeft: 3,
};

export interface WeatherConfig {
    name: string;
    weather: ISeasonalValues;
}

interface WeatherWeights {
    [key: string]: number;
}

export interface WeatherWeightsConfig {
    SUMMER: WeatherWeights;
    AUTUMN: WeatherWeights;
    WINTER: WeatherWeights;
    SPRING: WeatherWeights;
    AUTUMN_LATE: WeatherWeights;
    SPRING_EARLY: WeatherWeights;
}

export const weatherDefault: ISeasonalValues = {
    clouds: {
        values: [0],
        weights: [1],
    },
    windSpeed: {
        values: [0],
        weights: [1],
    },
    windDirection: {
        values: [1],
        weights: [1],
    },
    windGustiness: {
        min: 0,
        max: 0,
    },
    rain: {
        values: [0],
        weights: [1],
    },
    rainIntensity: {
        min: 0,
        max: 0,
    },
    fog: {
        values: [0],
        weights: [1],
    },
    temp: {
        day: {
            min: 9,
            max: 32,
        },
        night: {
            min: 2,
            max: 16,
        },
    },
    pressure: {
        min: 760,
        max: 780,
    },
};

// export const weatherLayouts: WeatherConfigPattern = {
//   name: "DEFAULT",
//   weather: {
//     clouds: {
//       values: [-1, -0.8, -0.5, 0.1, 0, 0.15, 0.4, 1],
//       weights: [70, 22, 22, 15, 15, 15, 5, 4],
//     },
//     windSpeed: {
//       values: [0, 1, 2, 3, 4],
//       weights: [6, 3, 2, 1, 1],
//     },
//     windDirection: {
//       values: [1, 2, 3, 4, 5, 6, 7, 8],
//       weights: [1, 1, 1, 1, 1, 1, 1, 1],
//     },
//     windGustiness: {
//       min: 0,
//       max: 1,
//     },
//     rain: {
//       values: [1, 2, 3, 4, 5],
//       weights: [20, 1, 1, 1, 1],
//     },
//     rainIntensity: {
//       min: 0,
//       max: 1,
//     },
//     fog: {
//       values: [0.0013, 0.0018, 0.002, 0.004, 0.006],
//       weights: [35, 6, 4, 3, 1],
//     },
//     temp: {
//       day: {
//         min: 9,
//         max: 32,
//       },
//       night: {
//         min: 2,
//         max: 16,
//       },
//     },
//     pressure: {
//       min: 760,
//       max: 780,
//     },
//   },
// };
