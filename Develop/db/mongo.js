const {MongoClient} = require('mongodb');
const username = "max"
const password = "fIh0SsjisQvfhMBe"
const uri = `mongodb+srv://max:${password}@cluster0-fkwlp.mongodb.net/test?retryWrites=true&w=majority`;

class Mongo {

    constructor(){
        this.client = this.createClient();
        this.openConnection;
        this.db = this.client.db('noteTaker');
    }

    createClient(){
        console.log({uri})
        // const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const mongoClient = new MongoClient(uri);
        return mongoClient;
    }

    async executeAsync(command){
        try {
            return await this.client.executeAsync(command);        
        } catch (e) {
            console.error(e);
        }
    }

    async listDatabases(){
        return await listDatabases(client);
    }

    async openConnection(){
        return this.client.connect((err, client) => {
            if (err) {
                console.error(err)
            }
        });
    }

    async closeConnection(){
        return await this.client.closeConnection()
    }
}

module.exports = Mongo;