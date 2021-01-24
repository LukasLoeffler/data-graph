import { Node } from "@baklavajs/core";


const intervals = [
    {text: "every 10 sec", value: "*/10 * * * * *"},
    {text: "every 20 sec", value: "*/20 * * * * *"},
    {text: "every 30 sec", value: "*/30 * * * * *"},
    {text: "every minute", value: "* * * * *"},
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
        this.addOutputInterface("onSuccess")
        this.addOption("CronExpression", "SelectOption", "INFO", undefined, {
            items:intervals
        })
        this.addOption("color", undefined, "#607565");
        this.addOption("running", undefined, true);
    }
}