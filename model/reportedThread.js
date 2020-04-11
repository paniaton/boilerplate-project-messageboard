var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const reportedThreadSchema = new Schema({
    threadId: String,
    reported: { type: Boolean, default: false }
})

const ReportedThread = mongoose.model("ReportedThread", reportedThreadSchema);          

let saveThreadReport = (threadId) => {
    let newReportedThread = new ReportedThread({
        threadId: threadId
        })
    
    return newReportedThread.save();
}

module.exports.saveThreadReport = saveThreadReport    