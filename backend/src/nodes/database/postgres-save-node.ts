import chalk from "chalk";
import { storeLastValue } from "../../manager/mongo-manager";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { PostgresManager } from "./postgres-manager";

const { Client } = require('pg')



const NODE_TYPE = "POSTGRES_SAVE"

export class PostgresSaveNode extends BaseNode {

    client: any;
    options: any;
    lastValue: any = {};
    columns: Array<string>;
    sources: Array<string>;
    
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections)
        this.options = options;
        this.client = new Client(options.connection);
        this.columns = options.mapping.map((map: any) => { return map.column});
        this.sources = options.mapping.map((map: any) => { return map.source});
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
        storeLastValue(this.id, msg.payload);

        //let values = Object.values(msg.payload).map((value: any) => { return value });

        let values = this.sources.map((source: any) => { return msg.payload[source]});

        let placeholder = this.buildPlaceholder(values.length);

        let sql = `INSERT INTO ${this.options.connection.table} (${this.columns}) VALUES (${placeholder})`;

        this.client
            .query(sql, values)
            .then((data: any) => {
                this.onSuccess(data, msg.additional);   
            })
            .catch((err: any) => {
                this.onFailure(err, msg.additional);
            })
    }
}