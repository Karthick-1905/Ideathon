const {StatusCodes} = require('http-status-codes')

const errorHandler = (err,req,res,next) =>{
    console.log(err);
    const statusCode  = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong, try again later';
    res.status(statusCode).json({message});
}

module.exports =  errorHandler