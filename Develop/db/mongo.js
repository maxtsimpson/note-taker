const { MongoClient } = require('mongodb');
const username = "max"
const password = "fIh0SsjisQvfhMBe"
const uri = `mongodb+srv://max:${password}@cluster0-fkwlp.mongodb.net/test?retryWrites=true&w=majority`;

class Mongo {

    constructor() {

        // this.openConnection();
        // return (async () => {
        //     this.client = this.createClient();
        //     await this.openConnection();
        //     this.db = this.client.db('noteTaker');
        //     return this; // when done
        // })();

        // return new Promise((resolve,reject) => {
        //     this.client = this.createClient();
        //     this.openConnection()
        //         .then(() => {
        //             console.log("connection opened");
        //             // this.listDatabases();
        //             // this.client.db().admin().listDatabases({ nameOnly: true}).then((result) => { 
        //             //    console.log(result) 
        //             // });
        //             this.db = this.client.db('noteTaker')
        //             // this.db = this.client.db('noteTaker').collections().then((result) => {
        //                 // console.log("======================") 
        //                 // console.log(result) 
        //                 // console.log("======================") 
        //             // });
        //             resolve()
        //         }, () => {
        //             console.log("connection rejected")
        //             reject()
        //         }).catch((error) => {
        //             console.log("an error occured" + error)
        //             reject(error)
        //         })
        // })

        // return (async () => {
        //     this.client = this.createClient();
        //     this.openConnection()
        //         .then(() => {
        //             console.log("connection opened");
        //             this.db = this.client.db('noteTaker');
        //         }, () => {
        //             console.log("connection rejected")
        //         }).catch((error) => {
        //             console.log("an error occured" + error)
        //         })
        // })();
        // this.db = this.client.db('noteTaker');
        // console.log("db set");    
        // this.db = this.client.db('noteTaker');
    }

    createClient() {
        // console.log({ uri })
        return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        // const mongoClient = new MongoClient(uri);

    }

    async executeAsync(command) {
        try {
            return await this.client.executeAsync(command);
        } catch (e) {
            console.error(e);
        }
    }

    listDatabases() {
        try {
                return this.client.db().admin().listDatabases({ nameOnly: true}).then(() => { 
            });
        } catch (error) {

        }
    }

    async openConnection() {
        // try {
        // console.log(this.client)
        return this.client.connect()

        // this.client.connect().then(() => {
        //     console.log("this.client connected")
        //     return
        // });
        // } catch (error) {
        //     console.error(error);
        // }
    }

    closeConnection() {
        try {
            this.client.closeConnection().then(() => {
                return
            });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Mongo;