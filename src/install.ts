import { AuthenticationType } from "trm-registry-types";
import { CoreEnv, Logger, Inquirer, Registry, SystemConnector, install as trmInstall, TraceLevel } from "trm-core";
import * as fs from "fs";

export type ActionArgs = {
    registryEndpoint?: string,
    registryAuth?: string,
    systemDest: string,
    systemAsHost: string,
    systemSysNr: string,
    systemSapRouter?: string,
    systemClient: string,
    systemLang: string,
    systemUser: string,
    systemPassword: string,
    packageName: string,
    packageVersion?: string,
    forceInstall: boolean,
    ignoreSapEntries: boolean,
    importTimeout: number,
    keepOriginalPackages: boolean,
    packageReplacements?: string,
    skipDependencies: boolean,
    skipWbTransport: boolean,
    targetSystem?: string,
    transportLayer?: string
};

export async function install(data: ActionArgs) {

    const registryEndpoint = data.registryEndpoint || 'public';
    const registryAuth = data.registryAuth ? JSON.parse(data.registryAuth) : undefined;
    const logger = new Logger(CoreEnv.CLI, TraceLevel.TRACE_ALL);
    const inquirer = new Inquirer(CoreEnv.DUMMY);
    const oRegistry = new Registry(registryEndpoint, registryEndpoint);

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
    var packageReplacements: string | {
        originalDevclass: string;
        installDevclass: string;
    }[] = data.packageReplacements;

    if(packageReplacements){
        var sPackageReplacements: string;
        try {
            sPackageReplacements = fs.readFileSync(packageReplacements).toString();
        } catch (e) {
            sPackageReplacements = packageReplacements;
        }
        packageReplacements = JSON.parse(sPackageReplacements);
    }else{
        packageReplacements = [];
    }

    const registryPing = await oRegistry.ping();
    if (registryPing.wallMessage) {
        logger.registryResponse(registryPing.wallMessage);
    }
    if (registryAuth && registryPing.authenticationType !== AuthenticationType.NO_AUTH) {
        logger.loading(`Logging into registry...`);
        await oRegistry.authenticate(inquirer, logger, registryAuth);
        const whoami = await oRegistry.whoAmI();
        logger.success(`Logged in as "${whoami.username}"`);
    }
    const oSystem = new SystemConnector({
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
    await oSystem.connect();
    
    await trmInstall({
        packageName,
        version: packageVersion,
        ci: true,
        forceInstall,
        ignoreSapEntries,
        importTimeout,
        keepOriginalPackages,
        packageReplacements: packageReplacements as {
            originalDevclass: string;
            installDevclass: string;
        }[],
        skipDependencies,
        skipWbTransport,
        targetSystem,
        transportLayer
    }, inquirer, oSystem, oRegistry, logger);
}