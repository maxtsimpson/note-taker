var path = require('path');
module.exports = function addHtmlRoutes(app) {

    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    // Wild card
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    })
}
