// THIS FILE IS JUST A SCRATCH PAD FOR TESTING/PLAYING DONT MARK IT

const noteRepo = require("./db/noteRepo");
const Note = require("./Models/note");
const mongo = require("./db/mongo")
// const repo = new noteRepo();
// let ready = repo.initiateMongo().then(() => {
//     notes = repo.retrieveNotesFromMongoDb();
//     console.log({notes})
// });

// const db = new mongo();
// const repo = new noteRepo();
// // repo.getNotesArrayFromMongo();
// console.log("about to call init")
// // repo.ensureConnection().then(() => console.log("past ensure"));
// repo.initRepo().then(() => repo.getNotesArrayFromMongo());
// console.log('about to enter while')

// interval = setInterval(() => {
//     if (!repo.repoReady) {
//         console.log("waiting for repo")
//     } else {
//         repo.getNotesArrayFromMongo().then((array) => console.log(array));
//         clearInterval(interval)
//     }
// },1000)

// console.log("past init")


// const repo = new noteRepo();
// console.log("about to init repo")
// repo.initRepo()
// .then( () => repo.getNotesArrayFromMongo())
// .then( (notes) => {
//     console.log({notes})
//     process.exit();
// });

const repo = new noteRepo();
repo.initRepo()
.then( () => repo.getNextId())
.then( (id) => {
    console.log(id["_id"])
    repo.dropConnection().then(() => console.log("dropped connections"));
})
.catch((error) => {
    console.log(error)
    done(error)
});

// repo.then()
// repo.mongoClient.db('noteTaker').command({ killAllSessions: [ ] });
// const repo = new noteRepo();
