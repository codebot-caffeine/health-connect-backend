async function insertHospitals(){
    let collection = await getCollection("Hospitals")
    await collection.insertMany([{
        HospitalName:"Apollo",
        HospitalId:1,
        Address: "Hyderabad"
    },{
        HospitalName:"Apollo",
        HospitalId:1,
        Address: "Hyderabad"
    }]).then((res)=>{
        console.log(res)
    })
}
