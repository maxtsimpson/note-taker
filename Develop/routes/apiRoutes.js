function addApiRoutes (app,repo) {

    // Get a list of notes
    app.get("/api/notes", async function(req, res) {
        let notes = await repo.getNotes();
        return res.json(notes);
    });

    // add a new note
    app.post("/api/notes", async function(req, res) {
        let note = await repo.addNote(req.body)
        .then((note) => note)
        .catch((error) => {throw error});
        
        return res.json(note)
    });

    //delete a note
    app.delete("/api/notes/:id", async (req, res) => {
        const message = await repo.removeNote(req.params.id)
        .then(result => result)
        .catch((error) => {throw error});;

        res.json(message)
    });

}

module.exports = addApiRoutes;