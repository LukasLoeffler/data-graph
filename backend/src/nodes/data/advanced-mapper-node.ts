import { set, get } from 'lodash';
import { format as dateformat } from 'date-fns'

import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import { storeLastValue } from "../../manager/mongo-manager";


const NODE_TYPE = "ADVANCED-MAPPER"

export class AdvancedMapperNode extends BaseNode {
    mapping: any;
    lastValue: any = {};
    injections: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.mapping = options.settings?.mapping;
        NodeManager.addNode(this);
    }

    async execute(msg: Message) {
        storeLastValue(this.id, { ...msg.payload });
        try {
            let newObject = await this.mapInput(msg.payload);
            this.onSuccess(newObject, msg.additional);
        } catch (error) {
            this.onFailure(error.message, msg.additional, true);
        }

    }

    /**
     * Takes inputData and tries to apply the mapping onto it returning the mapped object.
     * Checks whether input is array or object. If input is array each element is mapped.
     * @param inputData Data to map
     * @returns Mapped result.
     */
    async mapInput(inputData: any): Promise<any> {
        let output = undefined;

        if (Array.isArray(inputData)) output = inputData.map((elem: any) => this.mapObject(elem));
        else output = this.mapObject(inputData)
        return output;
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
            
            // Formatting is not implemented yet
            if (mapper.action === "format") {
                source = get(input_object, mapper.source);
                //source = parseFloat(source);
                source = parseInt(source);
            }

            if (mapper.action === "function") {
                try {
                    let payload = input_object;
                    let func = new Function('payload', mapper.function.function)
                    source = func(payload);
                } catch (error) {
                    let errorMessage = `Function mapper exception in function '${mapper?.function?.name}' --> ${error.message}`;
                    throw new Error(errorMessage);
                }
            }

            set(newObject, mapper.target, source);

            if (mapper.target === ".") {
                newObject = source;
            }
        });
        return newObject;
    }


    getTimeAsString(format: string) {
        return dateformat(new Date(), format);
    }
}

