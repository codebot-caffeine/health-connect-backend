
var exp = require("express")
var {getDatabasesAndCollections,getCollectionsList,dropCollection, modifyCollection, createDb} = require("./apis/editCollections")
var MongoClient = require("mongodb").MongoClient

let url = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority"

var client  = new MongoClient(url)

var app = exp()
app.use(exp.json())

var port = process.env.PORT || 3000

async function getCollection(collectionName){
    let result = await client.connect();
    db = result.db("root-db")
    let collection = await db.collection(collectionName)
    // let products = await collection.find({}).toArray()
    return collection
}

async function getData(cName){
    let result = await client.connect();
    db = result.db("root-db")
    let v = await db.collection(cName).find({}).toArray()
    console.log(v,"data")
}

app.get("/",(req,res)=>{
    res.send('running in 3000')
})

app.post("/signin",async(req,res)=>{
    try{
        let collectionName = req.body.Role != "doctor" ? "users" : "doctors"

        let collection = await getCollection(collectionName)
        let obj = await collection.find({"Name":req.body.Name,"Password":req.body.Password,"Role":req.body.Role}).toArray()
        // console.log(obj)
        // res.send(obj)
        if(obj.length > 0){
        // if(role != "doctor"){
            res.status(200).send(obj)
        }else{
            res.status(400).send("No user found.")
        }
        // }else{
        //     res.send('collection not created')
        // }
        // console.log('success')
        // getData()
        // response.send(inserted)
    }catch(error){
        console.log('fail')
    }
})

app.post("/add/role/:role",async (req,res)=>{
    let {role} = req.params
    try{
        let collectionName = req.body.Role != "doctor" ? "users" : "doctors"

        let collection = await getCollection(collectionName)
        let obj = await collection.find({"Mobile": req.body.Mobile,"Email": req.body.Email}).toArray()
        let limiter = await collection.find({}).toArray()
        // console.log(obj)
        // res.send(obj)
        if(obj.length == 0 && limiter.length < 20){
        // if(role != "doctor"){
            collection.insertOne({
                ...req.body
            }).then((response)=>{
                    res.status(200).send(response)
            }).catch((err)=>{
                    if(err.code == 121){
                        res.status(400).send(err.errInfo.details.schemaRulesNotSatisfied)
                    }
                    else{
                        res.status(400).send (err)
                    }
            })
        }else{
            res.status(400).send("Email and Mobile are already used.")
        }
        // }else{
        //     res.send('collection not created')
        // }
        // console.log('success')
        // getData()
        // response.send(inserted)
    }catch(error){
        console.log('fail')
    }
})


app.listen(port,()=>{
    // getDatabasesAndCollections().then((res)=>{
    //     console.log(res)
    // })
    
    let fields = ["Name","Gender","DOB","Postcode","Email","Mobile","Age","Password","Role","Experience","Specalization","HospitalName"]
    // modifyCollection("doctors",fields)

    // dropCollection("root-db","users")
    // getData("users")
    // getData("doctors")
    
    // getCollectionsList("root-db").then((res)=>{
    //     console.log(res)
    // })
    
})