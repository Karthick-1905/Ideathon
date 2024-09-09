require('dotenv').config()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please enter a valid username'],
    },
    email:{
        type:String,
        required:[true,"Please enter a valid email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please enter a password"]
    },
    profileImg:{
        type:String,
        default:""
    },
    phoneNo:{
        type:Number,
    },
    secondaryPhoneNo: {
        type:Number
    },
    recentSearchs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Search",
            required:true
        }
    ]
},{timestamps:true})


UserSchema.pre('save',async function(){
    const salt =  await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
})

UserSchema.methods.generateJwt = function(){
    const payload = {userId:this._id}
    const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
    return token;
} 
UserSchema.methods.comparePassword = async function(password){
    const isMatch = await bcryptjs.compare(password,this.password);
    return isMatch;
}

UserSchema.methods.toJSON = function(){
    var obj =  this.toObject();
    delete obj.password;
    return obj;
}


const UserModel = mongoose.model('User',UserSchema);
module.exports = UserModel;