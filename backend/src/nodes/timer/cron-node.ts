const cron = require('node-cron');
import { NodeManager } from "../node-manager";
import { BaseNode } from "../base-node";
import chalk from "chalk";


const NODE_TYPE = "CRON"

export class CronNode extends BaseNode{
    cronExpression: string;
    task: any;
    running: boolean


    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);

        this.cronExpression = this.getOption("cronexpression", options);
        this.running = this.getOption("running", options);

        
        try {
            this.task = this.createTask();
            if (this.running) this.start(true);
        } catch (error) {
            console.log(`Cron expression ${chalk.red(this.cronExpression)} is invalid. Using default now (1 minute interval)`);
            this.cronExpression = "* * * * *";
            this.task = this.createTask();
            if (this.running) this.start(true);
        }
        
        NodeManager.addNode(this);
    }

    createTask() {
        return cron.schedule(this.cronExpression, () =>  {
            this.on("onCron", new Date());
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

    reset() {
        console.log(`Cron Node ${chalk.cyan(this.id)} resetted.`);
        this.task.stop();
        this.cronExpression = "* * * * *";
        this.task = this.createTask();
        return true;
    }
}