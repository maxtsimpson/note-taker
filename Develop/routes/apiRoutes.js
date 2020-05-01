const noteRepo = require ('../db/noteRepo.js');

function addApiRoutes (app) {

    // Get a list of notes
    app.get("/api/notes", function(req, res) {
        return res.json(waitlistData);
    });

    // add a new note
    app.post("/api/notes", function(req, res) {
    return res.json(tableData);
    });

    //delete a note
    app.delete("/api/notes", function(req, res) {
        let reservation = reservationRepo.addReservation(req.body);
        res.json(reservation);
    });

}

module.exports = addApiRoutes;

