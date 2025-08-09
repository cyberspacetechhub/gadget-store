const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const APIResponse = require('../../utils/APIResponse');
const catchAsync = require('../../utils/catchAsync');
const { ValidationError, AuthenticationError } = require('../../utils/customErrors');

const login = catchAsync(async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        throw new ValidationError('Email/username and password are required');
    }

    // Find user by email or username
    const query = email ? { email } : { username };
    const user = await User.findOne(query).select('+password');

    if (!user || !await user.comparePassword(password)) {
        throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
    }

    // Determine user role
    const roles = user.__t || 'User';

    const accessToken = jwt.sign(
        {
            UserInfo: {
                _id: user._id,
                email: user.email,
                roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    console.log('Access Token:', accessToken)
    const refreshToken = jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    console.log('Refresh Token:', refreshToken)

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'Lax', // Changed from 'None' to 'Lax' for localhost
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    APIResponse.success(res, {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            roles,
            isEmailVerified: user.isEmailVerified
        },
        accessToken
    }, 'Login successful');
});

module.exports = { login };