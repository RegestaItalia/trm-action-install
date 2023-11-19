"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const trm_registry_types_1 = require("trm-registry-types");
const trm_core_1 = require("trm-core");
const fs = __importStar(require("fs"));
function install(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const registryEndpoint = data.registryEndpoint || 'public';
        const registryAuth = data.registryAuth ? JSON.parse(data.registryAuth) : undefined;
        const logger = new trm_core_1.Logger(trm_core_1.CoreEnv.CLI, trm_core_1.TraceLevel.TRACE_ALL);
        const inquirer = new trm_core_1.Inquirer(trm_core_1.CoreEnv.DUMMY);
        const oRegistry = new trm_core_1.Registry(registryEndpoint, registryEndpoint);
        const packageName = data.packageName;
        const packageVersion = data.packageVersion || 'latest';
        const forceInstall = data.forceInstall;
        const ignoreSapEntries = data.ignoreSapEntries;
        const importTimeout = data.importTimeout;
        const keepOriginalPackages = data.keepOriginalPackages;
        const skipDependencies = data.skipDependencies;
        const skipWbTransport = data.skipWbTransport;
        const targetSystem = data.targetSystem;
        const transportLayer = data.transportLayer;
        var packageReplacements = data.packageReplacements;
        if (packageReplacements) {
            var sPackageReplacements;
            try {
                sPackageReplacements = fs.readFileSync(packageReplacements).toString();
            }
            catch (e) {
                sPackageReplacements = packageReplacements;
            }
            packageReplacements = JSON.parse(sPackageReplacements);
        }
        else {
            packageReplacements = [];
        }
        const registryPing = yield oRegistry.ping();
        if (registryPing.wallMessage) {
            logger.registryResponse(registryPing.wallMessage);
        }
        if (registryAuth && registryPing.authenticationType !== trm_registry_types_1.AuthenticationType.NO_AUTH) {
            logger.loading(`Logging into registry...`);
            yield oRegistry.authenticate(inquirer, logger, registryAuth);
            const whoami = yield oRegistry.whoAmI();
            logger.success(`Logged in as "${whoami.username}"`);
        }
        const oSystem = new trm_core_1.SystemConnector({
            dest: data.systemDest,
            ashost: data.systemAsHost,
            sysnr: data.systemSysNr,
            saprouter: data.systemSapRouter
        }, {
            client: data.systemClient,
            lang: data.systemLang,
            user: data.systemUser,
            passwd: data.systemPassword
        }, logger);
        yield oSystem.connect();
        yield (0, trm_core_1.install)({
            packageName,
            version: packageVersion,
            ci: true,
            forceInstall,
            ignoreSapEntries,
            importTimeout,
            keepOriginalPackages,
            packageReplacements: packageReplacements,
            skipDependencies,
            skipWbTransport,
            targetSystem,
            transportLayer
        }, inquirer, oSystem, oRegistry, logger);
    });
}
exports.install = install;
