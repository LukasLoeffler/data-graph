import { Node } from "@baklavajs/core";


export default class PostgresSaveNode extends Node {
    type = "postgres-save";
    name = "Postgres Save";

    constructor() {
        super();
        this.addInputInterface("Payload", undefined, undefined, {type: "JSON"});
        this.addOutputInterface("onSuccess");
        this.addOutputInterface("onFailure");
        this.addOption("settings", "PostgresInsertDialog", { 
            connection: {
                name: "Processor", 
                host: "localhost", 
                port: 5432, 
                database: "processor", 
                user: "postgres", 
                password: "admin", 
                table: "processor",
            },
            mapping: [
                { source: "sourceProperty", column: "targetColumn" }
            ]
        });
        this.addOption("color", undefined, "#3F51B5");
        this.addOption("running", undefined, true);
    }

    save() {
        const state = super.save();
        state.interfaces.forEach(([name, intfState]) => {
            intfState.isInput = this.getInterface(name).isInput;
            intfState.type = this.getInterface(name).type;
        });
        return state;
    }

    load(state) {
        state.interfaces.forEach(([name, intfState]) => {
            const intf = intfState.isInput ? this.addInputInterface(name) : this.addOutputInterface(name);
            intf.id = intfState.id;
            intf.type = intfState.type;
        });
        super.load(state);
    }
}