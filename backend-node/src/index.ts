import { NodeRegistry } from "./nodes/node-registry";
import { Loader } from "./loader";


import { NodeManager } from "./nodes/node-manager";
import { MqttServerManager } from "./manager/mqtt-manager";
import { WsManager } from "./ws";
import { ExecutionCounter } from "./exec-counter";
import fs from 'fs';
import express from "express";
import chalk from "chalk";
const  cors = require('cors')


const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors())


// Loading nodes from config file.
Loader.loadConfig();


app.get("/available-nodes", ( req, res ) => {
    console.log("Fetching available nodes")
    let availableNodes = NodeRegistry.getAvailableNodes();
    res.send(availableNodes);
});

app.get("/get-node-config", ( req, res ) => {
    fs.readFile('./src/configuration/node-config.json', 'utf8' , (err: any, data:any) => {
        if (!data || err) {
            console.log(chalk.redBright("No configuration present. Creating empty config."))
            res.send({});
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post("/save-node-config", ( req, res ) => {
    fs.writeFile("./src/configuration/node-config.json", JSON.stringify( req.body, null, 4), {encoding:'utf8', flag:'w'}, function (err: any) {
        if (err) console.log(err)
        console.log("Successfully saved");
        Loader.loadConfig();
    });
    WsManager.sendMessage("Refreshed");
    res.send("Successfully saved");
});

app.get("/recieve-event/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    node.execute();
    if (!node) res.status(404).send("Node not found");
    else res.send("Successfully executed");
});

app.get("/mqtt-server", (req, res) => {
    let list = MqttServerManager.getAvailableServer();
    res.send(list);
});

app.get("/reset-exec-count/:nodeId", (req, res) => {
    ExecutionCounter.resetCount(req.params.nodeId);
    res.send("Successfully resetted");
})

// start the Express server
app.listen( port, () => {
    console.log( `Server started at http://localhost:${ port }` );
});