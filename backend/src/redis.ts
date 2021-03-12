import chalk from "chalk";
const redis = require("redis");
const { promisify } = require("util");


let url = 'redis://redis:6379/0'  // Reachable by docker in PROD mode
const environment = process.env.NODE_ENV || 'DEV';
if (environment === "DEV") url = "redis://localhost:6379/0";


const client = redis.createClient(url);


const getAsync = promisify(client.get).bind(client);

client.on("error", () => {
    console.log(`${chalk.magenta("Redis-Server")}: (${url}): ${chalk.redBright("connecting failed")}`)
});

client.on("connect", () => {
    console.log(`${chalk.magenta("Redis-Server")}: (${url}): ${chalk.greenBright("connected")}`)
});

export class RedisClient {

    static set(key: string, value: any) {
        client.set(key, value);
    }

    static incrby(key: string, value: any) {
        client.incrby(key, value);
    }

    static async get(key: string) {
        return getAsync(key);
    }
}
