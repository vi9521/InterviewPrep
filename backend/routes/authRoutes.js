const express = require("express")
const {registerUser, loginUser, getUserProfile, uploadImage, verifyEmail, resendEmailVerificationToken} = require("../controllers/authController")
const {protect} = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)

router.post("/upload-image", upload.single("image"), uploadImage)

router.get("/verify-email", verifyEmail)
router.post("/resend-verify-token", resendEmailVerificationToken)

module.exports = router