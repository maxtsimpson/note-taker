const note = require('../Models/note');
const fs = require("fs");

class noteRepo {

    constructor(){
        this.notes = [];
        this.notes = this.retrieveNotes();
        this.nextId = 0;
    }

    getNextId() {
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

    retrieveNotes(){
        //this to get the notes from file or eventually db
        try {
            if (fs.existsSync("./db.json")) {
                let fileContents = fs.readFileSync("./db.json");
                let json = JSON.parse(fileContents);
                return json.map(j => this.createnoteFromJSON(j))
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
        //this should work as long as no-one edits an note id. private properties would be good
        let index = this.notes.findIndex(note => note.id === noteId);
        this.notes.splice(index,1)
        this.storeNotes();
    }

    addNote(note){
        //this is to add another note to the repo
        this.notes.push(note);
        this.storeNotes();
    }

    createNote(title,text){
        return new note(this.getNextId(),title,text)
    }

    createnNoteFromJSON(jsonObject){
        
        let {id,title,text} = jsonObject
        
        //if the note array is already defined and id is already used get the next one
        if (this.notes.length > 0) {
            if(this.notes.map(note => note.id).includes(id)){
                id = this.getNextId();
            }
        }

        return new note(id,title,text);
    }

}

module.exports = noteRepo;