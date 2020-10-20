
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let Bins = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html');
})


app.post("/bin/:secret",(req, res)=>{
    if(req.params.secret != "beepbapbook"){
        res.send({success:false,message:"u scrub"});
        return;
    }
    let binId = randomString();
    console.log("Creating Bin:"+binId);
    Bins[binId] = [];
    res.send({success:true, binId:binId});
});


app.patch("/bin/:binId",(req,res)=>{
    var sentData = req.body;
    var binId = req.params.binId;
    
    if(!Bins.hasOwnProperty(binId)){
        res.send({success:false,message:"Bad id"});
        return;
    }
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





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
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

    
}
