const noteRepo = require ('../db/noteRepo.js');

function addApiRoutes (app) {

    // Get a list of notes
    app.get("/api/notes", function(req, res) {
        let notes = noteRepo.getNotes();
        console.log({notes})
        return res.json(notes);
    });

    // add a new note
    app.post("/api/notes", function(req, res) {
        let note = noteRepo.addnote(req.body);
        return res.json(note);
    });

    //delete a note
    app.delete("/api/notes", function(req, res) {
        // need to get the id param from this url
        // let noteId = 
        let note = noteRepo.removeNote(noteId);
    });

}

module.exports = addApiRoutes;

