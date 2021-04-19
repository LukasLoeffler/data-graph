import { BaseNode } from "../base-node";
import { NodeManager } from "../../nodes/node-manager";
import { Message } from "../../message";
import { format } from "date-fns";
var ExcelJS = require('exceljs');
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

    buildFileName(payload: any) {
        let outputFilename = this.fileName;
        if(this.fileName.includes("${}")) console.log(this.fileName);
        let matches = this.fileName.match(/[^{\}]+(?=})/g);

        matches?.forEach(match => {
            outputFilename = outputFilename.replace('${'+match+'}', this.evaluateExpression(match, payload))
        });
        return outputFilename;
    }

    /**
     * If expression can be extracted from payload. Its expected to be a valid field to extracted.
     * If expression does not result in a truthy value, the expression is applied as datetime formatting for the
     * current timestamp.
     * If nothing matches the expression, the method throws an error.
     * @param expression The expression to be evaluated, either as payload property or time formatting expression.
     * @param payload Payload to check expression for
     * @returns Either the value of the extracted payload property or formatted time string
     */
    evaluateExpression(expression: string, payload: any): string {
        if (payload[expression]) {
            let expressionValue = payload[expression];
            if (typeof expressionValue !== "string") throw new Error("Extracted expression value must be string");
            return expressionValue;
        };
        return format(new Date(), expression)
    }

    execute(msg: Message) {
        try {
            let payload = msg.payload;
            let file = `${this.filePath}/${this.buildFileName(payload)}`

            if (this.fileType === "json") this.saveAsJson(file, msg)
            else if (this.fileType === "csv") this.saveAsCsv(file, msg);
            else if (this.fileType === "xslx") this.saveAsExcel(file, msg);
            else {
                fs.writeFile(file, payload, (err: any) => {
                    if (err) this.onFailure(err, msg.additional, true);
                });
            }
        } catch (error) {
            this.onFailure(error.message, msg.additional, true);
        }
    }

    saveAsJson(filePath: string, msg: Message) {
        fs.writeFile(filePath, JSON.stringify(msg.payload, null, 4), (err: any) => {
            if (err) this.onFailure(err, msg.additional, true);
        });
    }

    saveAsCsv(filePath: string, msg: Message) {
        try {
            let fileExists = fs.existsSync(filePath);

            let prependHeader = !fileExists || !this.append;
            converter.json2csv(msg.payload, { prependHeader: prependHeader }, (err: any, csv: any) => {
                if (fs.existsSync(filePath) && this.append) {
                    fs.appendFile(filePath, "\n" + csv, (err: any) => {
                        if (err) this.onFailure(err, msg.additional, true);
                    });
                } else {
                    fs.writeFile(filePath, csv, (err: any) => {
                        if (err) this.onFailure(err, msg.additional, true);
                    });
                }
            });
        } catch (error) {
            this.onFailure(error.message, msg.additional, true);
        }
    }

    saveAsExcel(filePath: string, msg: Message) {
        let workbook = new ExcelJS.Workbook();

        workbook.xlsx.readFile(filePath)
        .then(function () {
            let worksheet = workbook.worksheets[0];
            worksheet.addRow(Object.values(msg.payload));
            workbook.xlsx.writeFile(filePath);
        })
        .catch((error: any) =>  {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('My Sheet');
            let worksheet = workbook.worksheets[0];
            worksheet.addRow(Object.values(msg.payload));
            workbook.xlsx.writeFile(filePath);
        });
    }
}