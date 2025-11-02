export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        VERIFY_EMAIL: "/api/auth/verify-email",
        RESEND_VERIFY_EMAIL: "/api/auth/resend-verify-token"
    },

    IMAGE:{
        UPLOAD_IMAGE : "/api/auth/upload-image"
    },

    SESSION:{
        CREATE: "/api/session/create",
        GET_ALL: "/api/session/my-sessions",
        GET_ONE: (id) => `/api/session/${id}`,
        DELETE: (id) => `/api/session/${id}`,
    },

    QUESTION:{
        ADD_TO_SESSION: "/api/question/add",
        PIN: (id) => `/api/question/${id}/pin`,
        UPDATE_NOTE: (id) => `/api/question/${id}/note`
    },

    AI:{
        GENERATE_QUESTION: "/api/ai/generate-questions",
        GENERATE_EXPLAINATION: "/api/ai/generate-explaination",
    },

    INTERVIEW:{
        CREATE: "/api/interview/create",
        GET_ALL: "/api/interview/my-interviews",
        GET_ONE: (id) => `/api/interview/${id}`,
        DELETE: (id) => `/api/interview/${id}`,
        SUBMIT_ANSWER: (id) => `/api/interview/answer/${id}`,
        GENERATE_FEEDBACK: (id) => `/api/interview/feedback/${id}`,
        GET_FEEDBACK: (id) => `/api/interview/feedback/${id}`,
    }

}