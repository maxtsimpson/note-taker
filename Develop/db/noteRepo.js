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
        // console.log(this.collection)
        return await this.collection.find().toArray().then((notesArray) => notesArray)
    }

    async getNextId() {
        console.log("in getNextId") //this gets the current item with the highest id in the collection then returns that id + 1
        const maxId = await this.collection
        .find()
        .sort({_id:-1}) // -1 is sort descending
        .limit(1)
        .toArray() //toArray or it's a cursor object which is hard to deal with
        .then(note => note[0]._id) //returns an array with a single note object. get the id prop and return it

        return (maxId + 1)
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
        this.retrieveNotes();
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
        const result = await this.collection.deleteOne(
            { _id: parseInt(id)}
        )
        return `${result.deletedCount} document(s) was/were deleted.`;
    }

    async removeNote(noteID) {
        let index = this.notes.findIndex(n => n.id === noteID);
        this.notes.splice(index,1)
        return await this.deleteNoteById(noteID)
        .then((result) => result)
        .catch((error) => {throw error});
    }

    async addNote(noteDTO) {
        //this is to add another note to the repo
        // DTO stands for data transfer object
        // use DTO and create note as i want the repo to be the
        //  only place where notes are created, so i can
        // control ID's allocated

        //also not going to prevent duplicate notes so dont need to wait for the addNoteToMongo to return, just assume it works
        let { title, text } = noteDTO;
        let newNote = await this.createNote(title, text)
        this.notes.push(newNote);
        console.log(this.notes)
        await this.addNoteToMongo(newNote).catch((error) => {throw error});
        return this.addlocalId(newNote);
    }

    async createNote(title, text) {
        const newNote = await this.getNextId().then((id) => {
            return {_id:id, title: title, text: text}
        })
        return newNote
    }

}

module.exports = noteRepo;