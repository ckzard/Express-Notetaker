const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require('path');
const port = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


//home page
app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, '..', '..', 'index.html'), (error, data) => {
        if (error) {
            throw error;
        }
        
        res.sendFile(path.join(__dirname, "..", "..", "index.html"))
    })
})

//notes route
app.get("/notes", (req, res) => {
    
    fs.readFile(path.join(__dirname, '..', '..', 'notes.html'), (error, data) => {
        if (error) {
            throw error;
        }
        
        res.sendFile(path.join(__dirname, "..", "..", "notes.html"))
    })
})


//reads JSON data notes from db
app.get("/api/notes", (req, res) => {
    
    fs.readFile(path.join(__dirname, '..', '..', '..', 'db/db.json'), (error, data) => {
        if (error) {
            throw error;
        }
        console.log(JSON.parse(data))
    })
})

app.post("/api/notes", (req, res) =>  {
    
    //read what is in the current database json
    let currentDBJSON = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'db/db.json'), "utf-8", (error, data) => {
        if (error) {
            throw error;
        }
    })
    //convert data into a javascript object to manipulate
    let currentDB = JSON.parse(currentDBJSON);

    //take post data and push it to js db object
    var textTitle = req.body.textTitle;
    var textMain =  req.body.textMain;
    var fileText = {"title": textTitle,"text":textMain, "id" : currentDB.length};

    //checking if user missed either the title or text before adding to db
    if (!fileText.title || !fileText.text) {
        return;
    }
    currentDB.push(fileText);

    //overwrite database file with new data
    fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'db/db.json'), JSON.stringify(currentDB, null, 2), () => {
        console.log("appended...", currentDB);
    })
})

app.listen(port, () => {
    console.log(`"Listening on port", ${port}`)
    console.log(__dirname)
})