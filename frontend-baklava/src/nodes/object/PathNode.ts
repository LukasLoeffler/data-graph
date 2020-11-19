import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("objectPath", {
    twoColumn: true,
    width: 200
})  
    .addInputInterface("payload", undefined, undefined, {type: "Message"})
    .addOutputInterface("onSuccess")
    .addOutputInterface("onFailure")
    .addOption("Path", "InputOption")
    .build();
