const nodemailer = require("nodemailer");
const randomize = require("randomatic");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const crypto = require("crypto");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({
                message: "User already exists, please login",
                success: false,
            });
        }

        const otp = randomize("0", 6); // Generate 6-digit OTP
        const userModel = new UserModel({
            name,
            email,
            password,
            otp,
            otpExpires: Date.now() + 600000, // 10 minutes
        });

        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.status(201).json({
            message: "Signup successful. Please verify your email with OTP",
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = "Auth failed email or password is wrong";
        
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Generate OTP for login verification
        const otp = randomize('0', 6);
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        try {
            // Send OTP email
            await sendOtpEmail(email, otp);
            
            res.status(200).json({
                message: "Please verify OTP sent to your email",
                success: true,
                requireOTP: true,
                email: user.email
            });
        } catch (emailError) {
            // If email fails, remove OTP from user
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            
            res.status(500).json({
                message: "Failed to send OTP email. Please try again.",
                success: false
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Function to send OTP to the user's email
async function sendOtpEmail(email, otp) {
    try {
        // First check if credentials exist
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email credentials are not configured');
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "OTP Verification",
            html: `
                <h1>OTP Verification</h1>
                <p>Your OTP for login is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow to handle in the calling function
    }
}

// Function to send password reset email
async function sendResetEmail(email, token) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            text: `To reset your password, please click the following link: ${resetUrl}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Reset email sent: " + info.response);
    } catch (error) {
        console.error("Error sending reset email:", error);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Generate OTP for password reset
        const otp = randomize('0', 6);
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.status(200).json({
            message: "OTP sent to your email",
            success: true  
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({
            email,
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        // Clear OTP after successful verification
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            message: "Password reset successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            message: "OTP verification successful",
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Add a new function for verifying login OTP
const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            "12345",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email: user.email,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    verifyOTP,
    verifyLoginOTP,
    verifyResetOTP
};
