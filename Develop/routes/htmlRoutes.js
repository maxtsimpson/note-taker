function addHtmlRoutes (app,repo) {

    // Get a list of notes
    app.get("/html/notes", function(req, res) {
        let notes = repo.getNotes();
        console.log({notes})
        return res.json(notes);
    });

    // add a new note
    app.post("/html/notes", function(req, res) {
        let note = repo.addnote(req.body);
        return res.json(note);
    });

    //delete a note
    app.delete("/html/notes", function(req, res) {
        // need to get the id param from this url
        // let noteId = 
        let note = repo.removeNote(noteId);
    });

}

module.exports = addHtmlRoutes;

