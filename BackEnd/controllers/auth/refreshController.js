const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const APIResponse = require('../../utils/APIResponse');
const catchAsync = require('../../utils/catchAsync');
const { AuthenticationError } = require('../../utils/customErrors');

const refresh = catchAsync(async (req, res) => {
    
    try {
        const cookies = req.cookies;
       if (!cookies?.refreshToken) {
        throw new AuthenticationError('Refresh token required');
    }

    const refreshToken = cookies.refreshToken;
    console.log('Refresh token from cookies:', refreshToken);

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
        throw new AuthenticationError('Invalid refresh token');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Token decoded successfully, email:', decoded.email);
    console.log('User email:', user.email);
    
    if (user.email !== decoded.email) {
        throw new AuthenticationError('Invalid refresh token');
    }
    
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
    
    return APIResponse.success(res, {
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            roles
        }
    }, 'Refresh token successful');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Refresh token expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new AuthenticationError('Invalid refresh token');
        } else {
            throw error;
        }
    }
});

module.exports = { refresh };