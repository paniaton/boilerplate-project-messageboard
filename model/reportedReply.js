var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const reportedReplySchema = new Schema({
    replyId: String,
    reported: { type: Boolean, default: false }
})

const ReportedReply = mongoose.model("ReportedReply", reportedReplySchema);          

let saveRepyReport = (replyId) => {
    let newReportedReply = new ReportedReply({
        threadId: replyId
    })
    
    return newReportedReply.save();
}

module.exports.saveRepyReport = saveRepyReport    