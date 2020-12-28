import chalk from "chalk";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { PostgresManager } from "./postgres-manager";

var format = require('pg-format');
const { Client } = require('pg')



const NODE_TYPE = "POSTGRES_SAVE"

export class PostgresSaveNode extends BaseNode {

    client: any;
    
    constructor(name: string, id: string, options: any) {
        super(name, NODE_TYPE, id, [], [])
        
        this.client = new Client(PostgresManager.getDefaultConnection())
        try {
            this.client.connect();
        } catch (error) {
            console.log(chalk.red("Database does not exist"))
        }
        NodeManager.addNode(this);
    }

    execute(msg: Message) {

        console.log(msg.payload[0]);

        let keys = this.objectKeysToString(Object.keys(msg.payload[0]))

        console.log(keys);

        let values = Object.values(msg.payload[0]).map((key: any) => {return `'${key}'`})

        values.forEach((value: any) => {
            console.log(typeof value);
        })

        let sql = format(`INSERT INTO bikes (${Object.keys(msg.payload[0])}) VALUES (${values})`);
        console.log(sql);

        this.client
            .query(sql)
            .then(() => console.log("Success"))
            .catch((err: any) => console.log(err))
    }

    objectKeysToString(keys: any) {
        let output = "";

        keys.forEach((key: string) => {
            output = output + `${key}, `
        });
        return output;
    }
}