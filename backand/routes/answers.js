const express = require('express');
const answer = require('../models/Answer');

const fetchuser = require('../middleware/fetchuser');
const Answer = require("../models/Answer");
const { route } = require('./questions');
const User = require("../models/User");
const LocalStorage = require('node-localStorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

const Question = require("../models/Question");
const router = express.Router();
const mongoose = require('mongoose')

router.post('/addanswer/:id',fetchuser, async (req, res) => {
    try {

        // console.log(req.params.id);
        let newanswer = await Answer.create({
            questionid: req.params.id,
            answer: req.body.answer,
            postedId: req.user.id,
            postedBy: req.user.username,
            votes: 0
        })

        res.json({ "Success": "Added Answer Successfully", "status": true })
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchanswer/:id", async (req, res) => {
    try {
        const answers = await Answer.find({ questionid: req.params.id });
        res.json(answers);
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post('/fetchUserAnswers/:username', async(req, res)=>{
    try{
        
        const answers = await Answer.find({postedBy : req.params.username});
        // console.log(answers);

        if(!answers)
        {
            return res.status(404).send("Question not Found");
        }

        res.json(answers);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/fetchUserAnsweredQuestions/:username', async(req, res)=>{
    try{
        
        const answers = await Answer.find({postedBy : req.params.username});
        // console.log(answers);

        const questions = [];

        for(i in answers){
            const question = await Question.find({_id:answers[i].questionid});
            questions.push(question);
        }

        if(!questions)
        {
            return res.status(404).send("Question not Found");
        }

        res.json(questions);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})


router.post('/fetchUserAcceptedAnsweredQuestions/:username', async(req, res)=>{
    try{
        
        const answers = await Answer.find({$and: [{postedBy : req.params.username }, { status : "Accepted" }]});
        // console.log(answers);

        const questions = [];

        for(i in answers){
            const question = await Question.find({_id:answers[i].questionid});
            questions.push(question);
        }

        if(!questions)
        {
            return res.status(404).send("Question not Found");
        }

        res.json(questions);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/findNumberOfAns", async (req, res) => {
    try {
        const answers = await Answer.find();

        let obj = {};

        answers.map(answer => {

            if (obj[answer.questionid] == null) {
                obj[answer.questionid] = 1;
            }
            else {
                obj[answer.questionid] += 1;
            }

        })

        res.json(obj);
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/upvote/:id", async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        const vote = answer["votes"] + 1;

        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });

        res.json({"status": "upvoted"});
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchVotes", async (req, res) => {
    const allAnswers = await Answer.find();
    const obj = {};

    allAnswers.map(ans => {
        obj[ans._id] = ans.votes;
    })
    res.json(obj);
})

router.post("/downvote/:id", async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        const vote = answer["votes"] - 1;

        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });

        res.json({"status": "downvoted"});
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/acceptanswer/:id", async(req, res)=>{
    try{
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, {$set : {"status": "Accepted"}});
        res.json({"status": "Accepted"});
    }

    catch(e){
        console.log(e.message);
        res.status(400).send("Internal Server error");
    }
})

router.post("/points", async(req, res)=>{
    try{
        let username = localStorage.getItem("username");

        let answers = await Answer.find({$and:[{"postedBy" : username},{"status" : "Accepted"}]});

        res.json({"points" : answers.length*5});
    }
    catch(e){
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

module.exports = router