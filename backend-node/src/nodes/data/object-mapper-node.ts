import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const jsonUtils = require('./object-utils')


const NODE_TYPE = "JSON_MAPPER"

export class ObjectMapperNode extends BaseNode {
    mapper: any;


    constructor(name: string, id: string, options: any, targetsSuccess: Array<string>, targetsFailure: Array<string>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure);

        this.mapper = options.mapping.mappings;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        let newObject = mapObjectArray(msgIn.payload, this.mapper);
        let msgOut = new Message(this.id, NODE_TYPE, newObject);
        this.onSuccess(msgOut);
    }
}

function mapObjectArray(array: Array<any>, mapping: any) {
    return array.map(elem => {
        return mapObject(elem, mapping);
    });
}

/**
 * 
 * @param {Object} input_object The input object which should be mapped into another form
 * @param {*} mapping The mapping object which holds the maps
 * @param {String} mode Can be "explicit" and "implicit". 
 * Implicit mode takes input object and applies the changes onto it.
 * Explicit mode creates a new object containing only the explicitly defined fields
 */
function mapObject(input_object: any, mapping: any, mode = "explicit") {
    let newObject = {};
    if (mode == "implicit") {
        newObject = input_object;
    }
    mapping.forEach((mapper: any) => {
        jsonUtils.setValue(newObject, mapper.target, jsonUtils.getValue(input_object, mapper.source));
        if (mode === "implicit") {
            jsonUtils.setValue(input_object, mapper.source, undefined);
        }
    });
    return newObject;
}

