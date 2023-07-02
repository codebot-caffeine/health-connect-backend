var mongodb = require("mongodb")
var MongoClient = require("mongodb").MongoClient

let url = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority"
let urldb = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/root-db?retryWrites=true&w=majority"

var client  = new MongoClient(url)
var dbclient = new MongoClient(urldb)

let maindb;
// MongoClient.connect(urldb,{useNewUrlParser: true},(err,database)=>{
//     if(err){
//         console.log(`Unable to connect to the databse: ${err}`);
//         throw err;
//     } else {
//         console.log(database)
//         maindb =  database;
//         console.log('Connected to the database');
//     }
// });

async function getDatabasesAndCollections(){
    var connection = await client.connect()
    let db = (await connection.db().admin().listDatabases()).databases
    return db
}

async function dropCollection(db,collection){
    var connection = await client.connect()
    let db0 = await connection.db(db)
    db0.collection(collection).drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
    });
}

async function modifyCollection(collectionName,fields){//collection creation with schema
    let obj = {}
    var connection = await client.connect()
    let db0 = await connection.db("root-db")
    // if(e == 'Email' || e == "Postcode" || e == "Experience" || e == "Mobile" || e == "DOB")
    for (let e of fields){
        if(e == 'Age' || e == "Postcode" || e == "Experience" || e == "Mobile" || e == "DOB"){
           obj[e] = {
            bsonType: "int",
            description: "Required."
           }
        }
        else if(e == "Password" || e == "Email"){
            obj[e] = {
                bsonType: ["string","int"],
                description: "Required."
            }
        }
        else{
            obj[e] = {
                bsonType: "string",
                description: "Required."
            }
        }
    }

    console.log(obj,fields)

    let value = db0.createCollection(collectionName,{
        validator:{
          $jsonSchema: {
            bsonType: "object",
            required: [ ...fields ],
            properties: {
              ...obj
            }
          }
        }
      })
    return value
}
// Name
// Gender
// DOB
// Age 
// Email
// Mobile
// Postcode
// Password
// //DOCTORS
// Hospital
// Experience
// Specialization

async function createDb(dbName,collectionName){
     // database name
     let client1 = await client.connect()
     const db = client1.db("root-db");
      
     // collection name
     db.createCollection(collectionName);
    //  db.close()
}

async function getCollectionsList(dbName){
    var connection = await client.connect()
    let collections = await connection.db(dbName).listCollections().toArray()
    return collections
}

async function getCollection(collectionName){
    let result = await client.connect();
    db = result.db(dbName)
    let collection = await db.collection(collectionName)
    // let products = await collection.find({}).toArray()
    return collection
}

module.exports = {getDatabasesAndCollections,dropCollection,modifyCollection,getCollectionsList,createDb,getCollection}