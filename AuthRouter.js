const { 
    signup, 
    login, 
    forgotPassword, 
    resetPassword, 
    verifyOTP,
    verifyLoginOTP,
    verifyResetOTP
} = require('../Controllers/AuthController');
const { 
    signupValidation, 
    loginValidation 
} = require('../Middlewares/AuthValidation');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/signup', signupValidation, signup);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-otp', verifyResetOTP);

module.exports = router;