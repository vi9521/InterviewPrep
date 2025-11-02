const Interview = require("../models/interviewModel")
const ApiResponse = require("../utils/apiResponse")
const { firstInterviewQuestionPrompt, nextInterviewQuestionPrompt, interviewFeedbackPrompt } = require("../utils/prompts")
const { generateFirstInterviewQuestion, generateNextInterviewQuestion, generateInterviewFeedback } = require("./aiController")

function formatInterviewHistoryToTranscript(history) {
    if (!history || history.length === 0) {
        return "No interview history available.";
    }

    const formattedTranscript = history.map(turn => {
        // Skip the first item in the history array (usually the initial prompt)
        // Only format the actual Q&A turns
        if (turn === history[0]) {
            return ''; // skip the first item
        }

        // Join all text parts in case a 'part' array has multiple text items (though usually it's one)
        const textContent = turn.parts.map(part => part.text).join(' ');

        if (turn.role === "model") {
            return `Q: ${textContent}`; // AI's question
        } else if (turn.role === "user") {
            return `A: ${textContent}`; // User's answer
        }
        return ''; // Fallback for unexpected roles, though enum should prevent this
    }).join('\n\n'); // Join each Q&A pair with a double newline for readability

    return formattedTranscript;
}

const createInterview = async (req, res) => {
    try {
        const user = req.user._id

        const { jobRole, experience, topicsToFocus, interviewType, resumeData, totalQuestions } = req.body
        // Validate required fields
        if (!jobRole || !experience || !topicsToFocus || !interviewType || !totalQuestions) {
            return res.status(400).json(new ApiResponse(400, "All fields are required: jobRole, experience, topicsToFocus, interviewType, resumeData, totalQuestions"));
        }

        const interview = await Interview.create({
            jobRole, experience, topicsToFocus, interviewType, resumeData, totalQuestions, user
        })

        // generate first question
        const prompt = firstInterviewQuestionPrompt({ jobRole, experience, topicsToFocus, interviewType, resumeData })

        const result = await generateFirstInterviewQuestion(prompt)
        if (!result) {
            return res.status(500).json(new ApiResponse(500, "Failed to generate first interview question"));
        }
        const { question } = result

        // const { question } = {
        //     title: 'Node.js and Microservices',
        //     question: "Given your experience with Node.js and backend development, can you describe a challenging microservices project you've worked on, and what architectural decisions you made?"
        // }

        // store prompt and question from api in database
        interview.interviewHistory = [
            {
                role: 'user',
                parts: [{ text: prompt }]
            },
            {
                role: 'model',
                parts: [{ text: question }]
            }
        ];
        await interview.save();

        // response
        return res.status(201).json(new ApiResponse(201, "Interview created successfully", { interview, question }))

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to create interview", { error: error.message }));
    }
}

const getMyInterviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, "Fetched interviews successfully", { interviews }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to fetch interviews", { error: error.message }));
    }
}

const getInterviewById = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.user._id;

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json(new ApiResponse(404, "Interview not found"));
        }

        if (interview.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to access this interview")
            )
        }

        return res.status(200).json(new ApiResponse(200, "Interview fetched successfully", { interview }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to fetch interview", { error: error.message }));
    }
}

const submitAnswer = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.user._id;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json(new ApiResponse(404, "Interview not found"));
        }

        if (interview.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to access this interview")
            )
        }

        const { answer } = req.body;

        // add answer in db
        interview.interviewHistory.push(
            {
                role: 'user',
                parts: [{ text: answer }]
            }
        )

        // if total questions hit
        if ((interview.totalQuestions * 2) < interview.interviewHistory.length) {
            interview.status = "completed"
            interview.endTime = Date.now()
            await interview.save();
            const nextQuestion = "END"
            return res.status(200).json(new ApiResponse(200, "Answer submitted successfully & interview completed", { nextQuestion }));
        }

        // generate next question
        const prompt = nextInterviewQuestionPrompt()
        const interviewHistory = interview.interviewHistory // array

        const result = await generateNextInterviewQuestion(prompt, interviewHistory);
        if (!result) {
            return res.status(500).json(new ApiResponse(500, "Failed to generate next question"));
        }
        const { question } = result

        // const { question } = {
        //     title: 'Node.js and Microservices',
        //     question: "That's a great tech stack. Could you elaborate on how you specifically implemented the event-driven architecture to ensure data consistency within your inventory system, and what strategies you used to handle potential issues like message failures or out-of-order events?"
        // }

        interview.interviewHistory.push(
            {
                role: 'model',
                parts: [{ text: question }]
            }
        )
        await interview.save();

        return res.status(200).json(new ApiResponse(200, "Answer submitted successfully & next new question generated", { nextQuestion: question }));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to submit answer", { error: error.message }));
    }
}

