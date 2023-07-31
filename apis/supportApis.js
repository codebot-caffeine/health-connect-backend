var {getCollection} = require('./editCollections')
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
let nodeGeocoder = require('node-geocoder');
//geo coder testing
let options = {
    provider: 'openstreetmap'
};
   
let geoCoder = nodeGeocoder(options);

// const Geocodio = require('geocodio-library-node');
// const geocoder = new Geocodio('d4e40b0a006abd0500dd50654406a6b64d56fd0');

function generatePassword() {
    var length = 12,
        charset = 
       "0123456789",
        password = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

async function returnLocation(address){
    let location;
    let obtained = [];
    await geoCoder.geocode(address).then((res)=>{
       obtained.push(res)
    })
    // console.log(location)
}

async function insertHospitals(){
    let collection = await getCollection("hospitals")
    let result = excelToJson({
        source: fs.readFileSync("gpslistnew.xlsx"), // fs.readFileSync return a Buffer
        header:{
            // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
            rows: 1 // 2, 3, 4, etc.
        }
    });
    result = result['gps-list-new']
    result = result.map( (each)=>{    
        let obj = {}
        obj.HospitalName =  each.A,
        obj.HospitalId  =  parseInt(generatePassword())
        obj.Address =  each.G
        obj.Mobile = each.D ? parseInt(String(each.D).split(' ').join().replaceAll(',','')) : -1
        obj.Website  = each.E ? each.E : ''
        obj.Doctors = []
        obj.Location = {latitude: each.K,longitude:each.L}
        // obj._id = parseInt(generatePassword())
        return obj
    })
    console.log(result)
    // console.log(resultSheet.GPslist_geocodio_4f29734cc22d75)
    // console.log([...result])
    await collection.insertMany(result).then((res)=>{
        console.log(res)
    })
}

 //     const filter = {"_id": b[0]._id};
        //     const deleteDoc = {
        //         $unset:{
        //             Slots: []
        //         }
        //     }
        //    await collection.updateOne(filter, deleteDoc).then((result)=>{
        //         res.status(200).send({
        //             status:true,
        //             response: `${result.matchedCount} document(s) matched the filter, added slots ${result.modifiedCount} document(s)`
        //         })
        //     }).catch((error)=>{
        //         res.status(200).send({
        //             status:false,
        //             errorMessage: error
        //         })
        //     });

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

// serverHttp.listen(port,()=>{
//     // getDatabasesAndCollections().then((res)=>{
//     //     console.log(res)
//     // })
//     console.log(`server started on ${port}`)
//     //"Name","Gender","DOB","Postcode","Email","Mobile","Age","Password","Role","Experience","Specalization","HospitalName","HospitalId","Address","Doctors","Mobile","Website","User","Doctor","BookedSlot","Hospital","Prescription"
//     let fields = ["Name","Gender","DOB","Postcode","Email","Mobile","Password","Role","Experience","Specalization","HospitalId","Address"]//["DrugName","Dosage","Days","ConsultationId","Comments"]
//     // modifyCollection("doctors",fields)
//     // geoCode(' rk beach Visakhapatnam')
//     // dropCollection("root-db","users-auth")
//     // getData("users")
//     // insertHospitals()
//     // getData("users")
//     // getData("doctors")
//     // getCollectionsList("root-db").then((res)=>{
//     //     console.log(res)
//     // })
//     // createCollectionHospitals()

//     // const result = excelToJson({
//     //     source: fs.readFileSync("GP's list.xlsx"), // fs.readFileSync return a Buffer
//     //     header:{
//     //         // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
//     //         rows: 1 // 2, 3, 4, etc.
//     //     }
//     // });
//     // console.log(result)
//     // chatApp(port)
// })


module.exports = {insertHospitals}
