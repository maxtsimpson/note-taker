const noteRepo = require("../Develop/db/noteRepo");

const repo = new noteRepo();

const cleanup = () => {
    repo.mongoClient.close()
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);