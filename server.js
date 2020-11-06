const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.use(function(err, req, res, next) {
    console.error("== Error ==:" + err.stack)
    res.status(500).send('Something broke!');
});

let Bins = {};
let NeedToSave = false;

//====Utilities
function randomString() {
    const letters = "abcdefghijklmnopqrstuvwxyzRTYUIOPASDFGHJKLZXCVBNM";
    let output = "";
    for (let i = 0; i < 16; i++) {
        let letter = letters[Math.floor(Math.random() * letters.length)];
        output += letter;
    }
    return output;
}

function getFormattedDate() {
    return Date().split(" ").slice(1, 5).join(" ");
}


//====Routing

//Index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home/index.html');
});

//favicon
app.get("/favicon.ico",(req, res)=>{
    res.send().status(404);
});

//==Bins
    //Create
    app.post("/bin/create/:secret", (req, res) => {
        //var password = fs.readFileSync(__dirname+'/private/SupahSecrets.txt');
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

        //Dont save urls
        sentData = JSON.parse(JSON.stringify(sentData).replace(/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g, "*Redacted*"));

        if (Object.keys(sentData).length === 0) {
            res.send({ success: false, message: "Empty Object" });
            return;
        }
        if (!Bins.hasOwnProperty(binId)) {
            res.send({ success: false, message: "Bad id" });
            return;
        }
        addObjectToBin(binId, sentData);
        res.send({ success: true });
    });

    //Get
    app.get("/bin/:binId", (req, res) => {
        var binId = req.params.binId;
        if (!Bins.hasOwnProperty(binId)) {
            res.send({ success: false, message: "bad Id" });
            return;
        }
        var toSend = readBin(binId);
        res.send({ success: true, data: toSend });
    })
//==End bins
//Assets
app.get('/:area/assets/:filename', (req, res) => {
    var filename = req.params.filename;
    var area = req.params.area;
    var patha = __dirname + '/public/' + area + '/assets/' + filename;
    var pathb = __dirname + '/public/' + area + '/assets/dist/' + filename;
    
    try {
        fs.accessSync(patha);
        res.sendFile(patha);
    } 
    catch
    {
        try{
            fs.accessSync(pathb);
            res.sendFile(pathb);
        }
        catch{
            console.log("== Error Accessing invalid file: "+patha);
            res.send("Oops, looks like that doesn't exits.<br> Have a look <a href='/'>here</a> instead").status(404);
        }
    }
});
//html indexs
app.get("/:area", (req, res) => {
    var area = req.params.area;
    console.log("Page Accesed: " + area + " at " + getFormattedDate())
    mySendFile(__dirname + '/public/' + area + '/index.html',res);
});

//htmls
app.get("/:area/:page", (req, res) => {
    var area = req.params.area;
    var page = req.params.page;
    var path = __dirname + '/public/' + area + '/' + page + '.html';
    mySendFile(path,res);
});


function mySendFile(path,res){
    try{
        fs.accessSync(path)
        res.sendFile(path);
        return true;
    }catch{
        console.log("== Error Accessing invalid file: "+path);
        res.send("Oops, looks like that doesn't exits.<br> Have a look <a href='/'>here</a> instead").status(404);
        return false;

    }
}


//====Funcs
function createBin() {
    let binId = randomString();
    Bins[binId] = [];
    console.log("Creating Bin:" + binId + " " + getFormattedDate());
    NeedToSave = true;
    return binId;
}

function readBin(binId) {
    console.log("reading bin: " + binId + " " + getFormattedDate());
    if (Bins.hasOwnProperty(binId)) {
        return Bins[binId];
    } else {
        return null;
    }
}

function addObjectToBin(binId, object) {
    if (!object.hasOwnProperty("createdDate")) {
        object.createdDate = Date();
    }
    Bins[binId].push(object);
    NeedToSave = true;
    console.log("Added:" + JSON.stringify(object) + " at " + getFormattedDate());
}

//Files
function saveBinsToFile() {
    if (!NeedToSave) {
        return;
    }
    var path = __dirname + '/private/JsonBins.json';
    console.log("Saving to :" + path);
    console.log("Saving at :" + getFormattedDate());
    Bins.lastSaved = "" + Date();

    fs.writeFile(path, JSON.stringify(Bins), (error) => {
        if (error) { throw error; } else {
            NeedToSave = false;
        }

    });

}

function setBinsFromFile() {
    fs.readFile(__dirname + '/private/JsonBins.json', 'utf8', function(error, data) {
        if (error) { throw error; }
        var rawData = JSON.parse(data); //{[]}
        Bins = rawData;
        console.log("Bins Loaded");
    });
}




//===Startup

function startup() {

    setBinsFromFile();

    setInterval(() => {
        saveBinsToFile();
    }, 10 * 60000);

    console.log("setup Complete");
}




//Start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    startup();
});