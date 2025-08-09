const User = require('../../models/User');
const APIResponse = require('../../utils/APIResponse');
const catchAsync = require('../../utils/catchAsync');

const logout = catchAsync(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return APIResponse.success(res, null, 'Logged out successfully');
    }

    const refreshToken = cookies.jwt;

    // Find user and remove refresh token
    const user = await User.findOne({ refreshToken });

    if (user) {
        user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
        await user.save();
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production'
    });

    APIResponse.success(res, null, 'Logged out successfully');
});

module.exports = { logout };