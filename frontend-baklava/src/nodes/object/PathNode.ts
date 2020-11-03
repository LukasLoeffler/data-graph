import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("objectPath", {
    twoColumn: true,
    width: 200
})  
    .addInputInterface("payload")
    .addOutputInterface("onSuccess")
    .addOutputInterface("onFailure")
    .addOption("Path", "InputOption")
    .build();
