import { set, get } from 'lodash';
import { format as dateformat } from 'date-fns'

import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { getDb, storeLastValue } from "../../manager/mongo-manager";


enum ExecMode {
    TEST = "TEST",
    EXEC = "EXEC"
}


const NODE_TYPE = "ADVANCED-MAPPER"

export class AdvancedMapperNode extends BaseNode {
    mapping: any;
    lastValue: any = {};
    injections: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = [], inputConnctions: Array<any>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.mapping = options.settings?.mapping;
        //console.log(this.mapper);
        NodeManager.addNode(this);
    }

    
    async execute(msgIn: Message) {
        storeLastValue(this.id, msgIn.payload);
        let newObject = await this.mapInput(msgIn.payload);
        this.onSuccess(newObject, msgIn.additional);
    }

    mapObject(input_object: any) {
        let newObject = {};
        this.mapping.forEach((mapper: any) => {

            let source = null;

            if (mapper.action === "inject") {
                let injection = mapper.injection;

                if (injection.type === "time") {
                    if (injection.value) source = this.getTimeAsString(injection.value);
                    else source = new Date();
                }
                if (injection.type === "data") {
                    if (injection.value) source = JSON.parse(injection.value);
                }
            }

            if (mapper.action === "move") {
                source = (mapper.source !== ".") ? get(input_object, mapper.source) : input_object;
            }

            if (mapper.action === "format") {
                source = get(input_object, mapper.source);
                //source = parseFloat(source);
                source = parseInt(source);
            }

            if (mapper.action === "function") {
                let payload = input_object;
                let func = new Function('payload', mapper.function.function)
                source = func(payload);
            }

            set(newObject, mapper.target, source);

            if (mapper.target === ".") {
                newObject = source;
            }
        });
        return newObject;
    }

    async mapInput(inputData: any): Promise<any> {
        let output = undefined;

        if (Array.isArray(inputData)) {
            output = inputData.map((elem: any) => {
                return this.mapObject(elem);
            });
        } else {
            output = this.mapObject(inputData)
        }
        return output;
    }

    getTimeAsString(format: string) {
        return dateformat(new Date(), format);
    }
}

