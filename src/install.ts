import { CliInquirer, ConsoleLogger, Inquirer, Logger, Registry, ServerSystemConnector, SystemConnector, install as action } from "trm-core";
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
    registryEndpoint: string,
    registryAuth?: string,
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
    
    await action({
        packageName: '',
        registry,
        allowReplace: false,
        force: false,
        generateTransport: false,
        ignoreDependencies: false,
        importTimeout: 1,
        keepOriginalDevclass: false,
        packageReplacements: [],
        r3transOptions: {},
        silent: false,
        skipCustImport: false,
        skipLangImport: false,
        skipObjectTypesCheck: false,
        skipSapEntriesCheck: false,
        transportLayer: '',
        version: '',
        wbTrTargetSystem: ''
    });
}