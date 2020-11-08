import { RedisClient } from "./redis";
import { WsManager } from "./ws";



export default class ExecutionCounter {

    /**
     * Increments the execution counter for the given node by one and writes these changes to the redis-database.
     * If no data is existing for the given node 1 is set as start value.
     * After the value is incremented and set the data is send via websockets.
     * @param nodeId ID of the node created.
     */
    static incrCount(nodeId: string) {
        RedisClient.get(nodeId).then((data: any) => {
            let incrData = 1; // Initial initalization at 1 as fallback
            if (data) incrData = parseInt(data)+1; // Override initial value if value is present in database
            RedisClient.set(nodeId, incrData); // Setting value to database 
            this.sendExecutionCount(nodeId, incrData); // Send data to frontend
        })
    }

    static resetCount(nodeId: string) {
        const zeroValue = 0;
        RedisClient.set(nodeId, zeroValue);
        this.sendExecutionCount(nodeId, zeroValue);
    }


    static sendExecutionCount(nodeId: string, count: number) {
        let payload = {
            type: "ExecutionCount",
            node: nodeId,
            callCount: count
        }
        WsManager.sendMessage(JSON.stringify(payload));
    }
}