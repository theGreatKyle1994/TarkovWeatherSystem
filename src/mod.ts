// Configs
import modConfig from "../config/config.json";

// General
import ModuleManager from "./modules/core/ModuleManager";
import FikaHandler from "./utilities/fikaHandler";

// SPT
import type { DependencyContainer } from "tsyringe";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { IEndLocalRaidRequestData } from "@spt/models/eft/match/IEndLocalRaidRequestData";

// Fika
import type { IFikaRaidCreateRequestData } from "@spt/models/fika/routes/raid/create/IFikaRaidCreateRequestData";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";

class DynamicEnvironmentSystem implements IPreSptLoadMod, IPostDBLoadMod {
    private _logger: ILogger;
    private _staticRouterModService: StaticRouterModService;
    private _ModuleManager: ModuleManager;
    private _FikaHandler = new FikaHandler();

    public preSptLoad(container: DependencyContainer): void {
        this._logger = container.resolve<ILogger>("WinstonLogger");

        if (modConfig.enable) {
            this._ModuleManager = new ModuleManager(container, this._logger);
            this._ModuleManager.preSPTConfig();

            this._staticRouterModService =
                container.resolve<StaticRouterModService>(
                    "StaticRouterModService"
                );

            this._staticRouterModService.registerStaticRouter(
                "[DES] /fika/raid/create",
                [
                    {
                        url: "/fika/raid/create",
                        action: async (
                            _,
                            info: IFikaRaidCreateRequestData,
                            ___,
                            output
                        ) => (this._FikaHandler.setHost(info.serverId), output),
                    },
                ],
                "[DES] /fika/raid/create"
            );
            this._staticRouterModService.registerStaticRouter(
                "[DES] /client/match/local/end",
                [
                    {
                        url: "/client/match/local/end",
                        action: async (
                            _,
                            info: IEndLocalRaidRequestData,
                            ___,
                            output
                        ) => (
                            this._FikaHandler.isHost(
                                info.results.profile._id
                            ) && this._ModuleManager.update(),
                            output
                        ),
                    },
                ],
                "[DES] /client/match/local/end"
            );
        } else
            this._logger.logWithColor(
                "[DES] Mod has been disabled. Check config.",
                LogTextColor.YELLOW
            );
    }

    public postDBLoad(): void {
        modConfig.enable && this._ModuleManager.postDBConfig();
    }
}

module.exports = { mod: new DynamicEnvironmentSystem() };
