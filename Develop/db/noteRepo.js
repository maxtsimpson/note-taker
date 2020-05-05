const note = require('../Models/note');
const fs = require("fs");
const Mongo = require("./mongo")
const { MongoClient } = require('mongodb');
const username = "max"
const password = "fIh0SsjisQvfhMBe"
const uri = `mongodb+srv://max:${password}@cluster0-fkwlp.mongodb.net/test?retryWrites=true&w=majority`;

class noteRepo {

    constructor() {
        this.initRepo()
        this.notes = [];
        this.nextId = 0;
        this.repoReady = false
        this.collection = null
    }

    async initRepo(){
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        await client.connect().then(async (client) => {
            this.collection = client.db('noteTaker').collection('notes')
            this.repoReady = true
            return
        }).catch((reason) => {
            throw reason
        });
    }

    async getNotesArrayFromMongo (){
        return await this.collection.find().toArray().then((notesArray) => notesArray)
    }

    getNextId() {
        let id = this.nextId
        this.nextId++
        return id;
    }

    // getConnection(){
    //     console.log(`starting `)
    //     if (this.mongoClient.isConnected()) {
    //         console.log("client is already connected")
    //         return new Promise((resolve,reject) => {
    //             resolve(this.mongoClient);
    //             reject();
    //         })
    //     }
    //     console.log("new connection")
    //     return new Promise((resolve,reject) => {
    //         console.log("in promise")
    //         console.log("1================")
    //         console.log(this)
    //         console.log("1================")
    //         this.mongoClient.connect()
    //         .then(() => resolve())
    //         .catch((error) => {
    //             reject(error);
    //             throw error;
    //         })
    //         // this.mongoClient.connect((error) => {
    //         //     if (error) {
    //         //         // console.log("ERROR IN CONNECTION")
    //         //         throw error
    //         //         // reject(error);
    //         //         // return;
    //         //     }
    //         //     console.log("was not an error")
    //         //     console.log("================")
    //         //     console.log(this)
    //         //     console.log("================")
    //         //     this.connection = connectedClient;
    //         //     resolve(connectedClient);
                
                
    //         // })
    //         console.log("skipped callback")
    //     })
    // }

    // storeNotes() {

    //     //this is to store notes to file or eventually to db
    //     if (this.notes.length > 0) {
    //         if (!this.mongoClient.isConnected()) {
    //             this.mongoClient.connect().then(() => {
    //                 console.log("connection opened");
    //                 this.collection.insertOne()
    //                 // this.mongoClient.db('noteTaker').collection('notes').
    //             });
    //         }
    //     }
    // }




    retrieveNotes() {
        this.getNotesArrayFromMongo().then((notesArray) => {
            this.notes = notesArray
        })
    }

    getNotes() {
        //this is to get the notes
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