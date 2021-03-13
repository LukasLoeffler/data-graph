import chalk from "chalk";
import { Message } from "../message";
import { NodeManager } from "../nodes/node-manager";
import { ExecutionCounter } from "../exec-info"
import { io } from "..";

const NODE_TYPE = "BASE_NODE";


export class BaseNode {
    name: string;
    id: string;
    type: string;
    targetsSuccess: Array<any>;
    targetsFailure: Array<any>;
    outputConnections: Array<any>;
    running: boolean;
    options: any;

    
    constructor(name: string, type: string, id: string = "", options: any, outputConnections: Array<any>) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.options = options;
        this.outputConnections = outputConnections;
        this.targetsSuccess = outputConnections.filter((intf: any) => intf.from.name === "onSuccess");
        this.targetsFailure = outputConnections.filter((intf: any) => intf.from.name === "onFailure");
        this.running = true;
    }

    public toString = () : string => {
        return `${this.type} (id: ${this.id}, name: ${this.name})`;
    }

    onSuccess(payload: any, additional: any = null) {
        ExecutionCounter.incrCountType(this.id, "success");
        this.targetsSuccess.forEach(target => {
            this.sendConnectionExec(target.from.id, target.to.id);
            let message = new Message(target.from.id, target.to.id, target.from.name, target.to.name, this.id, target.from.nodeId, target.to.nodeId, payload, additional);
            NodeManager.getNodeById(target.to.nodeId).execute(message);
        });
    }

    onFailure(payload: any, additional: any = null) {
        ExecutionCounter.incrCountType(this.id, "failure");
        this.sendErrorMessage(this.id);  // Red shadow pulse trigger
        this.targetsFailure.forEach(target => {
            this.sendConnectionExec(target.from.id, target.to.id);
            let message = new Message(target.from.id, target.to.id, target.from.name, target.to.name, this.id, target.from.nodeId, target.to.nodeId, payload, additional);
            NodeManager.getNodeById(target.to.nodeId).execute(message);
        });
    }

    on(trigger: string, payload: any, additional: any = null) {
        let targets = this.outputConnections.filter((intf: any) => intf.from.name === trigger);
        targets.forEach(target => {
            this.sendConnectionExec(target.from.id, target.to.id);
            let message = new Message(target.from.id, target.to.id, target.from.name, target.to.name, this.id, target.from.nodeId, target.to.nodeId, payload, additional);
            NodeManager.getNodeById(target.to.nodeId).execute(message);
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

    sendConnectionExec(fromNodeId: string, toNodeId: string): void {
        let message = {
            type: "CONNECTION_EXEC",
            data: {
                from: fromNodeId,
                to: toNodeId
            }
        }
        io.emit('CONNECTION_EXEC', message);
    }

    
    sendErrorMessage(nodeId: string, errorMessage: string = ""): void {
        let message = {
            type: "NODE_EXEC_ERROR",
            data: {
                nodeId: nodeId,
                message: errorMessage
            }
        }
        io.emit("NODE_EXEC_ERROR", message);
    }
}