const verifySignUp = require('./verifySignup');
const authJwt = require('./auth.jwt');
const validateTicket = require('./ticketValidateor');

module.exports = {
    verifySignUp,
    authJwt,
    validateTicket
}