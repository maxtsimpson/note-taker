function addApiRoutes (app,repo) {

    // Get a list of notes
    app.get("/api/notes", function(req, res) {
        let notes = repo.getNotes();
        console.log({notes})
        return res.json(notes);
    });

    // add a new note
    app.post("/api/notes", function(req, res) {
        let note = repo.addnote(req.body);
        return res.json(note);
    });

    //delete a note
    app.delete("/api/notes/:id", async (req, res) => {
        const message = await repo.removeNote(req.params.id)
        .then(() => "removed note successfully");

        res.body(message)
    });

    

}

module.exports = addApiRoutes;

{"_id":{"$oid":"5ead092f67d270dd066e062c"},"\"dinner\"":"nachos"}