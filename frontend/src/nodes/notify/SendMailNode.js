import { Node } from "@baklavajs/core";
import { store } from '../../main';


export default class SendMailNode extends Node {
    type = "send-mail";
    name = "Send Mail";

    optionValue = null;

    constructor() {
        super();
        this.addInputInterface("text");

        this.addOption("settings", "SendMailDialog", {
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            },
            from: 'youremail@gmail.com',
            to: 'myfriend@mail.com',
            subject: 'Send Processed Data',
            html: false
        });

        this.addOutputInterface("onFailure");

        this.addOption("color", undefined, "#03A9F4");
        this.addOption("running", undefined, true);
    }
}