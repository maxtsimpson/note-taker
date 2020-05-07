const noteRepo = require("../db/noteRepo");
const Note = require("../Models/note");

test("Can instantiate noteRepo instance", () => {
    const repo = new noteRepo();
    expect(typeof (repo)).toBe("object");
});

test("Can add note", () => {
    const repo = new noteRepo();
    const note = new Note("dinner","nachos and a beer");
    const result = repo.addNote(note);
    expect(typeof (result)).toBe("object");
});

// test("Can get a new id", done => { Test doesnt work

//     const repo = new noteRepo();

//     while(!repo.repoReady){

//     }
//     repo.getNextId()
//     .then( (id) => {
//         console.log({id})
//         expect(typeof (id).toBe("Number"))
//         done()
//     })
//     .catch((error) => {
//         console.log(error)
//         done(error)
//     });
// }); 

// test("Can get notes", done => { //doesnt work
//     const repo = new noteRepo();
//     repo.initRepo()
//     .then( () => repo.getNotes())
//     .then( (notes) => {
//         expect(Array.isArray(notes))
//         done()
//     })
//     .catch((error) => {
//         console.log(error)
//         done(error)
//     });
// });