const generateFeedback = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.user._id;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json(new ApiResponse(404, "Interview not found"));
        }

        if (interview.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to access this interview")
            )
        }

        const { jobRole, experience, interviewType, topicsToFocus } = interview
        const interviewHistory = interview.interviewHistory

        const formattedInterviewTranscript = formatInterviewHistoryToTranscript(interviewHistory)

        const prompt = interviewFeedbackPrompt({ jobRole, experience, interviewType, topicsToFocus, formattedInterviewTranscript })
        const interviewFeedback = await generateInterviewFeedback(prompt);
        if (!interviewFeedback) {
            return res.status(500).json(new ApiResponse(500, "Failed to interview Feedback"));
        }

        // const interviewFeedback = {
        //     "feedback": "The candidate presented a strong understanding of microservices and event-driven architectures, which is highly relevant for a Backend Software Engineer with 3-5 years of experience. Their ability to articulate solutions for data consistency challenges in a distributed system, using concepts like idempotency and dead-letter queues, showcased significant technical depth. The discussion around Kafka, Docker, and Consul further reinforced their hands-on experience with modern backend technologies. While strong on architectural concepts, there's an opportunity to link these high-level discussions more directly to their specific experience with Node.js, Express.js, and MongoDB.",
        //     "strengths": [
        //         "Demonstrated strong technical depth in microservices and event-driven architectures.",
        //         "Showcased practical experience with Kafka, Docker, and Consul.",
        //         "Articulated effective strategies for handling data consistency and message failures in distributed systems.",
        //         "Provided clear and concise explanations of complex technical concepts."
        //     ],
        //     "areasForImprovement": [
        //         "Connecting architectural discussions more directly to specific Node.js, Express.js, and MongoDB implementation details.",
        //         "Elaborating on how specific features of Node.js/Express.js were leveraged (e.g., async operations, middleware, API design within microservices).",
        //         "Discussing MongoDB's role within the microservices, such as schema design or transaction handling in an event-driven context.",
        //         "Potentially quantifying the impact or benefits of their architectural decisions.",
        //         "Briefly mentioning trade-offs of chosen technologies/architectures."
        //     ],
        //     "actionableAdvice": [
        //         "When discussing project experience, be prepared to delve into how Node.js, Express.js, and MongoDB were specifically utilized to build out services or handle data persistence.",
        //         "Consider preparing examples of how you've handled data modeling in MongoDB for a microservices environment, especially concerning eventual consistency.",
        //         "Practice discussing the 'why' behind architectural choices, including the pros and cons or trade-offs involved.",
        //         "If possible, try to include quantifiable outcomes (e.g., performance improvements, reduced errors) when describing the impact of your work."
        //     ]
        // }

        interview.feedback = interviewFeedback;
        interview.status = "completed"
        await interview.save();

        return res.status(200).json(new ApiResponse(200, "Feedback generated successfully", { interviewFeedback: interviewFeedback }));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to generating feedback", { error: error.message }));
    }
}

const getFeedback = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.user._id;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json(new ApiResponse(404, "Interview not found"));
        }

        if (interview.user.toString() !== userId.toString()) {
            return res.status(403).json(
                new ApiResponse(403, "You are not authorized to access this interview")
            );
        }

        if (!interview.feedback) {
            return res.status(404).json(new ApiResponse(404, "Feedback not generated yet"));
        }

        return res.status(200).json(new ApiResponse(200, "Feedback fetched successfully", { interviewFeedback: interview.feedback }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Failed to fetch feedback", { error: error.message }));
    }
}

module.exports = { createInterview, getMyInterviews, getInterviewById, generateFeedback, getFeedback, submitAnswer };