var {getCollection} = require('./editCollections')

async function insertHospitals(){
    let collection = await getCollection("hospitals")
    await collection.insertMany([{
        HospitalName:"Apollo",
        HospitalId:1,
        Address: "Hyderabad",
        Mobile: 9990000000
    },{
        HospitalName:"Gandhi",
        HospitalId:2,
        Address: "Hyderabad",
        Mobile: 9990000000
    }]).then((res)=>{
        console.log(res)
    })
}

// app.post("/register/:role", async (req, res) => {
//     let {role} = req.params
//     try{
//         if(role == req.body.Role){
//             let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users-auth" : "doctors"

//             let collection = await getCollection(collectionName)
//             let obj = await collection.find({"Mobile": req.body.Mobile,"Email": req.body.Email}).toArray()
//             let limiter = await collection.find({}).toArray()
            
//             if(obj.length == 0 && limiter.length < 20){
//             //Encrypt user password
//                 let {Password} = req.body
//                 encryptedPassword = await bcrypt.hash(Password, 10);
            
//                 // Create user in our database
//                 collection.insertOne({
//                     ...req.body,
//                     "Password": encryptedPassword
//                 }).then((response)=>{
//                     const token = jwt.sign(
//                         { user_id: response._id, Email },
//                         TOKEN_KEY,
//                         {
//                         expiresIn: "2h",
//                         }
//                     );
//                     // save user token
//                     userCreated.token = token;
                
//                     // return new user
//                     res.status(201).send({status:true,response:{...response}});
//                 }).catch((err)=>{
//                         if(err.code == 121){
//                             res.status(400).send(
//                                 {status:false,errorMessage :err.errInfo.details.schemaRulesNotSatisfied}
//                             )
//                         }
//                         else{
//                             res.status(400).send ({status:false,errorMessage :'failining in catch'})
//                         }
//                 })
//             }else{
//                 res.status(200).send({status:false,errorMessage:"Email and Mobile are already used."})
//             }
//         }else{
//             res.status(400).send({status:false,errorMessage:"role in path and body not matched"})
//         }
//     }
//     catch (err) {
//         res.status(400).send({status:false,errorMessage:err})
//       console.log(err);
//     }
//     // Our register logic ends here
// });



module.exports = {insertHospitals}
