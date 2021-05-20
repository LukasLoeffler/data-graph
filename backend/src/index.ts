import { loadConfig, LoadingMode } from "./loader";
import { NodeManager } from "./nodes/node-manager";
import { connectToServer, getDb } from "./manager/mongo-manager";
import { ExecutionCounter } from "./exec-info";
import { Client } from 'pg';
import { urlencoded, json, raw } from 'body-parser';
import express from "express";
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import cors from 'cors';
import path from "path";


const app = express();
app.use(cors())

const PORT = process.env.PORT || 3000;

var rawBodySaver = function (req: any, res: any, buf: any, encoding: string) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(raw({ verify: rawBodySaver, type: '*/*', limit: '50mb' }));

let dbo: any;


let lastSave = {};  // Object to cache last node config to check if changes occured.

export let connectedClients: number = 0;
export let io: any = null;


connectToServer( function( err: any, client: any ) {
    if (err) console.log("Connection to Mongo:", err);

    dbo = getDb();  // Fetching database object
    loadConfig(dbo, LoadingMode.STARTUP);  // Loading nodes from config file.
    let server = app.listen( PORT, () => {
        console.log( `Server started at http://localhost:${ PORT }` );
    });

    io = require('socket.io')(server, {cors: { origins: '*:*'}});
    io.on('connection', function(socket: any) {
        // Increase counter on new connection
        ++connectedClients;
        console.log("New Websocket Connection. Number of connected clients:", connectedClients);

        // Initially emit all node-execution counts if new device connects
        ExecutionCounter.initialEmitAllCounts();

        // Decrease the connection count on disconnect
        socket.on('disconnect', function () {
            --connectedClients;
            console.log("Websocket Connection lost. Number of connected clients:", connectedClients);
        });

        // Execute node by ID on BTN_CLICK event
        socket.on('BTN_CLICK', function(data: any) {
            let node = NodeManager.getNodeById(data);
            node.execute();
        });
    });
});


app.get("/node-config/:id", (req: express.Request, res: express.Response) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };
    dbo.collection("node-configs").findOne(query, function (err: any, result: any) {
        if (err) res.status(404).send(err);
        else {
            res.send(result);
        }
    });
});

