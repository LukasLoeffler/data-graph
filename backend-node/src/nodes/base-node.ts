var crypto = require("crypto");
import chalk from "chalk";
import { Message } from "../message";
import { NodeManager } from "../nodes/node-manager";
import { WsManager } from "../ws";

const NODE_TYPE = "BASE_NODE"

export class BaseNode {
    name: string;
    id: string;
    type: string;
    targetsSuccess: Array<any>;
    targetsFailure: Array<any>;
    running: boolean;

    constructor(name: string, type: string, id: string = "", targetsSuccess: Array<any> = [], targetsFailure: Array<any> = []) {
        this.name = name;
        this.type = type;
        if (id) this.id = id;
        else this.id = crypto.randomBytes(10).toString('hex');
        this.targetsSuccess = targetsSuccess;
        this.targetsFailure = targetsFailure;
        this.running = true;
    }

    public toString = () : string => {
        return `${this.type} (id: ${this.id}, name: ${this.name})`;
    }

    onSuccess(payload: any) {
        this.targetsSuccess.forEach(target => {
            let message = this.buildMessage(this.id, target);
            WsManager.sendMessage(message);
            NodeManager.getNodeById(target).execute(payload);
        });
    }

    onFailure(msg: Message) {
        this.targetsFailure.forEach(target => {
            WsManager.sendMessage(this.buildMessage(this.id, target));
            NodeManager.getNodeById(target).execute(msg);
        });
    }

    start() {
        console.log(chalk.red("Start method not implemented for node type:", this.type));
    }

    stop() {
        //console.log(chalk.red("Stop method not implemented for node type:", this.type));
    }

    reset(): boolean {
        console.log(chalk.red("Reset method not implemented for node type:", this.type));
        return false;
    }

        /**
     * Options are generated by the frontend end therefore a source for errors.
     * This method checks the passed options of the constructor against the requiredOptions of this class.
     * @param options Passed options
     */
    validateOptions(options: any, requiredOptions: any) {
        requiredOptions.forEach((option: any) => {
            let cronExpression = options[option];
            if (!cronExpression) throw new Error(`${chalk.red(NODE_TYPE)}: Option '${option}' is not present`);
        });
    }

    /**
     * Extracts the optionValue for optionName
     * @param options 
     */
    getOption(optionName: string, options: any) {
        return options[optionName];
    }

    buildMessage(fromNodeId: string, toNodeId: string): string {
        let message = {
            type: "ConnectionExecution",
            data: {
                from: fromNodeId,
                to: toNodeId
            }
        }
        return JSON.stringify(message);
    }
}