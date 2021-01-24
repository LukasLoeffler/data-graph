const cron = require('node-cron');
import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import { Message } from "../../message";
import chalk from "chalk";


const NODE_TYPE = "CRON"
const requiredOptions = ["cronexpression"];

export class CronNode extends BaseNode{
    cronExpression: string;
    task: any;
    running: boolean


    constructor(name: string, id: string, options: any, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, []);

        this.validateOptions(options, requiredOptions);
        this.cronExpression = this.getOption("cronexpression", options);
        this.running = this.getOption("running", options);

        this.task = this.createTask();

        if (this.running) this.start(true);
        NodeManager.addNode(this);
    }

    createTask() {
        return cron.schedule(this.cronExpression, () =>  {
            let msgOut = new Message(this.id, NODE_TYPE, "")
            this.onSuccess(msgOut);
        }, {
            scheduled: false
        });
    }

    start(initial = false) {
        if (!initial) console.log(`Cron Node ${chalk.cyan(this.id)} started.`)
        this.task.start();
        this.running = true;
        return this.running;
    }

    // Routine to stop/kill the task after reload.
    stop() {
        console.log(`Cron Node ${chalk.cyan(this.id)} stopped.`)
        this.task.stop();
        this.running = false;
        return this.running;
    }
}