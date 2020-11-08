const redis = require("redis");
const { promisify } = require("util");


let url = "redis://192.168.178.82:6379/0"
const client = redis.createClient(url);

const getAsync = promisify(client.get).bind(client);

client.on("error", (error: any) => {
    console.error(error);
});

export class RedisClient {

    static set(key: string, value: any) {
        console.log("Set:", key, value);
        client.set(key, value);
    }

    static async get(key: string) {
        return getAsync(key);
    }
}
