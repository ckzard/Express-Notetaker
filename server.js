const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require('path');
const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


//home page
app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, 'public/index.html'), (error, data) => {
        if (error) {
            throw error;
        }
        
        res.sendFile(path.join(__dirname, "public/index.html"))
    })
})

//notes route
app.get("/notes", (req, res) => {
    
    fs.readFile(path.join(__dirname, 'public/notes.html'), (error, data) => {
        if (error) {
            throw error;
        }
        
        res.sendFile(path.join(__dirname, "public/notes.html"))
    })
})


//reads JSON data notes from db
app.get("/api/notes", (req, res) => {
    console.log("someone requested")
    let notes = fs.readFileSync('db/db.json', 'utf-8', (error, data) => {
        if (error) {
            throw error;
        }
        
    })
    res.send(notes);
})

app.post("/api/notes", (req, res) =>  {
    //read what is in the current database json
    let currentDBJSON = fs.readFileSync(path.join(__dirname, 'db/db.json'), "utf-8", (error, data) => {
        if (error) {
            throw error;
        }
    })
    //convert data into a javascript object to manipulate
    let currentDB = JSON.parse(currentDBJSON);
    var noteMain = {title : req.body.title, text : req.body.text, id : currentDB.length + 1} 
    currentDB.push((noteMain));

    fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(currentDB, null, 2), () => {
    })
    res.sendFile(path.join(__dirname, "notes.html"));
})

app.listen(port, () => {
    console.log(`"Listening on port", ${port}`)
})