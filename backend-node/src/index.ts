import { NodeRegistry } from "./nodes/node-registry";
import { Loader } from "./loader";

import express from "express";
import chalk from "chalk";
const cors = require('cors')
const fs = require('fs');


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
    res.send("Successfully saved");
});

// start the Express server
app.listen( port, () => {
    console.log( `Server started at http://localhost:${ port }` );
});