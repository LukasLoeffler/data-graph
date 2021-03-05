import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { format } from 'date-fns'
import { getDb, storeLastValue } from "../../manager/mongo-manager";
var _ = require('lodash');

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
        super(name, NODE_TYPE, id, outputConnections);
        this.mapper = options.mapping.mappings;
        this.injections = inputConnctions.filter((connection: any) => connection.to.name.includes("inject"));

        NodeManager.addNode(this);
    }

    async execute(msgIn: Message) {
        storeLastValue(this.id, msgIn.payload);
        let newObject = await mapObject(msgIn.payload, this.mapper, ExecMode.EXEC, this.injections, this.sendConnectionExec);
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
                    let output = await mapObject(result.last, mapping, undefined, injections, sendConnectionExec);
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

export async function mapObject(input_object: any, mapping: any, mode: ExecMode = ExecMode.TEST, injections: any = [], sendConnectionExec: Function = () => {}): Promise<Object> {
    let newObject = {};

    for await (let mapper of mapping) {
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
        } else if (mapper.target.includes("unix")) {
            let date = new Date(_.get(input_object, mapper.source)* 1000);
            _.set(newObject, mapper.target, date);
        }
        else if (mapper.source.includes("inject")) {

            if (mode === ExecMode.EXEC) {
                injections.forEach((element: any) => {
                    sendConnectionExec(element.from.id, element.to.id);
                });
            }

            let injectNodeId = injections.find((inject: any) => inject.to.name === mapper.source).from.nodeId;
            let value = await NodeManager.getNodeById(injectNodeId).get();
            _.set(newObject, mapper.target, value);
        } else {
            _.set(newObject, mapper.target, _.get(input_object, mapper.source)); 
        }
    };
    return newObject;
}