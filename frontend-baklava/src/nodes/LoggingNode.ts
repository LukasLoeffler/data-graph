import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("logging", {
    twoColumn: true,
    width: 200
})  
    .addInputInterface("event")
    .addOutputInterface("onSuccess")
    .addOption("Operation", "SelectOption", "INFO", undefined, {
        items: [ "INFO", "WARN", "DANGER" ]
    })
    .build();
