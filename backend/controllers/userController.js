const {StatusCodes} = require('http-status-codes')
const User = require('../models/userModel')
const Search = require('../models/searchModel')

const getUserProfile = async(req,res)=>{
    const {username} = req.params;
    const user = await User.findOne({ username })
	if (!user) throw new NotFoundError("user not found")
    res.status(StatusCodes.OK).json({success:true,user});
}


const handleSearch = async (req, res) => {
    const { searchText } = req.body;
    const userId = req.user.id; 
  
    if (!searchText) {
      return res.status(400).json({ error: "Search text is required" });
    }
  
    try {
      let search = await Search.findOne({ search: searchText });
  
      if (search) {
        search.count += 1;
        await search.save();
      } else {
        search = new Search({ search: searchText, count: 1 });
        await search.save();
      }
      const user = await User.findById(userId);
  
      const alreadySearched = user.recentSearchs.some(
        (recentSearchId) => recentSearchId.toString() === search._id.toString()
      );
  
      if (!alreadySearched) {
        user.recentSearchs.push(search._id);
        await user.save();
      }
  
      // 6. Return the updated user and search data
      return res.status(200).json({
        message: "Search updated successfully",
        search,
        recentSearches: user.recentSearchs,
      });
    } catch (error) {
      console.error("Error in handling search:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const getRecentSearches = async (req, res) => {
    const userId = req.userId; 
  
    try {
      const user = await User.findById(userId)
        .populate('recentSearchs')
        .exec();
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Return the populated recent searches
      return res.status(200).json({
        message: "Recent searches fetched successfully",
        recentSearches: user.recentSearchs,
      });
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };


module.exports =  {getUserProfile,handleSearch,getRecentSearches}