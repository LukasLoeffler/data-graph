import { Node } from "@baklavajs/core";


export default class CsvToJsonNode extends Node {
    type = "csv-to-json";
    name = "CSV to JSON";

    constructor() {
        super();
        this.addInputInterface("Payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("color", undefined, "#7eb342");
        this.addOption("running", undefined, true);
    }
}