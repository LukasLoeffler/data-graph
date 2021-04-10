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
    append: boolean;
    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);

        this.fileName = options.settings?.filename;
        this.fileType = options.settings?.filetype;
        this.filePath = options.settings?.path;
        this.append = options.settings?.append;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let payload = msg.payload;
        let datetime = new Date().toISOString().replace(/:/g, "-")
        let file = `${this.filePath}/${this.fileName}-${datetime}.${this.fileType}`

        if (this.append) file = `${this.filePath}/${this.fileName}.${this.fileType}`;

        // FileType JSON: saving json
        if (this.fileType === "json") {
            fs.writeFile(file, JSON.stringify(payload,  null, 4),  (err: any) => {
                if (err) {
                    this.onFailure(err, msg.additional, true);
                } else {
                    this.onSuccess(payload, msg.additional);
                }
            });
        } else if (this.fileType === "csv") {
            this.writeToCsv(payload, file, msg);
        } else {
            fs.writeFile(file, payload,  (err: any) => {
                if (err) {
                    this.onFailure(err, msg.additional, true);
                } else {
                    this.onSuccess(payload, msg.additional);
                }
            });
        }
    }


    writeToCsv(payload: any, filePath: string, msg: Message) {
        try {
            let fileExists = fs.existsSync(filePath);

            converter.json2csv(payload, { prependHeader: !fileExists}, (err: any, csv: any) => {
                if (err) throw new Error(err);
                else {
                    if (fs.existsSync(filePath)) {
                        fs.appendFile(filePath, "\n"+csv, (err: any) => {
                            if (err) throw new Error(err);
                            else this.onSuccess(payload, msg.additional);
                        })
                    } else {
                        fs.writeFileSync(filePath, csv);
                        this.onSuccess(csv, msg.additional);
                    }
                }
            });
        } catch (error) {
            this.onFailure(error.message, msg.additional, true);
            console.log(error);
        }
    }
}