import * as core from "@actions/core";
import { install } from "./install";

install({
    registryEndpoint: core.getInput('registryEndpoint'),
    registryAuth: core.getInput('registryAuth'),
    systemDest: core.getInput('systemDest'),
    systemAsHost: core.getInput('systemAsHost'),
    systemSysNr: core.getInput('systemSysNr'),
    systemSapRouter: core.getInput('systemSapRouter'),
    systemClient: core.getInput('systemClient'),
    systemLang: core.getInput('systemLang'),
    systemUser: core.getInput('systemUser'),
    systemPassword: core.getInput('systemPassword'),
    packageName: core.getInput('packageName'),
    packageVersion: core.getInput('packageVersion'),
    forceInstall: core.getBooleanInput('forceInstall'),
    ignoreSapEntries: core.getBooleanInput('ignoreSapEntries'),
    importTimeout: parseInt(core.getInput('importTimeout')),
    keepOriginalPackages: core.getBooleanInput('keepOriginalPackages'),
    packageReplacements: core.getInput('packageReplacements'),
    skipDependencies: core.getBooleanInput('skipDependencies'),
    skipWbTransport: core.getBooleanInput('skipWbTransport'),
    targetSystem: core.getInput('targetSystem'),
    transportLayer: core.getInput('transportLayer'),
}).then(() => {
    console.log("OK.");
}).catch(err => {
    core.setFailed(err.message);
});