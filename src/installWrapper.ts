import { Logger } from "trm-commons";
import { Login, PUBLIC_RESERVED_KEYWORD, InstallActionInput, InstallActionOutput, RESTSystemConnector, RFCSystemConnector, RegistryV2, SystemConnector, install, InstallPackageReplacements } from "trm-core";

export type ActionArgs = {
    systemLoginUser: string,
    systemLoginPassword: string,
    systemLoginLanguage: string,
    name: string,
    registryEndpoint: string,
    safe: boolean,
    noDependencies: boolean,
    noSapEntries: boolean,
    noObjectTypesCheck: boolean,
    importTransportTimeout: number,
    noLanguageTransport: boolean,
    noCustomizingTransport: boolean,
    keepOriginalAbapPackages: boolean,
    createInstallTransport: boolean,
    systemRFCDest?: string,
    systemRFCAsHost?: string,
    systemRFCSysnr?: string,
    systemRFCSAPRouter?: string,
    systemRESTEndpoint?: string,
    systemRESTRfcDestination?: string,
    systemLoginClient?: string,
    r3transDirPath?: string,
    registryToken?: string,
    registryAuth?: string,
    version?: string,
    overwrite?: boolean,
    integrity?: string,
    packageReplacements?: string,
    transportLayer?: string,
    installTransportTargetSystem?: string
};

export async function installWrapper(data: ActionArgs): Promise<InstallActionOutput> {
    //set system
    const systemLogin: Login = {
        client: data.systemLoginClient,
        user: data.systemLoginUser,
        passwd: data.systemLoginPassword,
        lang: data.systemLoginLanguage
    }
    if (data.systemRFCDest && data.systemRFCAsHost && data.systemRFCSysnr) {
        SystemConnector.systemConnector = new RFCSystemConnector({
            dest: data.systemRFCDest,
            ashost: data.systemRFCAsHost,
            sysnr: data.systemRFCSysnr,
            saprouter: data.systemRFCSAPRouter
        }, systemLogin);
    } else if (data.systemRESTEndpoint) {
        SystemConnector.systemConnector = new RESTSystemConnector({
            endpoint: data.systemRESTEndpoint,
            rfcdest: data.systemRESTRfcDestination
        }, systemLogin);
    } else {
        throw new Error(`No system connection defined: an RFC/REST connection must be provided.`);
    }
    await SystemConnector.connect();

    //get registry
    var registryAuth: any = {};
    if (data.registryToken) {
        registryAuth.token = data.registryToken;
    }
    if (data.registryAuth) {
        try {
            registryAuth = JSON.parse(data.registryAuth);
        } catch (e) {
            throw new Error(`Unable to parse registry authentication object: is input in JSON format?`);
        }
    }
    if (data.registryEndpoint.toLowerCase() === PUBLIC_RESERVED_KEYWORD) {
        data.registryEndpoint = PUBLIC_RESERVED_KEYWORD;
    }
    const registry = new RegistryV2(data.registryEndpoint, data.registryEndpoint);
    const ping = await registry.ping();
    if(ping.messages){
        ping.messages.forEach(o => Logger.registryResponse(o));
    }
    if (registryAuth) {
        Logger.loading(`Logging into "${data.registryEndpoint}" registry...`);
        await registry.authenticate(registryAuth);
        const whoami = await registry.whoAmI();
        Logger.success(`Logged in as ${whoami.user}`);
        if (whoami.messages) {
            whoami.messages.forEach(o => Logger.registryResponse(o));
        }
    }

    //data parsing
    var replacements: InstallPackageReplacements[] = [];
    if(data.packageReplacements){
        try{
            replacements = JSON.parse(data.packageReplacements);
        }catch(e){
            throw new Error(`Invalid package replacements input.`);
        }
    }
    const actionInput: InstallActionInput = {
        contextData: {
            noInquirer: true,
            r3transOptions: {
                tempDirPath: process.cwd(),
                r3transDirPath: data.r3transDirPath
            }
        },
        packageData: {
            name: data.name,
            version: data.version,
            overwrite: data.overwrite,
            registry
        },
        installData: {
            checks: {
                noDependencies: data.noDependencies,
                noSapEntries: data.noSapEntries,
                noObjectTypes: data.noObjectTypesCheck
            },
            import: {
                timeout: data.importTransportTimeout,
                noLang: data.noLanguageTransport,
                noCust: data.noCustomizingTransport
            },
            installDevclass: {
                keepOriginal: data.keepOriginalAbapPackages,
                transportLayer: data.transportLayer,
                replacements
            },
            installTransport: {
                create: data.createInstallTransport,
                targetSystem: data.installTransportTargetSystem
            }
        }
    }
    return await install(actionInput);
}