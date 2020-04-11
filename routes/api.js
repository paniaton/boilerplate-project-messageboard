/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


var Thread = require('../model/thread');
var ThreadPass = require('../model/threadPass');
var ThreadReport = require('../model/reportedThread');
var Reply = require('../model/reply');
var ReplyPass = require('../model/replyPass');
var ReplyReport = require('../model/reportedReply');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/*
Only allow your site to be loading in an iFrame on your own pages.
Do not allow DNS prefetching.
Only allow your site to send the referrer for your own pages.

I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along 
the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')

I can delete a post(just changing the text to '[deleted]') if I send a DELETE request 
to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. 
(Text response will be 'incorrect password' or 'success')

I can report a thread and change it's reported value to true by sending a PUT request 
to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')

I can report a reply and change it's reported value to true by sending a PUT request 
to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
Complete functional tests that wholely test routes and pass.
*/

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  /*
  I can POST a thread to a specific message board by passing form data text and delete_password
  to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) 
  Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on),
  reported(boolean), delete_password, & replies(array).
  */
  .post(async (req,res) => {
    let board = req.params.board;
    let { text, delete_password } = req.body;
      try {
        let newThreadDoc = await Thread.saveThread(board,text);
        let hash = await bcrypt.hash(delete_password, saltRounds);
        let newThreadPass = await ThreadPass.saveThreadPass(newThreadDoc._id,hash);
        let newThreadRepo = await ThreadReport.saveThreadReport(newThreadDoc._id);
          res.redirect(`/b/${board}/`)
      }
      catch(err){
        console.log(err)
        res.status(404)
        .type('error')
        .send('Error al guardar el usr');
      }
    })

/*
I can GET an array of the most recent 10 bumped threads on the board with only 
the most recent 3 replies from /api/threads/{board}. 
The reported and delete_passwords fields will not be sent.
[{"created_on":"2020-04-03T00:17:34.041Z","bumped_on":"2020-04-03T00:17:34.041Z",
"replycount":0,"_id":"5e8680b635ab7021e904aaca","board":"pani","text":"1wqe","__v":0},

{"created_on":"2020-04-03T00:17:34.041Z","bumped_on":"2020-04-03T00:17:34.041Z",
"replycount":0,"_id":"5e8680be35ab7021e904aacd","board":"pani","text":"ewq","__v":0}]

{"_id":"5e84fccf54f987008736f6e1","text":"nuevo tread","created_on":"2020-04-01T20:42:55.533Z",
"bumped_on":"2020-04-01T20:48:43.518Z","replies":[{"_id":"5e84fe2354f987008736f6e4","text":"2",
"created_on":"2020-04-01T20:48:35.990Z"},{"_id":"5e84fe2754f987008736f6e5","text":"3",
"created_on":"2020-04-01T20:48:39.941Z"},{"_id":"5e84fe2b54f987008736f6e6","text":"4",
"created_on":"2020-04-01T20:48:43.510Z"}],"replycount":4}
*/
  .get(async (req,res) => {
    let board = req.params.board;
    try{
      let i = 0;
      let jsonCollection = []
      let threadCollection = await Thread.findThreads(board);
      let repliesCollection = await Reply.findThreeReply(threadCollection.map(t => t._id))
      threadCollection.forEach(threadDoc => {
        let jsonDoc = {
          _id:threadDoc._id,
          text:threadDoc.text,
          created_on:threadDoc.created_on,
          bumped_on:threadDoc.bumped_on,
          replies:repliesCollection[i],
          replycount:threadDoc.replycount
        }
        jsonCollection.push(jsonDoc)
        i++;
      })
      res.json(jsonCollection)
    }catch(err){
      console.log(err)
      res.status(404)
      .type('error')
      .send('Error al leer la db')
    }
  })
    
  app.route('/api/replies/:board')
  /*
  I can POST a reply to a thead on a specific board by passing form data text, delete_password, 
  & thread_id to /api/replies/{board} and it will also update the bumped_on date to 
  the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) 
  In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
  */
  .post(async (req,res) => {
    let board = req.params.board;
    let { text, delete_password, thread_id } = req.body;
    try{ 
      let replyDoc = await Reply.saveReply(thread_id,text);
      let hash = await bcrypt.hash(delete_password, saltRounds)
      let newPassRep = await ReplyPass.saveReplyPass(replyDoc._id,hash);
      let newReplyRep = await ReplyReport.saveRepyReport(replyDoc._id);
      let updatedThred = await Thread.updateBumpDate(thread_id);
      res.redirect(`/b/${board}/${thread_id}`)
    }catch(err){
      console.log(err)
      res.status(404)
      .type('error')
      .send('Error al leer la db')
    }
  })
  /*
  I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id} 
  Also hiding the same fields.
  */
  .get(async (req,res) => {
    let board = req.params.board;
    let thread_id = req.query.thread_id;
    try{ 
      let replyCollection = await Reply.findAll(thread_id);
        let threadDoc = await Thread.findByid(thread_id);
        res.json({   
          board: threadDoc.board,
          text: threadDoc.text,
          created_on: threadDoc.created_on,
          bumped_on: threadDoc.bumped_on,
          replycount: threadDoc.replycount,
          replies: replyCollection
        });
    }catch(err){
      console.log(err)
      res.status(404)
      .type('error')
      .send('Error al leer la db')
    }
  })
};
