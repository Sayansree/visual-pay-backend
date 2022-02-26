
// create an express app
const express = require("express");
const cors = require("cors");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const app = express();
const config = require("./config");
var axios = require("axios");
const localStorage = require("localStorage");

const createData = require("./util/consent_detail");
const requestData = require("./util/request_data");
// var AuthController = require('./AuthController');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
// app.use("/",AuthController)
app.get("/", function (req, res) {
  res.send("Hello");
});

db={
phone:"",
pin:"",
id:"j"
}

const checkPhone=(phn)=>{//verified
  console.log("check phone")
  return db.phone==phn
  
}
const addUser=(phn,pin)=>{
  console.log("adduser")
  db.phone=phn
  db.pin=pin
}
const checkAuth=(phn,pin)=>{//verified
  console.log("check auth")
  return db.phone==phn && db.pin==pin
}
const addId=(phn,id)=>{
  console.log("addId")
  db.id=id
}
const delUser=(phn)=>{
  console.log("del user")
  db.phone=""
  db.pin=""
  db.id=null
}
const getid=(phn)=>{
  console.log("get id")
  return db.id
}
app.get('/checklogin', (req, res)=> {
  var token = req.headers['x-access-token'];
  if (!token) return res.send({ auth: false,wait:false, message: 'No token provided.' });
  jwt.verify(token,config.JWT_secret, (err, decoded)=> {
  if (err) return res.send({ auth: false,wait:false, message: 'Failed to authenticate token.' });
  res.send({auth:true,wait:getid(decoded.phone)==null,message:"login successful"});
  });
});
app.post("/consent/:mobileNumber", (req, res) => {
  localStorage.setItem("consent", "Pending");
 
  var token = req.headers['x-access-token'];
  if (token) 
    jwt.verify(token,config.JWT_secret, (err, decoded)=> {
    if (!err) res.send({ url:"https://ansuman528.github.io/VisualPe", token: token });
    })
  obj={
    phone : req.params.mobileNumber,
    // hash : bcrypt.hashSync((new Date()).toUTCString(), 8)
  }
  var token = jwt.sign(obj, config.JWT_secret, {expiresIn: 86400 });

  if(checkPhone(req.params.mobileNumber))
    if(checkAuth(req.params.mobileNumber,req.body.pin))
      res.send({ url:"https://ansuman528.github.io/VisualPe", token: token }); 
    else
      res.send({ url:"https://ansuman528.github.io/VisualPe/login.html", token: null });
  else{
    let body = createData(req.params.mobileNumber);
    var requestConfig = {
      method: "post",
      url: config.api_url + "/consents",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": config.client_id,
        "x-client-secret": config.client_secret,
        },
      data: body,
    };
  axios(requestConfig)
    .then( (response)=> {
      let url = response.data.url;
      //write phone no pin to db
      addUser(req.params.mobileNumber,req.body.pin)
      res.send({"url":url,"jwt":token});
    })
    .catch(function (error) {
      console.log(error);
      console.log("Error");
    });
  }
});

////// CONSENT NOTIFICATION
var body={}
app.post("/visualpay", (req, res) => {
   body = req.body;
  if (body.type === "CONSENT_STATUS_UPDATE") {
    if (body.data.status === "ACTIVE") {
      console.log("In Consent notification");
      addId(body.data.Detail.Customer.id.split("@")[0],body.consentId)
      fi_data_request(body.consentId);
    } else {
      delUser(body.data.Detail.Customer.id.split("@")[0])
      localStorage.setItem("jsonData", "Rejected");
    }
  }
  if (body.type === "SESSION_STATUS_UPDATE") {
    if (body.data.status === "COMPLETED") {
      console.log("In FI notification");
      fi_data_fetch(body.dataSessionId);
    } else {
      localStorage.setItem("jsonData", "PENDING");
    }
  }

  res.send("OK");
});
app.get("/visualpay", (req, res) => {
  res.send(body);
})
////// FI DATA REQUEST

const fi_data_request = async (consent_id) => {
  console.log("In FI data request");
  let request_body = requestData(consent_id);
  var requestConfig = {
    method: "post",
    url: config.api_url + "/sessions",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": config.client_id,
      "x-client-secret": config.client_secret,
    },
    data: request_body,
  };

  axios(requestConfig)
    .then(function (response) {
      console.log("Data request sent");
    })
    .catch(function (error) {
      console.log(error);
      console.log("Error");
    });
};

////// FETCH DATA REQUEST

const fi_data_fetch = (session_id) => {
  console.log("In FI data fetch");
  var requestConfig = {
    method: "get",
    url: config.api_url + "/sessions/" + session_id,
    headers: {
      "Content-Type": "application/json",
      "x-client-id": config.client_id,
      "x-client-secret": config.client_secret,
    },
  };
  axios(requestConfig)
    .then(function (response) {
      localStorage.setItem("jsonData", JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
      console.log("Error");
    });
};

app.post("/redirect", (req, res) => {
  res.send(localStorage.getItem("consent"));
});

///// GET DATA
app.get("/get-data/DEPOSIT", (req, res) => {
  res.send(JSON.parse(localStorage.getItem("jsonData")));
});
app.get("/get-data/:type", (req, res) => {
  res.send(config.fiData[req.params.type]);
});

app.listen(config.port || 3000, () => console.log("Server is running..."));
