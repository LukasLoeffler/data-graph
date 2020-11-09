import { NodeManager } from "./nodes/node-manager";
import { RedisClient } from "./redis";
import { WsManager } from "./ws";


class NodeExecutionCount {
    type: string;
    nodeId: string;
    executionCount: number

    constructor(type: string, nodeId: string, executionCount: number) {
        this.type = type;
        this.nodeId = nodeId;
        this.executionCount = executionCount;
    }
}


export class ExecutionCounter {

    /**
     * Increments the execution counter for the given node by one and writes these changes to the redis-database.
     * If no data is existing for the given node 1 is set as start value.
     * After the value is incremented and set the data is send via websockets.
     * @param nodeId ID of the node created.
     */
    static incrCount(nodeId: string): void {
        RedisClient.get(nodeId).then((data: any) => {
            let incrData = 1; // Initial initalization at 1 as fallback
            if (data) incrData = parseInt(data)+1; // Override initial value if value is present in database
            RedisClient.set(nodeId, incrData); // Setting value to database 
            this.sendExecutionCount(nodeId, incrData); // Send data to frontend
        })
    }


    /**
     * Fetches list of all active nodes and get the respective node count. Emitting these node counts to frontent
     * for proper initialization.
     */
    static initialEmitAllCounts(): void {
        let activeNodes = NodeManager.getActiveNodes();
        activeNodes.forEach(node => {
            RedisClient.get(node.id).then((data: any) => {
                let count = 0; // Initial initalization at 0 as fallback
                if (data) count = parseInt(data); // Override initial value if value is present in database
                this.sendExecutionCount(node.id, count); // Send data to frontend
            })
        });
    }


    /**
     * Resets the call count of the given node to 0
     * @param nodeId Id of the node
     */
    static resetCount(nodeId: string): void {
        const zeroValue = 0;
        RedisClient.set(nodeId, zeroValue);
        this.sendExecutionCount(nodeId, zeroValue);
    }


    /**
     * Emits the count of a node via websockets to the frontend.
     * @param nodeId Id of the node
     * @param count Count to emit
     */
    static sendExecutionCount(nodeId: string, count: number): void {
        let payload: NodeExecutionCount = {
            type: "ExecutionCount",
            nodeId: nodeId,
            executionCount: count
        }
        WsManager.sendMessage(JSON.stringify(payload));
    }
}