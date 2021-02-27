import { add } from "date-fns";

export class Message {
    sourceId: string;
    targetId: string;
    sourceName: string;
    targetName: string;
    sourceNodeId: string;
    targetNodeId: string;
    type: string;
    payload: any;
    additional: any;

    constructor(sourceId: string, targetId: string, sourceName: string, targetName: string, sourceNodeId: string, targetNodeId: string, type: string, payload: any, additinal: any = null) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.sourceName = sourceName;
        this.targetName = targetName;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.type = type;
        this.payload = payload;
        this.additional = additinal;
    }
}