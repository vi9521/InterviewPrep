const Session = require("../models/sessionModel")
const Question = require("../models/questionModel")
const ApiResponse = require("../utils/apiResponse")

const createSession = async (req, res)=>{
    try {
        const {role , experience, topicsToFocus, description, questions} = req.body
    
        const userId = req.user._id
    
        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        })
    
        const questionDocs = await Promise.all(
            questions?.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                })
                return question._id
            })
        )
    
        session.questions = questionDocs
        await session.save()
    
        return res.status(201).json(new ApiResponse(201, "Session created successfully", {session}))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const getMySessions = async (req, res)=>{
    try {
        const userId = req.user._id

        const sessions = await Session.find({ user: userId })
            .populate('questions')
            .sort({ createdAt: -1 })

        return res.status(200).json(
            new ApiResponse(200, "Sessions retrieved successfully", {sessions})
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const getSessionById = async (req, res)=>{
    try {
        const { id } = req.params
        const userId = req.user._id

        const session = await Session.findById(id)
            .populate('questions')

        if (session.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to access this session")
            )
        }

        if (!session) {
            return res.status(404).json(
                new ApiResponse(404, "Session not found")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Session retrieved successfully", {session})
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const deleteSession = async (req, res)=>{
    try {
        const { id } = req.params
        const userId = req.user._id

        const session = await Session.findById(id)

        if (!session) {
            return res.status(404).json(
                new ApiResponse(404, "Session not found")
            )
        }

        if (session.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to delete this session")
            )
        }

        await Question.deleteMany({ session: id })

        await Session.findByIdAndDelete(id)

        return res.status(200).json(
            new ApiResponse(200, "Session deleted successfully")
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

module.exports = {createSession, getMySessions, getSessionById, deleteSession}