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
//             let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users-auth" : "doctors-auth"

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
//                         { user_id: response.insertedId },
//                         TOKEN_KEY,
//                         {
//                         expiresIn: "2h",
//                         }
//                     );
//                     // save user token
//           
                
//                     // return new user
//                     res.status(201).send({status:true,response:{...response},token:token});
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

// app.post("/signin",async(req,res)=>{
//     try{
//         let collectionName = req.body.Role != "doctor" ? "users-auth" : "doctors-auth"

//         let collection = await getCollection(collectionName)
//         let obj = await collection.find({"Email":req.body.Email,"Password":req.body.Password,"Role":req.body.Role}).toArray()
//         // console.log(obj)
//         // res.send(obj)
//         if(obj.length > 0){
//         // if(role != "doctor"){
//             res.status(200).send(
//                 {
//                     status:true,
//                     response:[...obj]
//                 }
//                 // obj
//             )
//         }else{
//             res.status(200).send(
//                 {
//                     status:false,
//                     errorMessage: "No user found."
//                 }       
//             )
//         }
//         // }else{
//         //     res.send('collection not created')
//         // }
//         // console.log('success')
//         // getData()
//         // response.send(inserted)
//     }catch(error){
//         console.log('fail')
//     }
// })

// app.post("/add/role/:role",async (req,res)=>{
//     let {role} = req.params
//     try{
//         if(role == req.body.Role){
//             let collectionName = req.body.Role != "doctor" && role != "doctor" ? "users-auth" : "doctors-auth"

//             let collection = await getCollection(collectionName)
//             let obj = await collection.find({"Mobile": req.body.Mobile,"Email": req.body.Email}).toArray()
//             let limiter = await collection.find({}).toArray()
//             // console.log(obj)
//             // res.send(obj)
//             if(obj.length == 0 && limiter.length < 20){
//             // if(role != "doctor"){
//                 collection.insertOne({
//                     ...req.body
//                 }).then((response)=>{
//                         res.status(200).send({status:true,
//                             response:response})
//                 }).catch((err)=>{
//                         if(err.code == 121){
//                             res.status(400).send(
//                                 {status:false,errorMessage :err.errInfo.details.schemaRulesNotSatisfied}
//                             )
//                         }
//                         else{
//                             res.status(400).send ({status:false,errorMessage :err})
//                         }
//                 })
//             }else{
//                 res.status(200).send({status:false,errorMessage:"Email and Mobile are already used."})
//             }
//         }else{
//             res.status(400).send({status:false,errorMessage:"role in path and body not matched"})
//         }
//     }catch(error){
//         console.log('fail')
//     }
// })



module.exports = {insertHospitals}
