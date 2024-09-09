const mongoose =  require('mongoose')


const SearchSchema = mongoose.Schema({
    search:{
        type:String,
        required:true,
        unique:true,
        index: true,
    },
    count: {
        type: Number,
        default: 0
    }
},{timestamps:true})

const searchModel =  mongoose.model("Search",SearchSchema);

module.exports =  searchModel