const note = require('../Models/note');
const fs = require("fs");
const Mongo = require("./mongo")

class noteRepo {

    constructor(){
        this.notes = [];
        this.notes = this.retrieveNotes();
        this.nextId = 0;
        this.mongo = new Mongo();
    }



    getNextId() {
        console.log("in getNextId");
        let id = this.nextId
        this.nextId++
        return id;
    }

    storeNotes(){
        //this is to store notes to file or eventually to db
        if (this.notes.length > 0) {
            io.writeToFile("./db.json",JSON.stringify(this.notes,undefined,2))    
        }
    }

    retrieveNotesFromMongoDb(){
        this.notes = this.mongo.db.collection('notes').toArray();
    }

    retrieveNotes(){
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

    getNotes(){
        //this is to get the notes
        this.notes = this.retrievenotes(); // get the latest copy of the notes
        return this.notes.map(e => this.clonenote(e));
    }

    removeNote(noteId){
        //this should work as long as no-one edits a note id. private properties would be good
        let index = this.notes.findIndex(note => note.id === noteId);
        this.notes.splice(index,1)
        this.storeNotes();
    }

    addNote(noteDTO){
        //this is to add another note to the repo     
        // DTO stands for data transfer object
        // use DTO and create note as i want the repo to be the
        //  only place where notes are created, so i can
        // control ID's allocated
        let {title,text} = noteDTO;
        let newNote = this.createNote(title,text)
        this.notes.push(newNote);
        this.storeNotes();
        return newNote;
    }

    createNote(title,text){
        return new note(this.getNextId(),title,text)
    }

    createnNoteFromJSON(jsonObject){
        console.log("in createnNoteFromJSON");
        console.log({jsonObject});
        let {id,title,text} = jsonObject
        
        //if the note array is already defined and id is already used get the next one
        if (this.notes.length > 0) {
            if(this.notes.map(note => note.id).includes(id)){
                id = this.getNextId();
            }
        }

        if((id === "undefined") || (typeof id !== "number")){
            id = this.getNextId();
        }

        return new note(id,title,text);
    }

}

module.exports = noteRepo;