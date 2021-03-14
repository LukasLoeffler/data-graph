import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";

import { booleanPointInPolygon } from "@turf/turf"
import { point as turfPoint, multiPolygon } from '@turf/helpers'
import { storeLastValue } from "../../manager/mongo-manager";


const NODE_TYPE = "GEOFILTER"

export class GeoFilterNode extends BaseNode {
    
    options: any;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.options = options;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let latFilterField = this.options.filter.sourceLat || undefined;
        let lonFilterField = this.options.filter.sourceLon || undefined;
        try {
            storeLastValue(this.id, msg.payload);
            const coordArrays = this.options.filter.geometry.map((geom: any) => { return geom.geometry.coordinates });
            let filterPolygon = multiPolygon(coordArrays);
            let filterMode = this.options.filter.filterMode;
        
            let output = msg.payload.filter((element: any) => {
                let point = turfPoint([element[lonFilterField], element[latFilterField]])
                let within = booleanPointInPolygon(point, filterPolygon);
                return (filterMode) ? within : !within;  // Selection depends on INSIDE/OUTSIDE polygon mode
            });

            this.onSuccess(output, msg.additional);
        } catch (error) {
            if (error.message === "Cannot read property 'map' of null") {
                let message = `No filter polygon set in ${this.id}`
                this.onFailure(message, msg.additional);
            } else if (error.message === "coordinates must contain numbers"){
                let message = `Coordinate properties '${latFilterField}' and/or '${lonFilterField}' don't match the input. Node: ${this.id} (${this.name})`
                this.onFailure(message, msg.additional);
            } else if (error.message === "Cannot read property 'geometry' of null") {
                let message = `Node settings not set. Node: ${this.id}`
                this.onFailure(message, msg.additional);
            } else {
                this.onFailure(error.message, msg.additional);
            }
        }
    }
}