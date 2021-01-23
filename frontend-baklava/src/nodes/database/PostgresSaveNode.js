import { Node } from "@baklavajs/core";


export default class PostgresSaveNode extends Node {
    type = "postgresSave";
    name = "Postgres Save";

    constructor() {
        super();
        this.addInputInterface("Payload");
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("connection", "PostgresInsertDialog", {
            name: "Processor", 
            host: "localhost", 
            port: 5432, 
            database: "processor", 
            user: "postgres", 
            password: "", 
            table: "processor"
        });
        this.addOption("color", undefined, "#423dd9");
    }

    save() {
        const state = super.save();
        state.interfaces.forEach(([name, intfState]) => {
            intfState.isInput = this.getInterface(name).isInput;
        });
        return state;
    }

    load(state) {
        state.interfaces.forEach(([name, intfState]) => {
            const intf = intfState.isInput ? this.addInputInterface(name) : this.addOutputInterface(name);
            intf.id = intfState.id;
        });
        super.load(state);
    }
}