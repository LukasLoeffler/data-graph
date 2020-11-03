var crypto = require("crypto");
import { NodeManager } from "../nodes/node-manager";

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
}