
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
            The green chip indicates the number of times the button has been pressed.
            This number can be resetted by right-clicking the green indicator.
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
        type: "http-get",
        text: `
            Executes an http-get request. The name and url of the node can be set in the settings menu.
            This node does not make use of input data. Input messages only triggers request.
        `
    },
    {
        type: "http-post-put",
        text: `
            Executes an http-post / http-get request. The name, url and http method of the node can be set in the settings menu.
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
        type: "file-save",
        text: `
            Saves the input data to the filesystem of the server. <br>
            <b>Note:</b> Local file saves over the browser are not supported.
        `
    },
    {
        type: "postgres-save",
        text: `
            Takes an input object and tries to save to the postgres database/table provided in the settings.<br>
            <b>Note:</b> The input object has to match the database table in number of fields(columns) and in datatype of said fields(columns).
        `
    },
    {
        type: "mqtt-sub",
        text: `
            Subscribes to a given topic on a mqtt server.
            Node can be stopped and won't recieve any messages while stopped.
        `
    },
        {
        type: "mqtt-pub",
        text: `
            Publishes the input object to the given topic on a mqtt server.
        `
    },
]






export function getDescription(nodeType) {
    let description = descriptions.find(descr => descr.type === nodeType);

    if (description) return description.text;
    else return "No description provided for node"
}