require('dotenv').config()
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')


const autheicateUser = (req,res,next) =>{
    const {token} = req.cookies;
    if(!token) {throw new UnauthenticatedError("You are not authorized for this route")}
    try{
        const {userId} = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId};
        next();
    }
    catch(error){
        throw new UnauthenticatedError('autheication invalid.')
    }
}

module.exports = autheicateUser