const noteRepo = require("./db/noteRepo");
const Note = require("./Models/note");

const repo = new noteRepo();
notes = repo.retrieveNotesFromMongoDb();
console.log({notes})