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
        console.log(`id is: ${req.params.id}`)
        const message = await repo.removeNote(req.params.id)
        .then((result) => `removed note successfully\n${result}`);

        res.body(message)
    });

    

}

module.exports = addApiRoutes;