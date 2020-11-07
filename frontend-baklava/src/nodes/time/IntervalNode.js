import { Node } from "@baklavajs/core";



export default class IntervalNode extends Node {
    type = "interval";
    name = "Interval";

    

    constructor() {
        super();
        this.addOption("OpenSettings", "SettingsOption");
    }

    addOutput(name) {
        this.addOutputInterface(name);
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
        data.interfaces.forEach(([k, v]) => {
            this.addOutputInterface(k);
            if (this.interfaces.has(k)) {
                this.interfaces.get(k).load(v);
            }
        });
        this.hooks.load.execute(data);
    }
}