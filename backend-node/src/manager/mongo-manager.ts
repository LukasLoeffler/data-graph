const MongoClient = require('mongodb').MongoClient;


//let url = "mongodb://localhost:27017";
let url = "mongodb+srv://lukloe:010184Lukas@cluster0.oorug.mongodb.net?retryWrites=true&w=majority";

let _db: any;


let requiredCollections = ["mqtt-servers", "workspaces", "node-configs", "node-templates"]


function connectToServer( callback: any ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function(err: any, client: any ) {
        _db  = client.db('mydb');

        requiredCollections.forEach((collection: any) => {
            _db.createCollection("customers", function(err: any, res: any) {
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