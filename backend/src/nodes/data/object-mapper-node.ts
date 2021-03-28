import { set, get } from 'lodash';
import { format } from 'date-fns'

import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { getDb, storeLastValue } from "../../manager/mongo-manager";


enum ExecMode {
    TEST = "TEST",
    EXEC = "EXEC"
}


const NODE_TYPE = "OBJECT_MAPPER"

export class ObjectMapperNode extends BaseNode {
    mapper: any;
    lastValue: any = {};
    injections: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = [], inputConnctions: Array<any>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.mapper = options.settings?.mapping;
        this.injections = inputConnctions.filter((connection: any) => connection.to.name.includes("inject"));

        NodeManager.addNode(this);
    }

    
    async execute(msgIn: Message) {
        storeLastValue(this.id, msgIn.payload);
        let newObject = await mapObject(msgIn.payload, this.mapper, ExecMode.EXEC);
        this.onSuccess(newObject, msgIn.additional);
    }

    test(mapping: any, res: any) {
        let query = { 
            _id: this.id
        };

        // Copy for access in arrow function
        let injections = this.injections;
        let sendConnectionExec = this.sendConnectionExec;

        getDb().collection("last-values").findOne(query, async function(err: any, result: any) {
            if (err) res.status(404).send(err);
            else {
                if (Array.isArray(result.last)) {
                    res.send(mapObject(result.last.slice(0, 10), mapping));
                } else {
                    let output = await mapObject(result.last, mapping, undefined);
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
        set(newObject, mapper.target, datetimeStringOut);
    } catch {
        set(newObject, mapper.target, "Wrong encoding");
    }
}

export async function mapObject(input_object: any, mapping: any, mode: ExecMode = ExecMode.TEST): Promise<Object> {
    let newObject = {};

    for await (let mapper of mapping) {
        if (mapper.source.includes("'")) {
            // If source is string set string as value
            set(newObject, mapper.target, mapper.source.replace(/'/g, ''));
        } else if (mapper.source.includes("{{time}}")) {
            //check for {{time}} only temporary until a better concept is implemented
            set(newObject, mapper.target, new Date());
        } else if (mapper.source.includes("{{time-")) {
            setCustomTime(mapper, newObject);
        } else if (mapper.source.includes("{{payload}}")) {
            set(newObject, mapper.target, input_object);
        } else if (mapper.source === ".") {
            set(newObject, mapper.target, input_object);
        } else if (mapper.target.includes("unix")) {
            let date = new Date(get(input_object, mapper.source)* 1000);
            set(newObject, mapper.target, date);
        } else if (mapper.target.includes("unix")) {
            let date = new Date(get(input_object, mapper.source)* 1000);
            set(newObject, mapper.target, date);
        } else if (mapper.target === ".") {
            newObject = get(input_object, mapper.source);
        } else {
            set(newObject, mapper.target, get(input_object, mapper.source)); 
        }
    };
    return newObject;
}