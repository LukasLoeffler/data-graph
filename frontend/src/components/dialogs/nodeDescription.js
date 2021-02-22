
let descriptions = [
    {
        type: "logging",
        text: `
            Takes the input and logs the input to the console of the backend.
            In the future a log into the application console in the frontend is planned.
        `
    },
    {
        type: "button",
        text: `
            Triggers a <a href="/wiki/downstream">downstream</a> node by clicking on the blue <b>EXECUTE</b> button in the node.<br><br>
            The green bubble indicates the number of times the button has been pressed.
            This number can be resetted by right-clicking the blue button.
        `
    },
    {
        type: "info",
        text: `
            Gives information on how many times a node has been activated, the total number of input bytes, date and time of last activation. <br>
            The amount of information shown on the node can be edited in settings menu.
            The information can be resetted over the context menu or by right clicking on the table.
        `
    },
    {
        type: "cron",
        text: `
            Triggers the a <a href="/wiki/downstream">downstream</a> node when a cron expression matches the current time.
            More information is provided here: <a href="https://www.npmjs.com/package/node-cron" target="_blank">node-cron</a>.
            Check out the interval node for a more convient way to trigger downstream nodes periodically.
        `
    },
    {
        type: "interval",
        text: `
            Triggers the a <a href="/wiki/downstream">downstream</a> node periodically. The perid can be selected right on the node itself in the editor.
        `
    },
    {
        type: "httpGet",
        text: `
            Executes an http-get request. The name and url of the node can be set in the settings menu.
            This node does not make use of input data. Input messages only triggers request.
        `
    },
    {
        type: "httpPostPut",
        text: `
            Executes an http-post / gttp-get request. The name, url and http method of the node can be set in the settings menu.
            Takes the input data as request body. <br>
            <ul>
                <li>Url</li>
                <li>Name</li>
                <li>Timeout</li>
                <li>Expected output</li>
            </ul> 
        `
    },
    {
        type: "fileSave",
        text: `
            Saves the input data to the filesystem of the server. <br>
            <b>Note:</b> Local file saves over the browser are not supported.
        `
    },
]



export function getDescription(nodeType) {
    let description = descriptions.find(descr => descr.type === nodeType);

    if (description) return description.text;
    else return "No description provided for node"
}