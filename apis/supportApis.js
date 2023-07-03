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

module.exports = {insertHospitals}
