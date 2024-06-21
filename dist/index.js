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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const install_1 = require("./install");
var importTimeout;
try {
    importTimeout = parseInt(core.getInput('importTimeout'));
}
catch (e) {
    core.setFailed(`Invalid import timeout value.`);
}
(0, install_1.install)({
    systemDest: core.getInput('systemDest'),
    systemAsHost: core.getInput('systemAsHost'),
    systemSysnr: core.getInput('systemSysnr'),
    systemClient: core.getInput('systemClient'),
    systemUser: core.getInput('systemUser'),
    systemPassword: core.getInput('systemPassword'),
    systemLang: core.getInput('systemLang'),
    packageName: core.getInput('packageName'),
    packageVersion: core.getInput('packageVersion'),
    allowReplace: core.getBooleanInput('allowReplace'),
    force: core.getBooleanInput('force'),
    generateTransport: core.getBooleanInput('generateTransport'),
    ignoreDependencies: core.getBooleanInput('ignoreDependencies'),
    importTimeout,
    keepOriginalDevclass: core.getBooleanInput('keepOriginalDevclass'),
    registryEndpoint: core.getInput('registryEndpoint'),
    skipCustImport: core.getBooleanInput('skipCustImport'),
    skipLangImport: core.getBooleanInput('skipLangImport'),
    skipObjectTypesCheck: core.getBooleanInput('skipObjectTypesCheck'),
    skipSapEntriesCheck: core.getBooleanInput('skipSapEntriesCheck'),
    transportLayer: core.getInput('transportLayer'),
    wbTrTargetSystem: core.getInput('wbTrTargetSystem'),
    packageReplacements: core.getInput('packageReplacements'),
    registryAuth: core.getInput('registryAuth'),
    r3transTempFolder: core.getInput('r3transTempFolder'),
    simpleLog: core.getBooleanInput('simpleLog'),
}).then(() => {
    console.log("Package installed.");
}).catch(err => {
    core.setFailed(err.message);
});
