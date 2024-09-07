import { useState } from "react"




const SearchBar = ({onChange:setQuery,onQuery,query}) => {
  return (
    <div className="flex flex-col">
        <div className="flex flex-row">
            <input type="text" placeholder="Search For places" className="input input-bordered w-full max-w-xs"  value={query}
            onChange={(e)=>{setQuery(e.target.value)}}/>
            <button className="btn btn-primary flex-1" onClick={onQuery} >Search</button>
       </div>
       <h4 className="p-4 text-black font-medium tracking-wide">{query != '' ? 'RecentSearch' : 'Results'}</h4>
       <div>
       <ul className="menu w-full rounded-box">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
            <li><a>Item 3</a></li>
        </ul>
       </div>
    </div>
  )
}

export default SearchBar