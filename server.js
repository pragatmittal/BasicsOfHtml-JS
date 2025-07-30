var express=requ;ire('express');
var app=express()
var port=8080
app.use(express.static('frontend'))
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`)
})