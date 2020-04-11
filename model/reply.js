var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const replySchema = new Schema({
    threadId: String,
    text: String, 
    created_on: { type: Date, default: Date.now() }
})

const Reply = mongoose.model("Reply", replySchema);

const saveReply = (threadId,text) => {
    let newReply = new Reply({threadId: threadId, text: text});
    return newReply.save();
}

const findThreeReply = (threadIdCollection) => {
    let promArray = threadIdCollection.map(tId => {
        return Reply.find({threadId: tId})
        .sort('-created_on')
        .limit(3)
        .exec()
    })
    return Promise.all(promArray)
}

const findAll = (tId) => {
        return Reply.find({threadId: tId})
        .sort('-created_on')
        .exec()
}

module.exports.findAll = findAll;
module.exports.saveReply = saveReply;
module.exports.findThreeReply = findThreeReply;
