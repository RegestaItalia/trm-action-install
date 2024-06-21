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
const trm_core_1 = require("trm-core");
const core = __importStar(require("@actions/core"));
const GithubLogger_1 = require("./GithubLogger");
const _getRegistry = (endpoint, auth) => __awaiter(void 0, void 0, void 0, function* () {
    const registry = new trm_core_1.Registry(endpoint);
    if (auth) {
        var oAuth;
        try {
            oAuth = JSON.parse(auth);
        }
        catch (e) {
            throw new Error(`Invalid registry authentication data.`);
        }
        trm_core_1.Logger.loading(`Logging into registry...`);
        yield registry.authenticate(oAuth);
        const whoami = yield registry.whoAmI();
        const ping = yield registry.ping();
        trm_core_1.Logger.success(`Logged in as "${whoami.username}"`);
        if (ping.wallMessage) {
            trm_core_1.Logger.registryResponse(ping.wallMessage);
        }
    }
    return registry;
});
const _getPackageReplacements = (iPackageReplacements) => {
    var packageReplacements;
    try {
        packageReplacements = JSON.parse(iPackageReplacements).map(o => {
            return {
                originalDevclass: o.originalDevclass,
                installDevclass: o.installDevclass
            };
        });
    }
    catch (e) {
        packageReplacements = [];
    }
    packageReplacements.forEach(o => {
        if (!o.originalDevclass) {
            throw new Error(`Package replacement input: missing original devclass.`);
        }
        if (!o.installDevclass) {
            throw new Error(`Package replacement input: missing install devclass.`);
        }
    });
    return packageReplacements;
};
function install(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const debug = core.isDebug();
        if (data.simpleLog) {
            trm_core_1.Logger.logger = new trm_core_1.ConsoleLogger(debug);
        }
        else {
            trm_core_1.Logger.logger = new GithubLogger_1.GithubLogger(debug);
        }
        trm_core_1.Inquirer.inquirer = new trm_core_1.CliInquirer();
        trm_core_1.SystemConnector.systemConnector = new trm_core_1.ServerSystemConnector({
            dest: data.systemDest,
            ashost: data.systemAsHost,
            sysnr: data.systemSysnr
        }, {
            client: data.systemClient,
            user: data.systemUser,
            passwd: data.systemPassword,
            lang: data.systemLang
        });
        yield trm_core_1.SystemConnector.connect();
        const registry = yield _getRegistry(data.registryEndpoint, data.registryAuth);
        const packageName = data.packageName;
        const version = data.packageVersion;
        const allowReplace = data.allowReplace;
        const force = data.force;
        const generateTransport = data.generateTransport;
        const ignoreDependencies = data.ignoreDependencies;
        const importTimeout = data.importTimeout;
        const keepOriginalDevclass = data.keepOriginalDevclass;
        const packageReplacements = _getPackageReplacements(data.packageReplacements);
        const r3transTempFolder = data.r3transTempFolder;
        const skipCustImport = data.skipCustImport;
        const skipLangImport = data.skipLangImport;
        const skipObjectTypesCheck = data.skipObjectTypesCheck;
        const skipSapEntriesCheck = data.skipSapEntriesCheck;
        const transportLayer = data.transportLayer;
        const wbTrTargetSystem = data.wbTrTargetSystem;
        yield (0, trm_core_1.install)({
            packageName,
            version,
            registry,
            allowReplace,
            force,
            generateTransport,
            ignoreDependencies,
            importTimeout,
            keepOriginalDevclass,
            packageReplacements,
            r3transOptions: {
                tempDirPath: r3transTempFolder
            },
            skipCustImport,
            skipLangImport,
            skipObjectTypesCheck,
            skipSapEntriesCheck,
            transportLayer,
            wbTrTargetSystem,
            silent: true
        });
    });
}
exports.install = install;
