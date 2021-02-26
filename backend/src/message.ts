
export class Message {
    sourceId: string;
    targetId: string;
    sourceName: string;
    targetName: string;
    sourceNodeId: string;
    targetNodeId: string;
    type: string;
    payload: any;

    constructor(sourceId: string, targetId: string, sourceName: string, targetName: string, sourceNodeId: string, targetNodeId: string, type: string, payload: any) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.sourceName = sourceName;
        this.targetName = targetName;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.type = type;
        this.payload = payload;
    }
}