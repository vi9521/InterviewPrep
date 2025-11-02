const mongoose = require("mongoose");

// Define the schema for individual chat parts (text content)
const partSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for subdocuments if not needed

// Define the schema for a single turn in the interview history
const turnSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model"], // Enforce that role can only be 'user' or 'model'
        required: true
    },
    parts: {
        type: [partSchema], // Array of partSchema documents
        required: true
    }
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for subdocuments if not needed

// Define the main Session Schema
const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        jobRole: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        topicsToFocus: {
            type: String,
            required: true
        },

        interviewType: {
            type: String,
            enum: ["technical", "behavioral", "hr", "mixed"],
            required: true
        },

        resumeData: {
            type: String,
            default: ""
        },

        totalQuestions: {
            type: Number,
            default: 2,
            required: true
        },
        interviewHistory: {
            type: [turnSchema],
            default: []
        },

        startTime: {
            type: Date,
            default: Date.now
        },
        endTime: {
            type: Date,
            default: null
        },

        status: { // "in-progress", "completed", "aborted"
            type: String,
            enum: ["in-progress", "completed", "aborted"],
            default: "in-progress",
            required: true
        },

        feedback: {
            type: mongoose.Schema.Types.Mixed
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);
