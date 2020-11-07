var crypto = require("crypto");
import chalk from "chalk";
import { NodeManager } from "../nodes/node-manager";

const NODE_TYPE = "BASE_NDOE"

export class BaseNode {
    name: string;
    id: string;
    type: string;
    targetsSuccess: Array<any>
    targetsFailure: Array<any>

    constructor(name: string, type: string, id: string = "", targetsSuccess: Array<any> = [], targetsFailure: Array<any> = []) {
        this.name = name;
        this.type = type;
        if (id) this.id = id;
        else this.id = crypto.randomBytes(10).toString('hex');
        this.targetsSuccess = targetsSuccess;
        this.targetsFailure = targetsFailure;
    }

    public toString = () : string => {
        return `${this.type} (id: ${this.id}, name: ${this.name})`;
    }

    onSuccess(payload: any) {
        this.targetsSuccess.forEach(target => {
            NodeManager.getNodeById(target).execute(payload);
        });
    }

    onFailure(errorMessage: string = "No error message provided.") {
        this.targetsFailure.forEach(target => {
            NodeManager.getNodeById(target).execute(errorMessage);
        });
    }

    stop() {
        
    }

        /**
     * Options are generated by the frontend end therefore a source for errors.
     * This method checks the passed options of the constructor against the requiredOptions of this class.
     * @param options Passed options
     */
    validateOptions(options: any, requiredOptions: any) {
        requiredOptions.forEach((option: any) => {
            let cronExpression = options[option];
            if (!cronExpression) throw new Error(`${chalk.red(NODE_TYPE)}: Option '${option}' is not present`);
        });
    }

    /**
     * Extracts the optionValue for optionName
     * @param options 
     */
    getOption(optionName: string, options: any) {
        return options[optionName];
    }
}