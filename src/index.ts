import { getBooleanInput, getInput, isDebug, setFailed } from "@actions/core";
import { ActionArgs, installWrapper } from "./installWrapper";
import { GithubLogger } from "./GithubLogger";
import { Inquirer, Logger, InstallActionOutput } from "trm-core";
import { GithubInquirer } from "./GithubInquirer";

const main = async(data: ActionArgs): Promise<InstallActionOutput> => {
    //set logger
    Logger.logger = new GithubLogger(isDebug());

    //set inquirer
    Inquirer.inquirer = new GithubInquirer();

    return await installWrapper(data);
}

const sImportTransportTimeout = getInput("importTransportTimeout", { required: true, trimWhitespace: true });
var importTransportTimeout: number;
try{
    if(sImportTransportTimeout){
        importTransportTimeout = parseInt(sImportTransportTimeout);
    }
}catch(e){
    setFailed(`Invalid import transport timeout value: "${sImportTransportTimeout}", expected seconds.`);
}
main({
    systemLoginUser: getInput("systemLoginUser", { required: true, trimWhitespace: true }),
    systemLoginPassword: getInput("systemLoginPassword", { required: true, trimWhitespace: true }),
    systemLoginLanguage: getInput("systemLoginLanguage", { required: true, trimWhitespace: true }),
    name: getInput("name", { required: true, trimWhitespace: true }),
    registryEndpoint: getInput("registryEndpoint", { required: true, trimWhitespace: true }),
    safe: getBooleanInput("safe", { required: true, trimWhitespace: true }),
    noDependencies: getBooleanInput("noDependencies", { required: true, trimWhitespace: true }),
    noSapEntries: getBooleanInput("noSapEntries", { required: true, trimWhitespace: true }),
    noObjectTypesCheck: getBooleanInput("noObjectTypesCheck", { required: true, trimWhitespace: true }),
    importTransportTimeout,
    noLanguageTransport: getBooleanInput("noLanguageTransport", { required: true, trimWhitespace: true }),
    noCustomizingTransport: getBooleanInput("noCustomizingTransport", { required: true, trimWhitespace: true }),
    keepOriginalAbapPackages: getBooleanInput("keepOriginalAbapPackages", { required: true, trimWhitespace: true }),
    createInstallTransport: getBooleanInput("createInstallTransport", { required: true, trimWhitespace: true }),
    systemRFCDest: getInput("systemRFCDest", { required: false, trimWhitespace: true }),
    systemRFCAsHost: getInput("systemRFCAsHost", { required: false, trimWhitespace: true }),
    systemRFCSysnr: getInput("systemRFCSysnr", { required: false, trimWhitespace: true }),
    systemRFCSAPRouter: getInput("systemRFCSAPRouter", { required: false, trimWhitespace: true }),
    systemRESTEndpoint: getInput("systemRESTEndpoint", { required: false, trimWhitespace: true }),
    systemRESTRfcDestination: getInput("systemRESTRfcDestination", { required: false, trimWhitespace: true }),
    systemLoginClient: getInput("systemLoginClient", { required: false, trimWhitespace: true }),
    r3transDirPath: getInput("r3transDirPath", { required: false, trimWhitespace: true }),
    registryToken: getInput("registryToken", { required: false, trimWhitespace: true }),
    registryAuth: getInput("registryAuth", { required: false, trimWhitespace: true }),
    version: getInput("version", { required: false, trimWhitespace: true }),
    overwrite: getBooleanInput("overwrite", { required: true, trimWhitespace: true }),
    integrity: getInput("integrity", { required: false, trimWhitespace: true }),
    packageReplacements: getInput("packageReplacements", { required: false, trimWhitespace: true }),
    transportLayer: getInput("transportLayer", { required: false, trimWhitespace: true }),
    installTransportTargetSystem: getInput("installTransportTargetSystem", { required: false, trimWhitespace: true })
}).then(result => {
    var sSuccess = `Installed ${result.trmPackage.packageName}`;
    if(result.installTransport){
        sSuccess += `, use transport request ${result.installTransport.trkorr}`;
    }
    Logger.success(sSuccess);
}).catch(e => {
    setFailed(e);
});