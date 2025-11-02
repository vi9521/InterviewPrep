const User = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const ApiResponse = require("../utils/apiResponse")
const cloudinary = require("../utils/cloudinary")
const fs = require("fs")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10d' })
}

// Send email verification token
const sendTokenOnMail = async (email) => {
    try {
        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const verificationUrl = `${process.env.EMAIL_DOMAIN_URL}/verify-email?token=${verificationToken}&email=${email}`;
        await transporter.sendMail({
            to: email,
            subject: "Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Welcome to PrepBuddy!</h2>
                    <p style="color: #666; line-height: 1.6;">Thank you for registering. To complete your registration and verify your email address, please click the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
                    </div>
                    <p style="color: #666; line-height: 1.6;">If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                    <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">This verification link will expire in 24 hours.</p>
                </div>
            `,
        });

        return verificationToken;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email. Please try again later.");
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body

        // check if user is already exits
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(401).json(new ApiResponse(401, "User with this email is already exits"))
        }

        // make password hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // send Email verification token
        const verificationToken = await sendTokenOnMail(email)

        // create new user
        const user = await User.create({
            name, email, password: hashedPassword, profileImageUrl, verificationToken: verificationToken
        })

        return res.status(201).json(
            new ApiResponse(200, "User registered successfully, Check Email to verify", {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            })
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Error in register controller", error))
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(401).json(new ApiResponse(401, "Invalid email or password"))
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json(new ApiResponse(401, "Invalid email or password"))
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json(new ApiResponse(401, "Please verify your email first"))
        }

        // Generate JWT token
        const token = generateToken(user._id)

        return res.status(200).json(
            new ApiResponse(200, "Login successful", {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                token
            })
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json(new ApiResponse(404, "User not found"))
        }

        return res.status(200).json(
            new ApiResponse(200, "User profile retrieved successfully", user)
        )

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message))
    }
}

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        let imageUrl = req.file.path

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "user_profiles",
            resource_type: "auto"
        });

        // Delete the local file after upload
        fs.unlinkSync(imageUrl);

        // Update imageUrl with Cloudinary URL
        imageUrl = result.secure_url;

        return res.status(200).json(new ApiResponse(200, null, { imageUrl }));
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json(new ApiResponse(500, error.message));
    }
}

const verifyEmail = async (req, res) => {
    const { token, email } = req.query;

    try {
        const user = await User.findOne({ email, verificationToken: token });

        if (!user) return res.status(400).json(new ApiResponse(200, "Invalid Token"));

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json(new ApiResponse(200, "Email verified successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Verification failed"));
    }
};

const resendEmailVerificationToken = async (req, res) => {
    try {
        const { email } = req.body

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json(new ApiResponse(404, "User not found"))
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json(new ApiResponse(400, "Email is already verified"))
        }

        // send email verification token to user
        const verificationToken = await sendTokenOnMail(email)

        // Update user's verification token
        user.verificationToken = verificationToken
        await user.save()

        return res.status(201).json(new ApiResponse(201, "Verification Mail is sent on your email"))
    } catch (error) {
        console.error("Error Sending Email Verification Token:", error);
        return res.status(500).json(new ApiResponse(500, error.message));
    }
}

module.exports = { registerUser, loginUser, getUserProfile, uploadImage, verifyEmail, resendEmailVerificationToken }