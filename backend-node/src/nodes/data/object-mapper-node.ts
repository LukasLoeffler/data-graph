import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const jsonUtils = require('./object-utils')


const NODE_TYPE = "JSON_MAPPER"

export class ObjectMapperNode extends BaseNode {
    mapper: any;


    constructor(name: string, id: string, mappingString: Array<string>, targetsSuccess: Array<string>, targetsFailure: Array<string>) {
        super(name, NODE_TYPE, id, targetsSuccess, targetsFailure)
        this.mapper = createMapper(mappingString);
        NodeManager.addNode(this);
    }

    execute(payload: any) {
        console.log("Type:", typeof payload)
        let newObject = mapObjectArray(payload, this.mapper);
        this.onSuccess(newObject);
    }
}

function createMapper(arr: Array<string>) {
    return arr.map((elem, index) => {
        elem = elem.replace(/ /g, "");
        if (!elem.includes("-->")) {
            throw {
                message: `'-->' not present on element ${index+1}`
            }
        }
        return {
            source: elem.split("-->")[0],
            target: elem.split( "-->")[1],
        }  
    })
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

