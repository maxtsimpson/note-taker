const Note = require("../Models/note");

test("Can instantiate note instance", () => {
    const note = new Note("dinner","nachos and a beer");
    expect(typeof (note)).toBe("object");
});