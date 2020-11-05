import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("cron", {
    twoColumn: true,
    width: 200
})
    .addOutputInterface("onSuccess")
    .addOption("CronExpression", "InputOption", "* * * * *")
    .build();
