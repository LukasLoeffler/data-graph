import { Node } from "@baklavajs/core";



export default class AggregatorNode extends Node {
    type = "aggregator";
    name = "Aggregator";

    

    constructor() {
        super();
        this.addOption("OpenSettings", "SettingsOption");
    }

    addInput(name) {
        this.addInputInterface(name);
    }

    load(data) {
        this.id = data.id;
        this.name = data.name;
        this.state = data.state;
        data.options.forEach(([k, v]) => {
            if (this.options.has(k)) {
                this.options.get(k).value = v;
            }
        });

        console.log(data.interfaces);
        data.interfaces.forEach(([k, v]) => {
            this.addInputInterface(k);
            if (this.interfaces.has(k)) {
                this.interfaces.get(k).load(v);
            }
        });
        this.hooks.load.execute(data);
    }
}