"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Configs
const config_json_1 = __importDefault(require("../config/config.json"));
const weatherSystem_1 = __importDefault(require("./weatherSystem"));
// SPT Imports
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class TarkovWeatherSystem {
    logger;
    configServer;
    staticRouterModService;
    WeatherSystem = new weatherSystem_1.default();
    weatherSeasonValues;
    preSptLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.configServer = container.resolve("ConfigServer");
        this.staticRouterModService = container.resolve("StaticRouterModService");
        this.weatherSeasonValues = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        if (config_json_1.default.enable)
            this.WeatherSystem.enable(this.weatherSeasonValues, this.logger);
        else
            this.logger.log("[TWS] Mod has been disabled. Check config.", LogTextColor_1.LogTextColor.YELLOW);
        if (config_json_1.default.enable) {
            this.staticRouterModService.registerStaticRouter("[TWS] /client/game/keepalive", [
                {
                    url: "/client/game/keepalive",
                    action: async (_url, _, __, output) => {
                        // if (modConfig.enableWeather) {
                        //   this.WeatherSystem.setWeather(this.weatherSeasonValues);
                        // }
                        // if (modConfig.enableSeasons) {
                        //   this.WeatherSystem.setSeason(this.weatherSeasonValues);
                        // }
                        return output;
                    },
                },
            ], "[TWS] /client/game/keepalive");
            config_json_1.default.enableSeasons &&
                this.staticRouterModService.registerStaticRouter("[TWS] /client/match/local/end", [
                    {
                        url: "/client/match/local/end",
                        action: async (_url, _, __, output) => {
                            // this.WeatherSystem.setSeason(this.weatherSeasonValues);
                            return output;
                        },
                    },
                ], "[TWS] /client/match/local/end");
            config_json_1.default.enableWeather &&
                this.staticRouterModService.registerStaticRouter("[TWS] /client/weather", [
                    {
                        url: "/client/weather",
                        action: async (_url, _, __, output) => {
                            if (this.WeatherSystem.dbWeather.weatherLeft <= 0) {
                                this.WeatherSystem.setWeather(this.weatherSeasonValues);
                            }
                            return output;
                        },
                    },
                ], "[TWS] /client/weather");
        }
    }
}
module.exports = { mod: new TarkovWeatherSystem() };
//# sourceMappingURL=mod.js.map