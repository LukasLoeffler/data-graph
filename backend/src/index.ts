import { NodeRegistry } from "./nodes/node-registry";
import { Loader } from "./loader";
import { NodeManager } from "./nodes/node-manager";
import { connectToServer, getDb } from "./manager/mongo-manager";
import { WsManager } from "./ws";
import { ExecutionCounter } from "./exec-info";
import path from 'path';
import express from "express";
import chalk from "chalk";
var mongodb = require('mongodb');

console.log("Running v1.0.0");


const  cors = require('cors')

var jsonPath = path.join(__dirname, '.', 'config', 'node-config.json');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors())

let dbo: any;


connectToServer( function( err: any, client: any ) {
    if (err) console.log("Connection to Mongo:", err);

    dbo = getDb();  // Fetching database object
    Loader.loadConfig(dbo);  // Loading nodes from config file.
    app.listen( PORT, () => {
        console.log( `Server started at http://localhost:${ PORT }` );
    });
});


app.get("/get-node-config/:id", ( req, res ) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    dbo.collection("node-configs").findOne(query, function(err: any, result: any) {
        if (err) res.status(404).send(err);
        else {
            res.send(result);
        }
    });
});

app.get("/node-configs/all", (req, res) => {
    dbo.collection("node-configs").find({}).toArray(function(err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
});

app.delete("/node-configs/all", (req, res) => {
    dbo.collection("node-configs").deleteMany({}, function(err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
});

app.delete("/node-configs/:id", (req, res) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    dbo.collection("node-configs").deleteOne(query, function(err: any, obj: any) {
        if (err) res.status(404).send(err);
        else res.send({
            "num_deleted": obj.result.n
        });
    });
});


app.put("/save-node-config/:id", ( req, res ) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    var newvalues = { $set: req.body };
    const options = { upsert: true };
    dbo.collection("node-configs").updateOne(query, newvalues, options, function(err: any, obj: any) {
        if (err) {
            console.log(err);
            res.status(500).send("Configuation not saved");
        } else {
            WsManager.sendMessage("Refreshed");
            Loader.loadConfig(dbo);
            res.send(`Updated ${obj.result.n}`);
        }
    });
});

app.post("/save-node-config/", ( req, res ) => {
    dbo.collection("node-configs").insertOne(req.body, function(err: any, obj: any) {
        if (err) res.status(500).send("Configuation not saved");
        else {
            WsManager.sendMessage("Refreshed");
            Loader.loadConfig(dbo);
            res.send(`Created ${obj.result.n}`);
        }
    });
});


app.get("/recieve-event/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    node.execute();
    if (!node) res.status(404).send("Node not found");
    else res.send("Successfully executed");
});


app.get("/last-value/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let lastValue = node.getLastValue();
    res.send(lastValue);
})

app.post("/test/:nodeId", async (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    node.test(req.body.mapping, res);
})

app.get("/start/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let running = node.start();
    res.send({"running": running});
});

app.get("/stop/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let running = node.stop();
    res.send({"running": running});
});

app.get("/reset/:nodeId", (req, res) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    console.log("Resetting Node:", node.name);
    let running = node.reset();
    res.send({"reset": "success"});
});


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

app.get("/workspace/:id", (req, res) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    dbo.collection("workspaces").findOne(query, function(err: any, result: any) {
        if (err) res.status(404).send(err);
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


app.post("/node-template", (req, res) => {
    dbo.collection("node-templates").insertOne(req.body, function(err: any, result: any) {
        if (err) res.status(400).send(err);
        else res.send(result);
    });
});