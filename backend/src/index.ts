import { Loader } from "./loader";
import { NodeManager } from "./nodes/node-manager";
import { connectToServer, getDb } from "./manager/mongo-manager";
import { ExecutionCounter } from "./exec-info";
import express from "express";
import chalk from "chalk";
const { Client } = require('pg')
var mongodb = require('mongodb');
const bodyParser = require('body-parser');


const  cors = require('cors')

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

var rawBodySaver = function (req: any, res: any, buf: any, encoding: string) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

let dbo: any;


let lastSave = {};  // Object to cache last node config to check if changes occured.

export let io: any = null;


connectToServer( function( err: any, client: any ) {
    if (err) console.log("Connection to Mongo:", err);

    dbo = getDb();  // Fetching database object
    Loader.loadConfig(dbo);  // Loading nodes from config file.
    let server = app.listen( PORT, () => {
        console.log( `Server started at http://localhost:${ PORT }` );
    });

    
    io = require('socket.io')(server, {cors: { origins: '*:*'}});
    io.on('connection', function(socket: any) {
        console.log("NewConnection:", socket.id);
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

    if (JSON.stringify(newvalues) === JSON.stringify(lastSave)) {
        console.log(chalk.yellow("No changes detected. Not saving."))
        res.status(400).send("No changes detected");
    } else {
        
        dbo.collection("node-configs").updateOne(query, newvalues, options, function(err: any, obj: any) {
            if (err) {
                console.log(err);
                res.status(500).send("Configuation not saved");
            } else {
                Loader.loadConfig(dbo);
                res.send(`Updated ${obj.result.n}`);
            }
        });
    }

    lastSave = newvalues;
});

app.post("/save-node-config/", ( req, res ) => {
    dbo.collection("node-configs").insertOne(req.body, function(err: any, obj: any) {
        if (err) res.status(500).send("Configuation not saved");
        else {
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

    let query = { 
        _id: req.params.nodeId
    };
    dbo.collection("last-values").findOne(query, function(err: any, result: any) {
        if (err) res.status(404).send(err);
        if (result?.last) {
            if (Array.isArray(result.last)) {
                res.send(result.last.slice(0, 10));
            } else {
                res.send(result.last);
            }
        } else {
            res.status(404).send("Not found");
        }
    });
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

app.get("/reset-exec-count/:nodeId", (req, res) => {
    ExecutionCounter.resetCount(req.params.nodeId);
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



app.get('/http-in/*', function(req, res) {
    let url = req.originalUrl.replace("/http-in", "");

    let node = NodeManager.getNodesByType("HTTP_IN_REQUEST").find((node: any) => node.listenUrl === url && ( node.listenMethod === "GET" || node.listenMethod === "*") );
    if (node) node.execute(req, res);
    else res.status(400).send({message: "no matching endpoint active"});
});

app.post('/http-in/*', function(req, res) {
    let url = req.originalUrl.replace("/http-in", "");

    let node = NodeManager.getNodesByType("HTTP_IN_REQUEST").find((node: any) => node.listenUrl === url && ( node.listenMethod === "POST" || node.listenMethod === "*") );
    if (node) node.execute(req, res);
    else res.status(400).send({message: "no matching endpoint active"});
});


app.post('/check-pg-connection', async function(req, res) {

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
