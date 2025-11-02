const interviewQuestionsPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
    You are an AI trained to generate technical interview questions and answers. 

    Task: 
    Role: ${role} 
    — Candidate Experience: ${experience} years 
    — Focus Topics: ${topicsToFocus} 
    — Write ${numberOfQuestions} interview questions. 
    — For each question, generate a detailed but beginner-friendly answer. 
    — If the answer needs a code example, add a small code block inside. 
    — Keep formatting very clean. 
    — Return a pure JSON array like: 
    [
        {
            "question": "Question here?",
            "answer": "Answer here."
        }
    ]

    Important: Do NOT add any extra text. Only return valid JSON.
    `)


const conceptExplanationPrompt = (question) => (`
    You are an AI trained to generate explanations for a given interview question. 

    Task: 
    — Explain the following interview question and its concept in depth as if you're teaching a beginner developer. 
    — Question: "${question}" 
    — After the explanation, provide a short and clear title that summarizes the concept for the article or page header. 
    — If the explanation includes a code example, provide a small code block. 
    — Keep the formatting very clean and clear. 
    — Return the result as a valid JSON object in the following format: 
    {
        "title": "Short title here?",
        "explanation": "Explanation here."
    }

    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`)

const firstInterviewQuestionPrompt = ({ jobRole, experience, interviewType, topicsToFocus, resumeData }) => (`
    You are an AI Interviewer. Your task is to generate the initial, relevant interview question based on the provided context.

    **Interview Context:**
    - Job Role: ${jobRole}
    - Experience Level: ${experience} years
    - Interview Type: ${interviewType}
    - Key Topics to Focus On: ${topicsToFocus}
    ${resumeData &&
    `- Resume Data: ${resumeData}`}

    **Instructions:**
    1.  Generate only ONE interview question.
    2.  Phrase the question in a natural, conversational tone, as if a human interviewer were speaking.
    3.  The question must be concise and directly relevant to the job role, experience level, and interview type.
    4.  Return the result as a valid JSON object in the following format:
        {
            "title": "Short title here?",
            "question": "question here"
        }

    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`)

const nextInterviewQuestionPrompt = () => (`
    You are an AI Interviewer. Your task is to generate the next relevant interview question.

    **Instructions:**
    1.  **Generate only ONE interview question.**
    2.  Phrase the question in a natural, conversational tone, as if a human interviewer were speaking.
    3.  Review the entire chat history provided, paying particular attention to the candidate's last response. Ensure the new question builds upon the conversation, **avoids asking about the same topic again**, and probes deeper where appropriate, maintaining a natural flow.
    4.  Do NOT provide any answers, feedback, or any conversational text beyond the question itself.
    5.  Return the question as a plain text string.
    6.  Do NOT include any extra text, markdown, or code blocks.
`)

const interviewFeedbackPrompt = ({ jobRole, experience, interviewType, topicsToFocus, formattedInterviewTranscript }) => (`
    You are an AI Interviewer. The interview for the **${jobRole}** role, with **${experience} years of experience**, focusing on **${topicsToFocus}** and of **${interviewType}** type, has concluded.

    **Interview Transcript:**
    ${formattedInterviewTranscript}

    **Instructions for Feedback:**
    1.  Provide concise and constructive overall feedback on the candidate's performance.
    2.  Highlight key strengths demonstrated during the interview.
    3.  Identify specific areas for improvement, offering actionable advice.
    4.  Consider the job role, experience level, interview type, and topics discussed.
    5.  Maintain a professional, encouraging, and helpful tone.
    6.  Return the result as a valid JSON object in the following format:
        {
            "feedback": "Your comprehensive feedback here.",
            "strengths": ["List of key strengths demonstrated"],
            "areasForImprovement": ["List of specific areas for improvement"],
            "actionableAdvice" : ["List of Actionable Advice"]
        }

    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`)

module.exports = { interviewQuestionsPrompt, conceptExplanationPrompt, firstInterviewQuestionPrompt, nextInterviewQuestionPrompt, interviewFeedbackPrompt };