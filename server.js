
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

let Bins = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html');
})


app.post("/bin/create/:secret",(req, res)=>{
    if(req.params.secret != "beepbapbook"){
        res.send({success:false,message:"u scrub"});
        return;
    }
    let binId = randomString();
    console.log("Creating Bin:"+binId);
    Bins[binId] = [];
    res.send({success:true, binId:binId});
});


app.post("/bin/:binId",(req,res)=>{
    var sentData = req.body;
    var binId = req.params.binId;

    if(Object.keys(sentData).length === 0){
        res.send({success:false,message:"Empty Object"});
        return;
    }
    if(!Bins.hasOwnProperty(binId)){
        res.send({success:false,message:"Bad id"});
        return;
    }
    
    console.log("Recieved:" + JSON.stringify(sentData));
    sentData.createdDate = Date();
    Bins[binId].push(sentData);
    
    console.log("Added:" + JSON.stringify(sentData));
    res.send({success:true});
})


app.get("/bin/:binId",(req,res)=>{
    var binId = req.params.binId;
    if(!Bins.hasOwnProperty(binId)){
        res.send({success:false,message:"bad Id"});
        return;
    }
    var toSend = Bins[binId];
    console.log("Getting bin:" + binId);
    res.send({success:true,data:toSend});
})


function randomString(){
    const letters = "abcdefghijklmnopqrstuvwxyzRTYUIOPASDFGHJKLZXCVBNM";
    let output = "";
    for (let i = 0; i < 16; i++) {
        let letter = letters[Math.floor(Math.random()*letters.length)];
        output+=letter;
    }
    return output;
}


function saveBinsToFile(){
    fs.writeFile(__dirname+'/private/JsonBins.json',JSON.stringify({Bins:Bins}),(error)=>{
        if(error){ throw error;}
    });
}

function setBinsFromFile(){
    fs.readFile(__dirname+'/private/JsonBins.json','utf8', function(error, data) {
        if(error){ throw error; }
        console.log(data);
        var rawData = JSON.parse(data);//{Bins:[]}
        Bins = rawData.Bins;
      });
}


//============Setup==============

setBinsFromFile();

setInterval(() => {
    saveBinsToFile();
}, 120000);

//=============End Setup==========





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

