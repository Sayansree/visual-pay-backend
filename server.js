const express = require('express');
// var cors = require('cors');
const app = express();
// app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 5000;

lk={}
vp={}
an={}
app.post('/lakshmi',(req,res)=>{
    console.log(req.body)
        lk=req.body
    res.sendStatus(200);
});
app.get('/lakshmi',(req,res)=>{
    res.send(lk)
});
app.post('/visualpay',(req,res)=>{
    console.log(req.body)
    vp=req.body
    res.sendStatus(200);
});
app.get('/visualpay',(req,res)=>{
    res.send(vp)
});
app.post('/ansuman',(req,res)=>{
    console.log(req.body)
    an=req.body
    res.sendStatus(200);
});
app.get('/ansuman',(req,res)=>{
    res.send(an)
});


const server = app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});