const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const { createInterview, getMyInterviews, getInterviewById, generateFeedback, getFeedback, nextInterviewQuestion, submitAnswer } = require("../controllers/interviewController")

const router = express.Router()

router.post("/create", protect, createInterview)
router.get("/my-interviews", protect, getMyInterviews)
router.get("/:id", protect, getInterviewById)
// router.delete("/:id", protect, )

router.post("/answer/:id", protect, submitAnswer)

router.post("/feedback/:id", protect, generateFeedback)
router.get("/feedback/:id", protect, getFeedback)

module.exports = router