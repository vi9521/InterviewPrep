require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')

const app = express()

app.use(cors({origin: "*", allowedHeaders: ["Content-Type", "Authorization"]}))

connectDB()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes")
const sessionRoutes = require("./routes/sessionRoutes")
const questionRoutes = require("./routes/questionRoutes")
const { protect } = require('./middlewares/authMiddleware')
const {generateInterviewQuestions, generateConceptExplanation} = require("./controllers/aiController")

app.use("/api/auth", authRoutes)
app.use("/api/session", sessionRoutes)
app.use("/api/question", questionRoutes)

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions)
app.use("/api/ai/generate-explaination", protect, generateConceptExplanation)

const interviewRoutes = require("./routes/interviewRoutes")
app.use("/api/interview", interviewRoutes)

// serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}))

app.get('/', (req, res) =>{
    res.send('Server is running...')
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log("Server is running on port", PORT);
})