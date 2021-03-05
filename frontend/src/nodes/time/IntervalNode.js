import { Node } from "@baklavajs/core";
import { store } from '../../main';


const intervals = [
    {text: "every 10 sec", value: "*/10 * * * * *"},
    {text: "every 20 sec", value: "*/20 * * * * *"},
    {text: "every 30 sec", value: "*/30 * * * * *"},
    {text: "Every Minute", value: "* * * * *"},
    {text: "every 5 min", value: "*/5 * * * *"},
    {text: "every 10 min", value: "*/10 * * * *"},
    {text: "every 15 min", value: "*/15 * * * *"},
    {text: "every 20 min", value: "*/15 * * * *"},
    {text: "every 30 min", value: "*/15 * * * *"},
    {text: "every hour", value: "*/60 * * * *"}
]

export default class IntervalNode extends Node {
    type = "interval";
    name = "Interval";


    constructor() {
        super();
        this.addOutputInterface("onCron")
        this.addOption("CronExpression", "SelectOption", intervals[3].value, undefined, {
            items:intervals
        })
        this.addOption("color", undefined, "#607565");
        this.addOption("running", undefined, true);

        this.events.update.addListener(this, () => {
            store.commit("saveNodeConfig", this.id);
        });
    }
}