const Session = require("../models/sessionModel")
const Question = require("../models/questionModel")
const ApiResponse = require("../utils/apiResponse")

const addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json(new ApiResponse(400, "Invalid request. Session ID and questions array are required"))
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return res.status(404).json(new ApiResponse(404, "Session not found"))
        }

        // Check if the current user is the owner of the session
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(403).json(new ApiResponse(403, "You are not authorized to modify this session"))
        }

        // Create questions and get their IDs
        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                session: sessionId,
                question: q.question,
                answer: q.answer
            }))
        )

        // Add question IDs to session
        session.questions.push(...createdQuestions.map(q => q._id))
        await session.save()

        return res.status(200).json(new ApiResponse(200, "Questions added successfully", { createdQuestions }))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const togglePinQuestion = async (req, res) => {
    try {
        const questionId = req.params.id
        const question = await Question.findById(questionId)

        if (!question) {
            return res.status(404).json(new ApiResponse(404, "Question not found"))
        }

        // Check if the current user owns the session containing this question
        const session = await Session.findById(question.session)
        if (!session || session.user.toString() !== req.user._id.toString()) {
            return res.status(403).json(new ApiResponse(403, "You are not authorized to modify this question"))
        }

        // Toggle the pinned status
        question.isPinned = !question.isPinned
        await question.save()

        return res.status(200).json(new ApiResponse(200, "Question pin status updated successfully", question))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const updateQuestionNote = async (req, res) => {
    try {
        const questionId = req.params.id
        const { note } = req.body

        const question = await Question.findById(questionId)
        if (!question) {
            return res.status(404).json(new ApiResponse(404, "Question not found"))
        }

        // Check if the current user owns the session containing this question
        const session = await Session.findById(question.session)
        if (!session || session.user.toString() !== req.user._id.toString()) {
            return res.status(403).json(new ApiResponse(403, "You are not authorized to modify this question"))
        }

        // Update the note
        question.note = note || ""
        await question.save()

        return res.status(200).json(new ApiResponse(200, "Question note updated successfully", question))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}


module.exports = { addQuestionsToSession, togglePinQuestion, updateQuestionNote }