import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { format } from 'date-fns'
import { da } from "date-fns/locale";
var _ = require('lodash');


const NODE_TYPE = "OBJECT_MAPPER"

export class ObjectMapperNode extends BaseNode {
    mapper: any;
    lastValue: any = {};

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);

        this.mapper = options.mapping.mappings;
        NodeManager.addNode(this);
    }

    execute(msgIn: Message) {
        this.lastValue = msgIn.payload;
        let newObject = mapObject(msgIn.payload, this.mapper);
        this.onSuccess(newObject, msgIn.additional);
    }

    getLastValue() {
        if (Array.isArray(this.lastValue)) {
            return this.lastValue.slice(0, 10);
        }
        return this.lastValue;
    }

    test(mapping: any, res: any) {
        if (Array.isArray(this.lastValue)) {
            res.send(mapObject(this.lastValue.slice(0, 10), mapping));
        } else {
            let result = mapObject(this.lastValue, mapping);
            res.send(result);
        }
    }
}

function setCustomTime(mapper: any, newObject: object) {
    try {
        let timeCode = mapper.source.replace("{{time-", "").replace("}}", "");  // Extract time code
        let datetimeStringOut = format(new Date(), timeCode)
        _.set(newObject, mapper.target, datetimeStringOut);
    } catch {
        _.set(newObject, mapper.target, "Wrong encoding");
    }
}


export function mapObject(input_object: any, mapping: any, mode = "explicit") {
    let newObject = {};
    if (mode == "implicit") {
        newObject = input_object;
    }
    mapping.forEach((mapper: any) => {
        if (mapper.source.includes("'")) {
            // If source is string set string as value
            _.set(newObject, mapper.target, mapper.source.replace(/'/g, ''));
        } else if (mapper.source.includes("{{time}}")) {
            //check for {{time}} only temporary until a better concept is implemented
            _.set(newObject, mapper.target, new Date());
        } else if (mapper.source.includes("{{time-")) {
            setCustomTime(mapper, newObject);
        } else if (mapper.source.includes("{{payload}}")) {
            _.set(newObject, mapper.target, input_object);
        } else if (mapper.target.includes("unix")) {
            let date = new Date(_.get(input_object, mapper.source)* 1000);
            _.set(newObject, mapper.target, date);
        } else {
            // If source is path set origin as value
            _.set(newObject, mapper.target, _.get(input_object, mapper.source));
        }

        if (mode === "implicit") {
            _.set(input_object, mapper.source, undefined);
        }
    });
    return newObject;
}
