import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
var _ = require('lodash');

import { mapObject } from "./object-mapper-node";

const NODE_TYPE = "ARRAY_MAPPER"

export class ArrayMapperNode extends BaseNode {
    mapper: any;
    lastValue: any = [];

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);

        this.mapper = options.mapping.mappings;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        this.lastValue = msg.payload;
        let newObject = mapObjectArray(msg.payload, this.mapper);
        this.onSuccess(newObject, msg.additional);
    }

    getLastValue() {
        if (this.lastValue) {
            return this.lastValue.slice(0, 10);  // Limiting the size of the array to the last 10 values (performance)
        } else {
            return [];
        }
        
    }

    /**
     * Function to test the mapping against the latest input data. Output data is returned.
     * @param mapping Mapping to test
     */
    test(mapping: any, res: any) {
        res.send(mapObjectArray(this.lastValue, mapping).slice(0, 10));  // Same limitation for the test
    }
}

function mapObjectArray(array: Array<any>, mapping: any) {
    return array.map(elem => {
        return mapObject(elem, mapping);
    });
}
