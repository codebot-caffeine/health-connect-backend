
var exp = require("express")

var app = exp()
app.use(exp.json())


app.get("/",(req,res)=>{
    res.send('running in 3000')
})


app.listen(3000)