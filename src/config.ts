import * as os from 'os'
import * as path from 'path'
import { readFileSync, writeFileSync } from 'fs';
import { json } from 'stream/consumers';

class ConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConfigError";
    }
}

type Config = {
    dbUrl: string
    currentUserName: string
}
export function setUser(userName: string): void {
    const configPath = getConfigFilePath();
    let data: Config;
    try {
        const config = readConfig()
        config.currentUserName = userName;
        writeConfig(config);
    } catch (err) {
        throw new ConfigError("Invalid configuration" + ((err instanceof Error) ? err.message : String(err)))
    }
}

export function readConfig(): Config {
    const configPath = getConfigFilePath();
    let data: Config;
     try {
        const jsonString = readFileSync(configPath, 'utf8')
        const anyData = JSON.parse(jsonString)
        const configData = validateConfig(anyData)
        return configData
    } catch (err) {
        throw new ConfigError("Invalid configuration" + ((err instanceof Error) ? err.message : String(err)))
    }
}

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    const configPath = path.join(homeDir, '.gatorconfig.json')
    return configPath
}

function validateConfig(rawConfig: any): Config {
    if( typeof rawConfig !== 'object' ||
         rawConfig === null 
    ) {
        throw new ConfigError("Invalid config: invalid object!");
    }
    const dbUrl = rawConfig.db_url
    const currentUserName = typeof rawConfig.current_user_name === 'string' ? rawConfig.current_user_name : undefined;
    return {
        dbUrl: dbUrl,
        currentUserName: currentUserName
    } satisfies Config
}

function writeConfig(config: Config) {
     const configPath = getConfigFilePath();
     const pathData = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName
     }
      writeFileSync(configPath, JSON.stringify(pathData, null, 2), 'utf8')
}
