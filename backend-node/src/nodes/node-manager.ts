import chalk from "chalk";
import { BaseNode } from "./base-node";

let nodes: Array<BaseNode> = []


export class NodeManager {
    static getNodeById(id: string): any {
        let node = nodes.find(node => node.id === id);


        return node;
    }
    
    static addNode(node: BaseNode) {
        nodes.push(node);
    }

    static getActiveNodes(): Array<BaseNode> {
        return nodes;
    }
    
    static reset() {
        if (nodes.length > 0) console.log(chalk.bgRedBright("RESETTING CONFIG"))
        // Calling stop function for each node
        nodes.forEach((node: BaseNode) => {
            node.stop();
        });
        nodes = [];
    }
}

