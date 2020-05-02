const note = require('../Models/note');
const fs = require("fs");
const Mongo = require("./mongo")

class noteRepo {

    constructor() {
        this.notes = [];
        // this.notes = this.retrieveNotes();
        this.nextId = 0;
        this.mongo = new Mongo()
        this.mongoClient = this.mongo.createClient();
        // console.log(mongoClient)
        this.mongoClient.connect().then(() => {
            console.log("connection opened");
            this.retrieveNotesFromMongoDb().then((notesArray) => {
                this.notes = notesArray
                console.log(this.notes)
            })

            // let cursor = this.mongoClient.db('noteTaker').collection('notes');


            // this.notes = this.mongoClient.db('noteTaker').collections();
        });
        // Mongo.openConnection(this.mongo).then(() => {
        //     console.log("connection opened");
        //     this.db = this.client.db('noteTaker');
        // })
        // this.mongo.then(() => {
        //     this.retrieveNotesFromMongoDb().then((notesArray) => {
        //         this.notes = notesArray
        //         console.log(this.notes)
        //     })

        // })
        // this.initiateMongo(this);
        // this.dbReady = false;
    }

    // initiateMongo(noteRepo){
    //     return new Mongo()
    // }

    // async initiateMongo(noteRepo){
    //     return Promise.resolve().then(noteRepo => {
    //         noteRepo.mongo = new Mongo();
    //     });
    //     // console.log("in initiateMongo")
    //     // this.mongo = new Mongo();
    //     // this.dbReady = true
    //     // this.mongo.listDatabases();
    //     // console.log("db should now be ready")
    // }

    getNextId() {
        console.log("in getNextId");
        let id = this.nextId
        this.nextId++
        return id;
    }

    storeNotes() {
        //this is to store notes to file or eventually to db
        if (this.notes.length > 0) {
            io.writeToFile("./db.json", JSON.stringify(this.notes, undefined, 2))
        }
    }

    async retrieveNotesFromMongoDb() {
        console.log("in retrieveNotesFromMongoDb")
        // console.log(this.mongo)
        // console.log(this.mongo.db)
        let cursor = this.mongoClient.db('noteTaker').collection('notes').find()
        // let cursor = db.collection('notes')
        console.log({cursor})
        return await cursor.toArray();
    }

    retrieveNotes() {
        //this to get the notes from file or eventually db
        try {
            if (fs.existsSync("./db.json")) {
                let fileContents = fs.readFileSync("./db.json");
                let json = JSON.parse(fileContents);
                return json.map(j => this.createNoteFromJSON(j))
            }
        } catch (error) {
            throw error
            return [];
        }
    }

    getNotes() {
        //this is to get the notes
        this.notes = this.retrievenotes(); // get the latest copy of the notes
        return this.notes.map(e => this.clonenote(e));
    }

    removeNote(noteId) {
        //this should work as long as no-one edits a note id. private properties would be good
        let index = this.notes.findIndex(note => note.id === noteId);
        this.notes.splice(index, 1)
        this.storeNotes();
    }

    addNote(noteDTO) {
        //this is to add another note to the repo     
        // DTO stands for data transfer object
        // use DTO and create note as i want the repo to be the
        //  only place where notes are created, so i can
        // control ID's allocated
        let { title, text } = noteDTO;
        let newNote = this.createNote(title, text)
        this.notes.push(newNote);
        this.storeNotes();
        return newNote;
    }

    createNote(title, text) {
        return new note(this.getNextId(), title, text)
    }

    createnNoteFromJSON(jsonObject) {
        console.log("in createnNoteFromJSON");
        console.log({ jsonObject });
        let { id, title, text } = jsonObject

        //if the note array is already defined and id is already used get the next one
        if (this.notes.length > 0) {
            if (this.notes.map(note => note.id).includes(id)) {
                id = this.getNextId();
            }
        }

        if ((id === "undefined") || (typeof id !== "number")) {
            id = this.getNextId();
        }

        return new note(id, title, text);
    }

}

module.exports = noteRepo;