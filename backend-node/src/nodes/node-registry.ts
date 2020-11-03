import { BaseNode } from "./base-node";

import { CronNode } from "./timer/cron-node"
import { LoggingNode } from "./logging/logging-node"
import { HttpNode } from "./http/http-node"
import { FileSaveNode } from "./filesystem/save-file-node"
import { ObjectPathNode } from "./data/json-path-node"
import { ObjectMapperNode } from "./data/object-mapper-node"
import { FilterNode } from "./data/filter-node"
import { ButtonNode } from "./button/button-node";


class RegEntry {
    name: string;
    category: string;
    clss: any;
    socketIn: Array<any>;
    socketOut: Array<any>;

    constructor(name: string, category: string, clss: any, socketIn: Array<any>, socketOut: Array<any>) {
        this.name = name;
        this.category = category;
        this.clss = clss;
        this.socketIn = socketIn;
        this.socketOut = socketOut;
    }

    repr() {
        return {
            name: this.name,
            category: this.category,
            socketIn: this.socketIn,
            socketOut: this.socketOut
        }
    }
}

let advancedRegistry: Array<RegEntry> = [
    new RegEntry("cron", "time", CronNode, [], ["event"]),
    new RegEntry("logging", "logging", LoggingNode, ["input"], ["success"]),
    new RegEntry("httpGet", "http", HttpNode, ["input"], ["success", "failure"]),
    new RegEntry("fileSave", "fileSystem", FileSaveNode, ["input"], ["success"]),
    new RegEntry("objectPath", "object", ObjectPathNode, ["input"], ["success", "failure"]),
    new RegEntry("objectMapper", "object", ObjectMapperNode, ["input"], ["success"]),
    new RegEntry("objectFilter", "object", FilterNode, ["input"], ["success"]),
    new RegEntry("button", "object", ButtonNode, [], ["success"]),
]

export class NodeRegistry {
    static getClassByName(name: any) {
        let cls = advancedRegistry.find(regEntry => regEntry.name === name);
        if (!cls) {
            throw new Error(`Class '${name}' not registered.`)
        }
        return cls;
    }

    static getAvailableNodes() {
        return advancedRegistry.map(regEntry => {
            return regEntry.repr()
        });
    }
}
