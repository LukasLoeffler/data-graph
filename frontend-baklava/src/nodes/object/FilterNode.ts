import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("objectFilter", {
    twoColumn: true,
    width: 200
})  
    .addInputInterface("payload")
    .addOutputInterface("onSuccess")
    .addOption("FilterExpression", "InputOption")
    .build();
