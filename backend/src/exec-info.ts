import { NodeManager } from "./nodes/node-manager";
import { RedisClient } from "./redis";
import { WsManager } from "./ws";
import { format } from 'date-fns'
import { BaseNode } from "./nodes/base-node";

class NodeExecutionCount {
    type: string;
    nodeId: string;
    triggerCount: number;
    successCount: number;
    failureCount: number;
    bytesCount  : number

    constructor(type: string, nodeId: string, triggerCount: number, successCount: number, failureCount: number, bytesCount: number) {
        this.type = type;
        this.nodeId = nodeId;
        this.triggerCount = triggerCount;
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.bytesCount   = bytesCount;
    }
}


export class ExecutionCounter {


    static async incrCountType(nodeId: string, type: string, incrWidth: number = 1) {
        let execInfoString = `exex_info_${type}_${nodeId}`;

        console.log(`Incrementing: ${execInfoString} by ${incrWidth}`)
        let data = await RedisClient.get(execInfoString)

        let incrData = 1; // Initial initalization at 1 as fallback
        if (data) incrData = parseInt(data)+incrWidth; // Override initial value if value is present in database
        RedisClient.set(execInfoString, incrData); // Setting value to database
        this.sendExecutionCountWithoutInfo(nodeId);
    }

    /**
     * Fetches list of all active nodes and get the respective node count. Emitting these node counts to frontent
     * for proper initialization.
     */
    static async initialEmitAllCounts() {
        let activeNodes = NodeManager.getActiveNodes();
        activeNodes.forEach(node => {
            for (const node of activeNodes) {
                // Frontend is not fast enough to initialize in time.
                setTimeout(() => {
                    this.sendExecutionCountWithoutInfo(node.id);
                }, 1000);
            };
        });
    }


    /**
     * Resets the call count of the given node to 0
     * @param nodeId Id of the node
     */
    static resetCount(nodeId: string): void {

        let execInfoTrigger = `exex_info_trigger_${nodeId}`;
        let execInfoSuccess = `exex_info_success_${nodeId}`;
        let execInfoFailure = `exex_info_failure_${nodeId}`;
        let byteInfoTrigger =   `exex_info_bytes_${nodeId}`;


        RedisClient.set(execInfoTrigger, 0);
        RedisClient.set(execInfoSuccess, 0);
        RedisClient.set(execInfoFailure, 0);
        RedisClient.set(byteInfoTrigger, 0);

        this.sendExecutionCount(nodeId, 0, 0, 0, 0);
    }


    /**
     * Emits the count of a node via websockets to the frontend.
     * @param nodeId Id of the node
     * @param count Count to emit
     */
    static sendExecutionCount(nodeId: string, triggerCount: number, successCount: number, failureCount: number, bytesCount: number): void {
        let payload: NodeExecutionCount = {
            type: "ExecutionCount",
            nodeId: nodeId,
            triggerCount: triggerCount,
            successCount: successCount,
            failureCount: failureCount,
            bytesCount  : bytesCount
        }
        WsManager.sendMessage(JSON.stringify(payload));
    }

    /**
     * Emits the count of a node via websockets to the frontend.
     * @param nodeId Id of the node
     * @param count Count to emit
     */
    static async sendExecutionCountWithoutInfo(nodeId: string) {
        let execInfoTrigger = `exex_info_trigger_${nodeId}`;
        let execInfoSuccess = `exex_info_success_${nodeId}`;
        let execInfoFailure = `exex_info_failure_${nodeId}`;
        let byteInfoTrigger =   `exex_info_bytes_${nodeId}`;

        let triggerCount = await RedisClient.get(execInfoTrigger);
        let successCount = await RedisClient.get(execInfoSuccess);
        let failureCount = await RedisClient.get(execInfoFailure);
        let bytesCount   = await RedisClient.get(byteInfoTrigger);

        let payload: NodeExecutionCount = {
            type: "ExecutionCount",
            nodeId: nodeId,
            triggerCount: triggerCount,
            successCount: successCount,
            failureCount: failureCount,
            bytesCount  : bytesCount
        }
        WsManager.sendMessage(JSON.stringify(payload));
    }
}