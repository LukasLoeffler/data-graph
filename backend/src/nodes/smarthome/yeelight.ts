import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const { toggle } = require('yeelight.io');
const { on } = require('yeelight.io');
const { off } = require('yeelight.io');
const { brightness } = require('yeelight.io');
const { color } = require('yeelight.io');
const { Bulb } = require('yeelight.io');




const NODE_TYPE = "YEELIGHT"

enum Mode {
    ON = "on",
    OFF = "off",
    TOGGLE = "toggle",
    COLOR = "color",
    BRIGHTNESS = "brightness",
    NOTIFY = "notify"
}

export class YeelightNode extends BaseNode {

    bulbIP: string;
    action: Mode;

    constructor(name: string, id: string, options: any, outputConnections: Array<any> = []) {
        super(name, NODE_TYPE, id, options, outputConnections);
        this.bulbIP = options.settings.bulbIP;
        this.action = options.settings.action;
        NodeManager.addNode(this);
    }

    execute(msg: Message) {
        if (this.action === Mode.COLOR) {
            on(this.bulbIP, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
            color(this.bulbIP, 250, 0, 0, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
        }
        if (this.action === Mode.ON) {
            on(this.bulbIP, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
        }
        if (this.action === Mode.OFF) {
            off(this.bulbIP, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
        }
        if (this.action === Mode.TOGGLE) {
            toggle(this.bulbIP, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
        }
        if (this.action === Mode.BRIGHTNESS) {
            brightness(this.bulbIP, 10, (err: any) => {
                if (err) console.error(`error [${err.message}] occured on ${this.bulbIP}`);
            });
        }
        if (this.action === Mode.NOTIFY) {
            let l1 = new Bulb(this.bulbIP);
            l1.connect();

            l1.on('connected', (light: any) => {
                light.onn();
                light.color(255, 0, 0);
                
                setTimeout(()=> {
                    light.color(255, 255, 255);
                    light.disconnect();
                }, 1000)
            });
        }
    }
}