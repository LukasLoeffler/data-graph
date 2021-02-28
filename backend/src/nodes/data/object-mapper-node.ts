import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { format } from 'date-fns'
import { da } from "date-fns/locale";
import { getDb, storeLastValue } from "../../manager/mongo-manager";
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

        storeLastValue(this.id, msgIn.payload);
        let newObject = mapObject(msgIn.payload, this.mapper);
        this.onSuccess(newObject, msgIn.additional);
    }

    test(mapping: any, res: any) {
        let query = { 
            _id: this.id
        };

        getDb().collection("last-values").findOne(query, function(err: any, result: any) {
            if (err) res.status(404).send(err);
            else {
                if (Array.isArray(result.last)) {
                    res.send(mapObject(result.last.slice(0, 10), mapping));
                } else {
                    let output = mapObject(result.last, mapping);
                    res.send(output);
                }
            }
        });
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
        } else if (mapper.source === ".") {
            _.set(newObject, mapper.target, input_object);
        } else if (mapper.target.includes("unix")) {
            let date = new Date(_.get(input_object, mapper.source)* 1000);
            _.set(newObject, mapper.target, date);
        }
        else if (mapper.target === ".") {
            newObject = input_object[mapper.source];
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
