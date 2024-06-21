import * as core from "@actions/core";
import { install } from "./install";

var importTimeout: number;
try{
    importTimeout = parseInt(core.getInput('importTimeout'));
}catch(e){
    core.setFailed(`Invalid import timeout value.`);
}

install({
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