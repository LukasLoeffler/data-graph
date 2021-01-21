import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
const fs = require('fs');
const converter = require('json-2-csv');

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

    execute(msgIn: Message) {
        
        let payload = msgIn.payload;
        let datetime = new Date().toISOString().replace(/:/g, "-")
        let file = `${this.filePath}/${this.fileName}-${datetime}.${this.fileType}`
        if (this.fileType === "json") {
            fs.writeFile(file, JSON.stringify(payload,  null, 4),  (err: any) => {
                if (err) this.onFailure(err);
                //this.onSuccess(file)
            });
        } else if (this.fileType === "csv") {
            this.writeToCsv(payload, file);
        } else {
            fs.writeFile(file, payload,  (err: any) => {
                if (err) this.onFailure(err);
                //this.onSuccess(file)
            });
        }
    }


    writeToCsv(payload: any, filePath: string) {
        converter.json2csv(payload, (err: any, csv: any) => {
            if (err) {
                throw err;
            }
            // write CSV to a file
            fs.writeFileSync(filePath, csv);
            
        });
    }
}