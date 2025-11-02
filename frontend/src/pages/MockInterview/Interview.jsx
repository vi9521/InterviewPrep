import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Send, MessageCircle, User, Bot, Volume2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const AIMockInterview = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [agentState, setAgentState] = useState('idle'); // idle, speaking, listening, thinking
  const [interviewEnded, setInterviewEnded] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const shouldContinueListening = useRef(false); // Flag to control continuous listening

  const navigate = useNavigate()
  const { interviewId } = useParams()
  const [interviewDetails, setInterviewDetails] = useState({});

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Changed to true for continuous listening
      recognitionRef.current.interimResults = true; // Changed to true to get interim results
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setAgentState('listening');
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update userResponse with final transcript
        if (finalTranscript) {
          setUserResponse(prev => {
            const newResponse = prev + (prev ? ' ' : '') + finalTranscript;
            return newResponse;
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);

        // Restart recognition if shouldContinueListening is true
        if (shouldContinueListening.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            shouldContinueListening.current = false;
            setAgentState('idle');
          }
        } else {
          setAgentState('idle');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        // Handle specific errors
        if (event.error === 'no-speech' && shouldContinueListening.current) {
          // No speech detected, but user wants to continue listening
          // Restart recognition after a short delay
          setTimeout(() => {
            if (shouldContinueListening.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting after no-speech:', error);
              }
            }
          }, 1000);
        } else if (event.error === 'aborted') {
          // Recognition was aborted (likely by user stopping)
          shouldContinueListening.current = false;
          setIsListening(false);
          setAgentState('idle');
        } else {
          // Other errors
          setIsListening(false);
          setAgentState('idle');
          shouldContinueListening.current = false;
        }
      };
    }

    return () => {
      shouldContinueListening.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    async function getInterviewDetails() {
      try {
        const response = await axiosInstance.get(API_PATHS.INTERVIEW.GET_ONE(interviewId))
        setInterviewDetails(response.data.data.interview)
        if (response.data.data.interview.status === 'completed') {
          setInterviewEnded(true)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    getInterviewDetails()
  }, [interviewId])

  const speakQuestion = (question) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setAgentState('speaking');
      };

      utterance.onend = () => {
        setAgentState('idle');
      };

      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      shouldContinueListening.current = true;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        shouldContinueListening.current = false;
      }
    }
  };

  const stopListening = () => {
    shouldContinueListening.current = false;
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setAgentState('idle');
    }
  };

  const startInterview = async () => {
    try {
      setInterviewStarted(true);
      setAgentState('thinking');
      setIsProcessing(true)

      // Start the interview
      await new Promise(resolve => setTimeout(resolve, 1000));
      const len = interviewDetails.interviewHistory.length
      const firstQuestion = interviewDetails.interviewHistory[len-1].parts[0].text

      setCurrentQuestion(firstQuestion);
      setQuestionCount(len/2);
      speakQuestion(firstQuestion);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsProcessing(false)
    }
  };

  const submitAnswer = async () => {
    try {
      // Stop listening when submitting answer
      shouldContinueListening.current = false;
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }

      setIsProcessing(true)

      const response = await axiosInstance.post(API_PATHS.INTERVIEW.SUBMIT_ANSWER(interviewId), { answer: userResponse })

      const nextQuestion = response.data.data.nextQuestion

      // if interview Ended
      if (nextQuestion === "END") {
        setCurrentQuestion("");
        setUserResponse("")

        speakQuestion("Alright, that brings us to the end of our interview today. Thank you for your time. Please review the feedback provided");

        await new Promise(resolve => setTimeout(resolve, 15000));

        setInterviewEnded(true)

        return
      }

      setCurrentQuestion(nextQuestion);
      speakQuestion(nextQuestion);
      setUserResponse("")
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsProcessing(false)
    }
  }

  const getAgentAnimation = () => {
    switch (agentState) {
      case 'speaking':
        return 'animate-pulse bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50';
      case 'listening':
        return 'animate-bounce bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50';
      case 'thinking':
        return 'animate-spin bg-gradient-to-r from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/50';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-xl';
    }
  };

  const getAgentExpression = () => {
    switch (agentState) {
      case 'speaking':
        return '🗣️';
      case 'listening':
        return '👂';
      case 'thinking':
        return '🤔';
      default:
        return '🤖';
    }
  };

  const getStatusColor = () => {
    switch (agentState) {
      case 'speaking':
        return 'bg-blue-500 shadow-lg shadow-blue-500/50';
      case 'listening':
        return 'bg-green-500 animate-bounce shadow-lg shadow-green-500/50';
      case 'thinking':
        return 'bg-amber-500 animate-spin shadow-lg shadow-amber-500/50';
      default:
        return 'bg-gray-400';
    }
  };

  // If interview has ended, show a page with a button to go to feedback page
  if (interviewEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-2xl w-full">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Interview Completed!
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Congratulations on completing your mock interview session.<br />
              Your performance has been analyzed and feedback is ready for review.
            </p>
            <button
              className="group bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-semibold px-10 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              onClick={() => {
                navigate(`/interview/${interviewId}`)
              }}
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                View Detailed Feedback
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-12 py-4  flex flex-col">

        {/* Header */}
        <div className=" border-gray-100 p-4 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Mock Interview
            </h1>
            <p className="text-gray-600 text-lg">Practice your interview skills with our AI interviewer</p>
            {interviewStarted && (
              <div className="fixed top-8 right-8 z-30 mt-0 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Question {questionCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Flex grow to fill remaining space */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">

          {/* Left Column - AI Agent */}
          <div className="xl:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <div className={`w-40 h-40 rounded-full ${getAgentAnimation()} flex items-center justify-center mb-6 transition-all duration-500`}>
                  <div className="text-8xl">{getAgentExpression()}</div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Alex</h2>
                <p className="text-gray-600 text-lg mb-4">AI Interviewer</p>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
                  <span className="text-lg font-medium text-gray-700 capitalize">
                    {agentState === 'idle' ? 'Ready to help' : agentState}
                  </span>
                </div>
              </div>

              {/* Agent Status Card */}
              <div className="w-full p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-center">Current Status</h3>
                <div className="text-center">
                  {agentState === 'idle' && <p className="text-gray-600">Waiting for your input</p>}
                  {agentState === 'speaking' && <p className="text-blue-600 font-medium">🎵 Speaking question aloud</p>}
                  {agentState === 'listening' && <p className="text-green-600 font-medium">🎤 Listening to your response</p>}
                  {agentState === 'thinking' && <p className="text-amber-600 font-medium">⚡ Processing your answer</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Interview Content */}
          <div className="xl:col-span-2 flex flex-col gap-8">

            {/* Question Display */}
            {interviewStarted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Interview Question</h3>
                      <button
                        onClick={() => speakQuestion(currentQuestion)}
                        disabled={isProcessing || agentState === 'speaking' || agentState === 'thinking'}
                        className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl hover:shadow-md transition-all duration-200 disabled:opacity-50"
                      >
                        <Volume2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    {agentState === 'thinking' ? (
                      <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                        <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                        <p className="text-amber-700 font-medium text-lg">Processing your response...</p>
                      </div>
                    ) : (
                      <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200">
                        <p className="text-gray-800 leading-relaxed text-lg">{currentQuestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* User Response Area */}
            {interviewStarted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 flex-1">
                <div className="flex items-start gap-4 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Your Response</h3>
                      <div className={`px-3 py-1 rounded-xl text-sm font-medium ${isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isListening ? '🎤 Recording...' : '✏️ Type or speak'}
                      </div>
                    </div>
                    <div className="flex-1 p-6 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl border border-emerald-200">
                      <textarea
                        className="w-full h-full min-h-[200px] bg-transparent border-none outline-none resize-none text-gray-800 leading-relaxed text-lg placeholder-gray-400"
                        value={userResponse}
                        onChange={e => setUserResponse(e.target.value)}
                        placeholder="Your response will appear here as you speak or type..."
                        disabled={isProcessing}
                      />
                      {isProcessing && (
                        <div className="mt-4 flex items-center gap-3">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <span className="italic text-blue-600 font-medium">Processing your response...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Screen for non-started interviews */}
            {!interviewStarted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12 text-center flex-1 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <MessageCircle className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Interview?</h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                    Get ready to practice with our AI interviewer. This session will help you improve your interview skills
                    with realistic questions and instant feedback.
                  </p>
                </div>

                {/* Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Listen</h3>
                    <p className="text-gray-600 text-sm">Alex will ask you interview questions</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                    <div className="w-12 h-12 mx-auto mb-4 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Respond</h3>
                    <p className="text-gray-600 text-sm">Answer using voice or text input</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Improve</h3>
                    <p className="text-gray-600 text-sm">Get feedback and continue learning</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls - Fixed at bottom */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-4 fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!interviewStarted ? (
              <button
                onClick={startInterview}
                className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Play className="w-5 h-5" />
                <span>Start Interview Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || agentState === 'speaking' || agentState === 'thinking'}
                  className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg ${isListening
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-2xl shadow-red-500/25'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-2xl shadow-emerald-500/25'
                    }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isListening ? 'Stop Recording' : 'Start Recording'}</span>
                </button>

                <button
                  onClick={() => speakQuestion(currentQuestion)}
                  disabled={isProcessing || agentState === 'speaking' || agentState === 'thinking'}
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-blue-500/25"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Repeat Question</span>
                </button>

                <button
                  onClick={() => submitAnswer()}
                  disabled={userResponse.length === 0 || isProcessing || agentState === 'speaking' || agentState === 'thinking'}
                  className="group flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-indigo-500/25"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Answer</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMockInterview;