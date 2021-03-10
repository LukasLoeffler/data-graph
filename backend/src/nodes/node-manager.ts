import chalk from "chalk";
import { BaseNode } from "./base-node";

let nodes: Array<BaseNode> = []

/**
 * The NodeManager manages all active nodes. 
 * In contrast to the NodeRegistry which holds the classes, the NodeManager holds the node instances.
 */
export class NodeManager {
    static getNodeById(id: string): any {
        let node = nodes.find(node => node.id === id);
        return node;
    }

    static getNodesByType(type: string): any {
        let filteredNodes = nodes.filter(node => node.type === type);
        return filteredNodes;
    }
    
    /**
     * Adds a node to the active nodes.
     * Function usually called in constructor of nodes. 
     * @param node Node to activate
     */
    static addNode(node: BaseNode) {
        nodes.push(node);
    }

    /**
     * Returns all active nodes
     */
    static getActiveNodes(): Array<BaseNode> {
        return nodes;
    }
    
    /**
     * Resets all active nodes by calling the reset method of all nodes.
     * Reset methods will terminate all background code executions like scheduler.
     * Resets the active nodes array.
     */
    static reset() {
        if (nodes.length > 0) console.log(chalk.redBright("RESETTING CONFIG"))
        // Calling stop function for each node
        nodes.forEach((node: BaseNode) => {
            node.stop();
        });
        nodes = [];
    }

    static resetNode(nodeId: string) {
        let node = this.getNodeById(nodeId);
        if (node) {
            nodes = nodes.filter((node: any) => node.id !== nodeId);
            node.stop();
        }
    }
}

