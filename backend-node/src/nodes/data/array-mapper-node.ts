import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
var _ = require('lodash');

import { mapObject } from "./object-mapper-node";

const NODE_TYPE = "ARRAY_MAPPER"

export class ArrayMapperNode extends BaseNode {
    mapper: any;
    lastValue: any = [];

    constructor(name: string, id: string, options: any, targetsSuccess: Array<string>, targetsFailure: Array<string>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure);

        this.mapper = options.mapping.mappings;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        this.lastValue = msgIn.payload;
        let newObject = mapObjectArray(msgIn.payload, this.mapper);
        let msgOut = new Message(this.id, NODE_TYPE, newObject);
        this.onSuccess(msgOut);
    }

    getLastValue() {
        return this.lastValue.slice(0, 10);  // Limiting the size of the array to the last 10 values (performance)
    }

    /**
     * Function to test the mapping against the latest input data. Output data is returned.
     * @param mapping Mapping to test
     */
    test(mapping: any) {
        return mapObjectArray(this.lastValue, mapping).slice(0, 10);  // Same limitation for the test
    }
}

function mapObjectArray(array: Array<any>, mapping: any) {
    return array.map(elem => {
        return mapObject(elem, mapping);
    });
}
