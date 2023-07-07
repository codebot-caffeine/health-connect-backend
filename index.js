
var exp = require("express")
var cors = require('cors')
var bcrypt = require("bcryptjs")
var jwt  = require("jsonwebtoken")

//imports from made moduels
var {getDatabasesAndCollections,getCollectionsList,dropCollection, modifyCollection, createDb} = require("./apis/editCollections")
var {insertHospitals} = require('./apis/supportApis')
var{TOKEN_KEY} = require("./key")
var{verifyToken} = require('./middleware/auth')

var MongoClient = require("mongodb").MongoClient

let url = "mongodb+srv://Eshh:health-connect@health-connect.ziqzbp9.mongodb.net/?retryWrites=true&w=majority"

var client  = new MongoClient(url)

var app = exp()
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
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

async function getData(cName,page,pageSize){
    let result = await client.connect();
    db = result.db("root-db")
    let v = await db.collection(cName).find({}).sort("HospitalId").skip(page*pageSize).limit(pageSize).toArray()
    // console.log(v,"data")
    let total =  await db.collection(cName).countDocuments()
    return {response:v,total:total}
}

app.get("/",(req,res)=>{
    res.send('running in 3000')
})

app.get(`/list/hospitals`,verifyToken,(req,response)=>{
    let page  = parseInt(req.query.page ? req.query.page : 0)
    let pageSize = parseInt(req.query.pageSize? req.query.pageSize : 20)

    getData('hospitals',page,pageSize).then((res)=>{
        response.status(200).send({
            status:true,
            response:[
                {
                    hospitals : [...res.response],
                    total:res.total
                },
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

app.post("/update/:role",verifyToken,async (req,res)=>{
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
        delete req.body.token
        let Password;
        let finalObj;
        if(req.body.Password){
            Password = await bcrypt.hash(req.body.Password,10)
            finalObj = {
                ...req.body,"Password":Password
            }
        }else{
            finalObj = {
                ...req.body
            }
        }
        const filter = {"_id": b[0]._id};
        const updateDoc = {
            $set: {
              ...finalObj
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

app.post("/insert/slots",verifyToken,async(req,res)=>{
    // let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users" : "doctors"
    let collection = await getCollection("doctors")
    let b = await collection.find({"Email":req.body.Email}).toArray()
    // let userId = b._id.toString()
    let userId = b[0]._id.toString()
    // let existingSlots = b.Slots ? b.Slots : []
    // console.log(b.Slots,b)

    if(userId == req.body._id && req.body.Slots){
        const filter = {"_id": b[0]._id};
        const updateDoc = {
            $addToSet: {
              Slots: {$each : req.body.Slots}
            },
        };
        await collection.updateOne(filter, updateDoc).then((result)=>{
            res.status(200).send({
                status:true,
                response: `${result.matchedCount} document(s) matched the filter, added slots ${result.modifiedCount} document(s)`
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


//with auth code signup and signin
app.post("/add/role/:role", async (req, res) => {
    let {role} = req.params
    try{
        if(role == req.body.Role){
            let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users" : "doctors"

            let collection = await getCollection(collectionName)
            let obj = await collection.find({"Mobile": req.body.Mobile,"Email": req.body.Email}).toArray()
            let limiter = await collection.find({}).toArray()
            
            if(obj.length == 0 && limiter.length < 20){
            //Encrypt user password
                let {Password} = req.body
                encryptedPassword = await bcrypt.hash(Password, 10);
            
                // Create user in our database
                collection.insertOne({
                    ...req.body,
                    "Password": encryptedPassword
                }).then((response)=>{
                    const token = jwt.sign(
                        { user_id: response.insertedId },
                        TOKEN_KEY,
                        {
                        expiresIn: "24h",
                        }
                    );
                    // save user token
                    // return new user
                    res.status(201).send({status:true,response:{...response},token:token});
                }).catch((err)=>{
                        if(err.code == 121){
                            res.status(400).send(
                                {status:false,errorMessage :err.errInfo.details.schemaRulesNotSatisfied}
                            )
                        }
                        else{
                            res.status(400).send ({status:false,errorMessage :'failining in catch'})
                        }
                })
            }else{
                res.status(200).send({status:false,errorMessage:"Email and Mobile are already used."})
            }
        }else{
            res.status(400).send({status:false,errorMessage:"role in path and body not matched"})
        }
    }
    catch (err) {
        res.status(400).send({status:false,errorMessage:err})
    }
    // Our register logic ends here
});

app.post("/signin",async(req,res)=>{
    try{
        let collectionName = req.body.Role != "doctor" ? "users" : "doctors"

        let collection = await getCollection(collectionName)
        let obj = await collection.find({"Email":req.body.Email,"Role":req.body.Role}).toArray()
        // console.log(obj)
        // res.send(obj)
        let userId = obj[0]._id.toString()
        // console.log(req.body,obj)
        if(obj.length > 0 && (await bcrypt.compare(req.body.Password, obj[0].Password))){
        // if(role != "doctor"){
            // Create token
            const token = jwt.sign(
                { user_id: userId },
                TOKEN_KEY,
                {
                expiresIn: "24h",
                }
            );
            res.status(200).send(
                {
                    status:true,
                    token:token,
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
    }catch(error){
        res.status(400).send({
            status:false,
            errorMessage: error
        })
    }
})


app.listen(port,()=>{
    // getDatabasesAndCollections().then((res)=>{
    //     console.log(res)
    // })
    console.log(`server started on ${port}`)
    //"Name","Gender","DOB","Postcode","Email","Mobile","Age","Password","Role","Experience","Specalization","HospitalName","HospitalId","Address","Doctors","Mobile","Website"
    let fields = ["Name","Gender","DOB","Postcode","Email","Mobile","Password","Role"]
    // modifyCollection("users",fields)

    // dropCollection("root-db","users-auth")
    // getData("users")
    
    // insertHospitals()
    // getData("users")

    
    // getCollectionsList("root-db").then((res)=>{
    //     console.log(res)
    // })
    
})