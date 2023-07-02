
var exp = require("express")
var {getDatabasesAndCollections,getCollectionsList,dropCollection, modifyCollection, createDb} = require("./apis/editCollections")
var MongoClient = require("mongodb").MongoClient

let url = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority"

var client  = new MongoClient(url)

var app = exp()
app.use(exp.json())

async function getCollection(collectionName){
    let result = await client.connect();
    db = result.db("root-db")
    let collection = await db.collection(collectionName)
    // let products = await collection.find({}).toArray()
    return collection
}

async function getData(){
    let result = await client.connect();
    db = result.db("root-db")
    let v = await db.collection("users").find({}).toArray()
    console.log(v)
}

app.get("/",(req,res)=>{
    res.send('running in 3000')
})

app.post("/add/user",async (req,res)=>{
    try{
        let collection = await getCollection("users")
       
            collection.insertOne({
            ...req.body
            }).then((response)=>{
                res.send(response)
            }).catch((err)=>{
                res.send(err)
            })
        // console.log('success')
        // getData()
        // response.send(inserted)
    }catch(error){
        console.log('fail')
    }
})


app.listen(3000,()=>{
    getDatabasesAndCollections().then((res)=>{
        console.log(res)
    })
    
    let fields = ["Name","Gender","DOB","Postcode","Email","Mobile","Age"]
    // modifyCollection("users",fields)

    //dropCollection("root-db","users")
    getData()
    
    // getCollectionsList("root-db").then((res)=>{
    //     console.log(res)
    // })
    
})