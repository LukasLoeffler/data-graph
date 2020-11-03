import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("httpGet", {
    twoColumn: true,
    width: 200
})
    .addInputInterface("Event")
    .addOutputInterface("onSuccess")
    .addOutputInterface("onFailure")
    .addOption("URL", "InputOption", "http://example.com")
    .build();
