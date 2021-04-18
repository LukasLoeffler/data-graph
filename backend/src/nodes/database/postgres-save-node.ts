import chalk from "chalk";
import { storeLastValue } from "../../manager/mongo-manager";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";

const { Client } = require('pg')


const NODE_TYPE = "POSTGRES_SAVE"

export class PostgresSaveNode extends BaseNode {

    client: any;
    options: any;
    lastValue: any = {};
    columns: Array<string>;
    sources: Array<string>;
    placeholder: string;
    
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections)
        this.client = new Client(options.settings.connection);
        // Combination out of columns and sources are the mapping

        this.columns = options.settings.mapping.map((map: any) => { return map.column});
        this.sources = options.settings.mapping.map((map: any) => { return map.source});
        this.placeholder = this.buildPlaceholder(this.columns.length);
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
        storeLastValue(this.id, {...msg.payload });
        let values = this.sources.map((source: any) => { return msg.payload[source]});
        let sql = `INSERT INTO ${this.options.settings.connection.table} (${this.columns}) VALUES (${this.placeholder})`;

        this.client
            .query(sql, values)
            .then((data: any) => {
                this.onSuccess(data, msg.additional);
            })
            .catch((err: any) => {
                this.onFailure(err, msg.additional);
            })
    }

    stop() {
        this.client.end();
    }
}