
var exp = require("express")
var cors = require('cors')
var {getDatabasesAndCollections,getCollectionsList,dropCollection, modifyCollection, createDb} = require("./apis/editCollections")
var {insertHospitals} = require('./apis/supportApis')
var MongoClient = require("mongodb").MongoClient

let url = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority"

var client  = new MongoClient(url)

var app = exp()
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
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
    // console.log(v,"data")
    return v
}

app.get("/",(req,res)=>{
    res.send('running in 3000')
})

app.post("/signin",async(req,res)=>{
    try{
        let collectionName = req.body.Role != "doctor" ? "users" : "doctors"

        let collection = await getCollection(collectionName)
        let obj = await collection.find({"Email":req.body.Email,"Password":req.body.Password,"Role":req.body.Role}).toArray()
        // console.log(obj)
        // res.send(obj)
        if(obj.length > 0){
        // if(role != "doctor"){
            res.status(200).send(
                {
                    status:true,
                    response:[...obj]
                }
                // obj
            )
        }else{
            res.status(200).send(
                {
                    status:false,
                    errorMessage: "No user found."
                }       
            )
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
        if(role == req.body.Role){
            let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users" : "doctors"

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
                        res.status(200).send({status:true,
                            response:response})
                }).catch((err)=>{
                        if(err.code == 121){
                            res.status(400).send(
                                {status:false,errorMessage :err.errInfo.details.schemaRulesNotSatisfied}
                            )
                        }
                        else{
                            res.status(400).send ({status:false,errorMessage :err})
                        }
                })
            }else{
                res.status(200).send({status:false,errorMessage:"Email and Mobile are already used."})
            }
        }else{
            res.status(400).send({status:false,errorMessage:"role in path and body not matched"})
        }
    }catch(error){
        console.log('fail')
    }
})

app.get("/list/hospitals",(req,response)=>{
    getData('hospitals').then((res)=>{
        console.log(res)
        response.status(200).send({
            status:true,
            response:[
                {hospitals : [...res]}
            ]
        })
    }).catch((err)=>{
        response.status(400).send({
            status:false,
            errorMessage: err
        })
    })
    // res.send('running in 3000')
})

app.post("/update/:role",async (req,res)=>{
    let {role} = req.params
    let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users" : "doctors"

    let collection = await getCollection(collectionName)
    let b = await collection.find({"Email":req.body.Email}).toArray()
    // let id = await body._id
    let userId = b[0]._id.toString()
    // console.log(b[0]._id.toString(),req.body._id)
    if(userId == req.body._id){
         // create a filter for a movie to update
        delete req.body._id
        const filter = {"_id": b[0]._id};
        const updateDoc = {
            $set: {
              ...req.body
            },
        };
        await collection.updateOne(filter, updateDoc).then((result)=>{
            res.status(200).send({
                status:true,
                response: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
            })
        }).catch((error)=>{
            res.status(200).send({
                status:false,
                errorMessage: error
            })
        });
    }else{
        res.status(400).send({
            status:false,
            errorMessage:'Email and id are not found.'
        })
    }


})


app.listen(port,()=>{
    // getDatabasesAndCollections().then((res)=>{
    //     console.log(res)
    // })
    console.log(`port started on ${port}`)
    //"Name","Gender","DOB","Postcode","Email","Mobile","Age","Password","Role","Experience","Specalization",
    let fields = ["HospitalName","HospitalId","Address","Doctors","Mobile","Website"]
    // modifyCollection("hospitals",fields)

    // dropCollection("root-db","Hospitals")
    // getData("users")
    
    // insertHospitals()
    // getData("hospitals")

    
    // getCollectionsList("root-db").then((res)=>{
    //     console.log(res)
    // })
    
})