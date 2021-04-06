import { getDb, storeLastValue } from "../../manager/mongo-manager";
import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { mapObject } from "./object-mapper-node";

const NODE_TYPE = "ARRAY_MAPPER"

export class ArrayMapperNode extends BaseNode {
    mapper: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);

        this.mapper = options.settings?.mapping;
        NodeManager.addNode(this);
    }

    async execute(msg: Message) {
        storeLastValue(this.id, msg.payload);
        let newObject = await mapObjectArray(msg.payload, this.mapper);
        this.onSuccess(newObject, msg.additional);
    }

    /**
     * Function to test the mapping against the latest input data. Output data is returned.
     * @param mapping Mapping to test
     */
    async test(mapping: any, res: any) {
        let query = { 
            _id: this.id
        };

        getDb().collection("last-values").findOne(query, async function(err: any, result: any) {
            if (err) res.status(404).send(err);
            if (result?.last) {
                if (Array.isArray(result.last)) {
                    let data = await mapObjectArray(result.last, mapping);
                    res.send(data); 
                }
            }
            else res.status(404).send(err);
        });
    }
}

async function mapObjectArray(array: Array<any>, mapping: any) {

    let output = [];
    for await (let element of array) {
        output.push(await mapObject(element, mapping));
    }
    return output;
}
