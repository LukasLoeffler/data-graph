import chalk from "chalk";

const MongoClient = require('mongodb').MongoClient;



const environment = process.env.NODE_ENV || 'DEV';

console.log("Started application with ENV:", environment);


let url = 'mongodb://mongo:27017';
if (environment === "DEV") url = "mongodb://localhost:27017";


let _db: any;


let requiredCollections = ["mqtt-servers", "workspaces", "node-configs", "node-templates"]


function connectToServer( callback: any ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function(err: any, client: any ) {

        if (err) {
            console.log(`Mongo-Server: (${url}): ${chalk.redBright("connecting failed")}`);
            process.exit(1);
        }

        _db  = client.db('mydb');
        console.log(`Mongo-Server: (${url}): ${chalk.greenBright("connected")}`)

        requiredCollections.forEach((collection: any) => {
            _db.createCollection(collection, function(err: any, res: any) {
                if (err) console.log(`Collection ${collection} already exists`);
                else console.log(`Collection ${collection} successfully created`);
            });
        });

        return callback( err );
    });
}

function getDb () {
    return _db;
}

export { connectToServer, getDb };