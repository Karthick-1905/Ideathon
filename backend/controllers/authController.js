const {StatusCodes} = require('http-status-codes')
const User = require('../models/userModel')
const {BadRequestError} = require('../errors')


const register = async(req,res) =>{
    const user = await User.create(req.body);
    const token =  user.generateJwt();
    oneDay = 24*60*60*1000;
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+oneDay),
        secure: process.env.NODE_ENV === 'production'
    })
    res.status(StatusCodes.OK).json({success:true,user})
}
const login = async(req,res) =>{
    const {username,password} = req.body
    const user = await User.findOne({username})
    if(!user){
        throw new BadRequestError("Invalid crentials")
    }
    const isPasswordCorrect = user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new BadRequestError("Invalid crentials")
    }
    const token =  user.generateJwt();
    oneDay = 24*60*60*1000;
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+oneDay),
        secure: process.env.NODE_ENV === 'production'
    })
    res.status(StatusCodes.OK).json({success:true,user})
}

const logout  = async(req,res) =>{
    res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now())
    }) 
    res.status(StatusCodes.OK).json({success:true,msg:"Logged out"})
}

const getme =  async(req,res) =>{
    const user = await User.findById(req.user.userId);
    res.status(StatusCodes.OK).json({user})
}


module.exports =  {register,login,logout,getme}