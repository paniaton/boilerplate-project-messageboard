var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const replyPassSchema = new Schema({
    replyId: String,
    delete_password: String
})

const ReplyPass = mongoose.model("ReplyPass", replyPassSchema);

const saveReplyPass = (repliId,delete_password) => {
    let newReplyPass = new ReplyPass({
        repliId: repliId,
        delete_password: delete_password
    })
    return newReplyPass.save();
}

module.exports.saveReplyPass = saveReplyPass;