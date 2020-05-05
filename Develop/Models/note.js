class note {
    constructor(id,title,text){
        this._id = id; //_id convention matches what mongodb expects
        this.title = title;
        this.text = text;
    }
}

 module.exports = note;