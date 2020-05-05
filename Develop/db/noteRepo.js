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
        this.repoReady = false
        this.collection = null
        this.mongoClient = null
        // this.timeToDropConnection = 0; //a counter to keep the connection open for x seconds but eventually drop it
    }

    //super useful resource https://developer.mongodb.com/quickstart/node-crud-tutorial

    async initRepo() {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        this.mongoClient = client
        await client.connect().then(async (client) => {
            this.collection = client.db('noteTaker').collection('notes')
            this.nextId = this.collection.findOne({$query:{},$orderby:{_id:-1}})
            // this.retrieveNotes();
            this.repoReady = true
            return
        }).catch((reason) => {
            throw reason
        });
        
    }

    async getNotesArrayFromMongo() {
        return await this.collection.find().toArray().then((notesArray) => notesArray)
    }

    async getNextId() {
        // let id = this.nextId
        // this.nextId++
        // return id;

        return await this.collection.findOne({$query:{},$orderby:{_id:-1}})
    }



    async ensureConnection() {
        return new Promise((resolve, reject) => {
            if (this.mongoClient.isConnected()) {
                resolve();
            } else {
                this.mongoClient.connect()
                .then(async (client) => {
                    this.collection = client.db('noteTaker').collection('notes')
                    this.repoReady = true
                    resolve();
                })
                .catch((reason) => {
                    reject(reason);
                });
            }
        });
    }

    async dropConnections(){
        return await this.mongoClient.close({force:true})
    }

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
        console.log(this.repoReady)
        while(!this.repoReady){
            
        }
        return this.notes
        
    }

    async deleteNoteById(id){
        result = await this.collection.deleteOne(
            {_id: id}
        )
        console.log({result})
        console.log(`${result.deletedCount} document(s) was/were deleted.`);
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