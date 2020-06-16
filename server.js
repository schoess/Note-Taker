const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const { networkInterfaces } = require("os");

// Express app setup
// =============================================================
var app = express();
var PORT = process.env.port || 3333;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Express handling data parseing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================



app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  try {
      let dataBase = await readFileAsync(path.join(__dirname, "/db/db.json"), "utf-8");
      return res.json(JSON.parse(dataBase));
  } catch (err) {
      console.log(err);
  }
});

app.post("/api/notes", async (req, res) => {
    let userInput = JSON.stringify(req.body);
    try {
        let dataBase = await readFileAsync(path.join(__dirname, "/db/db.json"), "utf-8");
        let noteArr = JSON.parse(dataBase);
        let createNote = JSON.parse(userInput);
        createNote.id = uuidv4();
        noteArr.push(createNote);
        await writeFileAsync(path.join(__dirname, "/db/db.json"), JSON.stringify(noteArr));
        console.log("Note added");
        return res.json(userInput);
    } catch (err) {
        console.log(err);
    } 
});

app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    let dataBase = fs.readFileSync(path.join(__dirname, "/db/db.json"), 'utf-8');
    let noteArr = JSON.parse(dataBase);
    for (note of noteArr) {
        if (note.id == noteId) {
            noteArr.pop(note);
            fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(noteArr));
        }
    }
    res.json({message: "File Deleted"});
});








app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});



// Create New Characters - takes in JSON input

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
