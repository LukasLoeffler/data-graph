import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("HttpPostPut", {
    twoColumn: true,
    width: 200
})
    .addInputInterface("Payload")
    .addOutputInterface("onSuccess")
    .addOutputInterface("onFailure")
    .addOption("URL", "InputOption", "http://example.com")
    .build();
