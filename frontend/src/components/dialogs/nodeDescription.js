
let descriptions = [
    {
        type: "logging",
        text: `
            Takes the input and logs the input to the console of the backend.
            In the future a log into the application console in the frontend is planned.
        `,
        tags: ["logging", "console", "output"]
    },
    {
        type: "button",
        text: `
            Triggers a <a href="/wiki/downstream" target="_blank">downstream</a> node by clicking on the blue <b>EXECUTE</b> button in the node.<br><br>
            The green chip indicates the number of times the button has been pressed.
            This number can be resetted by right-clicking the green indicator.
        `,
        tags: ["button", "input", "click", "execute"]
    },
    {
        type: "info",
        text: `
            Gives information on how many times a node has been activated, the total number of input bytes, date and time of last activation. <br>
            The amount of information shown on the node can be edited in settings menu.
            The information can be resetted over the context menu or by right clicking on the table.
        `,
        tags: ["info", "counts", "events", "last", "date", "time", "logging", "log"]
    },
    {
        type: "cron",
        text: `
            Triggers the a <a href="/wiki/downstream" target="_blank">downstream</a> node when a cron expression matches the current time.
            More information is provided here: <a href="https://www.npmjs.com/package/node-cron" target="_blank">node-cron</a>.
            Check out the interval node for a more convient way to trigger downstream nodes periodically.
        `,
        tags: ["timer", "cron", "interval", "input"]
    },
    {
        type: "interval",
        text: `
            Triggers the a <a href="/wiki/downstream" target="_blank">downstream</a> node periodically. The perid can be selected right on the node itself in the editor.
        `,
        tags: ["timer", "interval", "input"]
    },
    {
        type: "http-get",
        text: `
            Executes an http-get request. The name and url of the node can be set in the settings menu.
            This node does not make use of input data. Input messages only triggers request.
        `,
        tags: ["http", "get"]
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
        `,
        tags: ["http", "post", "put", "output"]
    },
    {
        type: "file-save",
        text: `
            Saves the input data to the filesystem of the server. <br>
            <b>Note:</b> Local file saves over the browser are not supported.
        `,
        tags: ["file", "save", "output"]
    },
    {
        type: "postgres-save",
        text: `
            Takes an input object and tries to save to the postgres database/table provided in the settings.<br>
            <b>Note:</b> The input object has to match the database table in number of fields(columns) and in datatype of said fields(columns).
        `,
        tags: ["postgres", "db", "save", "insert", "output"]
    },
    {
        type: "mqtt-sub",
        text: `
            Subscribes to a given topic on a mqtt server.
            Node can be stopped and won't recieve any messages while stopped.
        `,
        tags: ["mqtt", "sub", "subscribe", "input"]
    },
    {
        type: "mqtt-pub",
        text: `
            Publishes the input object to the given topic on a mqtt server.
        `,
        tags: ["mqtt", "pub", "publish", "output"]
    },
    {
        type: "http-in-request",
        text: `
            Listens to an specific http-endpoint for incoming requests. If an request is incoming the node triggers the downstream nodes.
            In case of an http request which contains a payload the payload is transferred to the downstream node. 
            This data now can be used to be transformed or query other data sources. <br>
            <b>Important:</b> Somewhere downstream an http-in-reponse node has to be called to close the request.<br>
            
            <b>Parameters:</b>
            
            <ul>
                <li>Name</li>
                <li>Endpoint</li>
                <li>Http Method</li>
            </ul> 
        `,
        tags: ["http", "request", "in" , "input"]
    },
    {
        type: "http-in-response",
        text: `
            This node sends back the http reponse with the input payload.<br>
            <b>Important:</b> This node has to be in the downstream of an http-in-request node. If an request is already 
            answered by another http-in-response node, the response can not be sent due to the nature of http requests<br>
            
            <b>Parameters:</b>
            
            <ul>
                <li>Name, Required</li>
                <li>Status Code, Required, Default: 200</li>
            </ul>
        `,
        tags: ["http", "request", "response", "in", "output"]
    },
    {
        type: "csv-to-json",
        text: `
            Converts CSV to JSON.<br>
            <b>Important:</b> Currently first line has to be a header line to build keys correctly.
        `,
        tags: ["conversion", "datatype", "type", "csv", "json"]
    },
]






export function getDescription(nodeType) {
    let description = descriptions.find(descr => descr.type === nodeType);

    if (description) return description.text;
    else return "No description provided for node"
}

export function getTags(nodeType) {
    let description = descriptions.find(descr => descr.type === nodeType);

    if (description) return description.tags;
    else return []
}