import { NodeRegistry } from "./nodes/node-registry";
import { Loader } from "./loader";
import { NodeManager } from "./nodes/node-manager";
import { connectToServer, getDb } from "./manager/mongo-manager";
import { WsManager } from "./ws";
import { ExecutionCounter } from "./exec-info";
import fs from 'fs';
import path from 'path';
import express from "express";
import chalk from "chalk";
var mongodb = require('mongodb');


const  cors = require('cors')

var jsonPath = path.join(__dirname, '.', 'config', 'node-config.json');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors())

let dbo: any;


connectToServer( function( err: any, client: any ) {
    if (err) console.log("Connection to Mongo:", err);
    
    // Loading nodes from config file.
    dbo = getDb();
    Loader.loadConfig();

    // start the Express server
    app.listen( port, () => {
        console.log( `Server started at http://localhost:${ port }` );
    });
});


app.get("/available-nodes", ( req, res ) => {
    console.log("Fetching available nodes")
    let availableNodes = NodeRegistry.getAvailableNodes();
    res.send(availableNodes);
});

app.get("/get-node-config", ( req, res ) => {
    fs.readFile(jsonPath, 'utf8' , (err: any, data:any) => {
        if (!data || err) {
            console.log(chalk.redBright("No configuration present. Creating empty config."))
            res.send({});
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post("/save-node-config", ( req, res ) => {
    fs.writeFile(jsonPath, JSON.stringify( req.body, null, 4), {encoding:'utf8', flag:'w'}, function (err: any) {
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

app.get("/reset-exec-count/:nodeId", (req, res) => {
    ExecutionCounter.resetCount(req.params.nodeId);
    res.send("Successfully resetted");
})

app.get("/last-value/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let lastValue = node.getLastValue();
    res.send(lastValue);
})

app.post("/test/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let result = node.test(req.body.mapping);
    res.send(result);
})


app.get("/mqtt-server/all", (req, res) => {
    dbo.collection("mqtt-servers").find({}).toArray(function(err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
});

app.get("/mqtt-server/:id", (req, res) => {
    var query = { 
        id: parseInt(req.params.id)
    };
    console.log("Fetching mqttServers by id", query);
    dbo.collection("mqtt-servers").find(query).toArray(function(err: any, result: any) {
        if (err) res.status(404).send(err);
        else res.send(result);
    });
});

app.post("/mqtt-server", (req, res) => {
    dbo.collection("mqtt-servers").insertOne(req.body, function(err: any, result: any) {
        if (err) res.status(400).send(err);
        else res.send(result);
    });
});

app.delete("/mqtt-server/:id", (req, res) => {
    let query = { 
        id: req.params.id
    };
    dbo.collection("mqtt-servers").deleteOne(query, function(err: any, obj: any) {
        if (err) res.status(404).send(err);
        else res.send({
            "num_deleted": obj.result.n
        });
    });
});


app.get("/workspaces/all", (req, res) => {
    dbo.collection("workspaces").find({}).toArray(function(err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
});

app.post("/workspace", (req, res) => {
    dbo.collection("workspaces").insertOne(req.body, function(err: any, result: any) {
        if (err) res.status(400).send(err);
        else res.send(result);
    });
});

app.delete("/workspace/:id", (req, res) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    dbo.collection("workspaces").deleteOne(query, function(err: any, obj: any) {
        if (err) res.status(404).send(err);
        else res.send({
            "num_deleted": obj.result.n
        });
    });
});