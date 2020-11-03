const cron = require('node-cron');
import { NodeManager } from "../node-manager";

import { BaseNode } from "../base-node";


const NODE_TYPE = "CRON"


export class CronNode extends BaseNode{
    cronExpression: string;
    task: any;
    
    constructor(name: string, id: string, cronExpression: string, targetsSuccess: any) {
        super(name, NODE_TYPE, id, targetsSuccess, [])
        this.cronExpression = cronExpression;
        this.task = this.createTask(cronExpression);
        this.startTask();
        NodeManager.addNode(this);
    }

    createTask(cronExpression: any) {
        return cron.schedule(cronExpression, () =>  {
            this.onSuccess(`Payload ${new Date()}`);
        }, {
            scheduled: false
        });
    }

    changeTask(newCronExpression: string) {
        console.log(`Changing CRON to: ${newCronExpression}`)
        if (cron.validate(newCronExpression)) {
            console.log("Valid")
        } else {
            console.log("Invalid")
        }
        this.task.destroy();
        this.cronExpression = newCronExpression;
        this.task = this.createTask(newCronExpression);
        this.startTask();
    }

    startTask() {
        this.task.start();
    }

    stop() {
        console.log("Cron Task Stopped")
        this.task.stop();
    }
}