const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /auth/register
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Generate 6-digit verification OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            email,
            password,
            verificationToken: otp,
            isVerified: false, 
        });

        // Send OTP email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Critter Account Verification OTP',
                html: `
                    <h1>Welcome to Critter!</h1>
                    <p>Your verification code is:</p>
                    <h2 style="background-color: #ef5b44; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">${otp}</h2>
                    <p>Please enter this code in the app to verify your account.</p>
                `,
            });
        } catch (emailError) {
            console.error('Email sending failed, but user was created:', emailError.message);
        }

        res.status(201).json({ message: 'Registration successful. Please verify your email.', email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email OTP
// @route   POST /auth/verify-email
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
             return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email, verificationToken: otp });
        if (!user) return res.status(400).json({ message: 'Invalid OTP or email' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user & get token
// @route   POST /auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        // Set refresh token in HttpOnly cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Refresh token
// @route   POST /auth/refresh
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Token Rotation: Generate new tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: newAccessToken, role: user.role });
    } catch (error) {
        res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }
};

// @desc    Logout user
// @route   POST /auth/logout
const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); 
    
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    
    if (user) {
        user.refreshToken = '';
        await user.save();
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged out' });
};

// @desc    Get current user profile
// @route   GET /auth/me
const getMe = async (req, res) => {
    const user = {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role,
    };
    res.json(user);
};// @desc    Get all users
// @route   GET /auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, verifyEmail, login, refresh, logout, getMe, getUsers };
