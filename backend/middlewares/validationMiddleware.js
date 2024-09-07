const { BadRequestError, NotFoundError } = require('../errors');
const mongoose = require('mongoose')
const {body,validationResult,param} =  require('express-validator')
const User = require('../models/userModel')



const withValidationResult = (validationValue) =>{
    return [
        validationValue,
          (req,res,next) =>{
            const errors =  validationResult(req);
              if(!errors.isEmpty()){
                const errorMessages = errors.array().map(error=>error.msg);
                throw new BadRequestError(errorMessages[0]);
            }
            next();
            }
        ]
}

const validateRegisterInput = withValidationResult([
    body('username').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').
    isEmail().withMessage("Please provide a valid email").
    custom(async(email)=>{
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new BadRequestError('email already exist')
        } 
    }),
    body('password').notEmpty().withMessage('password is required').
    isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
])


const validateLoginInput = withValidationResult([
    body('username')
      .notEmpty()
      .withMessage('username is required'),
    body('password').notEmpty().withMessage('password is required'),
  ])

module.exports =  {validateRegisterInput,validateLoginInput}