app.get("/node-configs/all", (req: express.Request, res: express.Response) => {
    dbo.collection("node-configs").find({}).toArray(function(err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
});

app.delete("/node-config/:id", (req: express.Request, res: express.Response) => {
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

app.put("/node-config/:id", (req: express.Request, res: express.Response) => {
    let query = { 
        _id: new mongodb.ObjectID(req.params.id)
    };

    var newvalues = { $set: req.body };
    const options = { upsert: true };

    if (JSON.stringify(newvalues) === JSON.stringify(lastSave)) {
        //console.log(chalk.yellow("No changes detected. Not saving."))
        res.status(200).send("No changes detected");
    } else {
        
        dbo.collection("node-configs").updateOne(query, newvalues, options, function(err: any, obj: any) {
            if (err) {
                console.log(err);
                res.status(500).send("Configuation not saved");
            } else {
                loadConfig(dbo, LoadingMode.RUNNING);
                res.send(`Updated ${obj.result.n}`);
            }
        });
    }

    lastSave = newvalues;
});

app.post("/node-config/", (req: express.Request, res: express.Response) => {
    dbo.collection("node-configs").insertOne(req.body, function(err: any, obj: any) {
        if (err) res.status(500).send("Configuation not saved");
        else {
            loadConfig(dbo, LoadingMode.RUNNING);
            res.send(`Created ${obj.result.n}`);
        }
    });
});


app.get("/last-value/:nodeId", (req: express.Request, res: express.Response) => {

    let query = { 
        _id: req.params.nodeId
    };
    dbo.collection("last-values").findOne(query, function(err: any, result: any) {
        if (err) res.status(404).send(err);
        if (result?.last) {
            res.send(result.last);
        } else {
            res.status(404).send("Not found");
        }
    });
})

app.post("/test/:nodeId", async (req: express.Request, res: express.Response) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    node.test(req.body.mapping, res);
})

app.get("/start/:nodeId", (req: express.Request, res: express.Response) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let running = node.start();
    res.send({"running": running});
});

app.get("/stop/:nodeId", (req: express.Request, res: express.Response) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    let running = node.stop();
    res.send({"running": running});
});

app.get("/reset/:nodeId", (req: express.Request, res: express.Response) => {
    let node = NodeManager.getNodeById(req.params.nodeId);
    console.log("Resetting Node:", node.name);
    let running = node.reset();
    res.send({"reset": "success"});
});

app.get("/reset-exec-count/:nodeId", (req: express.Request, res: express.Response) => {
    ExecutionCounter.resetCount(req.params.nodeId);
    res.send({"reset": "success"});
});



app.get("/node-templates/all", (req: express.Request, res: express.Response) => {
    dbo.collection("node-templates").find({}).toArray(function (err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
})

app.post("/node-template", (req: express.Request, res: express.Response) => {
    dbo.collection("node-templates").insertOne(req.body, function(err: any, result: any) {
        if (err) res.status(400).send(err);
        else res.send(result);
    });
});



app.get('/http-in/*', function(req: express.Request, res: express.Response) {
    let url = req.originalUrl.replace("/http-in", "");

    let node = NodeManager.getNodesByType("HTTP_IN_REQUEST").find((node: any) => node.listenUrl === url && ( node.listenMethod === "GET" || node.listenMethod === "*") );
    if (node) node.execute(req, res);
    else res.status(400).send({message: "no matching endpoint active"});
});

app.post('/http-in/*', function(req: express.Request, res: express.Response) {
    let url = req.originalUrl.replace("/http-in", "");

    let node = NodeManager.getNodesByType("HTTP_IN_REQUEST").find((node: any) => node.listenUrl === url && ( node.listenMethod === "POST" || node.listenMethod === "*") );
    if (node) node.execute(req, res);
    else res.status(400).send({message: "no matching endpoint active"});
});


app.post('/check-pg-connection', async function(req: express.Request, res: express.Response) {

    let client = new Client(req.body);
    await client.connect(async (err: any) =>  {
        if (err) res.status(400).send({status: "error", message: err});
        else {
            let schema = await getPgTableSchema(req.body?.table, client);
            res.status(200).send(schema);
        }
    });
});


async function getPgTableSchema(tableName: string, client: any) {
    let sqlString = `SELECT * FROM information_schema.columns WHERE table_name = $1;`;
    let res = await client.query(sqlString, [tableName]);

    return res.rows.map((row: any) => {
        return {
            identity: row["is_identity"],
            identityGeneration: row["identity_generation"],
            name: row["column_name"],
            position: row["ordinal_position"],
            nullable: row["is_nullable"],
            dataType: row["data_type"],
            updateable: row["is_updatable"]
        }
    });
}

app.get("/node-history/all", (req: express.Request, res: express.Response) => {
    dbo.collection("node-history").find({}).sort({ date: -1 }).toArray(function (err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
})

app.get("/node-history/:nodeId", (req: express.Request, res: express.Response) => {

    let query = {
        nodeId: req.params.nodeId
    };

    dbo.collection("node-history").find(query).toArray(function (err: any, result: any) {
        if (err) res.status(500).send(err);
        else res.send(result);
    });
})

app.get("/artifacts/list", (req: express.Request, res: express.Response) => {
    let folder = "./output"
    fs.readdir(folder, (err: any, files: any) => {
        res.send(files);
    });
})

app.get("/artifact/:filename", (req: express.Request, res: express.Response) => {
    let filename = `${req.params.filename}`;
    res.sendFile(filename, { root: path.join(__dirname, '../output') });
})



app.get("/node-history/:nodeId/:param", (req: express.Request, res: express.Response) => {

    let query = {
        nodeId: req.params.nodeId
    };

    dbo.collection("node-history").find(query).toArray(function (err: any, result: any) {
        if (err) res.status(500).send(err);
        else {
            let output: any = [];
            let previous: any = undefined;
            result.forEach((historyEntry: any) => {
                let data = {
                    date: historyEntry.date,
                    value: historyEntry.optionsNew[req.params.param]
                };
                if (data.value != null && previous != data.value) output.push(data);
                previous = data.value;
            })
            res.send(output);
        }
    });
})