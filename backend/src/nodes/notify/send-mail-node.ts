import { Message } from "../../message";
import { BaseNode } from "../base-node";
import { NodeManager } from "../node-manager";
const nodemailer = require('nodemailer');


const NODE_TYPE = "send_mail"


export class SendMailNode extends BaseNode {
    
    transporter: any;
    mailOptions: any;
    html: boolean;

    constructor(name: string, id: string, options: any, outputConnections: Array<string>) {
        super(name, NODE_TYPE, id, options, outputConnections);
        
        this.html = options.settings.html;
        this.init(options.settings);
        NodeManager.addNode(this);
    }

    init(settings: any) {
        this.transporter = nodemailer.createTransport({
            service: settings.service,
            auth: settings.auth
        });

        this.mailOptions = {
            from: settings.from,
            to: settings.to,
            subject: settings.subject,
        };
    }

    execute(msg: Message) {
        let mailOptions = this.mailOptions;
        if (this.html) mailOptions.html = msg.payload.toString();
        else mailOptions.text = msg.payload.toString();

        this.transporter.sendMail(this.mailOptions, (error: any, info: any) => {
            if (error) {
                this.onFailure(error.message, msg.additional, true);
            }
        });
    }
}