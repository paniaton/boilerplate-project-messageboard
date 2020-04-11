var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const threadSchema = new Schema({
    board: String,
    text: String,
    created_on: { type: Date, default: Date.now() },
    bumped_on: { type: Date, default: Date.now() },
    replycount: { type: Number, default: 0 }
})

const Thread = mongoose.model("Thread", threadSchema);

const saveThread = (board,text) => {
    let newThread = new Thread({
        board: board,
        text: text
    })
    
       //falta hashearla
    return newThread.save()
    }

const updateBumpDate = (threadId) => {
    return Thread.findByIdAndUpdate(threadId,{bumped_on: Date.now(), $inc: { replycount: 1 } })
}

const findThreads = (board) => {
    return Thread.find()
    .where('board').equals(board)
    .sort('-bumped_on')
    .limit(10)
    .exec()
}

const findByid = (threadId) => {
    return Thread.findById(threadId)
    .exec()
}

module.exports.findByid = findByid;
module.exports.findThreads = findThreads;
module.exports.saveThread = saveThread;
module.exports.updateBumpDate = updateBumpDate;
//module.exports.Model = Model 
//module.exports = mongoose.model("Thread", threadSchema);