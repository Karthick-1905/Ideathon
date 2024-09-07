const {StatusCodes} = require('http-status-codes')
const User = require('../models/userModel')

const getUserProfile = async(req,res)=>{
    const {username} = req.params;
    const user = await User.findOne({ username })
	if (!user) throw new NotFoundError("user not found")
    res.status(StatusCodes.OK).json({success:true,user});
}

module.exports =  {getUserProfile}