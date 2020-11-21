const cron = require('node-cron');
import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import { Message } from "../../message";



const NODE_TYPE = "CRON"
const requiredOptions = ["CronExpression"];

export class CronNode extends BaseNode{
    cronExpression: string;
    task: any;


    constructor(name: string, id: string, options: any, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, []);
        this.validateOptions(options, requiredOptions);
        this.cronExpression = this.getOption("CronExpression", options);
        this.task = this.createTask();
        this.startTask();
        NodeManager.addNode(this);
    }

    createTask() {
        return cron.schedule(this.cronExpression, () =>  {
            let msgOut = new Message(this.id, NODE_TYPE, null)
            this.onSuccess(msgOut);
        }, {
            scheduled: false
        });
    }

    startTask() {
        this.task.start();
    }

    // Routine to stop/kill the task after reload.
    stop() {
        console.log("Cron Task Stopped")
        this.task.stop();
    }
}