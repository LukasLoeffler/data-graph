import { getDb, storeLastValue } from "../../manager/mongo-manager";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
var _ = require('lodash');

import { mapObject } from "./object-mapper-node";

const NODE_TYPE = "ARRAY_MAPPER"

export class ArrayMapperNode extends BaseNode {
    mapper: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);

        this.mapper = options.mapping.mappings;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        storeLastValue(this.id, msg.payload);
        let newObject = mapObjectArray(msg.payload, this.mapper);
        this.onSuccess(newObject, msg.additional);
    }

    /**
     * Function to test the mapping against the latest input data. Output data is returned.
     * @param mapping Mapping to test
     */
    test(mapping: any, res: any) {
        let query = { 
            _id: this.id
        };

        getDb().collection("last-values").findOne(query, function(err: any, result: any) {
            if (err) res.status(404).send(err);
            if (result?.last) {
                if (Array.isArray(result.last)) {
                    res.send(mapObjectArray(result.last.slice(0, 10), mapping)); 
                }
            }
            else res.status(404).send(err);
        });
    }
}

function mapObjectArray(array: Array<any>, mapping: any) {
    return array.map(elem => {
        return mapObject(elem, mapping);
    });
}
