const { createSecretKey } = require('crypto');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { start } = require('repl');
const app = express();
const port = 3000;

app.use(express.json());

let Bins = {};
let NeedToSave = false;

//====Utilities
function randomString(){
    const letters = "abcdefghijklmnopqrstuvwxyzRTYUIOPASDFGHJKLZXCVBNM";
    let output = "";
    for (let i = 0; i < 16; i++) {
        let letter = letters[Math.floor(Math.random()*letters.length)];
        output+=letter;
    }
    return output;
}


//====Routing

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//Create
app.post("/bin/create/:secret", (req, res) => {
    if (req.params.secret != "beepbapbook") {
        res.send({ success: false, message: "u scrub" });
        return;
    }
    var binId = createBin();

    res.send({ success: true, binId: binId });
});

//Add
app.post("/bin/:binId", (req, res) => {
    var sentData = req.body;
    var binId = req.params.binId;

    if (Object.keys(sentData).length === 0) {
        res.send({ success: false, message: "Empty Object" });
        return;
    }
    if (!Bins.hasOwnProperty(binId)) {
        res.send({ success: false, message: "Bad id" });
        return;
    }
    addObjectToBin(binId,sentData);
    NeedToSave = true;
    res.send({ success: true });
});

//Get
app.get("/bin/:binId",(req,res)=>{
    var binId = req.params.binId;
    if(!Bins.hasOwnProperty(binId)){
        res.send({success:false,message:"bad Id"});
        return;
    }
    var toSend = readBin(binId);
    console.log("Getting bin:" + binId);
    res.send({success:true,data:toSend});
})


//====Funcs
function createBin(){
    let binId = randomString();
    Bins[binId] = [];
    console.log("Creating Bin:" + binId);
    return binId;
}

function readBin(binId){
    console.log("reading bin: "+binId);
    if(Bins.hasOwnProperty(binId)){
        return Bins[binId];
    }else{
        return null;
    }
}

function addObjectToBin(binId, object) {
    if (!object.hasOwnProperty("createdDate")) {
        object.createdDate = Date();
    }   
    Bins[binId].push(object);
    console.log("Added:" + JSON.stringify(object));
}

//Files
function saveBinsToFile(){
    if(!NeedToSave){
        console.log("No activity, No save");
    }
    var path = __dirname+'/private/JsonBins.json';
    console.log("Saving to :" + path);

    fs.writeFile(path,JSON.stringify(Bins),(error)=>{
        if(error){ throw error;}
    });
}

function setBinsFromFile(){
    fs.readFile(__dirname+'/private/JsonBins.json','utf8', function(error, data) {
        if(error){ throw error; }
        console.log(data);
        var rawData = JSON.parse(data);//{[]}
        Bins = rawData;
      });
}




//===Startup

function startup(){
    /*
    testing save
    var myBinId = createBin();
    addObjectToBin(myBinId,{text:"the first text?!"});
    console.log(JSON.stringify(readBin(myBinId)));

    saveBinsToFile();
    */
    setBinsFromFile();

    setInterval(() => {
        saveBinsToFile();
    }, 10*60000);

    console.log("setup Complete");
}




//Start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    startup();
});
  
  
