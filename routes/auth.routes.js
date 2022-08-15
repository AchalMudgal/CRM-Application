const authController = require('../controller/auth.controller');
const { verifySignUp } = require('../middlewares')

module.exports = (app) =>{
    //signup
    app.post("/crm/api/v1/auth/signup",[verifySignUp.validateSignUpRequestBody],authController.signup);
    //signin
    app.post("/crm/api/v1/auth/signin",[verifySignUp.validateSignInRequestBody],authController.signin);
};
