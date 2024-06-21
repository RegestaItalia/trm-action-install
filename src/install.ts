import { CliInquirer, ConsoleLogger, Inquirer, InstallPackageReplacements, Logger, Registry, ServerSystemConnector, SystemConnector, install as action } from "trm-core";
import * as core from "@actions/core";
import { GithubLogger } from "./GithubLogger";

export type ActionArgs = {
    systemDest: string,
    systemAsHost: string,
    systemSysnr: string,
    systemClient: string,
    systemUser: string,
    systemPassword: string,
    systemLang: string,
    packageName: string,
    packageVersion: string,
    allowReplace: boolean,
    force: boolean,
    generateTransport: boolean,
    ignoreDependencies: boolean,
    importTimeout: number,
    keepOriginalDevclass: boolean,
    registryEndpoint: string,
    skipCustImport: boolean,
    skipLangImport: boolean,
    skipObjectTypesCheck: boolean,
    skipSapEntriesCheck: boolean,
    transportLayer?: string,
    wbTrTargetSystem?: string,
    packageReplacements?: string,
    registryAuth?: string,
    r3transTempFolder?: string,
    simpleLog: boolean
};

const _getRegistry = async (endpoint: string, auth?: string): Promise<Registry> => {
    const registry = new Registry(endpoint);
    if(auth){
        var oAuth: any;
        try{
            oAuth = JSON.parse(auth);
        }catch(e){
            throw new Error(`Invalid registry authentication data.`);
        }
        Logger.loading(`Logging into registry...`);
        await registry.authenticate(oAuth);
        const whoami = await registry.whoAmI();
        const ping = await registry.ping();
        Logger.success(`Logged in as "${whoami.username}"`);
        if(ping.wallMessage){
            Logger.registryResponse(ping.wallMessage);
        }
    }
    return registry;
}

const _getPackageReplacements = (iPackageReplacements: string): InstallPackageReplacements[] => {
    var packageReplacements;
    try{
        packageReplacements = JSON.parse(iPackageReplacements).map(o => {
            return {
                originalDevclass: o.originalDevclass,
                installDevclass: o.installDevclass
            }
        });
    }catch(e){
        packageReplacements = [];
    }
    packageReplacements.forEach(o => {
        if(!o.originalDevclass){
            throw new Error(`Package replacement input: missing original devclass.`);
        }
        if(!o.installDevclass){
            throw new Error(`Package replacement input: missing install devclass.`);
        }
    });
    return packageReplacements;
}

export async function install(data: ActionArgs) {
    const debug = core.isDebug();
    if(data.simpleLog){
        Logger.logger = new ConsoleLogger(debug);
    }else{
        Logger.logger = new GithubLogger(debug);
    }
    Inquirer.inquirer = new CliInquirer(); //TODO: dummy inquirer that throws error is needs user interaction
    SystemConnector.systemConnector = new ServerSystemConnector({
        dest: data.systemDest,
        ashost: data.systemAsHost,
        sysnr: data.systemSysnr
    }, {
        client: data.systemClient,
        user: data.systemUser,
        passwd: data.systemPassword,
        lang: data.systemLang
    });

    //connections
    await SystemConnector.connect();
    const registry = await _getRegistry(data.registryEndpoint, data.registryAuth);

    //data parsing
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
    
    await action({
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
}