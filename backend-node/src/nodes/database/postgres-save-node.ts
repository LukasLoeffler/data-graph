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
    
    constructor(name: string, id: string, options: any, successTargets: any, failureTargets: any) {
        super(name, NODE_TYPE, id, successTargets, failureTargets)
        
        this.client = new Client(PostgresManager.getDefaultConnection())
        try {
            this.client.connect();
        } catch (error) {
            console.log(chalk.red("Database does not exist"))
        }

        NodeManager.addNode(this);
    }

    buildPlaceholder(numberValues: number) {
        let placeholder = "";
        for(let i = 1; i <= numberValues; i++) {
            placeholder = placeholder + "$"+i;

            if (i !== numberValues) {
                placeholder = placeholder + ",";
            }
        }
        return placeholder;
    }

    execute(msg: Message) {
        let values = Object.values(msg.payload).map((value: any) => { return value });

        let placeholder = this.buildPlaceholder(values.length);

        let sql = `INSERT INTO iss_time (${Object.keys(msg.payload)}) VALUES (${placeholder})`;
        //console.log("SQL:", sql);

        this.client
            .query(sql, values)
            .then((data: any) => {
                this.onSuccess(new Message(this.id, NODE_TYPE, data));   
            })
            .catch((err: any) => {
                this.onFailure(new Message(this.id, NODE_TYPE, err));
            })
    }

    objectKeysToString(keys: any) {
        let output = "";

        keys.forEach((key: string) => {
            output = output + `${key}, `
        });
        return output;
    }
}