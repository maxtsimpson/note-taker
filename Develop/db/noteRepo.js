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
        console.log("in initRepo");
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        this.mongoClient = client
        console.log("client set, connecting");
        await client.connect().then(async (client) => {
            console.log("connected")
            this.collection = client.db('noteTaker').collection('notes')
            console.log("collection set about to set next id");
            this.nextId = this.collection.findOne({$query:{},$orderby:{_id:-1}})
            console.log("about to retrieve notes");
            this.retrieveNotes();
            this.repoReady = true
            console.log("repo is ready");
            return
        }).catch((reason) => {
            throw reason
        });
        
    }

    async getNotesArrayFromMongo() {
        console.log("in getNotesArrayFromMongo")
        console.log(this.collection)
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

    // async storeNotesArrayInMongo(){
    //     console.log("in storeNotesArrayInMongo")
    //     return await this.collection.updateMany(
    //         {}
    //         { upsert: true }
    //     )

    //     // .updateMany()

    //     var bulkUpdateOps = this.notes.map((notes) => {
    //         return {
    //             "updateOne": {
    //                 "filter": { "_id": doc.id },
    //                 "update": { "$set": { "name": doc.name } },
    //                 "upsert": true
    //             }
    //         };
    //     });
    // }

    storeNotes() {
        //this is to store notes to file or eventually to db
        console.log("in retrieveNotes")
        this.getNotesArrayFromMongo().then((notesArray) => {
            this.notes = notesArray
        })
    }


    retrieveNotes() {
        console.log("in retrieveNotes")
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

    async removeNote(noteId) {
        //this should work as long as no-one edits a note id. private properties would be good
        console.log("in removeNote")
        return await this.deleteNoteById(noteId).then((result) => result);

        // let index = this.notes.findIndex(note => note._id === noteId);
        // this.notes.splice(index, 1)
        // this.storeNotes();
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

}

module.exports = noteRepo;