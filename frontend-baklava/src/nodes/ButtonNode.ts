import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("button")
    .setName("Button")
    .addOption("BtnEvent", "EventButtonOption", undefined, undefined, {
        title: "Exec", 
        value: "exec1",
    })
    .addOutputInterface("onSuccess")
    .build();
