import { NodeBuilder } from "@baklavajs/core";

export default new NodeBuilder("fileSave", {
    twoColumn: true,
    width: 200
})
    .addInputInterface("Payload")
    .addOption("Path", "InputOption")
    .addOption("Filename", "InputOption", "example")
    .addOption("Filetype", "SelectOption", "json", undefined, {
        items: [ "json"]
    })
    .build();
