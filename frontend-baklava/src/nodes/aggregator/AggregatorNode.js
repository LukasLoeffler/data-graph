import { Node } from "@baklavajs/core";



export default class AggregatorNode extends Node {
    type = "aggregator";
    name = "Aggregator";

    constructor() {
        super();
        this.addOption("OpenSettings", "SettingsOption");
        this.addOutputInterface("onSuccess", "Message");
    }

    addInput(name) {
        this.addInputInterface(name);
        
    }

    load(data) {
        this.id = data.id;
        this.name = data.name;
        this.state = data.state;

        data.interfaces.forEach(([k, v]) => {

            if(k.includes("IN") || k.includes("in")) {
                this.addInputInterface(k);
            }
            
            if (this.interfaces.has(k)) {
                this.interfaces.get(k).load(v);
            }
        });
        data.options.forEach(([k, v]) => {
            if (this.options.has(k)) {
                this.options.get(k).value = v;
            }
        });
        this.hooks.load.execute(data);
    }

}