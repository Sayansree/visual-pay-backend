const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.post('lakshmi',(req,res)=>{
    console.log(req.body)
    res.sendStatus(200);
});
const server = app.listen(PORT, () => {
  console.log("server is running on port", server.address().port);
});