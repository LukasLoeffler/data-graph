
export class Message {
    sourceNodeId: string;
    type: string;
    payload: any;

    constructor(sourceNodeId: string, type: string, payload: any) {
        this.sourceNodeId = sourceNodeId;
        this.type = type;
        this.payload = payload;
    }
}