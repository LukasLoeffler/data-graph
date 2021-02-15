import chalk from "chalk";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { PostgresManager } from "./postgres-manager";

const { Client } = require('pg')



const NODE_TYPE = "POSTGRES_SAVE"

export class PostgresSaveNode extends BaseNode {

    client: any;
    options: any;
    
    constructor(name: string, id: string, options: any, successTargets: any, failureTargets: any) {
        super(name, NODE_TYPE, id, successTargets, failureTargets)
        
        this.options = options;
        this.client = new Client(options.connection);
        try {
            this.client.connect();
        } catch (error) {
            console.log(`${chalk.magenta("Postgres-Server")}: (${this.client.host}:${this.client.port}): ${chalk.redBright("connecting failed")}`);
            console.log(chalk.red("Database does not exist"))
        }

        NodeManager.addNode(this);
    }

    /**
     * Builds the $1, $2, .. ,$n expression for n elements for postgres insertions with different lengths
     * @param numberValues number of placeholder required
     */
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

        let sql = `INSERT INTO ${this.options.connection.table} (${Object.keys(msg.payload)}) VALUES (${placeholder})`;
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
}