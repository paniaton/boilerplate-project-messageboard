var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const threadPassSchema = new Schema({
    threadId: String,
    delete_password: String
})

const ThreadPass = mongoose.model("ThreadPass", threadPassSchema);  

let saveThreadPass = (threadId,delete_password) => {
    let newThreadPass = new ThreadPass({
        threadId: threadId,
        delete_password: delete_password
    })
    return newThreadPass.save();
}

module.exports.saveThreadPass = saveThreadPass    