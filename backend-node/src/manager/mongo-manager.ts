const MongoClient = require('mongodb').MongoClient;

let uri = "mongodb+srv://lukloe:010184Lukas@cluster0.oorug.mongodb.net?retryWrites=true&w=majority";
let dbo: any;

MongoClient.connect(uri, function(err: any, db: any) {
    if (err) throw err;
    dbo = db.db("mydb");
    dbo.createCollection("mqtt-servers", function(err: any, res: any) {
        if (err) console.log("Collection already exists.");
        else console.log("Collection created!");
    });
});


function getDbo() {
    if (!dbo) {
        
    }
}



export { dbo, getDbo };