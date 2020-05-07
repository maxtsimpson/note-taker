const note = require('../Models/note');
const fs = require("fs");
const { MongoClient } = require('mongodb');
const username = "max"
const password = "fIh0SsjisQvfhMBe"
const uri = `mongodb+srv://max:${password}@cluster0-fkwlp.mongodb.net/test?retryWrites=true&w=majority`;

class noteRepo {

    constructor() {
        this.initRepo()
        this.repoReady = false
        this.collection = null
        this.mongoClient = null
    }

    //super useful resource https://developer.mongodb.com/quickstart/node-crud-tutorial

    async initRepo() {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        this.mongoClient = client
        await client.connect().then(async (client) => {
            this.collection = client.db('noteTaker').collection('notes')
            this.nextId = this.collection.findOne({$query:{},$orderby:{_id:-1}})
            this.repoReady = true
            return
        }).catch((reason) => {
            throw reason
        });

    }

    async getNotesArrayFromMongo() {
        return await this.collection.find().toArray()
    }

    async getNextId() {
        const maxId = await this.collection //this gets the current item with the highest id in the collection then returns that id + 1
        .find()
        .sort({_id:-1}) // -1 is sort descending
        .limit(1)
        .toArray() //toArray or it's a cursor object which is hard to deal with
        .then(note => note[0]._id) //returns an array with a single note object. get the id prop and return it

        return (maxId + 1)
    }

    async ensureConnection() { //not used. was trying to handle the db connection a bit smarter
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

    async dropConnections(){ //not used at the moment. 
        return await this.mongoClient.close({force:true})
    }

    async UpdateMongoNotes(){ //not currently used. not in the scope of the homework
        return await this.collection.updateMany(this.notes)
    }

    async addNoteToMongo(note){ //not used
        return await this.collection.insertOne(note)
    }

    async getNotes() {
        //this is to get the notes
        console.log(this.repoReady)
        while(!this.repoReady){
            //this is if it's called to soon after an initRepo. not a good solution though
        }
        const notes = await this.getNotesArrayFromMongo()
        //convert add an id to the notes as well, which is the same as the _id
        //because mongo uses _id as object id in its db
        //got this from url. the ... syntax must mean the spread of properties on the note object https://stackoverflow.com/questions/38922998/add-property-to-an-array-of-objects
        return notes.map(note => this.addlocalId(note))

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