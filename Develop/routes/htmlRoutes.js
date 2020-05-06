var path = require('path');
module.exports = function addHtmlRoutes(app) {

    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    app.get("/favicon.ico", function (req, res) {
        //just so this chrome doesnt kill us
    })

    // Wild card
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    })
}
