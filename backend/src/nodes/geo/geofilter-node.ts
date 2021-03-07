import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
import * as turf from '@turf/turf'
import { measure } from "../../decorators";


const NODE_TYPE = "GEOFILTER"

export class GeoFilterNode extends BaseNode {
    
    filterPolygon: any;
    latFilterField: string;
    lonFilterField: string;
    filterMode: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, outputConnections);
        try {
            //this.filterPolygon = turf.polygon(options.filter.geometry[0].geometry.coordinates);
            let coordArrays = options.filter.geometry.map((geom: any) => { return geom.geometry.coordinates });
            this.filterPolygon = turf.multiPolygon(coordArrays);
        } catch (error) {
            console.log(error);
            this.filterPolygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
        }
        this.filterMode = options.filter.filterMode;
        this.latFilterField = options.filter.sourceLat;
        this.lonFilterField = options.filter.sourceLon;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        let latField = this.latFilterField;
        let lonField = this.lonFilterField;
        let polygon = this.filterPolygon;
        let filterMode = this.filterMode;
        try {
            let output = msg.payload.filter((element: any) => {
                let point = turf.point([element[lonField], element[latField]])
                let within = turf.booleanPointInPolygon(point, polygon);
                return (filterMode) ? within : !within;  // Selection depends on INSIDE/OUTSIDE polygon mode
            });

            this.onSuccess(output, msg.additional);
        } catch (error) {
            console.log(error);
        }
    }
}