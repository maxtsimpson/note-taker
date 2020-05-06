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
        const maxId = await this.collection.find().sort({_id:-1}).limit(1).toArray().then(id => id._id)
        // const maxId = await this.collection.findOne({$query:{},$orderby:{_id:-1}}).then((id) => id._id)
        console.log("============== maxid ===============")
        console.log({maxId})
        return (parseInt(maxId) + 1)
        return await this.collection.findOne({$query:{},$orderby:{_id:-1}}).then((id) => id._id)
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
        console.log("in storeNotes")       
        this.addNoteToMongo().then((notesArray) => {
            this.notes = notesArray
        })
    }

    async UpdateMongoNotes(){
        return await this.collection.updateMany(this.notes)
    }

    async addNoteToMongo(note){
        return await this.collection.insertOne(note)
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
            //this is if it's called to soon after an initRepo. not a good solution though
        } 
        //convert add an id to the notes as well, which is the same as the _id 
        //because mongo uses _id as object id in its db
        //got this from url. the ... syntax must mean the spread of properties on the note object https://stackoverflow.com/questions/38922998/add-property-to-an-array-of-objects
        return this.notes.map(note => this.addlocalId(note))
        // return this.notes.map(note => ({ ...note, id: note._id }))
        
    }
    
    addlocalId(note){
        return { ...note, id: note._id }
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
        console.log({noteId})
        return await this.deleteNoteById(noteId).then((result) => result);

        // let index = this.notes.findIndex(note => note._id === noteId);
        // this.notes.splice(index, 1)
        // this.storeNotes();
    }

    async addNote(noteDTO) {
        //this is to add another note to the repo     
        // DTO stands for data transfer object
        // use DTO and create note as i want the repo to be the
        //  only place where notes are created, so i can
        // control ID's allocated

        //also not going to prevent duplicate notes so dont need to wait for the addNoteToMongo to return, just assume it works
        console.log("in addNote")
        let { title, text } = noteDTO;
        let newNote = await this.createNote(title, text)
        console.log("finished createNote")
        console.log({newNote})
        this.notes.push(newNote);
        console.log("pushed new note")
        console.log(this.notes)
        console.log("about to add to Mongo")
        this.addNoteToMongo().catch((error) => {throw error});
        console.log("returning newNote via addLocalid")
        return this.addlocalId(newNote);
    }

    async createNote(title, text) {
        console.log("in createNote")
        const newNote = await this.getNextId().then((id) => {
            console.log("getNextId returned: " + id)
            // console.log("createNote id")
            // console.log({id})
            // return new note(id, title, text)
            return {_id:id, title: title, text: text}
        })
        console.log("createNote newNote")
        console.log({newNote})
        return newNote
        
    }

}

module.exports = noteRepo;