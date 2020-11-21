import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
const fs = require('fs');

const NODE_TYPE = "FILE_SAVE"



export class FileSaveNode extends BaseNode {
    fileName: string;
    fileType: string;
    filePath: string;
    constructor(name: string, id: string, fileName: string, fileType: string, filePath: string) {
        super(name, NODE_TYPE, id, [], [])
        this.fileName = fileName;
        this.fileType = fileType;
        this.filePath = filePath;
        NodeManager.addNode(this);
    }

    execute(payload: string) {
        
        let datetime = new Date().toISOString().replace(/:/g, "-").slice(0, -5)
        let file = `${this.filePath}/${this.fileName}-${datetime}.${this.fileType}`
        if (this.fileType === "json") {
            fs.appendFile(file, JSON.stringify(payload,  null, 4),  (err: any) => {
                if (err) this.onFailure(err);
                //this.onSuccess(file)
            });
        } else {
            fs.appendFile(file, payload,  (err: any) => {
                if (err) this.onFailure(err);
                //this.onSuccess(file)
            });
        }
    }
}